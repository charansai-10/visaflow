import uuid as _uuid
from fastapi import APIRouter
 
from app.core.dependencies import Current_User, DBSession
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard_service import service_get_dashboard
 
dashboard_router = APIRouter()
 
 
@dashboard_router.get(
    "/dashboard",
    response_model=DashboardResponse,
    status_code=200,
    summary="Employee dashboard — KPI cards, recent activity, guidance library",
    description=(
        "Returns all data needed to render the Employee Dashboard (Screen 11). "
        "Queries the authenticated user's applications, documents, activity log, "
        "and visa targets to build the 4 KPI cards, timeline, and guidance library."
    ),
)
async def get_dashboard(
    db: DBSession,
    current_user: Current_User,
) -> DashboardResponse:
    return await service_get_dashboard(db, current_user.user_id)
 