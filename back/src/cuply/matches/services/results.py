from collections import defaultdict
from typing import Optional
from uuid import UUID

from fastapi import HTTPException
from starlette import status

from backlib.repo_helpers import raise_not_found_if_none
from constants import (
    MATCH_RESULT_PROHIBITED_MSG,
    MATCH_RESULT_ORGANIZER_FILLED_MSG,
    MATCH_RESULT_TOO_MANY_ITEMS_MSG,
    MATCH_RESULT_PROHIBITED_FOR_FINISHED_MSG,
)
from cuply.auth.models import UserModel, UserRoles
from cuply.base.services.caching.cache import Cache
from cuply.base.services.elo_rating import EloRatingService
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.matches.models import (
    MatchStatus,
    MatchResultModel,
    MatchModel,
    MatchComplaintStatus,
    MatchComplaintCreation,
)
from cuply.matches.schemas.complaints import MatchComplaintCreateSchema
from cuply.matches.schemas.matches import SeriesMatchUpdateSchema
from cuply.matches.schemas.results import (
    MatchResultReadSchema,
    MatchResultCreateOrUpdateSchemaDto,
    MatchResultCreateSchema,
)
from cuply.series.models import SeriesModel, SeriesStatus
from cuply.stages.models import TournamentStageTypes
from cuply.tournaments.models import TournamentModel, TournamentPaymentType
from cuply.tournaments.services.permissions import TournamentPermissionService
from logs import cuply_logger


