""" Schemas for tournament allowed platform models. """
from pydantic import BaseModel, ConfigDict

from cuply.tournaments.schemas.tournaments import TournamentShortReadSchema
from cuply.platforms.schemas import PlatformShortReadSchema


class TournamentAllowedPlatformReadSchema(BaseModel):
    """ Read schema for TournamentAllowedPlatformModel. """
    id: int
    tournament: TournamentShortReadSchema
    platform: PlatformShortReadSchema

    model_config = ConfigDict(from_attributes=True)


class TournamentAllowedPlatformWriteSchema(BaseModel):
    """ Write schema for TournamentAllowedPlatformModel. """
    platform_id: int
