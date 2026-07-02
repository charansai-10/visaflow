"""
Application settings loaded from environment variables.

Rules:
- Fields WITHOUT defaults are REQUIRED (Pydantic crashes at startup if missing).
  This is intentional for secrets — better fail loud than ship with insecure defaults.
- Fields WITH defaults (= "" or = "foo") are optional and use the default when absent.
"""
from typing import List
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── App ───────────────────────────────────────────────────────────────────
    APP_NAME:    str = "VisaFlow"
    APP_VERSION: str = "1.0.0"
    APP_ENV:     str = "development"   # "development" | "staging" | "production"
    DEBUG:       bool = False

    # ⚠️ REQUIRED — no default. If missing in env, app CRASHES at startup.
    # Never ship a default like "sai" — trivially forgeable JWTs.
    SECRET_KEY: str

    # ── AI ────────────────────────────────────────────────────────────────────
    ANTHROPIC_API_KEY: str = ""

    # ── Database ──────────────────────────────────────────────────────────────
    # LOCAL_DATABASE_URL is required. ZOHO is optional and only used if DATABASE_ENV=zoho.
    LOCAL_DATABASE_URL: str
    ZOHO_DATABASE_URL:  str = ""
    DATABASE_ENV:       str = "local"   # "local" | "zoho"

    @property
    def DATABASE_URL(self) -> str:
        if self.DATABASE_ENV == "zoho":
            return self.ZOHO_DATABASE_URL
        return self.LOCAL_DATABASE_URL

    # ── Redis ─────────────────────────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"

    # ── JWT ───────────────────────────────────────────────────────────────────
    ALGORITHM:                   str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS:   int = 7

    # ── AWS S3 (optional — only used when STORAGE_BACKEND=s3) ────────────────
    AWS_ACCESS_KEY_ID:     str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION:            str = ""
    S3_BUCKET:             str = ""
    STORAGE_BACKEND:       str = "local"   # "local" | "s3"

    # ── CORS ──────────────────────────────────────────────────────────────────
    # Set per environment in the .env file. Example JSON string in .env:
    #   CORS_ORIGINS=["https://staging.vyuflo.com"]
    # Parsed by the validator below into a Python list.
    CORS_ORIGINS: List[str]
    COOKIE_SECURE: bool = True   # ⚠️ MUST be False on plain HTTP (local Docker)

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors(cls, v):
        if isinstance(v, str):
            import json
            return json.loads(v)
        return v

    # ── OAuth ─────────────────────────────────────────────────────────────────
    GOOGLE_CLIENT_ID:        str = ""
    GOOGLE_CLIENT_SECRET:    str = ""
    MICROSOFT_CLIENT_ID:     str = ""
    MICROSOFT_CLIENT_SECRET: str = ""
    APPLE_CLIENT_ID:         str = ""

    # LinkedIn OAuth
    LINKEDIN_CLIENT_ID:     str = ""
    LINKEDIN_CLIENT_SECRET: str = ""
    LINKEDIN_REDIRECT_URI:  str = ""

    # ── Email ─────────────────────────────────────────────────────────────────
    SMTP_USERNAME:   str = ""
    SMTP_PASSWORD:   str = ""
    SMTP_FROM_EMAIL: str = "noreply@visaflow.com"
    SMTP_PORT:       int = 587
    SMTP_HOST:       str = "smtp.gmail.com"
    MAIL_STARTTLS:   bool = True
    MAIL_SSL_TLS:    bool = False

    # ── Stripe ────────────────────────────────────────────────────────────────
    STRIPE_SECRET_KEY:     str = ""
    STRIPE_WEBHOOK_SECRET: str = ""

    # ── Rate limiting ─────────────────────────────────────────────────────────
    RATE_LIMIT_PER_MINUTE: int = 60

    # ── OTP ───────────────────────────────────────────────────────────────────
    OTP_EXPIRE_MINUTES: int = 10
    OTP_MAX_ATTEMPTS:   int = 5

    # ── Zoho (all optional) ───────────────────────────────────────────────────
    ZOHO_CLIENT_ID:      str = ""
    ZOHO_CLIENT_SECRET:  str = ""
    ZOHO_REFRESH_TOKEN:  str = ""
    ZOHO_ORG_ID:         str = ""
    ZOHO_WORKSPACE_ID:   str = ""

    # ── Frontend URL (used for email links, OAuth callbacks) ─────────────────
    FRONTEND_URL: str = "http://localhost:5173"


settings = Settings()