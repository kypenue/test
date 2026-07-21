""" Schemas for platforms models """
import datetime

from pydantic import BaseModel, ConfigDict


class PlatformReadSchema(BaseModel):
    """ Read schema for PlatformModel. """
    id: int
    name: str
    created_at: datetime.datetime
    updated_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class PlatformShortReadSchema(BaseModel):
    """ Short read schema for PlatformModel. """
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class PlatformCreateSchema(BaseModel):
    """ Create schema for PlatformModel. """
    name: str


class PlatformUpdateSchema(BaseModel):
    """ Update schema for PlatformModel. """
    name: str
