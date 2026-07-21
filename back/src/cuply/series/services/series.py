from typing import List

from backlib.pagination import AsyncPaginator
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.series.filters.series import SeriesModelFilter
from cuply.series.models import SeriesModel, SeriesStatus
from cuply.series.schemas.series import SeriesReadSchema


class SeriesService:
    async def get_my_series_in_tournament_paginated(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        user: UserModel,
    ) -> List[SeriesReadSchema]:
        query = uow.series.get_all_full_series_for_user_query(user.id, SeriesModel.tournament_id == tournament_id)
        paginator = AsyncPaginator(
            session=uow.session,
            model_class=SeriesModel,
            schema_class=SeriesReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            query=query,
        )
        return await paginator.get_result()

    async def get_playing_series_for_user(
            self,
            uow: AsyncUnitOfWork,
            user_id: int,
    ) -> List[SeriesModel]:
        """Возвращает все серии пользователя со статусом PLAYING."""
        return await uow.series.get_playing_series_for_user(user_id)

    async def get_user_series_in_tournament_paginated(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        user_id: int,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        user: UserModel,
    ) -> List[SeriesReadSchema]:
        query = uow.series.get_all_full_series_for_user_query(user_id, SeriesModel.tournament_id == tournament_id)
        paginator = AsyncPaginator(
            session=uow.session,
            model_class=SeriesModel,
            schema_class=SeriesReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            query=query,
        )
        return await paginator.get_result()

    async def get_my_series_paginated(
        self,
        uow: AsyncUnitOfWork,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        user: UserModel,
    ) -> List[SeriesReadSchema]:
        query = uow.series.get_all_full_series_for_user_query(user.id)
        paginator = AsyncPaginator(
            session=uow.session,
            model_class=SeriesModel,
            schema_class=SeriesReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            query=query,
        )
        return await paginator.get_result()

    async def get_all_series_paginated(
        self,
        uow: AsyncUnitOfWork,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        user: UserModel,
        filter_instance: SeriesModelFilter,
    ) -> List[SeriesReadSchema]:
        query = uow.series.get_all_full_series_query()
        paginator = AsyncPaginator(
            session=uow.session,
            model_class=SeriesModel,
            schema_class=SeriesReadSchema,
            filter_instance=filter_instance,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            query=query,
        )
        return await paginator.get_result()

    async def get_user_series_paginated(
        self,
        uow: AsyncUnitOfWork,
        user_id: int,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        user: UserModel,
    ) -> List[SeriesReadSchema]:
        query = uow.series.get_all_full_series_for_user_query(user_id)
        paginator = AsyncPaginator(
            session=uow.session,
            model_class=SeriesModel,
            schema_class=SeriesReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            query=query,
        )
        return await paginator.get_result()

    async def get_series_by_two_users_paginated(
        self,
        uow: AsyncUnitOfWork,
        user1_id: int,
        user2_id: int,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        user: UserModel,
    ) -> List[SeriesReadSchema]:
        query = uow.series.get_all_full_series_for_users_query(
            user1_id, user2_id,
            SeriesModel.status == SeriesStatus.PLAYED,
        )
        paginator = AsyncPaginator(
            session=uow.session,
            model_class=SeriesModel,
            schema_class=SeriesReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            query=query,
        )
        return await paginator.get_result()

    async def get_series_in_tournament_paginated(
            self,
            uow: AsyncUnitOfWork,
            tournament_id : int,
            page: int,
            per_page: int,
            order_by: list[str] | None,
            search: str,
    ) -> List[SeriesReadSchema]:
        query = uow.series.get_all_full_series_query(SeriesModel.tournament_id == tournament_id,
                                                     SeriesModel.status == SeriesStatus.PLAYED)
        paginator = AsyncPaginator(
            session=uow.session,
            model_class=SeriesModel,
            schema_class=SeriesReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            query=query,
        )
        return await paginator.get_result()
