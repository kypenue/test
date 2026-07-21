from uuid import UUID

from backlib.repo_helpers import raise_not_found_if_none
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.matches.models import MatchStatus
from cuply.series.models import SeriesModel, SeriesStatus
from cuply.series.services.forecast_competition import ForecastCompetitionBetService
from cuply.stages.exceptions.wildcard import (
    WildcardRoundCannotBeEndedException,
    NotAllWildcardSeriesPlayedException,
    WildcardRoundCannotBeStartedException,
)
from cuply.stages.models import (
    WildcardStageRoundModel,
    WildcardStageRoundStatuses,
    WildcardStageModel,
    StageParticipantStatus,
    TournamentStageStatus,
)
from cuply.stages.schemas.wildcard import WildcardStageRoundFullReadSchema
from cuply.stages.services.stages import AbstractRoundService
from cuply.tournaments.services.tournaments import get_participant_id


class WildcardRoundService(AbstractRoundService):
    async def get_round(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        wildcard_stage_id: UUID,
        round_id: UUID,
        user: UserModel,
        *args, **kwargs,
    ):
        wildcard_round = await uow.wildcard_round_repo.get_full_round(
            WildcardStageRoundModel.id == round_id,
        )
        raise_not_found_if_none(wildcard_round, round_id)

        return WildcardStageRoundFullReadSchema.model_validate(wildcard_round)

    async def start_round(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        wildcard_stage_id: UUID,
        round_id: UUID,
        user: UserModel,
        *args, **kwargs,
    ):
        tournament = await self._get_tournament_or_raise_404(uow, tournament_id)

        await self.permission_service.check_start_round(uow, user, tournament=tournament)

        wildcard_round: WildcardStageRoundModel = await uow.wildcard_round_repo.get_full_round(
            WildcardStageRoundModel.id == round_id,
        )
        raise_not_found_if_none(wildcard_round, round_id)

        if wildcard_round.status != WildcardStageRoundStatuses.WAITING_FOR_START:
            raise WildcardRoundCannotBeStartedException()

        wildcard_stage: WildcardStageModel = await uow.wildcard_stage_repo.find_one(id=wildcard_stage_id)

        for wildcard_series in wildcard_round.series:
            series: SeriesModel = wildcard_series.series
            home_player, guest_player = series.gamer1, series.gamer2
            home_participant_id = await get_participant_id(uow, tournament_id, home_player.id)
            guest_participant_id = await get_participant_id(uow, tournament_id, guest_player.id)
            for match_num in range(wildcard_stage.game_number):
                await uow.match_repo.add_one({
                    'match_number': match_num + 1,
                    'tournament_id': tournament_id,
                    'stage_id': stage_id,
                    'status': MatchStatus.INITIAL_ACTIVE,
                    'series_id': series.id,
                    'home_player_id': home_player.id,
                    'guest_player_id': guest_player.id,
                    'home_participant_id': home_participant_id,
                    'guest_participant_id': guest_participant_id,
                })
                home_player, guest_player = guest_player, home_player
                home_participant_id, guest_participant_id = guest_participant_id, home_participant_id

        await uow.wildcard_round_repo.edit_one(round_id, {
            'status': WildcardStageRoundStatuses.ROUND_STARTED,
        })

        await uow.commit()

    async def end_round(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        wildcard_stage_id: UUID,
        round_id: UUID,
        user: UserModel,
    ):
        tournament = await self._get_tournament_or_raise_404(uow, tournament_id)

        await self.permission_service.check_end_round(uow, user, tournament=tournament)

        wildcard_round: WildcardStageRoundModel = await uow.wildcard_round_repo.get_full_round(
            WildcardStageRoundModel.id == round_id,
        )
        raise_not_found_if_none(wildcard_round, round_id)

        wildcard_stage: WildcardStageModel = await uow.wildcard_stage_repo.find_one(id=wildcard_stage_id)
        raise_not_found_if_none(wildcard_stage, wildcard_stage_id)

        if wildcard_round.status != WildcardStageRoundStatuses.ROUND_STARTED:
            raise WildcardRoundCannotBeEndedException()

        all_series = []
        for wildcard_series in wildcard_round.series:
            if wildcard_series.series.status not in [SeriesStatus.PLAYED, SeriesStatus.WALK_OVER]:
                raise NotAllWildcardSeriesPlayedException()
            all_series.append(wildcard_series.series)

        forecast_bets_service = ForecastCompetitionBetService()
        await forecast_bets_service.set_bet_points_to_series(uow, all_series)

        await uow.wildcard_round_repo.edit_one(round_id, {
            'status': WildcardStageRoundStatuses.ROUND_ENDED,
        })

        next_round: WildcardStageRoundModel = await uow.wildcard_round_repo.find_one(
            wildcard_stage_id=wildcard_round.wildcard_stage_id,
            round_number=wildcard_round.round_number + 1,
        )
        if next_round:
            await uow.wildcard_round_repo.edit_one(next_round.id, {
                'status': WildcardStageRoundStatuses.WAITING_FOR_START,
            })
        else:
            await uow.stages_repo.edit_one(wildcard_stage.stage_id, {
                'status': TournamentStageStatus.STAGE_ENDED,
            })

        await self._set_participants_statuses(uow, stage_id, wildcard_round)

        await uow.commit()

    async def _set_participants_statuses(
        self,
        uow: AsyncUnitOfWork,
        stage_id: UUID,
        wildcard_round: WildcardStageRoundModel,
    ):
        """ Update participants statuses in StageParticipantModel for the current stage. """
        # get all participants for the current stage.
        stage_participants = await uow.stage_participant.find_all(stage_id=stage_id)
        stage_participants_dict = {
            participant.account_id: participant for participant in stage_participants
        }

        for wildcard_series in wildcard_round.series:
            series = wildcard_series.series
            if series.gamer1_score > series.gamer2_score or series.status == SeriesStatus.WALK_OVER:
                participant1 = stage_participants_dict[series.gamer1_id]
                await uow.stage_participant.edit_one(participant1.id, {
                    'status': StageParticipantStatus.WINNER,
                })

                if series.status != SeriesStatus.WALK_OVER:
                    participant2 = stage_participants_dict[series.gamer2_id]
                    await uow.stage_participant.edit_one(participant2.id, {
                        'status': StageParticipantStatus.LOSER,
                    })
            else:
                participant1 = stage_participants_dict[series.gamer1_id]
                await uow.stage_participant.edit_one(participant1.id, {
                    'status': StageParticipantStatus.LOSER,
                })

                participant2 = stage_participants_dict[series.gamer2_id]
                await uow.stage_participant.edit_one(participant2.id, {
                    'status': StageParticipantStatus.WINNER,
                })
