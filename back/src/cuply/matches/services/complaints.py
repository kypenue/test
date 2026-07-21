from uuid import UUID

from fastapi import HTTPException
from starlette import status

from backlib.pagination import AsyncPaginator
from backlib.repo_helpers import raise_not_found_if_none
from constants import MATCH_COMPLAINT_PROHIBITED_MSG
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.matches.models import (
    MatchModel,
    MatchComplaintStatus,
    MatchComplaintCreation,
    MatchComplaintModel,
)
from cuply.matches.schemas.complaints import (
    MatchComplaintReadSchema,
    MatchComplaintUpdateSchema,
    MatchComplaintCreateSchemaDto,
    MatchComplaintCreateSchema,
)
from cuply.series.models import SeriesModel
from cuply.matches.filters.complaints import MathComplaintModelFilter
from cuply.tournaments.services.permissions import TournamentPermissionService


class MatchComplaintService:
    def __init__(self):
        self.permission_service = TournamentPermissionService()

    def _is_match_participant(self, match: MatchModel, user: UserModel):
        return (
            match.home_player_account.user_id == user.id
            or match.guest_player_account.user_id == user.id
        )

    def _is_series_participant(self, series: SeriesModel, user: UserModel):
        return (series.gamer1 and series.gamer1.user_id == user.id or series.gamer2 and series.gamer2.user_id == user.id)

    async def create_complaint(
        self,
        tournament_id: int,
        series_id: UUID,
        match_id: UUID,
        schema: MatchComplaintCreateSchemaDto,
        uow: AsyncUnitOfWork,
        user: UserModel,
    ) -> MatchComplaintReadSchema:
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        match: MatchModel = await uow.match_repo.get_full_match(MatchModel.id == match_id)
        raise_not_found_if_none(match, match_id)

        if not self._is_match_participant(match, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=MATCH_COMPLAINT_PROHIBITED_MSG
            )

        data = MatchComplaintCreateSchema(
            author_id=user.id,
            comment=schema.comment,
            status=MatchComplaintStatus.OPEN,
            creation_way=MatchComplaintCreation.PLAYER_MANUAL,
            match_id=match_id,
            series_id=series_id,
            tournament_id=tournament_id,
        )
        data = data.model_dump(exclude_unset=True)
        complaint_id = await uow.match_complaint_repo.add_one(data)
        await uow.commit()

        complaint = await uow.match_complaint_repo.find_one(id=complaint_id)
        author = await uow.user_repo.find_one(id=complaint.author_id)

        is_moderator = await self.permission_service.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            raise_exc=False,
        )

        return MatchComplaintReadSchema.model_validate(
            complaint,
            context={
                "author_user": author,
                "current_user": user,
                "match": match,
                "can_moderate_tournament": is_moderator,
            }
        )

    async def get_match_complaints_paginated(
        self,
        tournament_id: int,
        series_id: UUID,
        match_id: UUID,
        uow: AsyncUnitOfWork,
        filter_instance: MathComplaintModelFilter,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        user: UserModel,
    ):
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        match = await uow.match_repo.get_full_match(MatchModel.id == match_id)
        raise_not_found_if_none(match, match_id)

        if not self._is_match_participant(match, user):
            await self.permission_service.check_get_complaint(uow, user, tournament=tournament)

        is_moderator = await self.permission_service.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            raise_exc=False,
        )

        async def get_match_complaints(item: MatchComplaintModel, context_data):
            author = await uow.user_repo.find_one(id=item.author_id)

            return {
                "author_user": author,
                "current_user": context_data["current_user"],
                "match": context_data["match"],
                "can_moderate_tournament": is_moderator,
            }

        paginator = AsyncPaginator(
            session=uow.session,
            model_class=MatchComplaintModel,
            schema_class=MatchComplaintReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=[],
            filter_instance=filter_instance,
            query=uow.match_complaint_repo.get_filter_by_query(match_id=match_id),
            context_function=get_match_complaints,
            context_data={"match": match, "current_user": user},
        )
        return await paginator.get_result()

    async def update_complaint(
        self,
        tournament_id: int,
        series_id: UUID,
        match_id: UUID,
        complaint_id: UUID,
        schema: MatchComplaintUpdateSchema,
        uow: AsyncUnitOfWork,
        user: UserModel,
    ) -> MatchComplaintReadSchema:
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await self.permission_service.check_update_complaint(uow, user, tournament=tournament)

        match: MatchModel = await uow.match_repo.get_full_match(MatchModel.id == match_id)
        raise_not_found_if_none(match, match_id)

        data = schema.model_dump(exclude_unset=True)
        complaint_id = await uow.match_complaint_repo.edit_one(complaint_id, data)
        await uow.commit()

        complaint = await uow.match_complaint_repo.find_one(id=complaint_id)
        author = await uow.user_repo.find_one(id=complaint.author_id)

        is_moderator = await self.permission_service.check_can_manage_tournament(
            uow, user,
            tournament_id=tournament_id,
            raise_exc=False,
        )

        return MatchComplaintReadSchema.model_validate(
            complaint,
            context={
                "author_user": author,
                "current_user": user,
                "match": match,
                "can_moderate_tournament": is_moderator,
            }
        )

    async def get_series_complaints_paginated(
        self,
        tournament_id: int,
        series_id: UUID,
        uow: AsyncUnitOfWork,
        filter_instance: MathComplaintModelFilter,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        user: UserModel,
    ):
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        series = await uow.series.get_full_series(SeriesModel.id == series_id)
        raise_not_found_if_none(series, series_id)

        if not self._is_series_participant(series, user):
            await self.permission_service.check_get_complaint(uow, user, tournament=tournament)

        is_moderator = await self.permission_service.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            raise_exc=False,
        )

        async def get_match_complaints(item: MatchComplaintModel, context_data):
            author = await uow.user_repo.find_one(
                id=item.author_id,
            )
            match = await uow.match_repo.get_full_match(
                MatchModel.id == item.match_id
            )

            return {
                "author_user": author,
                "current_user": context_data["current_user"],
                "match": match,
                "can_moderate_tournament": is_moderator,
            }

        paginator = AsyncPaginator(
            session=uow.session,
            model_class=MatchComplaintModel,
            schema_class=MatchComplaintReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=[],
            filter_instance=filter_instance,
            query=uow.match_complaint_repo.get_filter_by_query(series_id=series_id),
            context_function=get_match_complaints,
            context_data={"current_user": user},
        )
        return await paginator.get_result()

    async def get_tournament_complaints_paginated(
        self,
        tournament_id: int,
        uow: AsyncUnitOfWork,
        filter_instance: MathComplaintModelFilter,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        user: UserModel,
    ):
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await self.permission_service.check_get_complaint(uow, user, tournament=tournament)

        is_moderator = await self.permission_service.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            raise_exc=False,
        )

        async def get_match_complaints(item: MatchComplaintModel, context_data):
            author = await uow.user_repo.find_one(
                id=item.author_id,
            )
            match = await uow.match_repo.get_full_match(MatchModel.id == item.match_id)

            return {
                "author_user": author,
                "current_user": context_data["current_user"],
                "match": match,
                "can_moderate_tournament": is_moderator,
            }

        paginator = AsyncPaginator(
            session=uow.session,
            model_class=MatchComplaintModel,
            schema_class=MatchComplaintReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=[],
            filter_instance=filter_instance,
            query=uow.match_complaint_repo.get_filter_by_query(tournament_id=tournament_id),
            context_function=get_match_complaints,
            context_data={"current_user": user},
        )
        return await paginator.get_result()
