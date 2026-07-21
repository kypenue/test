""" Schemas for tournaments models. """
import datetime
import uuid
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator
from pydantic_core.core_schema import FieldValidationInfo

from cuply.accounts.schemas import AccountReadSchema
from cuply.auth.schemas import UserShortReadSchema
from cuply.communities.schemas import CommunityShortReadSchema
from cuply.games.schemas import GameReadSchema
from cuply.platforms.schemas import PlatformReadSchema
from cuply.tournaments.models import RegistrationStatus, RegistrationTypes, TournamentRoleTypes, TournamentPaymentType
from cuply.stages.models import TournamentStageTypes
from cuply.stages.schemas.stages import TournamentStageCreateSchema, TournamentStageReadSchema
from cuply.upload.schemas import UploadRead


class TournamentBaseWriteSchema(BaseModel):
    """ Base write for TournamentModel. """
    name: str
    description: Optional[str] = None

    tournament_format: Optional[str]
    rules_info: Optional[str]
    regulation: Optional[str]
    contacts_info: Optional[str]

    game_id: int

    registration_type: RegistrationTypes
    registration_start: datetime.datetime
    registration_end: datetime.datetime

    min_age: int = Field(ge=0, le=200)

    tournament_start: datetime.datetime
    tournament_end: datetime.datetime

    participants_number: Optional[int]
    should_limit_participants: Optional[bool]

    teams_used: bool = False

    cover_image_id: Optional[int]
    header_image_id: Optional[int]

    is_forecast_competition_allowed: bool = False

    @model_validator(mode="before")
    def check_dates(cls, values):
        registration_start = values.get("registration_start")
        registration_end = values.get("registration_end")
        if registration_start > registration_end:
            raise ValueError("registration_start must be before registration_end")

        tournament_start = values.get("tournament_start")
        tournament_end = values.get("tournament_end")
        if tournament_start > tournament_end:
            raise ValueError("tournament_start must be before tournament_end")

        if registration_end > tournament_start:
            raise ValueError("registration_end must be before tournament_start")

        return values

    @model_validator(mode="before")
    def check_registration_limits(cls, values):
        should_limit_participants = values.get("should_limit_participants")
        participants_number = values.get("participants_number")

        if should_limit_participants is False and participants_number is not None:
            raise ValueError("participants_number must be None when should_limit_participants is True")

        return values


class TournamentReadSchema(BaseModel):
    id: int

    name: str
    description: Optional[str] = None

    tournament_format: Optional[str]
    rules_info: Optional[str]
    regulation: Optional[str]
    contacts_info: Optional[str]

    game: GameReadSchema

    registration_type: Optional[RegistrationTypes]
    registration_start: datetime.datetime
    registration_end: datetime.datetime

    registration_status: RegistrationStatus = Field(default=None, validate_default=True)
    tournament_roles: List[TournamentRoleTypes] = Field(default=None, validate_default=True)

    lifecycle_status: Optional[int]

    min_age: int = Field(ge=0, le=200)

    tournament_start: datetime.datetime
    tournament_end: datetime.datetime

    participants_number: Optional[int]
    should_limit_participants: Optional[bool]

    stages: List[TournamentStageReadSchema]

    platforms: List[PlatformReadSchema]

    cover_image: Optional[UploadRead]
    header_image: Optional[UploadRead]

    community: Optional[CommunityShortReadSchema]
    is_primary: Optional[bool]

    payment_type: Optional[TournamentPaymentType]

    is_forecast_competition_allowed: bool

    teams_used: bool

    creator: UserShortReadSchema

    model_config = ConfigDict(from_attributes=True)

    @field_validator("registration_status", mode="before")
    def generate_registration_status(cls, value, info: FieldValidationInfo):
        return info.context.get("registration_status")

    @field_validator("tournament_roles", mode="before")
    def generate_tournament_roles(cls, value, info: FieldValidationInfo):
        return info.context.get("tournament_roles")


