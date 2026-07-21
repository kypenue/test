from typing import List, Optional

from cuply.accounts.models import AccountModel
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.series.models import SeriesStatus
from cuply.stages.exceptions.stages import MissingFieldsStageException
from cuply.stages.models import (
    StageModel,
    WildcardStageRoundStatuses,
    StageParticipantStatus,
    WildcardStageModel,
)
from cuply.stages.services.stages import AbstractStageService
from cuply.tournaments.services.tournaments import get_participant_id


class WildcardStageService(AbstractStageService):
    """ Service to manage wildcard stages. """
    def __init__(self):
        super().__init__()

    async def check_has_enough_data(
        self,
        uow: AsyncUnitOfWork,
        stage: StageModel,
        user: UserModel,
    ):
        return True

    async def start_stage(
        self,
        uow: AsyncUnitOfWork,
        stage: StageModel,
        previous_stage: StageModel,
        participants: List[AccountModel],
        *args, **kwargs,
    ):
        wildcard_stage: WildcardStageModel = stage.wildcard_stage

        required_participant_number = await self._get_required_participants_number_for_next_stage(uow, stage)
        if required_participant_number is None:
            raise MissingFieldsStageException('Not enough data for the next tournament.')

        wildcard_participants_number = self._calculate_wildcard_participants_number(
            total_participants=len(participants),
            required_participant_number=required_participant_number,
        )
        if wildcard_participants_number == 0:
            wildcard_winner_participants = participants[:]
            wildcard_playing_participants = []
        else:
            wildcard_winner_participants = participants[:-wildcard_participants_number]
            wildcard_playing_participants = participants[-wildcard_participants_number:]

        participant_number = 1
        for participant in wildcard_winner_participants:
            await uow.stage_participant.add_one({
                'order_number': participant_number,
                'status': StageParticipantStatus.WINNER,
                'account_id': participant.id,
                'stage_id': stage.id,
            })
            participant_number += 1

        round_id = await uow.wildcard_round_repo.add_one({
            'round_number': 1,
            'status': WildcardStageRoundStatuses.WAITING_FOR_START,
            'wildcard_stage_id': wildcard_stage.id,
        })

        for participant_num in range(wildcard_participants_number // 2 - 1, -1, -1):
            account1 = wildcard_playing_participants[participant_num]
            account2 = wildcard_playing_participants[-(participant_num + 1)]

            participant1_id = await get_participant_id(uow, stage.tournament_id, account1.id)
            participant2_id = await get_participant_id(uow, stage.tournament_id, account2.id)

            series_id = await uow.series.add_one({
                'gamer1_id': account1.id,
                'gamer2_id': account2.id,
                'participant1_id': participant1_id,
                'participant2_id': participant2_id,
                'gamer1_score': 0,
                'gamer2_score': 0,
                'tournament_id': stage.tournament_id,
                'status': SeriesStatus.PLAYING,
                'stage_id': stage.id,
            })
            await uow.wildcard_series.add_one({
                'series_id': series_id,
                'wildcard_round_id': round_id,
            })

        for participant in wildcard_playing_participants:
            await uow.stage_participant.add_one({
                'order_number': participant_number,
                'status': StageParticipantStatus.PLAYING,
                'account_id': participant.id,
                'stage_id': stage.id,
            })
            participant_number += 1

    async def _get_required_participants_number_for_next_stage(
        self,
        uow: AsyncUnitOfWork,
        stage: StageModel,
    ) -> Optional[int]:
        next_stage = await uow.stages_repo.get_full_tournament_stage(
            StageModel.tournament_id == stage.tournament_id,
            StageModel.order_number == stage.order_number + 1,
        )
        required_participant_number = await self.stage_service.get_required_participants_number(uow, next_stage)
        return required_participant_number

    def _calculate_wildcard_participants_number(
        self,
        total_participants: int,
        required_participant_number: Optional[int],
    ) -> int:
        if required_participant_number is None:
            return 0
        return (total_participants - required_participant_number) * 2
