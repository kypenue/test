""" Repositories for tournament allowed platforms. """
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from backlib.repos import BaseSyncRepo, BaseAsyncRepo
from cuply.tournaments.models import TournamentAllowedPlatformModel, TournamentModel


class TournamentAllowedPlatformSyncRepo(BaseSyncRepo):
    """ Sync repository for TournamentAllowedPlatformModel. """
    model = TournamentAllowedPlatformModel


class TournamentAllowedPlatformAsyncRepo(BaseAsyncRepo):
    """ Async repository for TournamentAllowedPlatformModel. """
    model = TournamentAllowedPlatformModel

    def get_full_platform_query(self, *filters):
        return select(TournamentAllowedPlatformModel).filter(*filters).options(
            joinedload(TournamentAllowedPlatformModel.platform),
            joinedload(TournamentAllowedPlatformModel.tournament).options(
                joinedload(TournamentModel.creator),
            ),
        )

    async def get_full_platform(self, *filters):
        result = await self.session.execute(self.get_full_platform_query(*filters))
        return result.scalar_one_or_none()

    async def get_full_platforms(self, *filters):
        result = await self.session.execute(self.get_full_platform_query(*filters))
        return result.scalars().all()
