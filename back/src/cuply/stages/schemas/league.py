from uuid import UUID

from pydantic import BaseModel, ConfigDict


class LeagueStageReadSchema(BaseModel):
    """ League stage read schema. """
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class LeagueStageCreateSchema(BaseModel):
    """ League stage create schema. """
    ...
