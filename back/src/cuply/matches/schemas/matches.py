import datetime as dt
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, NonNegativeInt, field_validator
from pydantic_core.core_schema import FieldValidationInfo

from cuply.accounts.schemas import (
    AccountReadWithUserShortSchema,
    AccountWithTgReadSchema,
)
from cuply.matches.models import MatchStatus
from cuply.matches.schemas.results import MatchResultReadSchema
from cuply.teams.schemas.teams import TeamShortReadSchema
from cuply.tournaments.schemas.registration import TournamentRegisteredUserReadSchema


class MatchFullReadSchema(BaseModel):
    match_number: Optional[int]
    status: MatchStatus

    home_player_id: int
    guest_player_id: int

    model_config = ConfigDict(from_attributes=True)


class SeriesMatchShortReadSchema(BaseModel):
    id: UUID
    home_player_account: AccountReadWithUserShortSchema
    guest_player_account: AccountReadWithUserShortSchema

    home_participant: TournamentRegisteredUserReadSchema
    guest_participant: TournamentRegisteredUserReadSchema

    created_at: dt.datetime
    updated_at: dt.datetime

    model_config = ConfigDict(from_attributes=True)


class SeriesMatchReadSchema(BaseModel):
    id: UUID

    home_player_account: AccountWithTgReadSchema
    home_player_match_result: Optional[MatchResultReadSchema] = Field(default=None, validate_default=True)

    guest_player_account: AccountWithTgReadSchema
    guest_player_match_result: Optional[MatchResultReadSchema] = Field(default=None, validate_default=True)

    home_participant: TournamentRegisteredUserReadSchema
    guest_participant: TournamentRegisteredUserReadSchema

    status: MatchStatus

    created_at: dt.datetime
    updated_at: dt.datetime

    model_config = ConfigDict(from_attributes=True)

    home_player_team: Optional[TeamShortReadSchema] = Field(default=None, validate_default=True)
    guest_player_team: Optional[TeamShortReadSchema] = Field(default=None, validate_default=True)

    @field_validator("home_player_team", mode="before")
    def generate_home_player_team(cls, value, info: FieldValidationInfo):
        home_player_team = info.context.get("home_player_team")
        if not home_player_team:
            return None
        return TeamShortReadSchema.model_validate(home_player_team)

    @field_validator("home_player_match_result", mode="before")
    def generate_home_player_match_result(cls, value, info: FieldValidationInfo):
        home_player_match_result = info.context.get("home_player_match_result")
        if not home_player_match_result:
            return None
        return MatchResultReadSchema.model_validate(
            home_player_match_result
        )

    @field_validator("guest_player_team", mode="before")
    def generate_guest_player_team(cls, value, info: FieldValidationInfo):
        guest_player_team = info.context.get("guest_player_team")
        if not guest_player_team:
            return None
        return TeamShortReadSchema.model_validate(guest_player_team)

    @field_validator("guest_player_match_result", mode="before")
    def generate_guest_player_match_result(cls, value, info: FieldValidationInfo):
        guest_player_match_result = info.context.get("guest_player_match_result")
        if not guest_player_match_result:
            return None
        return MatchResultReadSchema.model_validate(
            guest_player_match_result
        )


class SeriesMatchUpdateSchema(BaseModel):
    status: int
