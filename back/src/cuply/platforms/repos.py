""" Repositories for patforms models. """
from backlib.repos import BaseSyncRepo, BaseAsyncRepo
from cuply.platforms.models import PlatformModel


class PlatformSyncRepo(BaseSyncRepo):
    """ Sync repository for PlatformModel. """
    model = PlatformModel


class PlatformAsyncRepo(BaseAsyncRepo):
    """ Async repository for PlatformModel. """
    model = PlatformModel

