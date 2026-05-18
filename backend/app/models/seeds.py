# =============================================================================
# RBAC SEED DATA
# Run once at DB init / Alembic seed migration.
# Defines: the 4 roles + the 21 permissions + which role gets which.
# =============================================================================

ROLES_SEED = [
    {"name": "app_admin", "description": "Full system administrator. Can manage users, roles, visa types, content, and support.", "is_active": True},
    {"name": "hr",        "description": "Employer HR Manager. Manages applications and documents for their company's employees.", "is_active": True},
    {"name": "attorney",  "description": "Immigration Attorney. Manages assigned cases, verifies documents, updates status.", "is_active": True},
    {"name": "employee",  "description": "Visa Applicant. Manages their own applications, uploads documents, tracks progress.", "is_active": True},
]

PERMISSIONS_SEED = [
    # ── users ─────────────────────────────────────────────────────────────────
    {"code": "users.manage",      "module": "users",        "description": "Create, suspend, and delete any user account"},
    {"code": "users.view_all",    "module": "users",        "description": "List and search all users in the system"},
    # ── applications ──────────────────────────────────────────────────────────
    {"code": "applications.create",        "module": "applications", "description": "Start a new visa application"},
    {"code": "applications.view_own",      "module": "applications", "description": "View own applications only"},
    {"code": "applications.view_all",      "module": "applications", "description": "View all applications in the system"},
    {"code": "applications.update_status", "module": "applications", "description": "Change application status and current stage"},
    {"code": "applications.delete",        "module": "applications", "description": "Permanently delete a draft application"},
    # ── documents ─────────────────────────────────────────────────────────────
    {"code": "documents.upload",    "module": "documents", "description": "Upload a new document file"},
    {"code": "documents.view_own",  "module": "documents", "description": "Download and view own documents"},
    {"code": "documents.view_all",  "module": "documents", "description": "View and download any user's documents"},
    {"code": "documents.verify",    "module": "documents", "description": "Mark a document as verified or rejected"},
    {"code": "documents.delete",    "module": "documents", "description": "Permanently delete a document"},
    # ── messages ──────────────────────────────────────────────────────────────
    {"code": "messages.send",              "module": "messages", "description": "Send messages in any thread"},
    {"code": "messages.view_all_threads",  "module": "messages", "description": "View every message thread in the system"},
    # ── roles & permissions ───────────────────────────────────────────────────
    {"code": "roles.manage",       "module": "roles", "description": "Create, edit, and deactivate roles"},
    {"code": "permissions.manage", "module": "roles", "description": "Assign and revoke permissions from roles"},
    # ── support ───────────────────────────────────────────────────────────────
    {"code": "support.view_all_tickets", "module": "support", "description": "View all support tickets regardless of submitter"},
    {"code": "support.manage_tickets",   "module": "support", "description": "Reply, reassign, and close support tickets"},
    # ── content ───────────────────────────────────────────────────────────────
    {"code": "news.publish",        "module": "content", "description": "Publish and unpublish news articles"},
    {"code": "deadlines.manage",    "module": "content", "description": "Create, edit, and close application deadlines"},
    {"code": "visa_types.manage",   "module": "content", "description": "Add and edit visa types in the master list"},
]

# Role → list of permission codes it receives
ROLE_PERMISSIONS_SEED = {
    "app_admin": [
        # All 21 permissions
        "users.manage", "users.view_all",
        "applications.create", "applications.view_own", "applications.view_all",
        "applications.update_status", "applications.delete",
        "documents.upload", "documents.view_own", "documents.view_all",
        "documents.verify", "documents.delete",
        "messages.send", "messages.view_all_threads",
        "roles.manage", "permissions.manage",
        "support.view_all_tickets", "support.manage_tickets",
        "news.publish", "deadlines.manage", "visa_types.manage",
    ],
    "hr": [
        "users.view_all",
        "applications.create", "applications.view_own", "applications.view_all",
        "applications.update_status",
        "documents.upload", "documents.view_own", "documents.view_all",
        "documents.verify", "documents.delete",
        "messages.send", "messages.view_all_threads",
        "support.view_all_tickets", "support.manage_tickets",
        "deadlines.manage",
    ],
    "attorney": [
        "applications.create", "applications.view_own", "applications.view_all",
        "applications.update_status",
        "documents.upload", "documents.view_own", "documents.view_all",
        "documents.verify",
        "messages.send",
        "deadlines.manage",
    ],
    "employee": [
        "applications.create", "applications.view_own",
        "documents.upload", "documents.view_own",
        "messages.send",
    ],
}


