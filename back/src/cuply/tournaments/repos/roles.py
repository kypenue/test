from sqlalchemy import select
from sqlalchemy.orm import joinedload

from backlib.repos import BaseAsyncRepo
from cuply.tournaments.models import TournamentUserRoleModel, TournamentModel


class TournamentUserRoleRepo(BaseAsyncRepo):
    model = TournamentUserRoleModel

    def get_full_user_role_query(self, *filters):
        return select(TournamentUserRoleModel).filter(*filters).options(
            joinedload(TournamentUserRoleModel.user),
            joinedload(TournamentUserRoleModel.tournament).options(
                joinedload(TournamentModel.creator),
            ),
        )

    async def get_full_user_role(self, *filters):
        result = await self.session.execute(self.get_full_user_role_query(*filters))
        return result.scalar_one_or_none()

    async def get_full_user_roles(self, *filters):
        result = await self.session.execute(self.get_full_user_role_query(*filters))
        return result.scalars().all()
