# src/app/services/document_service.py
from __future__ import annotations

import uuid
import os
from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.services import db_create, db_get_by_id
from app.models.models import Document, DocumentActivity, DocumentType
from app.schemas.document import DocumentResponse

# ── Config ────────────────────────────────────────────────────────────────────
ALLOWED_FORMATS = {"pdf", "jpg", "jpeg", "png", "docx"}
MAX_FILE_SIZE_KB = 10 * 1024   # 10 MB


async def upload_document(
    db:               AsyncSession,
    file:             UploadFile,
    application_id:   Optional[uuid.UUID],
    document_type_id: uuid.UUID,
    is_draft:         bool,
    current_user_id:  uuid.UUID,
) -> DocumentResponse:
    """
    POST /documents/upload
    Saves the file, creates a Document row + activity log row.
    """

    # ── 1. Validate file format ───────────────────────────────────────────────
    ext = file.filename.rsplit(".", 1)[-1].lower() if file.filename else ""
    if ext not in ALLOWED_FORMATS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File format '{ext}' not allowed. Use: PDF, JPG, PNG, DOCX.",
        )

    # ── 2. Read file + validate size ──────────────────────────────────────────
    contents = await file.read()
    file_size_kb = len(contents) // 1024

    if file_size_kb > MAX_FILE_SIZE_KB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size is 10MB.",
        )

    # ── 3. Validate document_type exists ──────────────────────────────────────
    doc_type = await db_get_by_id(db, DocumentType, document_type_id)
    if not doc_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document type {document_type_id} not found.",
        )

    # ── 4. Save file to storage ───────────────────────────────────────────────
    # Replace this block with your S3/cloud storage logic
    upload_dir = f"uploads/{current_user_id}"
    os.makedirs(upload_dir, exist_ok=True)

    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = f"{upload_dir}/{unique_filename}"

    with open(file_path, "wb") as f:
        f.write(contents)

    # ── 5. Create Document row ────────────────────────────────────────────────
    document = Document(
        user_id          = current_user_id,
        application_id   = application_id,
        document_type_id = document_type_id,
        file_name        = file.filename,
        file_path        = file_path,        # S3 key in production
        file_size_kb     = file_size_kb,
        file_format      = ext,
        status           = "uploaded",
        version          = 1,
        ocr_status       = "not_started",
        is_draft         = is_draft,
        created_by       = current_user_id,
    )
    document = await db_create(db, document)

    # ── 6. Create activity log row ────────────────────────────────────────────
    activity = DocumentActivity(
        document_id = document.id,
        action      = "uploaded",
        actor_id    = current_user_id,
        actor_type  = "user",
        note        = f"Document uploaded: {file.filename}",
        created_by  = current_user_id,
    )
    await db_create(db, activity)

    return DocumentResponse.model_validate(document)