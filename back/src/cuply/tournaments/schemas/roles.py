import uuid

from pydantic import BaseModel, ConfigDict

from cuply.auth.schemas import UserReadSchema
from cuply.tournaments.models import TournamentRoleTypes
from cuply.tournaments.schemas.tournaments import TournamentShortReadSchema


class TournamentUserRoleReadSchema(BaseModel):
    id: uuid.UUID

    user: UserReadSchema
    tournament: TournamentShortReadSchema

    role_type: TournamentRoleTypes

    model_config = ConfigDict(from_attributes=True)


class TournamentUserRoleCreateSchema(BaseModel):
    user_id: int

    role_type: TournamentRoleTypes
