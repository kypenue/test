from typing import Optional

from pydantic import BaseModel, EmailStr


class FeedbackCreateSchema(BaseModel):
    name: str
    email: EmailStr
    tg_login: Optional[str]
    message: Optional[str]
