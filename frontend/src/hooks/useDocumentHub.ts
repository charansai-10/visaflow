// src/hooks/useDocumentHub.ts
import { useState, useEffect, useCallback } from "react";
import documentHubApi from "../api/documentHub.api";
import type {
  ActivityItem,
  HubDocument,
  HubRequirements,
  StorageInfo,
} from "../types/documentHub.types";

export function useDocumentHub() {
  const [documents,    setDocuments]    = useState<HubDocument[]>([]);
  const [requirements, setRequirements] = useState<HubRequirements | null>(null);
  const [activity,     setActivity]     = useState<ActivityItem[]>([]);
  const [storage,      setStorage]      = useState<StorageInfo>({ used_mb: 0, total_mb: 50 });
  const [isLoading,    setIsLoading]    = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [uploading,    setUploading]    = useState(false);
  const [uploadError,  setUploadError]  = useState<string | null>(null);
  const [viewMode,     setViewMode]     = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState("All Documents");
  const [searchQuery,  setSearchQuery]  = useState("");

  // ── Fetch all data via API layer ────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // All calls go through documentHubApi — not axios directly
      const [docs, reqs] = await Promise.all([
        documentHubApi.listDocuments(),
        documentHubApi.getRequirements().catch(() => null),
      ]);

      setDocuments(docs);
      setRequirements(reqs);
      setStorage(documentHubApi.getStorageInfo(docs));
      setActivity(documentHubApi.getActivity(docs));
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "Failed to load documents.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Upload ──────────────────────────────────────────────────────────────────
  const uploadDocument = useCallback(async (file: File, applicationId?: string) => {
    setUploading(true);
    setUploadError(null);
    try {
      await documentHubApi.uploadDocument(file, applicationId);
      await fetchAll(); // Refresh list after upload
    } catch (e: any) {
      setUploadError(e?.response?.data?.detail ?? "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [fetchAll]);

  // ── Delete ──────────────────────────────────────────────────────────────────
  const deleteDocument = useCallback(async (id: string) => {
    try {
      await documentHubApi.deleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "Delete failed.");
    }
  }, []);

  // ── Filtered documents ──────────────────────────────────────────────────────
  const filtered = documents.filter(doc => {
    const matchSearch =
      !searchQuery ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.document_type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchFilter =
      activeFilter === "All Documents" ? true :
      activeFilter === "H-1B Visa"     ? doc.application_name?.includes("H-1B") ?? false :
      activeFilter === "Personal"      ? ["personal", "identity"].includes(doc.category) :
      true;

    return matchSearch && matchFilter;
  });

  return {
    // Data
    documents:    filtered,
    allDocuments: documents,
    requirements,
    activity,
    storage,
    // States
    isLoading,
    error,
    uploading,
    uploadError,
    // View controls
    viewMode,     setViewMode,
    activeFilter, setActiveFilter,
    searchQuery,  setSearchQuery,
    // Actions
    uploadDocument,
    deleteDocument,
    refetch: fetchAll,
  };
}