class TournamentCreateSchema(TournamentBaseWriteSchema):
    """ Create schema for TournamentModel. """
    stages: List[TournamentStageCreateSchema]
    platforms: List[int]

    community_id: Optional[UUID] = None
    is_primary: bool = False

    @field_validator("stages")
    def check_stages(cls, value):
        stages: list[TournamentStageCreateSchema] = value
        stages.sort(key=lambda x: x.order_number)

        wildcard_allowed_previous_stages = [
            TournamentStageTypes.SWISS,
            TournamentStageTypes.LEAGUE,
        ]
        wildcard_allowed_next_stages = [
            TournamentStageTypes.SWISS,
            TournamentStageTypes.LEAGUE,
            TournamentStageTypes.SINGLE_ELIMINATION,
            TournamentStageTypes.DOUBLE_ELIMINATION,
        ]

        for num, stage in enumerate(stages, start=1):
            if stage.order_number != num:
                raise ValueError("Stages ordering is incorrect")
            if num != len(stages) and stage.stage_type in [
                TournamentStageTypes.SINGLE_ELIMINATION,
                TournamentStageTypes.DOUBLE_ELIMINATION,
            ]:
                raise ValueError("Single or double elimination must be last stages in tournament")
            if stage.stage_type == TournamentStageTypes.WILDCARD:
                previous_stage = stages[num - 2] if num >= 2 else None
                next_stage = stages[num] if len(stages) > num else None
                if not (
                        previous_stage.stage_type in wildcard_allowed_previous_stages
                        and next_stage.stage_type in wildcard_allowed_next_stages
                ):
                    raise ValueError("Incorrect wildcard stage position")

        return stages


class TournamentUpdateSchema(TournamentBaseWriteSchema):
    """ Update schema for TournamentModel. """
    is_primary: Optional[bool] = None


class TournamentPartialUpdateSchema(BaseModel):
    """ Partial update schema for TournamentModel. """
    tournament_format: Optional[str] = None
    rules_info: Optional[str] = None
    regulation: Optional[str] = None
    contacts_info: Optional[str] = None

    cover_image_id: Optional[int] = None
    header_image_id: Optional[int] = None

    is_primary: Optional[bool] = None


class TournamentSetLifecycleStatusSchema(BaseModel):
    lifecycle_status: int


class TournamentShortReadSchema(BaseModel):
    """ Short read schema for TournamentModel. """
    id: int
    name: str
    creator: UserShortReadSchema

    model_config = ConfigDict(from_attributes=True)


class TournamentRegulationReadSchema(BaseModel):
    """ Read schema with regulation for TournamentModel. """
    id: int
    name: str
    regulation: str
    creator: UserShortReadSchema

    model_config = ConfigDict(from_attributes=True)


class TournamentTeamShortReadSchema(BaseModel):
    """ Personal read schema for TeamModel. """
    id: uuid.UUID
    name: str
    tournament: TournamentShortReadSchema
    creator: UserShortReadSchema | None
    image: Optional[UploadRead] | None

    model_config = ConfigDict(from_attributes=True)


class TournamentPersonalRegisteredUserReadSchema(BaseModel):
    """ Personal read schema for TournamentRegisteredUserModel. """
    id: int
    tournament: TournamentShortReadSchema
    account: AccountReadSchema
    status: RegistrationStatus

    team: Optional[TournamentTeamShortReadSchema] = None

    created_at: datetime.datetime
    updated_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class TournamentPersonalReadSchema(BaseModel):
    """ Personal read schema for personal info about TournamentModel. """
    participant: Optional[TournamentPersonalRegisteredUserReadSchema] = Field(default=None, validate_default=True)

    model_config = ConfigDict(from_attributes=True)

    @field_validator("participant", mode="before")
    def generate_participant(cls, value, info: FieldValidationInfo):
        participant = info.context.get("participant")
        return TournamentPersonalRegisteredUserReadSchema.model_validate(participant) if participant else None


class TournamentStatsByAccountReadSchema(BaseModel):
    """
    Cхема, которая включает краткую информацию о турнире
    (используем TournamentShortReadSchema)
    и поля статистики (как в таске).
    """
    tournament: TournamentShortReadSchema

    # Те же поля, что и в «общей» статистике, но уже не rating, а всё остальное
    rating: Optional[float] = None  # пока None
    matches_count: int
    wins: int
    draws: int
    losses: int
    goals_scored: int
    goals_conceded: int
    wins_percent: float
    avg_goals_scored: float
    avg_goals_conceded: float
    clean_sheets_percent: float
    biggest_win: Optional[str]
    biggest_loss: Optional[str]

    model_config = ConfigDict(from_attributes=True)
