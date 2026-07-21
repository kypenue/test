from typing import Optional
from uuid import UUID

from pydantic import BaseModel, NonNegativeInt, ConfigDict


class MatchResultReadSchema(BaseModel):
    id: UUID

    home_score: NonNegativeInt
    guest_score: NonNegativeInt
    video_link: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class MatchResultCreateOrUpdateSchemaDto(BaseModel):
    home_score: NonNegativeInt
    guest_score: NonNegativeInt
    video_link: Optional[str] = None


class MatchResultCreateSchema(BaseModel):
    match_id: UUID
    player_id: int
    home_score: NonNegativeInt
    guest_score: NonNegativeInt
    video_link: Optional[str] = None
