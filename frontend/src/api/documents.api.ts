// src/api/documents.api.ts
import axios from "./axios";
import type { Document, DocumentListResponse } from "../hooks/useDocuments";

const documentsApi = {

  // GET /documents — all docs for current user
  list: async (): Promise<Document[]> => {
    const res = await axios.get("/documents");
    return Array.isArray(res.data) ? res.data : res.data.items ?? [];
  },

  // GET /documents?application_id=xxx — docs for a specific application
  listByApplication: async (applicationId: string): Promise<Document[]> => {
    const res = await axios.get("/documents", {
      params: { application_id: applicationId },
    });
    return Array.isArray(res.data) ? res.data : res.data.items ?? [];
  },

  // GET /documents/:id — single document
  get: async (id: string): Promise<Document> => {
    const res = await axios.get(`/documents/${id}`);
    return res.data;
  },

  // POST /documents/upload — upload a new document (multipart)
  upload: async (body: {
    application_id: string;
    document_type:  string;
    category:       string;
    file:           File;
  }): Promise<Document> => {
    const form = new FormData();
    form.append("application_id", body.application_id);
    form.append("document_type",  body.document_type);
    form.append("category",       body.category);
    form.append("file",           body.file);
    const res = await axios.post("/documents/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // DELETE /documents/:id
  delete: async (id: string): Promise<void> => {
    await axios.delete(`/documents/${id}`);
  },

  // PATCH /documents/:id/status — update status (attorney/HR action)
  updateStatus: async (id: string, status: string, note?: string): Promise<Document> => {
    const res = await axios.patch(`/documents/${id}/status`, { status, note });
    return res.data;
  },
};

export default documentsApi;
export type { DocumentListResponse };