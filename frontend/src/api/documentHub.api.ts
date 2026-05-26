// src/api/documentHub.api.ts
// ── Reuses existing working API files — no direct axios calls ─────────────────
import documentsApi                   from "./documents.api";
import type { Document }              from "../types/document.types";
import type {
  HubDocument,
  HubRequirements,
  ActivityItem,
  StorageInfo,
  RequirementItem,
} from "../types/documentHub.types";

// Use the shared axios instance only for endpoints not in documents.api.ts
import axios from "./axios";

// ── Normalise helpers ─────────────────────────────────────────────────────────
function toFileType(doc: Document): "pdf" | "docx" | "img" | "other" {
  const f = (doc.file_type ?? "").toLowerCase();
  if (f === "pdf")                                     return "pdf";
  if (f === "docx" || f === "doc")                     return "docx";
  if (["jpg","jpeg","png","gif","webp"].includes(f))   return "img";
  return "other";
}

function normaliseDocument(d: Document): HubDocument {
  return {
    id:               d.id,
    name:             d.name,
    file_type:        toFileType(d),
    status:           d.status as HubDocument["status"],
    document_type:    d.document_type ?? "Document",
    category:         d.category ?? "other",
    application_name: (d as any).application_name ?? undefined,
    application_id:   (d as any).application_id   ?? undefined,
    file_size_bytes:  d.file_size_bytes ?? 0,
    uploaded_at:      d.uploaded_at ?? new Date().toISOString(),
    verified_at:      d.verified_at  ?? undefined,
  };
}

// =============================================================================
// API OBJECT
// =============================================================================
const documentHubApi = {

  // ── Reuse documents.api.ts — same axios instance, cookies already work ───────
  listDocuments: async (): Promise<HubDocument[]> => {
    const docs = await documentsApi.list();          // ← already working
    return docs.map(normaliseDocument);
  },

  listByApplication: async (applicationId: string): Promise<HubDocument[]> => {
    const docs = await documentsApi.listByApplication(applicationId); // ← already working
    return docs.map(normaliseDocument);
  },

  uploadDocument: async (
    file:           File,
    applicationId?: string,
    documentType?:  string,
    category?:      string,
  ): Promise<HubDocument> => {
    const ext          = file.name.split(".").pop()?.toLowerCase() ?? "";
    const autoCategory = ["jpg","jpeg","png","gif","webp"].includes(ext)
      ? "identity"
      : ext === "pdf" ? "legal" : "other";
    const autoDocType  = documentType ?? file.name.replace(/\.[^/.]+$/, "");

    const doc = await documentsApi.upload({         // ← already working
      application_id: applicationId ?? "",
      document_type:  autoDocType,
      category:       category ?? autoCategory,
      file,
    });
    return normaliseDocument(doc);
  },

  deleteDocument: async (id: string): Promise<void> => {
    await documentsApi.delete(id);                  // ← already working
  },

  getFileBlob: async (id: string) => {
    return documentsApi.getFile(id);                // ← already working
  },

  // ── Requirements — uses axios directly but with NO extra params ───────────────
  // The previous version passed { status: "in_progress" } which may not be a
  // valid query param on your backend, causing a 422/401.
  getRequirements: async (): Promise<HubRequirements | null> => {
    try {
      // Step 1: get all applications, pick first in_progress one client-side
      const appsRes = await axios.get("/applications");
      const allApps: any[] = appsRes.data?.items ?? appsRes.data ?? [];
      const app = allApps.find((a: any) => a.status === "in_progress") ?? allApps[0];

      if (!app) return null;

      // Step 2: get tasks for that application
      const tasksRes = await axios.get(`/applications/${app.id}/tasks`);
      const tasks: any[] = Array.isArray(tasksRes.data)
        ? tasksRes.data
        : tasksRes.data?.items ?? [];

      const done  = tasks.filter((t: any) => t.is_completed).length;
      const items: RequirementItem[] = tasks.map((t: any) => ({
        id:          t.id,
        task_name:   t.name ?? t.task_name ?? "Document",
        status:      t.is_completed
          ? (t.document_id ? "verified" : "uploaded")
          : ((t.is_required ?? true) ? "missing" : "required"),
        document_id: t.document_id ?? undefined,
      }));

      return {
        visa_code: app.visa_type?.code ?? "H-1B",
        done,
        total:     tasks.length,
        items,
      };
    } catch {
      // Requirements are optional — don't break the whole page
      return null;
    }
  },

  // ── Pure functions — no network calls ────────────────────────────────────────
  getStorageInfo: (documents: HubDocument[], totalMb = 50): StorageInfo => {
    const usedBytes = documents.reduce((s, d) => s + (d.file_size_bytes ?? 0), 0);
    return { used_mb: usedBytes / (1024 * 1024), total_mb: totalMb };
  },

  getActivity: (documents: HubDocument[]): ActivityItem[] => {
    return [...documents]
      .sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())
      .slice(0, 5)
      .map(d => ({
        id:        d.id,
        text:      `${d.name} ${d.status === "verified" ? "verified" : "uploaded"}`,
        by:        "You",
        timestamp: d.uploaded_at,
      }));
  },
};

export default documentHubApi;