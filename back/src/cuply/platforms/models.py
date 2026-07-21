""" Models for platforms management."""
from sqlalchemy import Column, Text, Integer
from sqlalchemy.orm import relationship

from backlib.databases import BaseOrmModel


class PlatformModel(BaseOrmModel):
    """ Model representing platform. """
    __tablename__ = "platforms"

    id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False, doc="Name")

    tournaments = relationship(
        "TournamentModel",
        secondary="tournament_allowed_platforms",
        back_populates="platforms",
    )
