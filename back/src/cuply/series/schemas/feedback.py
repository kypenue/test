import datetime as dt
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, PositiveInt


class SeriesFeedbackReadSchema(BaseModel):
    id: UUID

    comment: Optional[str] = None
    opponent_mark: int

    created_at: dt.datetime
    updated_at: dt.datetime

    model_config = ConfigDict(from_attributes=True)


class SeriesFeedbackWithAuthorReadSchema(SeriesFeedbackReadSchema):
    author_id: int

    model_config = ConfigDict(from_attributes=True)


class SeriesFeedbackCreateSchema(BaseModel):
    comment: Optional[str] = None
    opponent_mark: PositiveInt


class SeriesFeedbackFullCreateSchema(BaseModel):
    series_id: UUID

    author_id: int
    opponent_id: int

    comment: Optional[str] = None
    opponent_mark: PositiveInt
