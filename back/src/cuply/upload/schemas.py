import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict, field_validator


class UploadContentCategory(Enum):
    STATIC = "STATIC"
    PROFILE = "PROFILE"
    UNKNOWN = "UNKNOWN"
    AVATAR = "AVATAR"
    HEADER = "HEADER"

    @classmethod
    def has_value(cls, value):
        return value in cls._value2member_map_


class UploadRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    owner_id: int | None
    bucket: str
    object_key: str
    content_category: str
    is_removed: bool
    created_at: datetime.datetime
    updated_at: datetime.datetime


class UploadCreate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    owner_id: int
    bucket: str
    object_key: str
    content_category: str
    is_removed: Optional[bool] = False

    @field_validator("content_category", mode="before")
    def validate_content_category(cls, value):
        assert UploadContentCategory.has_value(value)
        return value


class UploadResultRs(BaseModel):
    id: int
    s3_key: str


class UploadObjectRq(BaseModel):
    object_key: str
