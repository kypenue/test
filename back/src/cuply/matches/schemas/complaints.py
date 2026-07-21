import datetime as dt
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic_core.core_schema import FieldValidationInfo

from cuply.accounts.schemas import AccountReadWithUserShortSchema
from cuply.matches.models import MatchComplaintStatus, MatchComplaintCreation
from cuply.matches.schemas.matches import SeriesMatchShortReadSchema


class MatchComplaintReadSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    author: Optional[AccountReadWithUserShortSchema] = Field(default=None, validate_default=True)
    comment: Optional[str] = Field(default=None, validate_default=True)
    resolution_text: Optional[str] = Field(default=None, validate_default=True)
    status: MatchComplaintStatus
    creation_way: MatchComplaintCreation
    match: SeriesMatchShortReadSchema
    series_id: Optional[UUID]
    tournament_id: int

    created_at: dt.datetime
    updated_at: dt.datetime

    @field_validator("comment", mode="before")
    def generate_comment(cls, value, info: FieldValidationInfo):
        from cuply.auth.models import UserModel
        current_user: UserModel = info.context.get("current_user")
        author_user: UserModel = info.context.get("author_user")
        can_moderate_tournament: bool = info.context.get("can_moderate_tournament")
        if current_user.id != author_user.id:
            if not can_moderate_tournament:
                return None
        return value

    @field_validator("resolution_text", mode="before")
    def generate_resolution_text(cls, value, info: FieldValidationInfo):
        from cuply.auth.models import UserModel
        current_user: UserModel = info.context.get("current_user")
        author_user: UserModel = info.context.get("author_user")
        can_moderate_tournament: bool = info.context.get("can_moderate_tournament")
        if current_user.id != author_user.id:
            if not can_moderate_tournament:
                return None
        return value

    @field_validator("author", mode="before")
    def generate_author(cls, value, info: FieldValidationInfo):
        from cuply.auth.models import UserModel
        from cuply.matches.models import MatchModel
        current_user: UserModel = info.context.get("current_user")
        author_user: UserModel = info.context.get("author_user")
        can_moderate_tournament: bool = info.context.get("can_moderate_tournament")
        if current_user.id != author_user.id:
            if not can_moderate_tournament:
                return None
        match: MatchModel = info.context.get("match")
        if author_user.id == match.home_player_account.user.id:
            return match.home_player_account
        return match.guest_player_account


class MatchComplaintUpdateSchema(BaseModel):
    resolution_text: Optional[str] = None
    status: Optional[int] = None


class MatchComplaintCreateSchemaDto(BaseModel):
    comment: str


class MatchComplaintCreateSchema(BaseModel):
    author_id: int
    comment: str
    status: MatchComplaintStatus
    creation_way: MatchComplaintCreation
    match_id: UUID
    series_id: Optional[UUID]
    tournament_id: int