class MatchResultService:
    FINISHED_MATCH_STATUSES = {
        MatchStatus.CONTRADICTION_IN_RESULT,
        MatchStatus.CONFIRMED,
        MatchStatus.CONFIRMED_BY_CRON,
        MatchStatus.CONFIRMED_BY_ORGANIZER,
        MatchStatus.NOT_NECESSARY,
        MatchStatus.ADVANTAGE,
    }
    FINISHED_SAME_MATCH_STATUSES = {
        MatchStatus.CONFIRMED,
        MatchStatus.CONFIRMED_BY_CRON,
        MatchStatus.CONFIRMED_BY_ORGANIZER,
        MatchStatus.NOT_NECESSARY,
    }

    def __init__(self):
        self.permission_service = TournamentPermissionService()

    @staticmethod
    def compare_two_results(
            first: MatchResultModel,
            second: MatchResultModel | MatchResultCreateSchema,
    ) -> bool:
        return first.home_score == second.home_score and first.guest_score == second.guest_score

    async def _check_permission_to_match(
            self,
            tournament_id: int,
            match_id: UUID,
            uow: AsyncUnitOfWork,
            user: UserModel,
    ) -> MatchModel:
        match: MatchModel = await uow.match_repo.get_full_match(MatchModel.id == match_id)
        raise_not_found_if_none(match, match_id)

        if await self.permission_service.check_confirm_match_as_organizer(
                uow, user,
                tournament_id=tournament_id,
                raise_exc=False,
        ):
            return match

        if match.home_player_account.user_id != user.id and match.guest_player_account.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=MATCH_RESULT_PROHIBITED_MSG
            )

        return match

    async def update_next_matches_status(
            self,
            series_id: UUID,
            current_match: Optional[MatchModel],
            uow: AsyncUnitOfWork,
    ):
        if current_match is None or current_match.status in MatchResultService.FINISHED_MATCH_STATUSES:
            matches = await uow.match_repo.find_matches_by_series(series_id=series_id)
            already_played = 0
            player_x_win = defaultdict(int)
            for match in matches:
                guest = match.guest_player_id
                home = match.home_player_id
                if match.status in MatchResultService.FINISHED_SAME_MATCH_STATUSES:
                    already_played += 1
                    match_results = await uow.match_result_repo.find_results_in_match(match_id=match.id)
                    if match.status != MatchStatus.NOT_NECESSARY:
                        if match_results[0].home_score > match_results[0].guest_score:
                            player_x_win[home] += 1
                        elif match_results[0].guest_score > match_results[0].home_score:
                            player_x_win[guest] += 1
                if match.status == MatchStatus.ADVANTAGE:
                    already_played += 1
                    player_x_win[home] += 1
            max_wins = 0
            for wins in player_x_win.values():
                if wins > max_wins:
                    max_wins = wins

            if already_played < len(matches):
                if max_wins >= (len(matches) // 2 + 1):
                    for match in matches:
                        if match.status not in MatchResultService.FINISHED_MATCH_STATUSES:
                            to_update = SeriesMatchUpdateSchema(status=MatchStatus.NOT_NECESSARY)
                            cuply_logger.info(f"Completing ahead next match '{match.id}'")
                            data = to_update.model_dump(exclude_unset=True)
                            await uow.match_repo.edit_one(match.id, data)
                            already_played += 1

            series: SeriesModel = await uow.series.find_one(id=series_id)
            raise_not_found_if_none(series, series_id)

            to_update_data = None
            if already_played == len(matches):
                to_update_data = {
                    'status': SeriesStatus.PLAYED,
                    'gamer1_score': player_x_win[series.gamer1_id],
                    'gamer2_score': player_x_win[series.gamer2_id],
                }
            elif max_wins > 0:
                to_update_data = {
                    'gamer1_score': player_x_win[series.gamer1_id],
                    'gamer2_score': player_x_win[series.gamer2_id],
                }
            if to_update_data:
                await uow.series.edit_one(series_id, to_update_data)

            await uow.commit()

    async def set_match_result(
            self,
            tournament_id: int,
            series_id: UUID,
            match_id: UUID,
            schema: MatchResultCreateOrUpdateSchemaDto,
            uow: AsyncUnitOfWork,
            user: UserModel,
    ) -> MatchResultReadSchema:
        match = await self._check_permission_to_match(tournament_id, match_id, uow, user)
        match_results = await uow.match_result_repo.find_results_in_match(match_id=match_id)
        tournament = await uow.tournament_repo.get_full_tournament(TournamentModel.id == tournament_id)

        can_confirm_as_organizer = await self.permission_service.check_confirm_match_as_organizer(
            uow, user, tournament_id=tournament_id, raise_exc=False,
        )

        # Result was set by admin, user can not edit
        if (
                len(match_results) == 1
                and not can_confirm_as_organizer
                and match_results[0].player.role == UserRoles.ORGANIZER
                and match_results[0].player_id != match.guest_player_account.user_id
                and match_results[0].player_id != match.home_player_account.user_id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=MATCH_RESULT_ORGANIZER_FILLED_MSG
            )

        existing_match_res = None
        for match_res in match_results:
            if match_res.player_id == user.id:
                existing_match_res = match_res

        is_match_player = match.guest_player_account.user_id == user.id or match.home_player_account == user.id
        if (
                (existing_match_res is None and not can_confirm_as_organizer)
                or (can_confirm_as_organizer and len(match_results) == 0)
                or (existing_match_res is None and can_confirm_as_organizer and is_match_player)
        ):
            if len(match_results) >= 2:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=MATCH_RESULT_TOO_MANY_ITEMS_MSG
                )
            to_create = MatchResultCreateSchema(
                match_id=match_id,
                player_id=user.id,
                home_score=schema.home_score,
                guest_score=schema.guest_score,
                video_link=schema.video_link
            )
            if match.status == MatchStatus.CONFIRMED_BY_CRON or match.status == MatchStatus.CONFIRMED_BY_ORGANIZER:
                are_same = MatchResultService.compare_two_results(match_results[0], to_create)
                if not are_same:
                    home_score = match_results[0].home_score
                    guest_score = match_results[0].guest_score
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Счёт, введённый вашим соперником {home_score}:{guest_score}, был подтверждён. Необходимо ввести такой же результат"
                    )
            data = to_create.model_dump(exclude_unset=True)
            rs_match_result_id = await uow.match_result_repo.add_one(data)

            match_status = None
            if len(match_results) == 0 and user.id == match.home_player_account.user_id:
                match_status = MatchStatus.WAITING_CONFIRMATION_FROM_GUEST_PLAYER
            elif len(match_results) == 0 and user.id == match.guest_player_account.user_id:
                match_status = MatchStatus.WAITING_CONFIRMATION_FROM_HOME_PLAYER
            elif len(match_results) > 0 and match.status != MatchStatus.CONFIRMED_BY_CRON:
                if MatchResultService.compare_two_results(match_results[0], to_create):
                    match_status = MatchStatus.CONFIRMED
                else:
                    match_status = MatchStatus.CONTRADICTION_IN_RESULT

            if match_status is None and can_confirm_as_organizer:
                match_status = MatchStatus.CONFIRMED_BY_ORGANIZER
            if match_status:
                to_update = SeriesMatchUpdateSchema(status=match_status)
                data = to_update.model_dump(exclude_unset=True)
                await uow.match_repo.edit_one(match_id, data)

            if match_status == MatchStatus.CONTRADICTION_IN_RESULT:
                raise_not_found_if_none(tournament, tournament_id)
                comment = []
                if match_results:
                    match_res = match_results[0]
                    comment.append(
                        f"{match_res.player.surname} {match_res.player.name}: home_score: {match_res.home_score}; guest_score: {match_res.guest_score}"
                    )
                comment.append(
                    f"{user.surname} {user.name}: home_score: {schema.home_score}; guest_score: {schema.guest_score}"
                )
                auto_complaint = MatchComplaintCreateSchema(
                    author_id=tournament.creator.id,
                    comment="\n".join(comment),
                    status=MatchComplaintStatus.OPEN,
                    creation_way=MatchComplaintCreation.AUTO,
                    match_id=match.id,
                    series_id=match.series_id,
                    tournament_id=match.tournament_id
                )
                auto_complaint = auto_complaint.model_dump(exclude_unset=True)
                cuply_logger.info(f"Creating auto complaint for match '{match.id}'")
                await uow.match_complaint_repo.add_one(auto_complaint)
        else:
            if not can_confirm_as_organizer:
                if (
                        match.home_player_account.user_id == user.id and
                        match.status == MatchStatus.WAITING_CONFIRMATION_FROM_GUEST_PLAYER
                ) or (
                        match.guest_player_account.user_id == user.id and
                        match.status == MatchStatus.WAITING_CONFIRMATION_FROM_HOME_PLAYER
                ):
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=MATCH_RESULT_PROHIBITED_MSG
                    )

                if match.status in {
                    MatchStatus.INITIAL_DISABLED,
                    MatchStatus.CONFIRMED,
                    MatchStatus.NOT_NECESSARY,
                    MatchStatus.CONFIRMED_BY_CRON,
                    MatchStatus.CONFIRMED_BY_ORGANIZER,
                }:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=MATCH_RESULT_PROHIBITED_FOR_FINISHED_MSG
                    )

            if can_confirm_as_organizer:
                to_update = SeriesMatchUpdateSchema(status=MatchStatus.CONFIRMED_BY_ORGANIZER)
                data = to_update.model_dump(exclude_unset=True)
                await uow.match_repo.edit_one(match_id, data)
                data = schema.model_dump(exclude_unset=True)
                for match_res in match_results:
                    rs_match_result_id = await uow.match_result_repo.edit_one(match_res.id, data)
            elif match.status == MatchStatus.CONTRADICTION_IN_RESULT:
                opponent_res = None
                for match_res in match_results:
                    if match_res.player_id != user.id:
                        opponent_res = match_res
                if (
                        opponent_res is not None
                        and opponent_res.home_score == schema.home_score
                        and opponent_res.guest_score == schema.guest_score
                ):
                    to_update = SeriesMatchUpdateSchema(status=MatchStatus.CONFIRMED)
                    data_match = to_update.model_dump(exclude_unset=True)
                    await uow.match_repo.edit_one(match_id, data_match)
                data = schema.model_dump(exclude_unset=True)
                rs_match_result_id = await uow.match_result_repo.edit_one(existing_match_res.id, data)

        await self._invalidate_caches(uow, match.series_id)

        # updating elo rating
        if match.status in {MatchStatus.CONFIRMED, MatchStatus.CONFIRMED_BY_CRON, MatchStatus.CONFIRMED_BY_ORGANIZER}:
            if tournament and tournament.payment_type != TournamentPaymentType.FREE:
                if schema.home_score > schema.guest_score:
                    home_result = 1.0
                elif schema.home_score < schema.guest_score:
                    home_result = 0.0
                else:
                    home_result = 0.5

                gamer1_account = match.home_player_account
                gamer2_account = match.guest_player_account

                if gamer1_account and gamer2_account:
                    new_rating_home, new_rating_guest = EloRatingService.update_ratings_for_match(
                        gamer1_account.rating,
                        gamer2_account.rating,
                        home_result
                    )
                    await uow.account_repo.edit_one(gamer1_account.id, {"rating": new_rating_home})
                    await uow.account_repo.edit_one(gamer2_account.id, {"rating": new_rating_guest})

        await uow.commit()

        rs_match_res = await uow.match_result_repo.find_one(id=rs_match_result_id)

        match = await uow.match_repo.find_one(id=match_id)
        await self.update_next_matches_status(
            series_id=series_id,
            current_match=match,
            uow=uow
        )
        return MatchResultReadSchema.model_validate(rs_match_res)

    async def _invalidate_caches(self, uow: AsyncUnitOfWork, series_id):
        series: SeriesModel = await uow.series.find_one(id=series_id)
        stage = await uow.stages_repo.find_one(id=series.stage_id)
        if stage and stage.stage_type == TournamentStageTypes.SWISS:
            await Cache.delete(f"stages/{stage.id}/swiss-rating")
