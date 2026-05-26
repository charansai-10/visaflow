"""
Authentication routes — /api/v1/auth/*
PRODUCTION VERSION — refresh_token set as httpOnly cookie
"""
import uuid
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Request, Response, Cookie

from app.core.dependencies import Current_User, DBSession
from app.core.email import send_email
from app.core.exceptions import NotFoundException, UnauthorizedException
from app.models.models import User, UserProfile
from app.schemas.auth import (
    LoginRequest,
    MessageResponse,
    PasswordResetComplete,
    PasswordResetRequestResponse,
    PasswordResetRequestSchema,
    PasswordResetVerifyOTP,
    SignupRequest,
    SSORequest,
    TokenResponse,
)
from app.services.auth_services import (
    service_complete_password_reset,
    service_login,
    service_logout,
    service_refresh_token,
    service_request_password_reset,
    service_signup,
    service_sso_login,
    service_verify_reset_otp,
)
from app.services.services import db_get_by_field, db_get_by_id, get_user_role
from app.core.config import settings

router = APIRouter()

# ── Cookie helper ─────────────────────────────────────────────────────────────
def _set_refresh_cookie(response: Response, refresh_token: str) -> None:
    """Set refresh_token as httpOnly secure cookie."""
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,                        # JS cannot read it
        secure=settings.COOKIE_SECURE,        # True in production (HTTPS), False in dev
        samesite="lax",                       # lax allows normal navigation, strict breaks SSO redirects
        max_age=60 * 60 * 24 * 7,            # 7 days
        path="/api/v1/auth",                  # only sent to auth endpoints
    )

def _clear_refresh_cookie(response: Response) -> None:
    """Clear the refresh_token cookie on logout."""
    response.delete_cookie(
        key="refresh_token",
        path="/api/v1/auth",
    )

# ── /me ───────────────────────────────────────────────────────────────────────
@router.get("/me")
async def get_me(db: DBSession, current_user: Current_User):
    """Returns the currently authenticated user's profile."""
    user = await db_get_by_id(db, User, current_user.user_id)
    if not user:
        raise NotFoundException("User not found.")

    roles   = await get_user_role(db, current_user.user_id)
    profile = await db_get_by_field(db, UserProfile, "user_id", current_user.user_id)

    return {
        "id":                   str(user.id),
        "first_name":           user.first_name,
        "last_name":            user.last_name,
        "email":                user.email,
        "phone":                user.phone,
        "is_active":            user.is_active,
        "is_verified":          user.is_verified,
        "roles":                roles,
        "onboarding_step":      profile.onboarding_step      if profile else 1,
        "onboarding_completed": profile.onboarding_completed if profile else False,
        "created_at":           str(user.created_at),
    }

# ── Signup ────────────────────────────────────────────────────────────────────
@router.post("/signup", response_model=TokenResponse, status_code=201)
async def signup(body: SignupRequest, response: Response, db: DBSession) -> TokenResponse:
    print(body)
    result = await service_signup(
        db,
        first_name        = body.first_name,
        last_name         = body.last_name,
        email             = body.email,
        phone             = body.phone,
        country_code      = body.country_code,
        password          = body.password,
        terms_accepted    = body.terms_accepted,
        marketing_opt_in  = body.marketing_opt_in,
        newsletter_opt_in = body.newsletter_opt_in,
        referral_source   = body.referral_source,
        role              = body.role,
    )
    # ✅ Set refresh token as httpOnly cookie
    _set_refresh_cookie(response, result["refresh_token"])

    return TokenResponse(
        access_token    = result["access_token"],
        refresh_token   = None,               # ← NOT returned in body anymore
        roles           = result["roles"],
        user            = result["user"],
        onboarding_step = result["onboarding_step"],
    )

# ── Login ─────────────────────────────────────────────────────────────────────
@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, request: Request, response: Response, db: DBSession) -> TokenResponse:
    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent")

    result = await service_login(
        db,
        email      = body.email,
        password   = body.password,
        ip_address = ip,
        user_agent = ua,
    )
    # ✅ Set refresh token as httpOnly cookie
    _set_refresh_cookie(response, result["refresh_token"])

    return TokenResponse(
        access_token  = result["access_token"],
        refresh_token = None,                 # ← NOT returned in body
        roles         = result["roles"],
        user          = result["user"],
    )