# =============================================================================
# SEED DATA — visa_types
# =============================================================================

VISA_TYPES_SEED = [
    # ── Employment Visas ──────────────────────────────────────────────────────
    {
        "code": "H-1B",
        "name": "H-1B Specialty Occupation",
        "short_label": "H-1B",
        "category": "employment",
        "requires_employer_sponsor": True,
        "description": (
            "For temporary workers in specialty occupations that require "
            "theoretical or practical application of a body of highly "
            "specialized knowledge."
        ),
        "required_documents": [
            "Passport Copy",
            "Educational Transcripts",
            "Resume / CV",
            "Offer Letter",
            "Previous I-797",
        ],
        "display_order": 1,
    },
    {
        "code": "H-1B-EXT",
        "name": "H-1B Extension",
        "short_label": "H-1B Ext",
        "category": "employment",
        "requires_employer_sponsor": True,
        "description": (
            "Extension of an existing H-1B status with the same or a new employer."
        ),
        "required_documents": [
            "Passport Copy",
            "Current I-797 Approval Notice",
            "Offer Letter",
            "Resume / CV",
            "Pay Stubs (Last 3 Months)",
        ],
        "display_order": 2,
    },
    {
        "code": "L-1A",
        "name": "L-1A Intracompany Transferee (Manager/Executive)",
        "short_label": "L-1A",
        "category": "employment",
        "requires_employer_sponsor": True,
        "description": (
            "For executives or managers transferring to a U.S. office "
            "of the same multinational company."
        ),
        "required_documents": [
            "Passport Copy",
            "Offer Letter",
            "Organizational Chart",
            "Company Financial Statements",
            "Proof of Employment Abroad",
        ],
        "display_order": 3,
    },
    {
        "code": "L-1B",
        "name": "L-1B Intracompany Transferee (Specialized Knowledge)",
        "short_label": "L-1B",
        "category": "employment",
        "requires_employer_sponsor": True,
        "description": (
            "For employees with specialized knowledge transferring "
            "to a U.S. office of the same multinational company."
        ),
        "required_documents": [
            "Passport Copy",
            "Offer Letter",
            "Proof of Specialized Knowledge",
            "Proof of Employment Abroad",
            "Company Financial Statements",
        ],
        "display_order": 4,
    },
    {
        "code": "O-1A",
        "name": "O-1A Extraordinary Ability (Science/Business/Athletics)",
        "short_label": "O-1A",
        "category": "employment",
        "requires_employer_sponsor": False,
        "description": (
            "For individuals with extraordinary ability in sciences, "
            "education, business, or athletics."
        ),
        "required_documents": [
            "Passport Copy",
            "Resume / CV",
            "Awards and Recognition Evidence",
            "Published Work or Media Coverage",
            "Expert Reference Letters",
            "Contracts or Itinerary",
        ],
        "display_order": 5,
    },
    {
        "code": "O-1B",
        "name": "O-1B Extraordinary Ability (Arts/Film/TV)",
        "short_label": "O-1B",
        "category": "employment",
        "requires_employer_sponsor": False,
        "description": (
            "For individuals with extraordinary achievement in motion "
            "picture or television productions, or extraordinary ability in the arts."
        ),
        "required_documents": [
            "Passport Copy",
            "Resume / CV",
            "Portfolio or Showreel",
            "Critical Role Evidence",
            "Expert Reference Letters",
            "Contracts or Itinerary",
        ],
        "display_order": 6,
    },
    {
        "code": "TN",
        "name": "TN NAFTA/USMCA",
        "short_label": "TN",
        "category": "employment",
        "requires_employer_sponsor": True,
        "description": (
            "For Canadian and Mexican citizens in specific professional categories "
            "under the USMCA trade agreement."
        ),
        "required_documents": [
            "Passport Copy",
            "Offer Letter",
            "Educational Transcripts",
            "Professional License (if applicable)",
            "Resume / CV",
        ],
        "display_order": 7,
    },
    {
        "code": "E-2",
        "name": "E-2 Treaty Investor",
        "short_label": "E-2",
        "category": "employment",
        "requires_employer_sponsor": False,
        "description": (
            "For nationals of treaty countries investing a substantial amount "
            "of capital in a U.S. business."
        ),
        "required_documents": [
            "Passport Copy",
            "Investment Evidence",
            "Business Plan",
            "Source of Funds Documentation",
            "Company Registration Documents",
        ],
        "display_order": 8,
    },

    # ── Student Visas ─────────────────────────────────────────────────────────
    {
        "code": "F-1",
        "name": "F-1 Initial",
        "short_label": "F-1",
        "category": "student",
        "requires_employer_sponsor": False,
        "description": (
            "For international students enrolled full-time at a "
            "SEVP-approved U.S. academic institution."
        ),
        "required_documents": [
            "Passport Copy",
            "Form I-20",
            "SEVIS Fee Receipt",
            "Financial Support Evidence",
            "Acceptance Letter",
        ],
        "display_order": 9,
    },
    {
        "code": "F-1-OPT",
        "name": "F-1 OPT",
        "short_label": "F-1 OPT",
        "category": "student",
        "requires_employer_sponsor": False,
        "description": (
            "Optional Practical Training — allows F-1 students to work "
            "in a job related to their major for up to 12 months."
        ),
        "required_documents": [
            "Passport Copy",
            "Form I-20 (OPT Recommendation)",
            "EAD Application (Form I-765)",
            "Passport Photos",
            "Copy of Current Visa",
        ],
        "display_order": 10,
    },
    {
        "code": "F-1-OPT-EXT",
        "name": "F-1 OPT Extension",
        "short_label": "F-1 OPT Ext",
        "category": "student",
        "requires_employer_sponsor": False,
        "description": (
            "Extension of F-1 OPT for non-STEM degree holders "
            "under special circumstances."
        ),
        "required_documents": [
            "Passport Copy",
            "Current EAD Card",
            "Form I-20 (Updated)",
            "Employment Verification Letter",
        ],
        "display_order": 11,
    },
    {
        "code": "F-1-STEM-OPT",
        "name": "F-1 STEM OPT Extension",
        "short_label": "STEM OPT",
        "category": "student",
        "requires_employer_sponsor": True,
        "description": (
            "24-month STEM OPT extension for F-1 students who graduated "
            "with a STEM degree and are employed by an E-Verify employer."
        ),
        "required_documents": [
            "Passport Copy",
            "EAD Card",
            "Form I-20",
            "I-983 Training Plan",
            "Employer Attestation",
            "STEM Degree Transcript",
        ],
        "display_order": 12,
    },
    {
        "code": "F-1-CPT",
        "name": "F-1 CPT",
        "short_label": "CPT",
        "category": "student",
        "requires_employer_sponsor": True,
        "description": (
            "Curricular Practical Training — allows F-1 students to work "
            "off-campus as part of their academic program."
        ),
        "required_documents": [
            "Passport Copy",
            "Form I-20 (CPT Authorization)",
            "Offer Letter",
            "Enrollment Verification",
        ],
        "display_order": 13,
    },
    {
        "code": "J-1",
        "name": "J-1 Exchange Visitor",
        "short_label": "J-1",
        "category": "exchange",
        "requires_employer_sponsor": False,
        "description": (
            "For participants in approved exchange visitor programs — "
            "researchers, students, professors, and trainees."
        ),
        "required_documents": [
            "Passport Copy",
            "Form DS-2019",
            "SEVIS Fee Receipt",
            "Financial Support Evidence",
            "Program Sponsor Letter",
        ],
        "display_order": 14,
    },

    # ── Visitor ───────────────────────────────────────────────────────────────
    {
        "code": "B-1-B-2",
        "name": "B-1/B-2 Visitor",
        "short_label": "B1/B2",
        "category": "visitor",
        "requires_employer_sponsor": False,
        "description": (
            "For temporary visitors for business (B-1) or tourism/pleasure (B-2)."
        ),
        "required_documents": [
            "Passport Copy",
            "Bank Statements (Last 3 Months)",
            "Travel Itinerary",
            "Ties to Home Country Evidence",
            "Invitation Letter (if applicable)",
        ],
        "display_order": 15,
    },

    # ── Permanent Resident ────────────────────────────────────────────────────
    {
        "code": "EB-1",
        "name": "EB-1 Priority Worker",
        "short_label": "EB-1",
        "category": "permanent_resident",
        "requires_employer_sponsor": False,
        "description": (
            "For individuals with extraordinary ability, outstanding professors "
            "or researchers, or multinational managers/executives."
        ),
        "required_documents": [
            "Passport Copy",
            "Resume / CV",
            "Awards and Recognition Evidence",
            "Published Work or Media Coverage",
            "Expert Reference Letters",
            "Form I-140 Supporting Documents",
        ],
        "display_order": 16,
    },
    {
        "code": "EB-2",
        "name": "EB-2 Advanced Degree / NIW",
        "short_label": "EB-2",
        "category": "permanent_resident",
        "requires_employer_sponsor": False,
        "description": (
            "For professionals with advanced degrees or exceptional ability. "
            "NIW allows self-petition if the work benefits the U.S. national interest."
        ),
        "required_documents": [
            "Passport Copy",
            "Educational Transcripts",
            "Resume / CV",
            "Expert Reference Letters",
            "National Interest Waiver Justification Letter",
            "Form I-140 Supporting Documents",
        ],
        "display_order": 17,
    },
    {
        "code": "EB-3",
        "name": "EB-3 Skilled Worker",
        "short_label": "EB-3",
        "category": "permanent_resident",
        "requires_employer_sponsor": True,
        "description": (
            "For skilled workers, professionals, and unskilled workers "
            "with a permanent job offer from a U.S. employer."
        ),
        "required_documents": [
            "Passport Copy",
            "Educational Transcripts",
            "Resume / CV",
            "Offer Letter",
            "PERM Labor Certification",
            "Form I-140 Supporting Documents",
        ],
        "display_order": 18,
    },
    {
        "code": "GREEN-CARD",
        "name": "Green Card (Adjustment of Status)",
        "short_label": "Green Card",
        "category": "permanent_resident",
        "requires_employer_sponsor": False,
        "description": (
            "Adjustment of Status (Form I-485) for individuals already in the U.S. "
            "who are eligible for lawful permanent residence."
        ),
        "required_documents": [
            "Passport Copy",
            "Birth Certificate",
            "Form I-485",
            "Medical Examination (Form I-693)",
            "Affidavit of Support (Form I-864)",
            "Two Passport Photos",
            "Current Immigration Status Evidence",
        ],
        "display_order": 19,
    },
]


