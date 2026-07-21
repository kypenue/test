""" Repositories for games models. """
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from backlib.repos import BaseSyncRepo, BaseAsyncRepo
from cuply.games.models import GameModel


class GameSyncRepo(BaseSyncRepo):
    """ Sync repository for GameModel. """
    model = GameModel


class GameAsyncRepo(BaseAsyncRepo):
    """ Async repository for GameModel. """
    model = GameModel

    def get_filter_by_query(self, **filters):
        return select(GameModel).options(
            joinedload(GameModel.image)
        ).filter_by(**filters)
