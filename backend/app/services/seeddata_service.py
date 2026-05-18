import json
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import DocumentType, Role, Permission, RolePermission, VisaType
from app.models.seeds import DOCUMENT_TYPES_SEED, ROLES_SEED, PERMISSIONS_SEED, ROLE_PERMISSIONS_SEED, VISA_TYPES_SEED

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import hash_password
from enum import Enum


async def seed_document_types(db: AsyncSession):
    """
    Seed document_types table.
    - Skips existing records (based on unique 'name')
    """

    for doc_data in DOCUMENT_TYPES_SEED:
        # 🔍 Check if already exists
        result = await db.execute(
            select(DocumentType).where(DocumentType.name == doc_data["name"])
        )
        existing = result.scalar_one_or_none()

        if existing:
            continue

        # 🆕 Create new record
        new_doc_type = DocumentType(
            id=uuid.uuid4(),
            name=doc_data["name"],
            category=doc_data["category"],
            description=doc_data.get("description"),
            is_optional=doc_data.get("is_optional", False),
            accepted_formats=doc_data.get("accepted_formats", "PDF,JPG,PNG"),
            max_file_size_mb=doc_data.get("max_file_size_mb", 10),
            is_active=True,
            created_by=None,
            modified_by=None,
        )

        db.add(new_doc_type)

    await db.commit()
    
async def seed_visa_types(db: AsyncSession):
    """
    Seed visa_types table.
    - Skips existing records (based on unique 'code')
    - Converts required_documents list → JSON string
    """

    for visa_data in VISA_TYPES_SEED:
        # 🔍 Check if already exists
        result = await db.execute(
            select(VisaType).where(VisaType.code == visa_data["code"])
        )
        existing = result.scalar_one_or_none()

        if existing:
            continue

        # 🧠 Convert list → JSON string (since column is Text)
        required_docs = visa_data.get("required_documents")
        if required_docs:
            required_docs = json.dumps(required_docs)

        # 🆕 Create new record
        new_visa = VisaType(
            id=uuid.uuid4(),
            code=visa_data["code"],
            name=visa_data["name"],
            short_label=visa_data.get("short_label"),
            category=visa_data["category"],
            requires_employer_sponsor=visa_data.get("requires_employer_sponsor", False),
            description=visa_data.get("description"),
            required_documents=required_docs,
            display_order=visa_data.get("display_order", 0),

            # now allowed
            created_by=None,
            modified_by=None,
        )

        db.add(new_visa)

    await db.commit()
    
async def seed_rbac(db: AsyncSession):
    # ── Insert Roles ─────────────────────────────
    for role_data in ROLES_SEED:
        result = await db.execute(
            select(Role).where(Role.name == role_data["name"])
        )
        role = result.scalar_one_or_none()

        if not role:
            role = Role(**role_data)
            print(role,"role")
            db.add(role)

    # ── Insert Permissions ───────────────────────
    for perm_data in PERMISSIONS_SEED:
        result = await db.execute(
            select(Permission).where(Permission.code == perm_data["code"])
        )
        perm = result.scalar_one_or_none()

        if not perm:
            perm = Permission(**perm_data)
            db.add(perm)

    await db.commit()

    # ── Fetch fresh data ─────────────────────────
    roles = (await db.execute(select(Role))).scalars().all()
    permissions = (await db.execute(select(Permission))).scalars().all()

    role_map = {r.name: r for r in roles}
    perm_map = {p.code: p for p in permissions}

    # ── Insert Role-Permissions ──────────────────
    for role_name, perm_codes in ROLE_PERMISSIONS_SEED.items():
        for code in perm_codes:
            role = role_map[role_name]
            perm = perm_map[code]

            result = await db.execute(
                select(RolePermission).where(
                    RolePermission.role_id == role.id,
                    RolePermission.permission_id == perm.id
                )
            )

            exists = result.scalar_one_or_none()

            if not exists:
                db.add(RolePermission(
                    role_id=role.id,
                    permission_id=perm.id
                ))

    await db.commit()