DOCUMENT_TYPES_SEED = [
    # ── Identity ──────────────────────────────────────────────────────────────
    {
        "name": "Passport Copy",
        "category": "identity",
        "description": "Biographical page showing photo, personal details, and expiration date.",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 10,
    },
    {
        "name": "Birth Certificate",
        "category": "identity",
        "description": "Official government-issued birth certificate.",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 10,
    },
    {
        "name": "Two Passport Photos",
        "category": "identity",
        "description": "Two recent passport-style photographs meeting USCIS specifications.",
        "is_optional": False,
        "accepted_formats": "JPG,PNG",
        "max_file_size_mb": 5,
    },
    {
        "name": "Copy of Current Visa",
        "category": "identity",
        "description": "Copy of current valid visa stamp in passport.",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 10,
    },
    {
        "name": "Current Immigration Status Evidence",
        "category": "identity",
        "description": "I-94, current visa, or other evidence of lawful immigration status.",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 10,
    },

    # ── Employment ────────────────────────────────────────────────────────────
    {
        "name": "Offer Letter",
        "category": "employment",
        "description": "Signed offer letter from the sponsoring employer.",
        "is_optional": False,
        "accepted_formats": "PDF,DOCX",
        "max_file_size_mb": 10,
    },
    {
        "name": "Resume / CV",
        "category": "employment",
        "description": "Current resume highlighting relevant work experience and qualifications.",
        "is_optional": False,
        "accepted_formats": "PDF,DOCX",
        "max_file_size_mb": 10,
    },
    {
        "name": "Pay Stubs (Last 3 Months)",
        "category": "employment",
        "description": "Most recent three months of pay stubs from current employer.",
        "is_optional": False,
        "accepted_formats": "PDF",
        "max_file_size_mb": 10,
    },
    {
        "name": "Proof of Employment Abroad",
        "category": "employment",
        "description": "Employment contract or letter from foreign employer confirming role.",
        "is_optional": False,
        "accepted_formats": "PDF,DOCX",
        "max_file_size_mb": 10,
    },
    {
        "name": "Employment Verification Letter",
        "category": "employment",
        "description": "Letter from employer confirming current employment and job title.",
        "is_optional": False,
        "accepted_formats": "PDF,DOCX",
        "max_file_size_mb": 10,
    },
    {
        "name": "Organizational Chart",
        "category": "employment",
        "description": "Company org chart showing the applicant's position and reporting structure.",
        "is_optional": False,
        "accepted_formats": "PDF,PNG,JPG",
        "max_file_size_mb": 10,
    },
    {
        "name": "Contracts or Itinerary",
        "category": "employment",
        "description": "Signed contracts or detailed itinerary of engagements in the U.S.",
        "is_optional": False,
        "accepted_formats": "PDF,DOCX",
        "max_file_size_mb": 10,
    },
    {
        "name": "Employer Attestation",
        "category": "employment",
        "description": "Signed employer attestation confirming training plan compliance.",
        "is_optional": False,
        "accepted_formats": "PDF,DOCX",
        "max_file_size_mb": 10,
    },
    {
        "name": "Enrollment Verification",
        "category": "employment",
        "description": "Letter from DSO verifying enrollment and authorizing CPT.",
        "is_optional": False,
        "accepted_formats": "PDF,DOCX",
        "max_file_size_mb": 10,
    },

    # ── Education ─────────────────────────────────────────────────────────────
    {
        "name": "Educational Transcripts",
        "category": "education",
        "description": "Official transcripts from all degree-granting institutions.",
        "is_optional": False,
        "accepted_formats": "PDF",
        "max_file_size_mb": 10,
    },
    {
        "name": "STEM Degree Transcript",
        "category": "education",
        "description": "Official transcript confirming STEM degree classification.",
        "is_optional": False,
        "accepted_formats": "PDF",
        "max_file_size_mb": 10,
    },
    {
        "name": "Acceptance Letter",
        "category": "education",
        "description": "Official acceptance letter from the SEVP-approved institution.",
        "is_optional": False,
        "accepted_formats": "PDF,DOCX",
        "max_file_size_mb": 10,
    },
    {
        "name": "Professional License (if applicable)",
        "category": "education",
        "description": "State or national professional license relevant to the TN occupation.",
        "is_optional": True,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 10,
    },

    # ── Legal ─────────────────────────────────────────────────────────────────
    {
        "name": "Previous I-797",
        "category": "legal",
        "description": "Previous H-1B approval notice (I-797) if applicable.",
        "is_optional": True,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 10,
    },
    {
        "name": "Current I-797 Approval Notice",
        "category": "legal",
        "description": "Most recent I-797 Notice of Action for current H-1B status.",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 10,
    },
    {
        "name": "Form I-20",
        "category": "legal",
        "description": "Certificate of Eligibility for Nonimmigrant Student Status.",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 10,
    },
    {
        "name": "Form I-20 (OPT Recommendation)",
        "category": "legal",
        "description": "I-20 with DSO OPT recommendation endorsed for OPT application.",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 10,
    },
    {
        "name": "Form I-20 (Updated)",
        "category": "legal",
        "description": "Updated I-20 reflecting current program and status.",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 10,
    },
    {
        "name": "Form I-20 (CPT Authorization)",
        "category": "legal",
        "description": "I-20 with CPT authorization noted by the DSO.",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 10,
    },
    {
        "name": "I-983 Training Plan",
        "category": "legal",
        "description": "Training Plan for STEM OPT Students (Form I-983) signed by employer.",
        "is_optional": False,
        "accepted_formats": "PDF,DOCX",
        "max_file_size_mb": 10,
    },
    {
        "name": "EAD Application (Form I-765)",
        "category": "legal",
        "description": "Application for Employment Authorization (I-765) for OPT.",
        "is_optional": False,
        "accepted_formats": "PDF",
        "max_file_size_mb": 10,
    },
    {
        "name": "EAD Card",
        "category": "legal",
        "description": "Current Employment Authorization Document (EAD card).",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 10,
    },
    {
        "name": "Form DS-2019",
        "category": "legal",
        "description": "Certificate of Eligibility for Exchange Visitor Status (J-1).",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 10,
    },
    {
        "name": "SEVIS Fee Receipt",
        "category": "legal",
        "description": "I-901 SEVIS fee payment confirmation receipt.",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 10,
    },
    {
        "name": "Form I-485",
        "category": "legal",
        "description": "Application to Register Permanent Residence (Adjustment of Status).",
        "is_optional": False,
        "accepted_formats": "PDF",
        "max_file_size_mb": 10,
    },
    {
        "name": "Medical Examination (Form I-693)",
        "category": "legal",
        "description": "Report of Medical Examination and Vaccination Record (I-693).",
        "is_optional": False,
        "accepted_formats": "PDF",
        "max_file_size_mb": 10,
    },
    {
        "name": "Affidavit of Support (Form I-864)",
        "category": "legal",
        "description": "Form I-864 Affidavit of Support from a financial sponsor.",
        "is_optional": False,
        "accepted_formats": "PDF,DOCX",
        "max_file_size_mb": 10,
    },
    {
        "name": "PERM Labor Certification",
        "category": "legal",
        "description": "Approved ETA Form 9089 PERM Labor Certification from DOL.",
        "is_optional": False,
        "accepted_formats": "PDF",
        "max_file_size_mb": 10,
    },
    {
        "name": "Form I-140 Supporting Documents",
        "category": "legal",
        "description": "Supporting evidence package for the I-140 immigrant petition.",
        "is_optional": False,
        "accepted_formats": "PDF",
        "max_file_size_mb": 20,
    },
    {
        "name": "National Interest Waiver Justification Letter",
        "category": "legal",
        "description": "Detailed letter arguing national interest for EB-2 NIW self-petition.",
        "is_optional": False,
        "accepted_formats": "PDF,DOCX",
        "max_file_size_mb": 10,
    },

    # ── Personal ──────────────────────────────────────────────────────────────
    {
        "name": "Financial Support Evidence",
        "category": "personal",
        "description": "Bank statements or sponsor letter proving ability to support self.",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 10,
    },
    {
        "name": "Bank Statements (Last 3 Months)",
        "category": "personal",
        "description": "Three months of personal bank statements showing available funds.",
        "is_optional": False,
        "accepted_formats": "PDF",
        "max_file_size_mb": 10,
    },
    {
        "name": "Travel Itinerary",
        "category": "personal",
        "description": "Detailed travel plan including flight bookings and accommodation.",
        "is_optional": True,
        "accepted_formats": "PDF,DOCX",
        "max_file_size_mb": 10,
    },
    {
        "name": "Ties to Home Country Evidence",
        "category": "personal",
        "description": "Property, family, employment or other evidence of intent to return.",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG,DOCX",
        "max_file_size_mb": 10,
    },
    {
        "name": "Invitation Letter (if applicable)",
        "category": "personal",
        "description": "Letter from U.S. host confirming purpose and duration of visit.",
        "is_optional": True,
        "accepted_formats": "PDF,DOCX",
        "max_file_size_mb": 10,
    },

    # ── Other ─────────────────────────────────────────────────────────────────
    {
        "name": "Awards and Recognition Evidence",
        "category": "other",
        "description": "Certificates, trophies, letters confirming awards or prizes.",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 20,
    },
    {
        "name": "Published Work or Media Coverage",
        "category": "other",
        "description": "Published articles, press coverage, or citations evidencing prominence.",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 20,
    },
    {
        "name": "Expert Reference Letters",
        "category": "other",
        "description": "Reference letters from recognized experts in the field.",
        "is_optional": False,
        "accepted_formats": "PDF,DOCX",
        "max_file_size_mb": 10,
    },
    {
        "name": "Proof of Specialized Knowledge",
        "category": "other",
        "description": "Patents, publications, or technical documentation proving specialized knowledge.",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 20,
    },
    {
        "name": "Investment Evidence",
        "category": "other",
        "description": "Bank wire transfers, contracts, or receipts proving capital investment.",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 20,
    },
    {
        "name": "Business Plan",
        "category": "other",
        "description": "Detailed business plan for the E-2 investment enterprise.",
        "is_optional": False,
        "accepted_formats": "PDF,DOCX",
        "max_file_size_mb": 20,
    },
    {
        "name": "Source of Funds Documentation",
        "category": "other",
        "description": "Evidence showing the lawful source of investment funds.",
        "is_optional": False,
        "accepted_formats": "PDF",
        "max_file_size_mb": 20,
    },
    {
        "name": "Company Registration Documents",
        "category": "other",
        "description": "Articles of incorporation, operating agreement, or business license.",
        "is_optional": False,
        "accepted_formats": "PDF",
        "max_file_size_mb": 10,
    },
    {
        "name": "Company Financial Statements",
        "category": "other",
        "description": "Audited or unaudited financial statements for the past 2 years.",
        "is_optional": False,
        "accepted_formats": "PDF",
        "max_file_size_mb": 20,
    },
    {
        "name": "Portfolio or Showreel",
        "category": "other",
        "description": "Portfolio, showreel link, or representative work samples.",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 20,
    },
    {
        "name": "Critical Role Evidence",
        "category": "other",
        "description": "Evidence of critical or essential role in productions or performances.",
        "is_optional": False,
        "accepted_formats": "PDF,JPG,PNG",
        "max_file_size_mb": 20,
    },
    {
        "name": "Program Sponsor Letter",
        "category": "other",
        "description": "Letter from J-1 program sponsor confirming program details.",
        "is_optional": False,
        "accepted_formats": "PDF,DOCX",
        "max_file_size_mb": 10,
    },
    {
        "name": "Passport Photos",
        "category": "other",
        "description": "Passport-style photos meeting USCIS/DOS photo requirements.",
        "is_optional": False,
        "accepted_formats": "JPG,PNG",
        "max_file_size_mb": 5,
    },
]