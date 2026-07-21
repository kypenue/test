import datetime
import uuid

from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic_core.core_schema import FieldValidationInfo

from cuply.auth.schemas import UserShortReadSchema
from cuply.games.schemas import GameShortReadSchema
from cuply.teams.models import TeamAccessTypes
from cuply.tournaments.schemas.tournaments import TournamentShortReadSchema
from cuply.upload.schemas import UploadRead


class TeamShortReadSchema(BaseModel):
    id: uuid.UUID
    name: str
    access_type: TeamAccessTypes
    image: UploadRead | None
    game: GameShortReadSchema

    model_config = ConfigDict(from_attributes=True)


class TeamReadSchema(TeamShortReadSchema):
    creator: UserShortReadSchema | None

    tournament: TournamentShortReadSchema | None

    source_team: TeamShortReadSchema | None

    created_at: datetime.datetime
    updated_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class TournamentTeamReadSchema(TeamReadSchema):
    taken_places: int = Field(default=None, validate_default=True)
    available_places: int | None = Field(default=None, validate_default=True)

    model_config = ConfigDict(from_attributes=True)

    @field_validator("taken_places", mode="before")
    def generate_taken_places(cls, value, info: FieldValidationInfo):
        return info.context.get("taken_places") if info.context else None

    @field_validator("available_places", mode="before")
    def generate_available_places(cls, value, info: FieldValidationInfo):
        return info.context.get("available_places") if info.context else None


class UserTeamCreateSchema(BaseModel):
    name: str
    access_type: TeamAccessTypes
    image_id: int | None
    game_id: int


class TournamentTeamCreateSchema(BaseModel):
    name: str
    image_id: int | None


class TeamUpdateSchema(BaseModel):
    name: str
    image_id: int | None


class CopyToTournamentWriteSchema(BaseModel):
    team_id: uuid.UUID
    access_type: TeamAccessTypes
