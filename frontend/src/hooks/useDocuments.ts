// src/hooks/useDocuments.ts
import { useState, useEffect, useCallback } from "react";
import type { AxiosError } from "axios";
import documentsApi from "../api/documents.api";

// ── Types ─────────────────────────────────────────────────────────────────────
export type DocumentStatus =
  | "pending_review"
  | "verified"
  | "rejected"
  | "uploaded"
  | "required";

export interface Document {
  id:              string;
  application_id:  string;
  user_id:         string;
  name:            string;          // filename e.g. "passport_scan_2023.pdf"
  file_type:       string;          // "pdf" | "jpg" | "png"
  file_size_bytes: number;
  status:          DocumentStatus;
  document_type:   string;          // "passport" | "offer_letter" | "national_id"
  category:        string;          // "identity" | "employment" | "education"
  note?:           string;          // e.g. "Awaiting manager approval"
  uploaded_at?:    string;          // ISO datetime
  verified_at?:    string;
  created_at:      string;
  updated_at:      string;
}

export interface DocumentListResponse {
  items: Document[];
  total: number;
}

// ── Error helper ──────────────────────────────────────────────────────────────
function extractMessage(e: unknown): string {
  const err = e as AxiosError<{ detail: string }>;
  return (
    err.response?.data?.detail ??
    (e instanceof Error ? e.message : "Something went wrong.")
  );
}

// ── useDocuments — list all docs for current user (or by application) ─────────
export function useDocuments(applicationId?: string) {
  const [data, setData]         = useState<Document[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = applicationId
        ? await documentsApi.listByApplication(applicationId)
        : await documentsApi.list();
      // Handle both plain array and { items: [] } response shapes
      setData(Array.isArray(res) ? res : (res as DocumentListResponse).items ?? []);
    } catch (e) {
      setError(extractMessage(e));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => { void load(); }, [load]);

  return { data, isLoading, error, refetch: load };
}

// ── useDocument — single document by ID ──────────────────────────────────────
export function useDocument(documentId: string | undefined) {
  const [data, setData]         = useState<Document | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!documentId) return;
    setLoading(true);
    setError(null);
    try {
      setData(await documentsApi.get(documentId));
    } catch (e) {
      setError(extractMessage(e));
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => { void load(); }, [load]);

  return { data, isLoading, error, refetch: load };
}