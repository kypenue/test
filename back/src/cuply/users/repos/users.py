from sqlalchemy import select
from sqlalchemy.orm import selectinload

from backlib.repos import BaseSyncRepo, BaseAsyncRepo
from cuply.auth.models import UserModel


class UserSyncRepo(BaseSyncRepo):
    model = UserModel


class UserAsyncRepo(BaseAsyncRepo):
    model = UserModel

    def get_full_user_query(self, *filters, sn_exp=None, ns_exp=None):
        add_entities = []
        if sn_exp is not None:
            add_entities.append(sn_exp.label('sn'))
        if ns_exp is not None:
            add_entities.append(ns_exp.label('ns'))
        return select(
            UserModel,
            *add_entities,
        ).filter(*filters).options(
            selectinload(UserModel.system_roles),
        )

    async def get_full_user(self, *filters):
        result = await self.session.execute(self.get_full_user_query(*filters))
        return result.scalar_one_or_none()

    async def get_full_users(self, *filters):
        result = await self.session.execute(self.get_full_user_query(*filters))
        return result.scalars().all()
