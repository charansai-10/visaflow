"""
Pydantic schemas for onboarding routes.
File: app/schemas/onboarding.py
"""
from typing import Optional
from pydantic import BaseModel


# ── Requests ──────────────────────────────────────────────────────────────────

class VerifyEmailRequest(BaseModel):
    otp: str                        # 6-digit code from email


class OnboardingRoleRequest(BaseModel):
    role: str                       # employee_student | employer_hr | lawyer | admin


# class OnboardingProfileRequest(BaseModel):
#     full_legal_name: str
#     nationality:     str
#     visa_targets:    list[str]      # e.g. ["H-1B", "F-1"]

class OnboardingProfileRequest(BaseModel):
    full_legal_name: str
    date_of_birth: str | None = None        # "YYYY-MM-DD"
    gender: str | None = None
    nationality: str
    country_of_residence: str | None = None
    visa_targets: list[str]
    primary_visa: str | None = None
    timezone: str | None = None
    preferred_language: str | None = None
    phone_number:         Optional[str]  = None   # ← ADD
    country_code:         Optional[str]  = None   # ← ADD e.g. "+91"

class OnboardingCompleteRequest(BaseModel):
    pass                            # no body needed — identity from token


# ── Responses ─────────────────────────────────────────────────────────────────

class OnboardingStatusResponse(BaseModel):
    current_step:         str | int
    onboarding_completed: bool
    roles:                list[str]
    full_legal_name:      Optional[str] = None
    nationality:          Optional[str] = None
    visa_targets:         list[str]     = []