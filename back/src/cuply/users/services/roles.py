import uuid

from backlib.pagination import AsyncPaginator
from cuply.auth.models import UserModel
from backlib.repo_helpers import raise_not_found_if_none
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.users.exceptions.roles import UserCannotDeleteOwnSystemRolesException
from cuply.users.filters.roles import SystemUserRoleFilter
from cuply.tournaments.services.permissions import TournamentPermissionService
from cuply.users.models import SystemUserRoleModel
from cuply.users.schemas.roles import (
    SystemUserRoleReadSchema,
    SystemUserRoleCreateSchema,
)


class SystemUserRoleService:
    """ Service for system user roles. """
    def __init__(self):
        self.permission_service = TournamentPermissionService()

    async def get_user_roles(
        self,
        uow: AsyncUnitOfWork,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        filter_instance: SystemUserRoleFilter,
        user: UserModel,
    ) -> dict:
        await self.permission_service.check_get_system_user_roles(uow, user)

        paginator = AsyncPaginator(
            session=uow.session,
            model_class=SystemUserRoleModel,
            schema_class=SystemUserRoleReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=[],
            filter_instance=filter_instance,
            query=uow.system_role_repo.get_full_user_role_query(),
        )
        return await paginator.get_result()

    async def get_user_role(
        self,
        uow: AsyncUnitOfWork,
        user_role_id: uuid.UUID,
        user: UserModel,
    ) -> SystemUserRoleReadSchema:
        await self.permission_service.check_get_system_user_roles(uow, user)

        user_role = await uow.system_role_repo.get_full_user_role(
            SystemUserRoleModel.id == user_role_id,
        )
        raise_not_found_if_none(user_role, user_role_id)

        return SystemUserRoleReadSchema.model_validate(user_role)

    async def create_user_role(
        self,
        uow: AsyncUnitOfWork,
        schema: SystemUserRoleCreateSchema,
        user: UserModel,
    ) -> SystemUserRoleReadSchema:
        await self.permission_service.check_set_system_user_roles(uow, user)

        data = schema.model_dump()

        user_role = await uow.system_role_repo.get_full_user_role(
            SystemUserRoleModel.user_id == data["user_id"],
            SystemUserRoleModel.role_type == data["role_type"],
        )

        if not user_role:
            user_role_id = await uow.system_role_repo.add_one(data)
            user_role = await uow.system_role_repo.get_full_user_role(
                SystemUserRoleModel.id == user_role_id,
            )

        await uow.commit()

        return SystemUserRoleReadSchema.model_validate(user_role)

    async def delete_user_role(
        self,
        uow: AsyncUnitOfWork,
        user_role_id: uuid.UUID,
        user: UserModel,
    ):
        await self.permission_service.check_delete_system_user_roles(uow, user)

        user_role = await uow.system_role_repo.get_full_user_role(
            SystemUserRoleModel.id == user_role_id,
        )
        raise_not_found_if_none(user_role, user_role_id)

        if user_role.user_id == user.id:
            raise UserCannotDeleteOwnSystemRolesException('User cannot delete own role')

        await uow.system_role_repo.delete_one(user_role.id)
        await uow.commit()
