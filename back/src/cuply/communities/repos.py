from sqlalchemy import select
from sqlalchemy.orm import selectinload, joinedload

from backlib.repos import BaseAsyncRepo
from cuply.communities.models import CommunityModel, CommunityGameModel, CommunityUserRoleModel
from cuply.games.models import GameModel


class CommunityAsyncRepo(BaseAsyncRepo):
    model = CommunityModel

    def get_full_query(self, *filters):
        return (
            select(CommunityModel)
            .filter(*filters)
            .options(
                selectinload(CommunityModel.community_games).joinedload(CommunityGameModel.game).options(
                    joinedload(GameModel.image)
                ),
                selectinload(CommunityModel.games).options(
                    joinedload(GameModel.image)
                ),
                joinedload(CommunityModel.creator),
                joinedload(CommunityModel.avatar),
                joinedload(CommunityModel.header),
                selectinload(CommunityModel.roles),
            )
        )

    async def get_full_community(self, *filters) -> CommunityModel | None:
        stmt = self.get_full_query(*filters)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_full_communities(self, *filters):
        """
        Вернуть список CommunityModel.
        """
        stmt = self.get_full_query(*filters)
        result = await self.session.execute(stmt)
        return result.scalars().all()


class CommunityGameAsyncRepo(BaseAsyncRepo):
    model = CommunityGameModel


# Аналогично для SyncRepo, если нужно
class CommunitySyncRepo(BaseAsyncRepo):
    model = CommunityModel


class CommunityGameSyncRepo(BaseAsyncRepo):
    model = CommunityGameModel


class CommunityUserRoleRepo(BaseAsyncRepo):
    model = CommunityUserRoleModel

    def get_full_user_role_query(self, *filters):
        return select(CommunityUserRoleModel).filter(*filters).options(
            joinedload(CommunityUserRoleModel.user),
            joinedload(CommunityUserRoleModel.community).options(
                joinedload(CommunityModel.creator),
                selectinload(CommunityModel.games).options(
                    joinedload(GameModel.image)
                )
            ),
        )

    async def get_full_user_role(self, *filters):
        result = await self.session.execute(self.get_full_user_role_query(*filters))
        return result.scalar_one_or_none()

    async def get_full_user_roles(self, *filters):
        result = await self.session.execute(self.get_full_user_role_query(*filters))
        return result.scalars().all()
