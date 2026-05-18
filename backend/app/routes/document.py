# src/app/routers/document_router.py
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import  get_db
from app.core.dependencies import get_current_user
from app.schemas.document import DocumentResponse
from app.services.document_service import upload_document

document_router = APIRouter()


@document_router.post(
    "/documents/upload",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a document",
    description=(
        "Uploads a file and creates a Document record. "
        "Linked to an application if application_id is provided. "
        "Personal documents (Screen 16 Document Hub) pass no application_id."
    ),
)
async def api_upload_document(
    file:             UploadFile       = File(...),
    document_type_id: uuid.UUID        = Form(...),
    application_id:   Optional[uuid.UUID] = Form(None),
    is_draft:         bool             = Form(False),
    db:               AsyncSession     = Depends(get_db),
    current_user_id:  uuid.UUID        = Depends(get_current_user),
) -> DocumentResponse:
    return await upload_document(
        db               = db,
        file             = file,
        application_id   = application_id,
        document_type_id = document_type_id,
        is_draft         = is_draft,
        current_user_id  = current_user_id.user_id,
    )