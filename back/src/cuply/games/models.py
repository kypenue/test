""" Models for games management."""
from sqlalchemy import Column, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship

from backlib.databases import BaseOrmModel


class GameModel(BaseOrmModel):
    """ Model representing game. """
    __tablename__ = "games"

    id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False, doc="Name")
    community_games = relationship(
        argument="CommunityGameModel",
        back_populates="game"
    )

    image_id = Column(Integer, ForeignKey("uploads.id"), nullable=True, doc="Image")
    image = relationship(
        "UploadModel",
        foreign_keys="GameModel.image_id",
        uselist=False
    )

    min_age = Column(
        Integer,
        nullable=True,
        doc="Min Age",
    )
    disclaimer = Column(
        Text,
        nullable=True,
        doc="Disclaimer",
    )
    legal_info = Column(
        Text,
        nullable=True,
        doc="Legal Info",
    )

    cover_image_id = Column(
        Integer,
        ForeignKey("uploads.id"),
        nullable=True,
        doc="Cover Image ID",
    )
    cover_image = relationship(
        "UploadModel",
        foreign_keys="GameModel.cover_image_id",
        uselist=False,
    )