# ── SSO ───────────────────────────────────────────────────────────────────────
@router.post("/sso", response_model=TokenResponse)
async def sso_login(body: SSORequest, request: Request, response: Response, db: DBSession) -> TokenResponse:
    ip = request.client.host if request.client else None
    result = await service_sso_login(
        db,
        provider       = body.provider,
        provider_token = body.provider_token,
        terms_accepted = body.terms_accepted,
        ip_address     = ip,
    )
    # ✅ Set refresh token as httpOnly cookie
    _set_refresh_cookie(response, result["refresh_token"])

    return TokenResponse(
        access_token    = result["access_token"],
        refresh_token   = None,               # ← NOT returned in body
        roles           = result["roles"],
        user            = result["user"],
        onboarding_step = result.get("onboarding_step"),
    )

# ── Token Refresh ─────────────────────────────────────────────────────────────
@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    response: Response,
    db: DBSession,
    refresh_token: Optional[str] = Cookie(None),  # ← reads httpOnly cookie automatically
) -> TokenResponse:
    """
    Silent refresh — browser sends httpOnly cookie automatically.
    Returns new access_token. Also rotates the refresh cookie.
    """
    if not refresh_token:
        raise UnauthorizedException("No refresh token provided")

    result = await service_refresh_token(db, refresh_token=refresh_token)

    # ✅ Rotate refresh cookie (new token, extended expiry)
    _set_refresh_cookie(response, result["refresh_token"])

    return TokenResponse(
        access_token  = result["access_token"],
        refresh_token = None,                 # ← NOT returned in body
    )

# ── Logout ────────────────────────────────────────────────────────────────────
@router.post("/logout", response_model=MessageResponse)
async def logout(response: Response, user_id: Current_User) -> MessageResponse:
    """Revoke refresh token and clear cookie."""
    await service_logout(user_id.user_id)
    _clear_refresh_cookie(response)           # ✅ wipe cookie
    return MessageResponse(message="Logged out successfully")

# ── Password Reset ────────────────────────────────────────────────────────────
@router.post("/password-reset/request", response_model=PasswordResetRequestResponse)
async def request_password_reset(
    body: PasswordResetRequestSchema,
    db: DBSession,
    background_tasks: BackgroundTasks,
) -> PasswordResetRequestResponse:
    token = await service_request_password_reset(db, email=body.email)
    if token:
        plain_otp = getattr(token, "_plain_otp", None)
        if plain_otp:
            background_tasks.add_task(
                _send_reset_email, body.email, plain_otp, str(token.id)
            )
    return PasswordResetRequestResponse(
        message        = "If this email is registered, you will receive a reset code shortly.",
        reset_token_id = token.id if token else uuid.uuid4(),
    )

@router.post("/password-reset/verify-otp", response_model=MessageResponse)
async def verify_reset_otp(body: PasswordResetVerifyOTP, db: DBSession) -> MessageResponse:
    await service_verify_reset_otp(
        db,
        reset_token_id = body.reset_token_id,
        otp_code       = body.otp_code,
    )
    return MessageResponse(message="OTP verified. You may now set a new password.")

@router.post("/password-reset/complete", response_model=MessageResponse)
async def complete_password_reset(body: PasswordResetComplete, db: DBSession) -> MessageResponse:
    await service_complete_password_reset(
        db,
        reset_token_id = body.reset_token_id,
        new_password   = body.new_password,
    )
    return MessageResponse(message="Password updated successfully. Please log in.")

# ── Private helper ────────────────────────────────────────────────────────────
async def _send_reset_email(to_email: str, otp: str, token_id: str) -> None:
    import structlog
    log = structlog.get_logger(__name__)
    log.info("password_reset_email", to=to_email, token_id=token_id, otp=otp)
    await send_email(
        to      = to_email,
        subject = "Your VisaFlow password reset code",
        body    = f"Your VisaFlow password reset code is:\n\n{otp}\n\nExpires in 60 seconds.",
    )