"""
VisaFlow FastAPI Application Entry Point
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import AsyncSessionLocal, engine, Base, get_db
from app.core.middleware import  RateLimitMiddleware,RequestLoggingMiddleware
from app.core.exceptions import register_exception_handlers

# ✅ IMPORTANT: ensure all models are loaded
from app.models.models import *

from app.routes import auth, onboarding
from app.routes.document import document_router
from app.routes.application import application_router,application_task_router,application_history_router
from app.services.seeddata_service import  seed_document_types, seed_rbac, seed_visa_types
from app.routes.visa_types import visa_type_router
from app.routes.dashboard import dashboard_router
from app.routes.user_profile import user_profile_router
from app.routes.login_history import login_history_router
from app.routes.admin.admin_dashboard import admin_dashboard_router

# ─────────────────────────────────────────────
# Lifespan (startup / shutdown)
# ─────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting application...")

    # 1. Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # 2. Run seed safely
    async with AsyncSessionLocal() as db:
        await seed_rbac(db) 
        await seed_visa_types(db)
        await seed_document_types(db)

    yield
    print("🛑 Shutting down...")
    await engine.dispose()

# ─────────────────────────────────────────────
# FastAPI App
# ─────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="VisaFlow Immigration Management Platform API",
    docs_url="/docs",                # Swagger
    redoc_url="/redoc",              # ReDoc
    lifespan=lifespan,
)



# ─────────────────────────────────────────────
# Middleware
# ─────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173','https://helper-sheep-imminent.ngrok-free.dev'],
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
# Routers
# ─────────────────────────────────────────────
app.include_router(auth.router,                prefix="/api/v1/auth",       tags=["Authentication"])
app.include_router(onboarding.router,          prefix="/api/v1/onboarding", tags=["Onboarding"])
app.include_router(document_router,            prefix="/api/v1", tags=["Documents"])
app.include_router(application_router,         prefix="/api/v1", tags=["Applications"])
app.include_router(application_history_router, prefix="/api/v1", tags=["Application History"])
app.include_router(application_task_router,    prefix="/api/v1", tags=["Application Tasks"])
app.include_router(visa_type_router,           prefix="/api/v1", tags=["Visa Types"])
app.include_router(dashboard_router,           prefix="/api/v1", tags=["Dashboard"])
app.include_router(user_profile_router,        prefix="/api/v1", tags=["User Profile"])
app.include_router(login_history_router,       prefix="/api/v1", tags=["Login History"])
app.include_router(admin_dashboard_router,       prefix="/api/v1", tags=["admin cards"])


# ─────────────────────────────────────────────
# Health Check
# ─────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "ok",
        "version": settings.APP_VERSION,
    }

