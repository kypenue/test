from sqlalchemy import select
from sqlalchemy.orm import joinedload

from backlib.repos import BaseAsyncRepo
from cuply.users.models import SystemUserRoleModel


class SystemUserRoleAsyncRepo(BaseAsyncRepo):
    model = SystemUserRoleModel

    def get_full_user_role_query(self, *filters):
        return select(SystemUserRoleModel).filter(*filters).options(
            joinedload(SystemUserRoleModel.user),
        )

    async def get_full_user_role(self, *filters):
        result = await self.session.execute(self.get_full_user_role_query(*filters))
        return result.scalar_one_or_none()

    async def get_full_user_roles(self, *filters):
        result = await self.session.execute(self.get_full_user_role_query(*filters))
        return result.scalars().all()
