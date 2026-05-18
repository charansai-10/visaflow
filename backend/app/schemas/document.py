# src/app/schemas/document.py
from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


# ── Upload request (multipart form — not JSON) ────────────────────────────────
class DocumentUpload(BaseModel):
    application_id:   Optional[uuid.UUID] = None   # nullable — personal docs
    document_type_id: uuid.UUID
    is_draft:         bool = False

    model_config = {"from_attributes": True}


# ── Single document response ──────────────────────────────────────────────────
class DocumentResponse(BaseModel):
    id:                uuid.UUID
    user_id:           uuid.UUID
    application_id:    Optional[uuid.UUID]
    document_type_id:  uuid.UUID
    file_name:         str
    file_size_kb:      int
    file_format:       str
    total_pages:       Optional[int]
    status:            str
    version:           int
    ocr_status:        str
    ocr_confidence:    Optional[int]
    is_draft:          bool
    verified_at:       Optional[datetime]
    rejection_reason:  Optional[str]
    created_at:        datetime
    updated_at:        Optional[datetime]

    model_config = {"from_attributes": True}


# ── Activity log response ─────────────────────────────────────────────────────
class DocumentActivityResponse(BaseModel):
    id:          uuid.UUID
    document_id: uuid.UUID
    action:      str
    actor_type:  str
    note:        Optional[str]
    created_at:  datetime

    model_config = {"from_attributes": True}