import datetime
import uuid
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator, Field
from pydantic_core.core_schema import FieldValidationInfo

from cuply.accounts.schemas import AccountReadSchema
from cuply.games.schemas import GameShortReadSchema
from cuply.matches.models import MatchStatus
from cuply.matches.schemas.results import MatchResultReadSchema
from cuply.series.models import SeriesStatus
from cuply.teams.models import TeamAccessTypes
from cuply.tournaments.schemas.registration import TournamentRegisteredUserReadSchema
from cuply.upload.schemas import UploadRead


class MatchFullReadSchema(BaseModel):
    id: UUID

    match_number: Optional[int]
    status: MatchStatus

    home_player_id: int
    guest_player_id: int

    result: Optional[MatchResultReadSchema]

    model_config = ConfigDict(from_attributes=True)


class TeamShortReadSchema(BaseModel):
    id: uuid.UUID
    name: str
    access_type: TeamAccessTypes
    image: UploadRead | None
    game: GameShortReadSchema

    model_config = ConfigDict(from_attributes=True)


class AccountWithTeamReadSchema(AccountReadSchema):
    """ Read schema for AccountModel. """
    team: Optional[TeamShortReadSchema] = Field(default=None, validate_default=True)

    @field_validator("team", mode="before")
    def generate_system_roles(cls, value, info: FieldValidationInfo):
        team = None
        if info.context:
            participant_data = info.context.get("participant_data")
            if participant_data:
                participant = participant_data.get(info.data['id'])
                if participant:
                    team = participant.team
        return TeamShortReadSchema.model_validate(team) if team else None


class SeriesReadSchema(BaseModel):
    id: UUID

    status: SeriesStatus

    gamer1_score: Optional[int]
    gamer2_score: Optional[int]

    gamer1: Optional[AccountWithTeamReadSchema]
    gamer2: Optional[AccountWithTeamReadSchema]

    participant1: Optional[TournamentRegisteredUserReadSchema]
    participant2: Optional[TournamentRegisteredUserReadSchema]

    tournament_id: Optional[int]

    matches: List[MatchFullReadSchema]
    created_at: datetime.datetime
    updated_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
