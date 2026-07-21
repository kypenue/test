""" Filter games models. """
from fastapi_filter.contrib.sqlalchemy import Filter

from cuply.games.models import GameModel


class GameFilter(Filter):
    """ Filter for GameModel. """

    class Constants(Filter.Constants):
        model = GameModel

    class Config:
        populate_by_name = True
