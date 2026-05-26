// src/hooks/useMessages.ts
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "../api/axios";
import type {
  Conversation,
  Message,
  SendMessagePayload,
  ThreadListResponse,
  MessageListResponse,
} from "../types/message.types";

export function useMessages() {
  const [conversations,  setConversations]  = useState<Conversation[]>([]);
  const [messages,       setMessages]       = useState<Message[]>([]);
  const [activeConvId,   setActiveConvIdRaw] = useState<string | null>(null);
  const [isLoading,      setIsLoading]      = useState(true);
  const [isSending,      setIsSending]      = useState(false);
  const [searchQuery,    setSearchQuery]    = useState("");
  const [activeTab,      setActiveTab]      = useState<"all" | "unread" | "archived">("all");

  const convPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const msgPollRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch conversations ───────────────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    try {
      const res = await axios.get<ThreadListResponse>("/messages/conversations");
      const data = res.data;
      // Backend returns { items, total }
      setConversations(Array.isArray(data) ? data : data.items ?? []);
    } catch (e) {
      console.error("Failed to fetch conversations", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Fetch messages for active thread ─────────────────────────────────────
  const fetchMessages = useCallback(async (threadId: string) => {
    try {
      const res = await axios.get<MessageListResponse>(
        `/messages/conversations/${threadId}/messages`,
        { params: { limit: 100 } }
      );
      const data = res.data;
      setMessages(Array.isArray(data) ? data : data.items ?? []);
    } catch (e) {
      console.error("Failed to fetch messages", e);
    }
  }, []);

  // ── Set active conversation ───────────────────────────────────────────────
  const setActiveConvId = useCallback((id: string | null) => {
    setActiveConvIdRaw(id);
    setMessages([]);

    if (id) {
      fetchMessages(id);

      // Mark as read immediately
      axios.patch(`/messages/conversations/${id}/read`).then(() => {
        setConversations(prev =>
          prev.map(c => c.id === id ? { ...c, unread_count: 0 } : c)
        );
      }).catch(() => {});
    }

    // Clear message polling for old thread
    if (msgPollRef.current) {
      clearInterval(msgPollRef.current);
      msgPollRef.current = null;
    }

    // Start polling for new thread
    if (id) {
      msgPollRef.current = setInterval(() => fetchMessages(id), 5000);
    }
  }, [fetchMessages]);

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(async ({
    conversationId, content, file,
  }: SendMessagePayload) => {
    setIsSending(true);
    try {
      let res;

      if (file) {
        // Multipart for file attachments
        const form = new FormData();
        if (content) form.append("content", content);
        form.append("file", file);
        res = await axios.post<Message>(
          `/messages/conversations/${conversationId}/messages`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        // JSON for text messages
        res = await axios.post<Message>(
          `/messages/conversations/${conversationId}/messages`,
          { content }
        );
      }

      const newMsg = res.data;

      // Append new message to list
      setMessages(prev => [...prev, newMsg]);

      // Update conversation last_message preview
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId
            ? {
                ...c,
                last_message:    content ?? (file ? `📎 ${file.name}` : ""),
                last_message_at: newMsg.created_at,
              }
            : c
        )
      );
    } catch (e) {
      console.error("Failed to send message", e);
    } finally {
      setIsSending(false);
    }
  }, []);

  // ── Polling: conversations every 5s ──────────────────────────────────────
  useEffect(() => {
    fetchConversations();
    convPollRef.current = setInterval(fetchConversations, 5000);
    return () => {
      if (convPollRef.current) clearInterval(convPollRef.current);
      if (msgPollRef.current)  clearInterval(msgPollRef.current);
    };
  }, [fetchConversations]);

  return {
    conversations,
    messages,
    activeConvId,
    setActiveConvId,
    sendMessage,
    isLoading,
    isSending,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
  };
}