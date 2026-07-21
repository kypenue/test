# communities/schemas.py
import datetime
import uuid
from typing import Optional, List

from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic_core.core_schema import FieldValidationInfo
from pygments.lexer import default

from cuply.auth.schemas import UserShortReadSchema, UserReadSchema
from cuply.communities.models import CommunityRoleTypes
from cuply.upload.schemas import UploadRead
from cuply.games.schemas import GameShortReadSchema


class CommunityCreateSchema(BaseModel):
    """
    Схема для создания сообщества.
    """
    title: str
    description: Optional[str] = None
    social_links: Optional[List[str]] = None
    game_ids: Optional[List[int]] = None

    avatar_id: Optional[int] = None
    header_id: Optional[int] = None

    slug: Optional[str] = None


class CommunityUpdateSchema(BaseModel):
    """
    Схема для обновления сообщества.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    social_links: Optional[List[str]] = None
    game_ids: Optional[List[int]] = None

    avatar_id: Optional[int] = None
    header_id: Optional[int] = None

    slug: Optional[str] = None


class CommunityReadSchema(BaseModel):
    """
    Расширенная схема для чтения полного сообщества.
    """
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    description: Optional[str] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime

    creator: UserShortReadSchema

    avatar: Optional[UploadRead] = None
    header: Optional[UploadRead] = None

    social_links: Optional[List[str]] = None

    games: List[GameShortReadSchema]

    slug: Optional[str] = None

    community_roles: Optional[List[CommunityRoleTypes]] = Field(default=None, validate_default=True)

    @field_validator("community_roles", mode="before")
    def generate_community_roles(cls, value, info: FieldValidationInfo):
        return info.context.get("community_roles")


class CommunityShortReadSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    description: Optional[str] = None
    slug: Optional[str] = None
    games: List[GameShortReadSchema]
    creator: UserShortReadSchema


class CommunityUserRoleReadSchema(BaseModel):
    id: uuid.UUID

    user: UserReadSchema
    community: CommunityShortReadSchema

    role_type: CommunityRoleTypes

    model_config = ConfigDict(from_attributes=True)


class CommunityUserRoleCreateSchema(BaseModel):
    user_id: int

    role_type: CommunityRoleTypes

