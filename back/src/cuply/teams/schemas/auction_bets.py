import uuid

from pydantic import BaseModel, ConfigDict

from cuply.teams.schemas.teams import TeamReadSchema, TeamShortReadSchema
from cuply.tournaments.schemas.registration import TournamentRegisteredUserReadSchema


class AuctionBetReadSchema(BaseModel):
    id: uuid.UUID

    bet: int
    team: TeamReadSchema
    participant: TournamentRegisteredUserReadSchema

    model_config = ConfigDict(from_attributes=True)


class AuctionBetShortReadSchema(BaseModel):
    id: uuid.UUID

    bet: int
    participant: TournamentRegisteredUserReadSchema

    model_config = ConfigDict(from_attributes=True)


class TeamWithMaxBetReadSchema(BaseModel):
    team: TeamShortReadSchema
    max_bet: AuctionBetShortReadSchema | None
    seconds_left: float | None

    model_config = ConfigDict(from_attributes=True)


class AuctionReadSchema(BaseModel):
    bet_step: int | None
    min_bet: int | None
    max_bet: int | None
    bet_duration_seconds: int | None
    bet_extension_seconds: int | None
    is_started: bool | None

    lots: list[TeamWithMaxBetReadSchema]

    model_config = ConfigDict(from_attributes=True)


class AuctionBetWriteSchema(BaseModel):
    bet: int
    team_id: uuid.UUID
