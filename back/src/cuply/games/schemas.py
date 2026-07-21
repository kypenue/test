""" Schemas for games models """
import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, PositiveInt

from cuply.upload.schemas import UploadRead


class GameReadSchema(BaseModel):
    """ Read schema for GameModel. """
    id: int
    name: str
    created_at: datetime.datetime
    updated_at: datetime.datetime

    min_age: Optional[int]
    disclaimer: Optional[str]
    legal_info: Optional[str]

    image: Optional[UploadRead] = None
    cover_image: Optional[UploadRead] = None

    model_config = ConfigDict(from_attributes=True)


class GameShortReadSchema(BaseModel):
    """ Short read schema for GameModel. """
    id: int
    name: str

    image: Optional[UploadRead] = None

    model_config = ConfigDict(from_attributes=True)


class GameCreateSchema(BaseModel):
    """ Create schema for GameModel. """
    name: str
    min_age: Optional[PositiveInt] = None
    disclaimer: Optional[str] = None
    legal_info: Optional[str] = None
    image_id: Optional[int] = None
    cover_image_id: Optional[int] = None


class GameUpdateSchema(BaseModel):
    """ Update schema for GameModel. """
    name: str
    min_age: Optional[PositiveInt] = None
    disclaimer: Optional[str] = None
    legal_info: Optional[str] = None
    image_id: Optional[int] = None
    cover_image_id: Optional[int] = None
