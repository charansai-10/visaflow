from pydantic import BaseModel
from typing import Optional
 
 
class DashboardStats(BaseModel):
    # KPI Card 1 — Active Applications
    active_applications: int
 
    # KPI Card 2 — Documents Verified
    documents_verified: int
    documents_total: int
    documents_action_required: int   # count with status = rejected/pending_review
 
    # KPI Card 3 — Est. Processing Time
    processing_days: int             # from visa_types.typical_processing_days
    processing_type: str             # "Standard Processing" | "Premium Processing"
 
    # KPI Card 4 — Sponsor Status
    sponsor_name: str                # from latest application.sponsor_employer
    sponsor_stage: str               # human-readable current_stage label
    sponsor_verified: bool           # True if application has an assigned_hr
 
    # Profile Readiness donut
    profile_readiness: int           # 0-100 percentage
 
 
class ActivityItem(BaseModel):
    id: str
    title: str
    description: str
    timestamp: str       # ISO datetime string
    color: str           # hex: "#5269f2" | "#10b981" | "#cbd5e1"
 
 
class GuidanceItem(BaseModel):
    id: str
    tag: str             # "Required" | "Optional" | "Tip" | "Info"
    tag_color: str       # "blue" | "purple" | "gray"
    icon_type: str       # "doc" | "cap" | "user" | "info"
    title: str
    description: str
 
 
class DashboardResponse(BaseModel):
    stats: DashboardStats
    activity: list[ActivityItem]
    guidance: list[GuidanceItem]
 



