from uuid import UUID

from backlib.repo_helpers import raise_not_found_if_none
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.series.models import SeriesStatus
from cuply.series.services.forecast_competition import ForecastCompetitionBetService
from cuply.stages.exceptions.swiss import (
    SwissRoundCannotBeStartedException,
    SwissRoundCannotBeEndedException,
    NotAllSwissSeriesPlayedException,
)
from cuply.stages.models import (
    SwissStageRoundModel,
    SwissStageRoundStatuses,
    SwissStageModel,
    TournamentStageStatus,
    StageParticipantStatus,
    StageParticipantModel,
)
from cuply.stages.schemas.swiss import SwissStageRoundFullReadSchema
from cuply.stages.services.stages import AbstractRoundService
from cuply.stages.services.swiss.stage import SwissStageService
from cuply.tournaments.models import TournamentModel


class SwissRoundService(AbstractRoundService):
    """ Service to manage swiss rounds. """
    def __init__(self):
        self.swiss_stage_service = SwissStageService()
        super().__init__()

    async def get_round(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        swiss_stage_id: UUID,
        round_id: UUID,
        user: UserModel,
    ):
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        swiss_stage = await uow.swiss_stage_repo.get_full_stage(SwissStageModel.id == swiss_stage_id)
        raise_not_found_if_none(swiss_stage, swiss_stage_id)

        swiss_round = await uow.swiss_round_repo.get_full_round(
            SwissStageRoundModel.id == round_id,
        )
        raise_not_found_if_none(swiss_round, round_id)

        participant_data = await self.swiss_stage_service.get_participants_data(
            uow=uow,
            tournament=tournament,
            swiss_stage=swiss_stage,
        )

        return SwissStageRoundFullReadSchema.model_validate(swiss_round, context={
            'participant_data': participant_data,
        })

    async def start_round(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        swiss_stage_id: UUID,
        round_id: UUID,
        user: UserModel,
        *args, **kwargs,
    ):
        tournament = await self._get_tournament_or_raise_404(uow, tournament_id)

        await self.permission_service.check_start_round(uow, user, tournament=tournament)

        swiss_round: SwissStageRoundModel = await uow.swiss_round_repo.find_one(id=round_id)
        raise_not_found_if_none(swiss_round, round_id)

        if swiss_round.status != SwissStageRoundStatuses.WAITING_FOR_START:
            raise SwissRoundCannotBeStartedException()

        await uow.swiss_round_repo.edit_one(round_id, {
            'status': SwissStageRoundStatuses.ROUND_STARTED,
        })

        await uow.commit()

    async def end_round(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        swiss_stage_id: UUID,
        round_id: UUID,
        user: UserModel,
    ):
        tournament = await self._get_tournament_or_raise_404(uow, tournament_id)

        await self.permission_service.check_end_round(uow, user, tournament=tournament)

        swiss_stage = await uow.swiss_stage_repo.get_full_stage(SwissStageModel.id == swiss_stage_id)
        swiss_round = await self.swiss_stage_service.get_swiss_round_or_raise_404(swiss_stage, round_id)

        if swiss_round.status != SwissStageRoundStatuses.ROUND_STARTED:
            raise SwissRoundCannotBeEndedException()

        all_series = []
        for swiss_group in swiss_round.series_groups:
            for swiss_series in swiss_group.series:
                if swiss_series.series.status not in [SeriesStatus.PLAYED, SeriesStatus.WALK_OVER]:
                    raise NotAllSwissSeriesPlayedException()
                all_series.append(swiss_series.series)

        forecast_bets_service = ForecastCompetitionBetService()
        await forecast_bets_service.set_bet_points_to_series(uow, all_series)

        await uow.swiss_round_repo.edit_one(round_id, {
            'status': SwissStageRoundStatuses.ROUND_ENDED,
        })

        next_round: SwissStageRoundModel = await uow.swiss_round_repo.find_one(
            swiss_stage_id=swiss_round.swiss_stage_id,
            round_number=swiss_round.round_number + 1,
        )
        if next_round:
            await uow.swiss_round_repo.edit_one(next_round.id, {
                'status': SwissStageRoundStatuses.WAITING_FOR_DRAW,
            })
        else:
            await uow.stages_repo.edit_one(stage_id, {
                'status': TournamentStageStatus.STAGE_ENDED,
            })

        await self._set_participants_statuses(uow, tournament, swiss_stage)

        await uow.commit()

    async def _set_participants_statuses(
        self,
        uow: AsyncUnitOfWork,
        tournament: TournamentModel,
        swiss_stage: SwissStageModel,
    ):
        """ Update participants statuses in StageParticipantModel for the current stage. """
        # get all participants for the current stage.
        stage_participants = await uow.stage_participant.find_all(stage_id=swiss_stage.stage_id)
        stage_participants_dict = {
            participant.account_id: participant for participant in stage_participants
        }

        swiss_stage_service = SwissStageService()
        participant_data = await swiss_stage_service.get_participants_data(uow, tournament, swiss_stage)
        for account_id, participant in participant_data.items():
            stage_participant: StageParticipantModel = stage_participants_dict[account_id]

            # if the user hits the number of needed loses, we have to eliminate him from the stage.
            if (
                participant.loses == swiss_stage.loses_needed
                and stage_participant.status != StageParticipantStatus.LOSER
            ):
                await uow.stage_participant.edit_one(stage_participant.id, {
                    'status': StageParticipantStatus.LOSER,
                })

            # if the user hits the number of needed wins, we have to make him winner in the stage.
            if (
                participant.wins == swiss_stage.wins_needed
                and stage_participant.status != StageParticipantStatus.WINNER
            ):
                await uow.stage_participant.edit_one(stage_participant.id, {
                    'status': StageParticipantStatus.WINNER,
                })
