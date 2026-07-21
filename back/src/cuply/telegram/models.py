""" Models for Telegram verification. """
from sqlalchemy import (
    Column,
    Text,
    Integer,
    ForeignKey,
    DateTime,
    Boolean,
)
from sqlalchemy.orm import relationship

from backlib.databases import BaseOrmModel


class TelegramTokenVerifierModel(BaseOrmModel):
    """ Model for Telegram token verifier. """
    __tablename__ = "telegram_token_verifier"

    id = Column(
        Integer,
        primary_key=True,
    )

    token = Column(
        Text,
        nullable=True,
        unique=True,
        doc="Token",
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        doc="User ID",
    )
    user = relationship(
        "UserModel",
        backref="verifiers",
    )

    tg_login = Column(
        Text,
        nullable=True,
        doc="Telegram login",
    )

    expires_at = Column(
        DateTime(timezone=True),
        nullable=True,
        doc="Expiration time",
    )
    is_used = Column(
        Boolean,
        nullable=False,
        default=False,
        doc="Is token used?",
    )
