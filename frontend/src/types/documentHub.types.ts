// src/types/documentHub.types.ts

export type DocFileType = "pdf" | "docx" | "img" | "other";
export type DocStatus   = "verified" | "pending_review" | "uploaded" | "rejected" | "required" | "missing";

export interface HubDocument {
  id:              string;
  name:            string;           // file_name
  file_type:       DocFileType;      // derived from file_format
  status:          DocStatus;
  document_type:   string;           // e.g. "Passport Copy"
  category:        string;           // e.g. "identity"
  application_name?: string;         // e.g. "H-1B Visa Application"
  application_id?: string;
  file_size_bytes: number;
  uploaded_at:     string;           // ISO date
  verified_at?:    string;
}

export interface RequirementItem {
  id:           string;
  task_name:    string;
  status:       DocStatus;
  document_id?: string;
}

export interface HubRequirements {
  visa_code:    string;              // "H-1B"
  done:         number;
  total:        number;
  items:        RequirementItem[];
}

export interface ActivityItem {
  id:        string;
  text:      string;                 // "Updated_Resume_v2.docx uploaded"
  by:        string;                 // "Alexandra Smith"
  timestamp: string;                 // ISO
}

export interface StorageInfo {
  used_mb:  number;
  total_mb: number;
}

export interface DocumentHubData {
  documents:    HubDocument[];
  requirements: HubRequirements | null;
  activity:     ActivityItem[];
  storage:      StorageInfo;
  total:        number;
}