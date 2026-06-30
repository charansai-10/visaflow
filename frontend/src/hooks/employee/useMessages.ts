// src/hooks/employee/useMessages.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import messageApi from "../../api/employee/message.api";
import type { Conversation, Message, SendMessagePayload } from "../../types/employee/message.types";

export function useMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages,      setMessages]      = useState<Message[]>([]);
  const [activeConvId,  setActiveConvIdRaw] = useState<string | null>(null);
  const [isLoading,     setIsLoading]     = useState(true);
  const [isSending,     setIsSending]     = useState(false);
  const [isCreating,    setIsCreating]    = useState(false);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [activeTab,     setActiveTab]     = useState<"all" | "unread" | "archived">("all");

  const activeConvIdRef = useRef<string | null>(null);
  const [searchParams]  = useSearchParams();

  // ── Fetch conversations (called on mount + every 10s) ─────────────────────
  const fetchConversations = useCallback(async () => {
    try {
      const items = await messageApi.listConversations();
      setConversations(items);
    } catch (e) {
      console.error("Failed to fetch conversations", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Fetch messages for a thread ───────────────────────────────────────────
  const fetchMessages = useCallback(async (threadId: string) => {
    try {
      const items = await messageApi.listMessages(threadId);
      setMessages(items);
    } catch (e) {
      console.error("Failed to fetch messages", e);
    }
  }, []);

  // ── refreshMessages — called by SecureMessaging poll (3s) ─────────────────
  // Only updates if thread is still active to avoid stale overwrites.
  const refreshMessages = useCallback(async (threadId: string) => {
    if (activeConvIdRef.current !== threadId) return;
    try {
      const items = await messageApi.listMessages(threadId);
      setMessages(items);
      // Also refresh conversation list to update unread counts / last message
      const convs = await messageApi.listConversations();
      setConversations(convs);
    } catch {
      // Silent — polling failure shouldn't show errors
    }
  }, []);

  // ── Activate a conversation ───────────────────────────────────────────────
  const setActiveConvId = useCallback(async (id: string | null) => {
    setActiveConvIdRaw(id);
    activeConvIdRef.current = id;
    setMessages([]);
    if (!id) return;

    await fetchMessages(id);

    try {
      await messageApi.markRead(id);
      setConversations(prev => prev.map(c => c.id === id ? { ...c, unread_count: 0 } : c));
    } catch {
      // Ignore
    }
  }, [fetchMessages]);

  // ── Create conversation ───────────────────────────────────────────────────
  const createConversation = useCallback(async (payload: {
    thread_type: "direct" | "group";
    participant_ids: string[];
    application_id?: string;
    title?: string;
    initial_message?: string;
  }): Promise<Conversation | null> => {
    setIsCreating(true);
    try {
      const thread = await messageApi.createConversation(payload);
      setConversations(prev => {
        const exists = prev.find(c => c.id === thread.id);
        return exists ? prev : [thread, ...prev];
      });
      await setActiveConvId(thread.id);
      return thread;
    } catch (e) {
      console.error("Failed to create conversation", e);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [setActiveConvId]);

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(async ({ conversationId, content, file }: SendMessagePayload) => {
    const text = content?.trim() ?? "";
    if (!conversationId || (!text && !file)) return;

    setIsSending(true);
    try {
      const newMsg = file
        ? await messageApi.sendFile(conversationId, text || undefined, file)
        : await messageApi.sendText(conversationId, text);

      setMessages(prev => {
        // Deduplicate in case polling already added it
        if (prev.find(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });

      setConversations(prev => prev.map(c =>
        c.id === conversationId
          ? { ...c, last_message: text || (file ? `📎 ${file.name}` : ""), last_message_at: newMsg.created_at }
          : c
      ));
    } catch (e) {
      console.error("Failed to send message", e);
    } finally {
      setIsSending(false);
    }
  }, []);

  // ── Mount: load conversations + poll every 10s ────────────────────────────
  useEffect(() => {
    fetchConversations();
    const timer = setInterval(fetchConversations, 10_000);
    return () => clearInterval(timer);
  }, [fetchConversations]);

  // ── Auto-open thread from ?thread_id= URL param ───────────────────────────
  useEffect(() => {
    const threadIdFromUrl = searchParams.get("thread_id");
    if (threadIdFromUrl && !activeConvId && !isLoading) {
      setActiveConvId(threadIdFromUrl);
    }
  }, [searchParams, isLoading, activeConvId, setActiveConvId]);

  return {
    conversations,
    messages,
    activeConvId,
    setActiveConvId,
    sendMessage,
    createConversation,
    refreshMessages,      // ← new: used by SecureMessaging 3s poll
    isLoading,
    isSending,
    isCreating,
    searchQuery,   setSearchQuery,
    activeTab,     setActiveTab,
  };
}