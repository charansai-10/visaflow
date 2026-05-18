"""
Onboarding service functions.

All business logic for the onboarding flow lives here.
Routes in onboarding.py call these functions only.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestException, NotFoundException
from app.core.security import create_access_token, create_refresh_token
from app.models.models import User, UserOTP, UserProfile, UserVisaTarget, VisaType
from app.services.otp_service import send_email_verification_otp
from app.services.services import (
    db_create,
    db_delete,
    db_get_by_field,
    db_get_by_id,
    db_list,
    db_update,
    get_user_role,
    utc_now,
)


# ── GET /onboarding/status ────────────────────────────────────────────────────

async def service_get_onboarding_status(
    db: AsyncSession,
    user_id: uuid.UUID,
    roles: list[str],
) -> dict:
    """
    Returns the current onboarding state for the given user.
    Frontend uses this to decide which screen to show.
    """
    profile = await db_get_by_field(db, UserProfile, "user_id", user_id)
    if not profile:
        raise NotFoundException("Profile not found.")

    targets = await db_list(
        db,
        UserVisaTarget,
        filters=[UserVisaTarget.user_id == user_id],
    )
    # print(targets,"targets")
    return {
        "current_step":         profile.onboarding_step,
        "onboarding_completed": profile.onboarding_completed,
        "roles":                roles,
        "full_legal_name":      profile.full_legal_name,
        "nationality":          profile.nationality,
        "visa_targets":         [t.visa_type_code for t in targets],
    }


# ── POST /onboarding/verify-email ─────────────────────────────────────────────

async def service_verify_email(
    db: AsyncSession,
    *,
    user_id: uuid.UUID,
    otp: str,
) -> dict:
    """
    Verifies the 6-digit OTP the user received by email.
    - Marks the OTP row as used.
    - Sets User.is_verified = True.
    - Advances onboarding_step to 'profile' so frontend goes to Step 2.
    - Returns fresh tokens.
    """
    # ── 1. Find a valid, unused, non-expired OTP ───────────────────────────
    otp_record = await db.scalar(
        select(UserOTP)
        .where(UserOTP.user_id   == user_id)
        .where(UserOTP.otp_code  == otp)
        .where(UserOTP.otp_type  == "email_verification")
        .where(UserOTP.is_used   == False)                      # noqa: E712
        .where(UserOTP.expires_at > utc_now())
        .order_by(UserOTP.created_at.desc())
    )
    if not otp_record:
        raise BadRequestException("Invalid or expired code. Please request a new one.")

    # ── 2. Mark OTP as used ────────────────────────────────────────────────
    await db_update(db, UserOTP, otp_record.id, {"is_used": True})

    # ── 3. Get user & guard against double-verify ──────────────────────────
    user = await db_get_by_id(db, User, user_id)
    if not user:
        raise NotFoundException("User not found.")

    if user.is_verified:
        raise BadRequestException("This email is already verified.")

    # ── 4. Mark user as verified ───────────────────────────────────────────
    await db_update(db, User, user.id, {"is_verified": True})

    # ── 5. Advance onboarding step → 'profile' (go to Step 2 screen) ──────
    profile = await db_get_by_field(db, UserProfile, "user_id", user_id)
    print(profile.onboarding_step,"profile")
    if not profile:
        raise NotFoundException("Profile not found.")

    await db_update(db, UserProfile, profile.id, {
        "onboarding_step": 2,
    })

    # ── 6. Return fresh tokens ─────────────────────────────────────────────
    roles = await get_user_role(db, user_id)
    if isinstance(roles, str):
        roles = [roles]

    return {
        "access_token":    create_access_token(str(user_id),{"roles": roles}),
        "refresh_token":   create_refresh_token(str(user_id)),
        "roles":           roles,
        "user":user,
        "onboarding_step": 2,
    }


# ── POST /onboarding/resend-otp ───────────────────────────────────────────────

async def service_resend_otp(
    db: AsyncSession,
    *,
    user_id: uuid.UUID,
) -> None:
    """
    Resends the email verification OTP.
    Rate-limited: only 1 resend allowed per 60 seconds.
    """
    # ── 1. Get user ────────────────────────────────────────────────────────
    user = await db_get_by_id(db, User, user_id)
    if not user:
        raise NotFoundException("User not found.")

    # ── 2. Already verified? ───────────────────────────────────────────────
    if user.is_verified:
        raise BadRequestException("This email is already verified.")

    # ── 3. Rate limit — block if an OTP was sent in the last 60 seconds ───
    recent_otp = await db.scalar(
        select(UserOTP)
        .where(UserOTP.user_id  == user_id)
        .where(UserOTP.otp_type == "email_verification")
        .where(UserOTP.created_at > utc_now() - timedelta(seconds=60))
        .order_by(UserOTP.created_at.desc())
    )
    if recent_otp:
        raise BadRequestException(
            "Please wait 60 seconds before requesting a new code."
        )

    # ── 4. Send fresh OTP ──────────────────────────────────────────────────
    await send_email_verification_otp(db, user)


# ── POST /onboarding/role ─────────────────────────────────────────────────────

async def service_set_role(
    db: AsyncSession,
    user_id: uuid.UUID,
    *,
    role: str,
) -> dict:
    """
    Screen 04 — saves the user's chosen role.
    Advances onboarding_step to 'profile'.
    """
    profile = await db_get_by_field(db, UserProfile, "user_id", user_id)
    if not profile:
        raise NotFoundException("Profile not found.")

    await db_update(db, UserProfile, profile.id, {
        "user_role":       role,
        "onboarding_step": 3,
    })

    roles = await get_user_role(db, user_id)
    return await service_get_onboarding_status(db, user_id, roles)


# ── POST /onboarding/profile ──────────────────────────────────────────────────
async def service_save_profile(
    db: AsyncSession,
    user_id: uuid.UUID,
    *,
    full_legal_name: str,
    nationality: str,
    visa_targets: list[str],
    date_of_birth: str | None = None,
    gender: str | None = None,
    country_of_residence: str | None = None,
    primary_visa: str | None = None,
    timezone: str | None = None,
    preferred_language: str | None = None,
) -> dict:
    """
    Screen 05 — saves all profile fields from onboarding Step 2.
    Replaces existing visa targets (delete + re-insert).
    Advances onboarding_step to 3.
    """
    profile = await db_get_by_field(db, UserProfile, "user_id", user_id)
    if not profile:
        raise NotFoundException("Profile not found.")

    # ── Parse date_of_birth string → Python date ───────────────────────
    parsed_dob = None
    if date_of_birth:
        try:
            parsed_dob = datetime.strptime(date_of_birth, "%Y-%m-%d").date()
        except ValueError:
            raise BadRequestException("date_of_birth must be in YYYY-MM-DD format.")

    # ── Update all profile fields ──────────────────────────────────────
    update_data = {
        "full_legal_name":      full_legal_name,
        "nationality":          nationality,
        "onboarding_step":      3,
    }

    if parsed_dob is not None:
        update_data["date_of_birth"] = parsed_dob
    if gender is not None:
        update_data["gender"] = gender
    if country_of_residence is not None:
        update_data["country_of_residence"] = country_of_residence
    if timezone is not None:
        update_data["timezone"] = timezone
    if preferred_language is not None:
        update_data["preferred_language"] = preferred_language

    await db_update(db, UserProfile, profile.id, update_data)

    # ── Replace visa targets ───────────────────────────────────────────
    existing = await db_list(
        db, UserVisaTarget,
        filters=[UserVisaTarget.user_id == user_id],
    )
    for t in existing:
        await db_delete(db, UserVisaTarget, t.id)

    for i, vt in enumerate(visa_targets):
        await db_create(db, UserVisaTarget(
            user_id        = user_id,
            visa_type_code = vt,
            is_primary     = (vt == primary_visa) if primary_visa else (i == 0),
            created_by     = user_id,
        ))

    roles = await get_user_role(db, user_id)
    return await service_get_onboarding_status(db, user_id, roles)


# ── POST /onboarding/complete ─────────────────────────────────────────────────

async def service_complete_onboarding(
    db: AsyncSession,
    user_id: uuid.UUID,
) -> dict:
    """
    Screen 06 — user clicks 'Start My First Application'.
    Marks onboarding as fully completed.
    """
    profile = await db_get_by_field(db, UserProfile, "user_id", user_id)
    if not profile:
        raise NotFoundException("Profile not found.")

    await db_update(db, UserProfile, profile.id, {
        "onboarding_step": 4,
        "onboarding_completed": True,
    })

    roles = await get_user_role(db, user_id)
    return await service_get_onboarding_status(db, user_id, roles)