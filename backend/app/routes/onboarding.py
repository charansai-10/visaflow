"""
Onboarding routes — /api/v1/onboarding/*

Screens covered:
  03  Email Verify       POST /verify-email
  03  Resend OTP         POST /resend-otp
  03  Status             GET  /status
  04  Select Role        POST /role
  05  Essential Details  POST /profile
  06  Review & Complete  POST /complete
"""
from fastapi import APIRouter

from app.core.dependencies import Current_User, DBSession
from app.schemas.auth import TokenResponse
from app.schemas.onboarding import (
    OnboardingCompleteRequest,
    OnboardingProfileRequest,
    OnboardingRoleRequest,
    OnboardingStatusResponse,
    VerifyEmailRequest,
)
from app.services.onboarding_services import (
    service_complete_onboarding,
    service_get_onboarding_status,
    service_resend_otp,
    service_save_profile,
    service_set_role,
    service_verify_email,
)

router = APIRouter()


# ── GET /onboarding/status ────────────────────────────────────────────────────
@router.get("/status", response_model=OnboardingStatusResponse, status_code=200)
async def get_onboarding_status(
    db: DBSession,
    current_user: Current_User,
):
    """
    Returns current onboarding step.
    Frontend calls this on app load when tokens exist
    so it knows which screen to resume from.
    """
    return await service_get_onboarding_status(
        db,
        user_id = current_user.user_id,
        roles   = current_user.roles,
    )


# ── POST /onboarding/verify-email ─────────────────────────────────────────────
@router.post("/verify-email", response_model=TokenResponse, status_code=200)
async def verify_email(
    body: VerifyEmailRequest,
    db: DBSession,
    current_user: Current_User,
):
    """
    Screen 03 — user submits 6-digit OTP received by email.
    Sets is_verified = True on the User row.
    Returns fresh tokens + updated onboarding_step.
    """
    result = await service_verify_email(
        db,
        user_id = current_user.user_id,
        otp     = body.otp,
    )
    return TokenResponse(
        access_token    = result["access_token"],
        refresh_token   = result["refresh_token"],
        roles           = result["roles"],
        user=result["user"],     
        onboarding_step = result["onboarding_step"],
    )


# ── POST /onboarding/resend-otp ───────────────────────────────────────────────
@router.post("/resend-otp", status_code=200)
async def resend_otp(
    db: DBSession,
    current_user: Current_User,
):
    """
    Screen 03 — user clicks 'Resend Code'.
    Rate-limited to 1 request per 60 seconds.
    """
    await service_resend_otp(
        db,
        user_id = current_user.user_id,
    )
    return {"message": "Verification email sent. Please check your inbox."}


# ── POST /onboarding/role ─────────────────────────────────────────────────────
@router.post("/role", status_code=200)
async def set_role(
    body: OnboardingRoleRequest,
    db: DBSession,
    current_user: Current_User,
):
    """
    Screen 04 — user picks their role (Employee/Employer/Lawyer/Admin).
    Advances onboarding_step to 'profile'.
    """
    return await service_set_role(
        db,
        user_id = current_user.user_id,
        role    = body.role,
    )


# ── POST /onboarding/profile ──────────────────────────────────────────────────
@router.post("/profile", status_code=200)
async def save_profile(
    body: OnboardingProfileRequest,
    db: DBSession,
    current_user: Current_User,
):
    return await service_save_profile(
        db,
        user_id              = current_user.user_id,
        full_legal_name      = body.full_legal_name,
        nationality          = body.nationality,
        visa_targets         = body.visa_targets,
        date_of_birth        = body.date_of_birth,
        gender               = body.gender,
        country_of_residence = body.country_of_residence,
        primary_visa         = body.primary_visa,
        timezone             = body.timezone,
        preferred_language   = body.preferred_language,
    )


# ── POST /onboarding/complete ─────────────────────────────────────────────────
@router.post("/complete", status_code=200)
async def complete_onboarding(
    db: DBSession,
    current_user: Current_User,
):
    """
    Screen 06 — user clicks 'Start My First Application'.
    Marks onboarding_completed = True.
    """
    return await service_complete_onboarding(
        db,
        user_id = current_user.user_id,
    )