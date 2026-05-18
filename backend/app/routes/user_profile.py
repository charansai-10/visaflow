# src/app/routers/user_profile_router.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.user_profile import UserProfileResponse, UserProfileUpdate
from app.services.user_profile_service import get_my_profile, update_my_profile
import uuid

user_profile_router = APIRouter()


@user_profile_router.get(
    "/users/me/profile",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user profile",
    description="Returns profile for the logged-in user. Auto-creates if missing.",
)
async def api_get_my_profile(
    db:              AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID   = Depends(get_current_user),
) -> UserProfileResponse:
    return await get_my_profile(db, current_user_id.user_id)


@user_profile_router.patch(
    "/users/me/profile",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Update current user profile",
    description="Partial update — only provided fields are written.",
)
async def api_update_my_profile(
    payload:         UserProfileUpdate,
    db:              AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID   = Depends(get_current_user),
) -> UserProfileResponse:
    return await update_my_profile(db, current_user_id.user_id, payload)