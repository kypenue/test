""" Services for tournament allowed platforms management. """
from backlib.pagination import AsyncPaginator
from cuply.auth.models import UserModel
from backlib.repo_helpers import raise_not_found_if_none
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.tournaments.models import TournamentAllowedPlatformModel
from cuply.tournaments.schemas.platforms import (
    TournamentAllowedPlatformReadSchema,
    TournamentAllowedPlatformWriteSchema,
)
from cuply.tournaments.services.permissions import TournamentPermissionService


class TournamentAllowedPlatformService:
    """ Service for tournament allowed platforms management. """
    def __init__(self):
        self.permission_service = TournamentPermissionService()

    async def get_platforms(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        user: UserModel,
    ) -> dict:
        """ Get allowed platforms to tournament. """
        paginator = AsyncPaginator(
            session=uow.session,
            model_class=TournamentAllowedPlatformModel,
            schema_class=TournamentAllowedPlatformReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=[],
            query=uow.tournament_platforms.get_full_platform_query(
                TournamentAllowedPlatformModel.tournament_id == tournament_id,
            ),
        )
        return await paginator.get_result()

    async def get_platform(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        allowed_platform_id: int,
        user: UserModel,
    ) -> TournamentAllowedPlatformReadSchema:
        """ Get allowed platforms to tournament. """
        allowed_platform = await uow.tournament_repo.get_full_tournament(
            TournamentAllowedPlatformModel.id == allowed_platform_id,
            TournamentAllowedPlatformModel.tournament_id == tournament_id,
        )
        raise_not_found_if_none(allowed_platform, allowed_platform_id)
        return TournamentAllowedPlatformReadSchema.model_validate(allowed_platform)

    async def add_platform(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        schema: TournamentAllowedPlatformWriteSchema,
        user: UserModel,
    ) -> TournamentAllowedPlatformReadSchema:
        """ Add allowed platform to tournament. """
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await self.permission_service.check_add_allowed_platform_in_tournament(uow, user, tournament=tournament)

        data = schema.model_dump()

        platform_id = data["platform_id"]
        platform = await uow.platform_repo.find_one(id=platform_id)
        raise_not_found_if_none(platform, platform_id)

        data["tournament_id"] = tournament_id

        allowed_platform = await uow.tournament_platforms.find_one(**data)
        if allowed_platform is not None:
            return TournamentAllowedPlatformReadSchema.model_validate(allowed_platform)

        allowed_platform_id = await uow.tournament_platforms.add_one(data)
        allowed_platform = await uow.tournament_platforms.find_one(id=allowed_platform_id)

        await uow.commit()

        return TournamentAllowedPlatformReadSchema.model_validate(allowed_platform)

    async def remove_platform(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        schema: TournamentAllowedPlatformWriteSchema,
        user: UserModel,
    ):
        """ Delete allowed platform from tournament. """
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await self.permission_service.check_remove_allowed_platform_from_tournament(uow, user, tournament=tournament)

        data = schema.model_dump()

        platform_id = data["platform_id"]
        platform = await uow.platform_repo.find_one(id=platform_id)
        raise_not_found_if_none(platform, platform_id)

        data["tournament_id"] = tournament_id

        allowed_platform = await uow.tournament_platforms.find_one(**data)
        if allowed_platform is None:
            return

        await uow.tournament_platforms.delete_one(allowed_platform.id)
        await uow.commit()
