""" Schemas for tournament registration models. """
import datetime
import uuid
from typing import Optional

from pydantic import BaseModel, ConfigDict

from cuply.games.schemas import GameShortReadSchema
from cuply.models import RegistrationStatus
from cuply.accounts.schemas import AccountReadSchema
from cuply.teams.models import TeamAccessTypes
from cuply.upload.schemas import UploadRead


class TeamShortReadSchema(BaseModel):
    id: uuid.UUID
    name: str
    access_type: TeamAccessTypes
    image: UploadRead | None
    game: GameShortReadSchema

    model_config = ConfigDict(from_attributes=True)


class TournamentRegisteredUserReadSchema(BaseModel):
    """ Read schema for TournamentRegisteredUserModel. """
    id: int
    tournament_id: int
    account: AccountReadSchema
    status: RegistrationStatus

    team: Optional[TeamShortReadSchema] = None

    created_at: datetime.datetime
    updated_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class TournamentRegisteredUserWriteSchema(BaseModel):
    """ Create schema for TournamentRegisteredUserModel. """
    account_id: int


class TournamentSetRegistrationStatusSchema(BaseModel):
    """ Schema for setting registration status for TournamentRegisteredUserModel. """
    status: int
