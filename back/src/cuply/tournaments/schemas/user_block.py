""" Schemas for user block models. """
import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from cuply.auth.schemas import UserShortReadSchema


class UserBlockReadSchema(BaseModel):
    """ Read schema for UserBlockModel. """
    id: int
    creator: UserShortReadSchema
    user: UserShortReadSchema
    blocked_until: Optional[datetime.datetime]

    model_config = ConfigDict(from_attributes=True)


class UserBlockWriteSchema(BaseModel):
    """ Write schema for UserBlockModel. """
    blocked_until: Optional[datetime.datetime]
