import uuid

from sqlalchemy import Column, Text, UUID

from backlib.databases import BaseOrmModel


class FeedbackModel(BaseOrmModel):
    """ Model representing game. """
    __tablename__ = "feedbacks"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    name = Column(
        Text,
        nullable=False,
        doc="Name",
    )
    email = Column(
        Text,
        nullable=False,
        doc="Email",
    )
    tg_login = Column(
        Text,
        nullable=True,
        doc="Telegram Login",
    )
    message = Column(
        Text,
        nullable=True,
        doc="Message",
    )
