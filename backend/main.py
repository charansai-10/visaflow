"""
VisaFlow FastAPI Application Entry Point
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import AsyncSessionLocal, engine, Base
from app.core.middleware import RateLimitMiddleware, RequestLoggingMiddleware
from app.core.exceptions import register_exception_handlers

# ✅ IMPORTANT: ensure all models are loaded and registered with Base
from app.models.visamodels import *

# ── Employee routes ──────────────────────────────────────────────────────────
from app.routes.employee import onboarding, auth
from app.routes.employee.document import document_router
from app.routes.employee.application import (
    application_router,
    application_task_router,
    application_history_router,
)
from app.routes.employee.visa_types import visa_type_router
from app.routes.employee.dashboard import dashboard_router
from app.routes.employee.user_profile import user_profile_router
from app.routes.employee.login_history import login_history_router
from app.routes.employee.ocr_service import ocr_router
from app.routes.employee.payment_routes import payment_router
from app.routes.employee.consultation_routes import consultation_router
from app.routes.employee.notification_routes import notification_router
from app.routes.employee.message import message_router

# ⚠️ IMPORTANT: rename on import to prevent name collision with admin's roles_router.
# Previously both files exported `roles_router` — Python's import overwrote the
# employee one, silently disabling all employee-side role endpoints.
from app.routes.employee.roles import roles_router as employee_roles_router

# ── Admin routes ─────────────────────────────────────────────────────────────
from app.routes.admin.admin_dashboard import admin_dashboard_router
from app.routes.admin.roles import roles_router as admin_roles_router
from app.routes.admin.custom_roles import custom_roles_router
from app.routes.admin.system_settings import system_settings_router
from app.routes.admin.notification_templates import notification_templates_router
from app.routes.admin.admin_visa_types_router import admin_visa_types_router
from app.routes.admin.subscription import subscription_router
from app.routes.admin.revenue_dashboard import revenue_dashboard_router
from app.routes.admin.system_audit import system_audit_router
from app.routes.admin.workspace import workspace_router
from app.routes.admin.admin_support import admin_support_router

# ── Attorney routes ──────────────────────────────────────────────────────────
from app.routes.attorney.attorney_routes import attorney_router
from app.routes.attorney.intake import intake_router
from app.routes.attorney.analytics import analytics_router
from app.routes.attorney.calendar import calendar_router

# ── HR routes ────────────────────────────────────────────────────────────────
from app.routes.hr.invitation_routes import invitation_router
from app.routes.hr.hr_case_routes import hr_case_router
from app.routes.hr.hr_task_routes import hr_task_router
from app.routes.hr.hr_document_routes import hr_document_router
from app.routes.hr.hr_deadline_routes import hr_deadline_router
from app.routes.hr.hr_approval_routes import hr_approval_router

# ── Services ─────────────────────────────────────────────────────────────────
from app.services.employee.deadline_scheduler import start_deadline_scheduler
from app.services.employee.seeddata_service import (
    seed_document_types,
    seed_fee_templates,
    seed_rbac,
    seed_subscription_plans,
    seed_support_articles,
    seed_system_settings,
    seed_visa_types,
)


# ─────────────────────────────────────────────
# Lifespan (startup / shutdown)
# ─────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"🚀 Starting application (env={settings.APP_ENV})...")

    # 1. Create tables — safe for fresh DB. For real production with existing data,
    #    switch to Alembic migrations. See docs/migrations.md when ready.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # 2. Run seed safely
    async with AsyncSessionLocal() as db:
        await seed_rbac(db)                  # roles, permissions, role_permissions
        await seed_visa_types(db)            # visa_types
        await seed_document_types(db)        # document_types
        await seed_subscription_plans(db)    # subscription_plans + plan_features
        await seed_fee_templates(db)         # fee_templates
        await seed_system_settings(db)       # system_settings
        await seed_support_articles(db)      # support_articles

    # 3. Start deadline scheduler
    #    ⚠️ NOTE: If you scale to multiple workers, this will run once per worker.
    #    For now (single container), that's fine. For horizontal scaling, gate this
    #    behind an env var: if os.getenv("SCHEDULER_ENABLED") == "true".
    scheduler = start_deadline_scheduler()

    yield

    print("🛑 Shutting down...")
    await engine.dispose()


# ─────────────────────────────────────────────
# FastAPI App
# ─────────────────────────────────────────────
# ⚠️ SECURITY: In production, hide docs endpoints to prevent API schema disclosure.
_is_production = settings.APP_ENV == "production"

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="VisaFlow Immigration Management Platform API",
    docs_url=None if _is_production else "/docs",
    redoc_url=None if _is_production else "/redoc",
    openapi_url=None if _is_production else "/openapi.json",
    lifespan=lifespan,
)


# ─────────────────────────────────────────────
# Middleware
# ─────────────────────────────────────────────
# ✅ CORS reads from settings.CORS_ORIGINS — set per environment in .env
#    Local dev:   ["http://localhost:3000", "http://localhost:5173"]
#    Staging:     ["https://staging.vyuflo.com"]
#    Production:  ["https://vyuflo.com", "https://www.vyuflo.com"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.add_middleware(RateLimitMiddleware)
# app.add_middleware(RequestLoggingMiddleware)


# ─────────────────────────────────────────────
# Exception Handlers
# ─────────────────────────────────────────────
register_exception_handlers(app)


# ─────────────────────────────────────────────
# Static files (user uploads)
# ─────────────────────────────────────────────
# ⚠️ NOTE: Files in uploads/ are lost when the container rebuilds unless you
#    mount a Docker volume (see docker-compose.staging.yml). For production,
#    set STORAGE_BACKEND=s3 in .env and use AWS S3.
app.mount("/static", StaticFiles(directory="uploads"), name="static")


# ─────────────────────────────────────────────
# Routers
# ─────────────────────────────────────────────

# ── Auth & Onboarding ────────────────────────────────────────────────────────
app.include_router(auth.router,       prefix="/api/v1/auth",       tags=["Authentication"])
app.include_router(onboarding.router, prefix="/api/v1/onboarding", tags=["Onboarding"])

# ── Employee ─────────────────────────────────────────────────────────────────
app.include_router(document_router,            prefix="/api/v1", tags=["Documents"])
app.include_router(application_router,         prefix="/api/v1", tags=["Applications"])
app.include_router(application_history_router, prefix="/api/v1", tags=["Application History"])
app.include_router(application_task_router,    prefix="/api/v1", tags=["Application Tasks"])
app.include_router(visa_type_router,           prefix="/api/v1", tags=["Visa Types"])
app.include_router(dashboard_router,           prefix="/api/v1", tags=["Dashboard"])
app.include_router(user_profile_router,        prefix="/api/v1", tags=["User Profile"])
app.include_router(login_history_router,       prefix="/api/v1", tags=["Login History"])
app.include_router(ocr_router,                 prefix="/api/v1", tags=["OCR"])
app.include_router(payment_router,             prefix="/api/v1", tags=["Payments"])
app.include_router(consultation_router,        prefix="/api/v1", tags=["Consultations"])
app.include_router(notification_router,        prefix="/api/v1", tags=["Notifications"])
app.include_router(message_router,             prefix="/api/v1", tags=["Messages"])
app.include_router(employee_roles_router,      prefix="/api/v1", tags=["Employee Roles"])

# ── Admin ────────────────────────────────────────────────────────────────────
app.include_router(admin_dashboard_router,        prefix="/api/v1", tags=["Admin Dashboard"])
app.include_router(admin_roles_router,            prefix="/api/v1", tags=["Admin Roles"])
app.include_router(custom_roles_router,           prefix="/api/v1", tags=["Custom Roles"])
app.include_router(system_settings_router,        prefix="/api/v1", tags=["System Settings"])
app.include_router(notification_templates_router, prefix="/api/v1", tags=["Notification Templates"])
app.include_router(admin_visa_types_router,       prefix="/api/v1", tags=["Admin — Visa Types"])
app.include_router(subscription_router,           prefix="/api/v1", tags=["Admin — Subscriptions"])
app.include_router(revenue_dashboard_router,      prefix="/api/v1", tags=["Admin — Revenue Dashboard"])
app.include_router(system_audit_router,          prefix="/api/v1", tags=["System Audit"])
app.include_router(workspace_router,              prefix="/api/v1", tags=["Workspace"])
app.include_router(admin_support_router,          prefix="/api/v1", tags=["Admin Support"])

# ── Attorney ─────────────────────────────────────────────────────────────────
app.include_router(attorney_router, prefix="/api/v1", tags=["Attorneys"])
app.include_router(intake_router,   prefix="/api/v1", tags=["Client Intake"])
app.include_router(analytics_router, prefix="/api/v1", tags=["Attorney Analytics"])
app.include_router(calendar_router,  prefix="/api/v1", tags=["Attorney Calendar"])

# ── HR ───────────────────────────────────────────────────────────────────────
app.include_router(invitation_router,   prefix="/api/v1",    tags=["HR Invitation"])
app.include_router(hr_case_router,      prefix="/api/v1/hr", tags=["HR Cases"])
app.include_router(hr_task_router,      prefix="/api/v1/hr", tags=["HR Tasks"])
app.include_router(hr_document_router,  prefix="/api/v1/hr", tags=["HR Documents"])
app.include_router(hr_deadline_router,  prefix="/api/v1/hr", tags=["HR Deadlines"])
app.include_router(hr_approval_router,  prefix="/api/v1/hr", tags=["HR Approvals"])


# ─────────────────────────────────────────────
# Health Check
# ─────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status":  "ok",
        "version": settings.APP_VERSION,
        "env":     settings.APP_ENV,
    }