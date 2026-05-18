// src/types/document.types.ts

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
  name:            string;
  file_type:       string;
  file_size_bytes: number;
  status:          DocumentStatus;
  document_type:   string;
  category:        string;
  note?:           string;
  uploaded_at?:    string;
  verified_at?:    string;
  created_at:      string;
  updated_at:      string;
}

export interface DocumentListResponse {
  items: Document[];
  total: number;
}