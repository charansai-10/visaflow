"""
Reusable FastAPI dependency injectors.
"""
from typing import Annotated, Optional
import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_token
from app.core.exceptions import UnauthorizedException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

class CurrentUserData(BaseModel):
    user_id: uuid.UUID
    roles: list[str]

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
) -> CurrentUserData:
    try:
        payload = decode_token(token)

        user_id = payload.get("sub")   
        roles = payload.get("roles", [])  
        token_type = payload.get("type")

        if not user_id or token_type != "access":
            raise UnauthorizedException("Invalid token")

        return CurrentUserData(
            user_id=uuid.UUID(user_id),
            roles=roles
        )

    except (JWTError, ValueError, KeyError):
        raise UnauthorizedException("Could not validate credentials")

    
# ── Typed aliases for route signatures ───────────────────────────────────────
Current_User = Annotated[CurrentUserData, Depends(get_current_user)]
DBSession     = Annotated[AsyncSession, Depends(get_db)]