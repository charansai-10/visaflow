# src/app/services/user_profile_service.py
from __future__ import annotations
import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.models import User, UserProfile
from app.schemas.user_profile import UserProfileResponse, UserProfileUpdate
from app.services.services import db_create, db_get_by_id, db_update, db_get_by_field


async def get_my_profile(
    db: AsyncSession,
    current_user_id: uuid.UUID,
) -> UserProfileResponse:
    """
    GET /users/me/profile
    Returns the profile for the current user.
    Creates an empty one if it doesn't exist yet.
    """
    profile = await db_get_by_field(db, UserProfile, "user_id", current_user_id)

    # Auto-create empty profile if missing
    if not profile:
        profile = UserProfile(
            user_id    = current_user_id,
            created_by = current_user_id,
        )
        profile = await db_create(db, profile)

    return UserProfileResponse.model_validate(profile)

async def update_my_profile(
    db:              AsyncSession,
    current_user_id: uuid.UUID,
    payload:         UserProfileUpdate,
) -> UserProfileResponse:
    """
    PATCH /users/me/profile
    Updates profile fields. Also syncs phone + country_code to User table.
    """
    # ── 1. Get or create UserProfile ─────────────────────────────────────
    profile = await db_get_by_field(db, UserProfile, "user_id", current_user_id)
    if not profile:
        profile = UserProfile(
            user_id    = current_user_id,
            created_by = current_user_id,
        )
        profile = await db_create(db, profile)

    # ── 2. Build update dict from payload ─────────────────────────────────
    update_data = payload.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No fields provided for update.",
        )

    update_data["modified_by"] = current_user_id
    updated = await db_update(db, UserProfile, profile.id, update_data)

    # ── 3. Also sync phone + country_code to User table ───────────────────
    user_update: dict = {}
    if payload.phone_number is not None:
        user_update["phone"] = payload.phone_number
    if payload.country_code is not None:
        user_update["country_code"] = payload.country_code

    if payload.phone_number is not None:
        user_update["modified_by"] = current_user_id

    if user_update:
        user = await db_get_by_id(db, User, current_user_id)
        if user:
            await db_update(db, User, user.id, user_update)

    return UserProfileResponse.model_validate(updated)