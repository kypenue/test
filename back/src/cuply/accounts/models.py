""" Models for game account management. """
from sqlalchemy import Column, Integer, Text, ForeignKey, Float, text
from sqlalchemy.orm import relationship

from backlib.databases import BaseOrmModel


class AccountModel(BaseOrmModel):
    """ Model representing user game account."""
    __tablename__ = "gamers"

    id = Column(Integer, primary_key=True)
    game_id = Column(Integer, ForeignKey("games.id"), nullable=False, doc="Game ID")
    platform_id = Column(Integer, ForeignKey("platforms.id"), nullable=False, doc="Platform ID")
    login = Column(Text, nullable=False, doc="Login")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True, doc="User ID")

    game = relationship("GameModel", backref="accounts")
    platform = relationship("PlatformModel", backref="accounts")
    user = relationship("UserModel", backref="accounts")

    rating = Column(Float, nullable=False, default=950.0, server_default=text("950.0"), doc="ELO Rating")
