from uuid import UUID

from backlib.pagination import AsyncPaginator
from backlib.repo_helpers import raise_not_found_if_none
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.matches.models import MatchResultModel, MatchModel
from cuply.matches.schemas.matches import SeriesMatchReadSchema
from cuply.tournaments.models import TournamentRegisteredUserModel


class MatchService:
    async def get_match(
        self,
        tournament_id: int,
        series_id: UUID,
        match_id: UUID,
        uow: AsyncUnitOfWork,
        user: UserModel,
    ) -> SeriesMatchReadSchema:
        match: MatchModel = await uow.match_repo.get_full_match(MatchModel.id == match_id)
        raise_not_found_if_none(match, match_id)

        home_participant = await uow.registration_repo.get_full_participant(
            TournamentRegisteredUserModel.account_id == match.home_player_id,
            TournamentRegisteredUserModel.tournament_id == tournament_id,
        )
        raise_not_found_if_none(home_participant, match.home_player_id)

        guest_participant = await uow.registration_repo.get_full_participant(
            TournamentRegisteredUserModel.account_id == match.guest_player_id,
            TournamentRegisteredUserModel.tournament_id == tournament_id,
        )
        raise_not_found_if_none(guest_participant, match.guest_player_id)

        match_results = await uow.match_result_repo.get_full_matches_results(
            MatchResultModel.match_id == match_id,
        )
        home_player_match_result, guest_player_match_result = None, None
        for result in match_results:
            if result.player_id == match.home_player_account.user_id:
                home_player_match_result = result
            elif result.player_id == match.guest_player_account.user_id:
                guest_player_match_result = result

        return SeriesMatchReadSchema.model_validate(
            match,
            context={
                "home_player_team": home_participant.team,
                "guest_player_team": guest_participant.team,
                "home_player_match_result": home_player_match_result,
                "guest_player_match_result": guest_player_match_result,
            },
        )

    async def get_matches(
        self,
        tournament_id: int,
        series_id: UUID,
        uow: AsyncUnitOfWork,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        user: UserModel,
    ) -> SeriesMatchReadSchema:
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        query = uow.match_repo.get_full_match_query(
            MatchModel.series_id == series_id,
        ).order_by(MatchModel.match_number)

        async def get_teams(item: MatchModel, context_data):
            home_player = await uow.registration_repo.get_full_participant(
                TournamentRegisteredUserModel.tournament_id == tournament_id,
                TournamentRegisteredUserModel.account_id == item.home_player_id,
            )
            home_player_team = home_player.team if home_player else None
            guest_player = await uow.registration_repo.get_full_participant(
                TournamentRegisteredUserModel.tournament_id == tournament_id,
                TournamentRegisteredUserModel.account_id == item.guest_player_id,
            )
            guest_player_team = guest_player.team if guest_player else None

            data = {
                "home_player_team": home_player_team,
                "guest_player_team": guest_player_team,
            }

            match_results = await uow.match_result_repo.get_full_matches_results(MatchResultModel.match_id == item.id)
            if len(match_results) == 1:
                if home_player.account.user_id == match_results[0].player_id:
                    data.update({
                        "home_player_match_result": match_results[0],
                    })
                elif guest_player.account.user_id == match_results[0].player_id:
                    data.update({
                        "guest_player_match_result": match_results[0],
                    })
                else:
                    data.update({
                        "home_player_match_result": match_results[0],
                        "guest_player_match_result": match_results[0],
                    })

            elif len(match_results) == 2:
                if home_player.account.user_id == match_results[0].player_id:
                    data.update({
                        "home_player_match_result": match_results[0],
                        "guest_player_match_result": match_results[1],
                    })
                else:
                    data.update({
                        "home_player_match_result": match_results[1],
                        "guest_player_match_result": match_results[0],
                    })

            return data

        paginator = AsyncPaginator(
            session=uow.session,
            model_class=MatchModel,
            schema_class=SeriesMatchReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=[],
            query=query,
            context_function=get_teams,
        )
        return await paginator.get_result()
