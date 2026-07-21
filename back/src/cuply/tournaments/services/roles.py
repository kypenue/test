import uuid

from backlib.pagination import AsyncPaginator
from cuply.auth.models import UserModel
from backlib.repo_helpers import raise_not_found_if_none
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.tournaments.exceptions.roles import UserCannotDeleteOwnTournamentRolesException
from cuply.tournaments.filters.roles import TournamentUserRoleFilter
from cuply.tournaments.models import TournamentUserRoleModel
from cuply.tournaments.schemas.roles import (
    TournamentUserRoleReadSchema,
    TournamentUserRoleCreateSchema,
)
from cuply.tournaments.services.permissions import TournamentPermissionService


class TournamentUserRoleService:
    """ Service for tournament user roles. """
    def __init__(self):
        self.permission_service = TournamentPermissionService()

    async def get_user_roles(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        filter_instance: TournamentUserRoleFilter,
        user: UserModel,
    ) -> dict:
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await self.permission_service.check_get_tournament_user_roles(uow, user, tournament=tournament)

        paginator = AsyncPaginator(
            session=uow.session,
            model_class=TournamentUserRoleModel,
            schema_class=TournamentUserRoleReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=[],
            filter_instance=filter_instance,
            query=uow.tournament_roles_repo.get_full_user_role_query(
                TournamentUserRoleModel.tournament_id == tournament_id,
            ),
        )
        return await paginator.get_result()

    async def get_user_role(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        user_role_id: uuid.UUID,
        user: UserModel,
    ) -> TournamentUserRoleReadSchema:
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await self.permission_service.check_get_tournament_user_roles(uow, user, tournament=tournament)

        user_role = await uow.tournament_roles_repo.get_full_user_role(
            TournamentUserRoleModel.id == user_role_id,
            TournamentUserRoleModel.tournament_id == tournament_id,
        )
        raise_not_found_if_none(user_role, user_role_id)

        return TournamentUserRoleReadSchema.model_validate(user_role)

    async def create_user_role(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        schema: TournamentUserRoleCreateSchema,
        user: UserModel,
    ) -> TournamentUserRoleReadSchema:
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await self.permission_service.check_set_tournament_user_roles(uow, user, tournament=tournament)

        data = schema.model_dump()
        data["tournament_id"] = tournament_id

        user_role = await uow.tournament_roles_repo.get_full_user_role(
            TournamentUserRoleModel.tournament_id == data["tournament_id"],
            TournamentUserRoleModel.user_id == data["user_id"],
            TournamentUserRoleModel.role_type == data["role_type"],
        )

        if not user_role:
            user_role_id = await uow.tournament_roles_repo.add_one(data)
            user_role = await uow.tournament_roles_repo.get_full_user_role(
                TournamentUserRoleModel.id == user_role_id,
            )

        await uow.commit()

        return TournamentUserRoleReadSchema.model_validate(user_role)

    async def delete_user_role(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        user_role_id: uuid.UUID,
        user: UserModel,
    ):
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await self.permission_service.check_delete_tournament_user_roles(uow, user, tournament=tournament)

        user_role = await uow.tournament_roles_repo.get_full_user_role(
            TournamentUserRoleModel.id == user_role_id,
            TournamentUserRoleModel.tournament_id == tournament_id,
        )
        raise_not_found_if_none(user_role, user_role_id)

        if user_role.user_id == user.id:
            raise UserCannotDeleteOwnTournamentRolesException('User cannot delete own role')

        await uow.tournament_roles_repo.delete_one(user_role.id)
        await uow.commit()
