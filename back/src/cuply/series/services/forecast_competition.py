from typing import List
from uuid import UUID

from backlib.pagination import AsyncPaginator, ListPaginator
from backlib.repo_helpers import raise_not_found_if_none
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.series.exceptions.forecast_competition import (
    ForecastCompetitionIsNotAllowed,
    CannotBetForecastSeriesAlreadyPlayed,
    ForecastBetOfOtherUserCannotBeChanged, ForecastForSeriesAlreadyExists,
)
from cuply.series.filters.forecast_competition import ForecastCompetitionBetFilter
from cuply.series.models import ForecastCompetitionBetModel, SeriesModel, SeriesStatus
from cuply.series.schemas.forecast_comptetition import (
    ForecastCompetitionBetWriteSchema,
    ForecastCompetitionBetReadSchema,
    UserForecastCompetitionRatingReadSchema,
    CurrentUserForecastCompetitionBetReadSchema,
)


class ForecastCompetitionBetService:
    async def get_forecast_bets_paginated(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        series_id: UUID,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        filter_instance: ForecastCompetitionBetFilter,
    ) -> List[ForecastCompetitionBetReadSchema]:
        series = await uow.series.get_full_series(
            SeriesModel.id == series_id,
            SeriesModel.tournament_id == tournament_id,
        )
        if not series.tournament.is_forecast_competition_allowed:
            raise ForecastCompetitionIsNotAllowed()

        query = uow.forecast_bet_repo.get_full_bet_query(
            ForecastCompetitionBetModel.series_id == series_id,
        )

        paginator = AsyncPaginator(
            session=uow.session,
            model_class=ForecastCompetitionBetModel,
            schema_class=ForecastCompetitionBetReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            filter_instance=filter_instance,
            query=query,
        )
        return await paginator.get_result()

    async def get_forecast_bet(
        self,
        tournament_id: int,
        series_id: UUID,
        bet_id: UUID,
        uow: AsyncUnitOfWork,
    ) -> ForecastCompetitionBetReadSchema:
        series = await uow.series.get_full_series(
            SeriesModel.id == series_id,
            SeriesModel.tournament_id == tournament_id,
        )
        raise_not_found_if_none(series, series_id)
        if not series.tournament.is_forecast_competition_allowed:
            raise ForecastCompetitionIsNotAllowed()

        forecast_bet = await uow.forecast_bet_repo.get_full_bet(
            ForecastCompetitionBetModel.id == bet_id,
            ForecastCompetitionBetModel.series_id == series_id,
        )
        raise_not_found_if_none(forecast_bet, bet_id)

        return ForecastCompetitionBetReadSchema.model_validate(forecast_bet)

    async def create_forecast_bet(
        self,
        tournament_id: int,
        series_id: UUID,
        schema: ForecastCompetitionBetWriteSchema,
        uow: AsyncUnitOfWork,
        user: UserModel,
    ) -> ForecastCompetitionBetReadSchema:
        series = await uow.series.get_full_series(
            SeriesModel.id == series_id,
            SeriesModel.tournament_id == tournament_id,
        )
        raise_not_found_if_none(series, series_id)
        if not series.tournament.is_forecast_competition_allowed:
            raise ForecastCompetitionIsNotAllowed()

        if series.status == SeriesStatus.PLAYED:
            raise CannotBetForecastSeriesAlreadyPlayed()

        forecast_bet_for_series = await uow.forecast_bet_repo.get_full_bet(
            ForecastCompetitionBetModel.series_id == series_id,
        )
        if forecast_bet_for_series:
            raise ForecastForSeriesAlreadyExists()

        data = schema.model_dump()
        data['series_id'] = series.id
        data['creator_id'] = user.id
        data['points'] = 0

        bet_id = await uow.forecast_bet_repo.add_one(data)

        await uow.commit()

        forecast_bet = await uow.forecast_bet_repo.get_full_bet(
            ForecastCompetitionBetModel.id == bet_id,
        )
        return ForecastCompetitionBetReadSchema.model_validate(forecast_bet)

    async def update_forecast_bet(
        self,
        tournament_id: int,
        series_id: UUID,
        bet_id: UUID,
        schema: ForecastCompetitionBetWriteSchema,
        uow: AsyncUnitOfWork,
        user: UserModel,
    ) -> ForecastCompetitionBetReadSchema:
        series = await uow.series.get_full_series(
            SeriesModel.id == series_id,
            SeriesModel.tournament_id == tournament_id,
        )
        raise_not_found_if_none(series, series_id)
        if not series.tournament.is_forecast_competition_allowed:
            raise ForecastCompetitionIsNotAllowed()

        if series.status == SeriesStatus.PLAYED:
            raise CannotBetForecastSeriesAlreadyPlayed()

        forecast_bet = await uow.forecast_bet_repo.get_full_bet(
            ForecastCompetitionBetModel.id == bet_id,
            ForecastCompetitionBetModel.series_id == series_id,
        )
        raise_not_found_if_none(forecast_bet, bet_id)

        if forecast_bet.creator_id != user.id:
            raise ForecastBetOfOtherUserCannotBeChanged()

        data = schema.model_dump()
        data['points'] = 0

        await uow.forecast_bet_repo.edit_one(forecast_bet.id, data)

        await uow.commit()

        await uow.session.refresh(forecast_bet)

        return ForecastCompetitionBetReadSchema.model_validate(forecast_bet)

    async def delete_forecast_bet(
        self,
        tournament_id: int,
        series_id: UUID,
        bet_id: UUID,
        uow: AsyncUnitOfWork,
        user: UserModel,
    ):
        series = await uow.series.get_full_series(
            SeriesModel.id == series_id,
            SeriesModel.tournament_id == tournament_id,
        )
        raise_not_found_if_none(series, series_id)
        if not series.tournament.is_forecast_competition_allowed:
            raise ForecastCompetitionIsNotAllowed()

        if series.status == SeriesStatus.PLAYED:
            raise CannotBetForecastSeriesAlreadyPlayed()

        forecast_bet = await uow.forecast_bet_repo.get_full_bet(
            ForecastCompetitionBetModel.id == bet_id,
            ForecastCompetitionBetModel.series_id == series_id,
        )
        raise_not_found_if_none(forecast_bet, bet_id)

        if forecast_bet.creator_id != user.id:
            raise ForecastBetOfOtherUserCannotBeChanged()

        await uow.forecast_bet_repo.delete_one(forecast_bet.id)

        await uow.commit()

    async def get_current_user_bet_status(
        self,
        tournament_id: int,
        series_id: UUID,
        uow: AsyncUnitOfWork,
        user: UserModel,
    ) -> CurrentUserForecastCompetitionBetReadSchema:
        """ Get bet for current user in series. """
        series = await uow.series.get_full_series(
            SeriesModel.id == series_id,
            SeriesModel.tournament_id == tournament_id,
        )
        raise_not_found_if_none(series, series_id)
        if not series.tournament.is_forecast_competition_allowed:
            status, bet = 'FORECAST_COMPETITION_NOT_ALLOWED', None
        else:
            forecast_bet = await uow.forecast_bet_repo.get_full_bet(
                ForecastCompetitionBetModel.creator_id == user.id,
                ForecastCompetitionBetModel.series_id == series_id,
            )
            if not forecast_bet:
                if series.status == SeriesStatus.PLAYED:
                    status, bet = 'SERIES_ALREADY_PLAYED', None
                else:
                    status, bet = 'BET_ALLOWED', None
            else:
                status, bet = 'BET_FOUND', forecast_bet

        return CurrentUserForecastCompetitionBetReadSchema.model_validate({
            'status': status,
            'bet': bet,
        })

    async def get_rating_in_tournament_paginated(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
    ):
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)
        if not tournament.is_forecast_competition_allowed:
            raise ForecastCompetitionIsNotAllowed()

        query = uow.forecast_bet_repo.get_tournament_rating_query(
            tournament_id=tournament_id,
        )
        rating = await uow.session.execute(query)

        paginator = ListPaginator(
            session=uow.session,
            model_class=None,
            schema_class=UserForecastCompetitionRatingReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            items=[{'user': item[0], 'rating': item[1]} for item in rating],
        )
        return await paginator.get_result()

    async def set_bet_points_to_series(
        self,
        uow: AsyncUnitOfWork,
        series_list: list[SeriesModel],
    ):
        forecast_bets_to_update = []
        for series in series_list:
            forecast_competition_bets = series.series_forecast_competition_bets
            winner_id = series.gamer1_id if series.gamer1_score > series.gamer2_score else series.gamer2_id
            for forecast_competition_bet in forecast_competition_bets:
                if forecast_competition_bet.winner_id == winner_id:
                    forecast_bets_to_update.append({'id': forecast_competition_bet.id, 'points': 1})
        await uow.forecast_bet_repo.edit_bulk(forecast_bets_to_update)

    async def get_forecast_bets_for_tournament_paginated(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        filter_instance: ForecastCompetitionBetFilter,
    ) -> List[ForecastCompetitionBetReadSchema]:
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        if not tournament.is_forecast_competition_allowed:
            raise ForecastCompetitionIsNotAllowed()

        query = uow.forecast_bet_repo.get_full_bet_query(
            SeriesModel.tournament_id == tournament_id,
        )

        paginator = AsyncPaginator(
            session=uow.session,
            model_class=ForecastCompetitionBetModel,
            schema_class=ForecastCompetitionBetReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            filter_instance=filter_instance,
            query=query,
        )
        return await paginator.get_result()
