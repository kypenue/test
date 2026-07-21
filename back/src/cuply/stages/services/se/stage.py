from uuid import UUID
from typing import List, Optional

import math
import pandas as pd

from backlib.repo_helpers import raise_not_found_if_none
from cuply.accounts.models import AccountModel
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.series.models import SeriesStatus
from cuply.stages.models import (
    StageModel,
    StageParticipantStatus,
    StageParticipantModel,
    TournamentStageTypes,
    SingleEliminationStageRoundModel,
    SingleEliminationStageModel,
    SingleEliminationStageRoundStatuses,
)
from cuply.stages.services.stages import AbstractStageService
from cuply.teams.schemas.teams import TeamShortReadSchema
from cuply.tournaments.models import (
    TournamentModel, TournamentRegisteredUserModel,
)


class SEStageService(AbstractStageService):
    """ Service to manage single elimination stages. """
    def __init__(self):
        super().__init__()

    async def get_tournament_or_raise_404(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
    ) -> TournamentModel:
        """ Get tournament by id or raise 404 http exception. """
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)
        return tournament

    async def get_se_stage_or_raise_404(
        self,
        tournament: TournamentModel,
        se_stage_id: UUID,
    ) -> SingleEliminationStageModel:
        """ Get single elimination stage by id or raise 404 http exception. """
        for stage in tournament.stages:
            if stage.se_stage and stage.se_stage.id == se_stage_id:
                return stage.se_stage
        raise_not_found_if_none(None, se_stage_id)

    async def get_se_round_or_raise_404(
        self,
        se_stage: SingleEliminationStageModel,
        round_id: UUID,
    ) -> SingleEliminationStageRoundModel:
        """ Get single elimination round by id or raise 404 http exception. """
        for se_round in se_stage.rounds:
            if se_round.id == round_id:
                return se_round
        raise_not_found_if_none(None, round_id)

    async def get_participants_data(
        self,
        uow: AsyncUnitOfWork,
        se_stage: SingleEliminationStageModel,
    ) -> dict[int, AccountModel]:
        participants = {}

        stage_participants = await uow.stage_participant.get_full_participant(
            StageParticipantModel.stage_id == se_stage.stage_id
        )
        for stage_participant in stage_participants:
            participants[stage_participant.account_id] = stage_participant.account

        return participants

    async def get_bracket(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        se_stage_id: UUID,
        user: UserModel,
        round_number__gte: Optional[int] = None,
    ):
        se_stage = await uow.se_stage.get_full_stage(SingleEliminationStageModel.id == se_stage_id)

        stage_rating_data = {}
        stage_participants = await uow.stage_participant.get_full_participant(
            StageParticipantModel.stage_id == se_stage.stage_id,
        )
        for stage_participant in stage_participants:
            stage_rating_data[stage_participant.account_id] = stage_participant.order_number

        participants = await uow.registration_repo.get_full_participants(TournamentRegisteredUserModel.tournament_id == tournament_id)
        tournament_participants_data = {}
        for participant in participants:
            tournament_participants_data[participant.account_id] = participant

        gamer_data = {}

        series_list = []
        for se_round in se_stage.rounds:
            if round_number__gte and se_round.round_number < round_number__gte:
                continue

            for se_series in se_round.series:
                series = se_series.series

                participants_data = []
                for gamer in [series.gamer1, series.gamer2]:
                    if gamer:
                        if gamer.id not in gamer_data:
                            tournament_participant = tournament_participants_data.get(gamer.id)
                            if tournament_participant and tournament_participant.team:
                                team_data = TeamShortReadSchema.model_validate(tournament_participant.team).model_dump()
                            else:
                                team_data = None

                            gamer_data[gamer.id] = {
                                "id": gamer.id,
                                "name": gamer.login,
                                "country": gamer.user.country,
                                "city": gamer.user.city,
                                "team": team_data,
                                "participant_num": stage_rating_data.get(gamer.id)
                            }

                        if gamer.id == series.gamer1_id:
                            current_score = series.gamer1_score if series.gamer1_score else 0
                        else:
                            current_score = series.gamer2_score if series.gamer2_score else 0

                        is_winner = (
                            series.status == SeriesStatus.PLAYED and
                            (gamer.id == series.gamer1_id and
                                (series.gamer1_score > series.gamer2_score or series.gamer2 is None) or
                                gamer.id == series.gamer2_id and series.gamer2_score > series.gamer1_score
                            )
                        )

                        participants_data.append({
                            **gamer_data[gamer.id],
                            "isWinner": is_winner,
                            "status": "NO_PARTY",
                            "resultText": str(current_score),
                            "position": 1 if gamer.id == series.gamer1_id else 2,
                        })

                if series.status == SeriesStatus.NOT_ASSIGNED:
                    state = "NO_PARTY"
                elif series.status == SeriesStatus.WALK_OVER:
                    state = "WALK_OVER"
                elif series.status == SeriesStatus.PLAYED:
                    state = "PLAYED"
                else:
                    state = "SCORE_DONE"

                series_data = {
                    "id": se_series.series_id,
                    "name": se_series.short_id,
                    "next_winner_name": se_series.next_winner.short_id
                        if se_series.next_winner else None,
                    "nextMatchId": se_series.next_winner.series_id
                        if se_series.next_winner else None,
                    "startTime": "",
                    "tournamentRoundText": None,
                    "href": None,
                    "state": state,
                    "participants": participants_data,
                    "series_id": series.id,
                }

                series_list.append(series_data)

        return series_list

    async def start_stage(
        self,
        uow: AsyncUnitOfWork,
        stage: StageModel,
        previous_stage: StageModel,
        participants: List[AccountModel],
        *args, **kwargs,
    ):
        """ Start single elimination stage in tournament. """
        se_stage = stage.se_stage

        se_series = self._compose_rounds(len(participants))

        first_round_status = (
            SingleEliminationStageRoundStatuses.WAITING_FOR_DRAW
                if stage.order_number == 1 else SingleEliminationStageRoundStatuses.WAITING_FOR_START
        )

        added_rounds = {}
        added_series = {}
        for index, row in se_series.iloc[::-1].iterrows():
            round_key = row['round']
            if round_key not in added_rounds:
                round_id = await uow.se_rounds.add_one({
                    'round_number': row['round'],
                    'se_stage_id': se_stage.id,
                    'status': first_round_status
                        if round_key == 1 else SingleEliminationStageRoundStatuses.ROUND_NOT_STARTED,
                })
                added_rounds[round_key] = round_id

            series_key = row['short_id']
            if series_key not in added_series:
                series_id = await uow.series.add_one({
                    'tournament_id': stage.tournament_id,
                    'status': SeriesStatus.NOT_ASSIGNED,
                    'stage_id': stage.id,
                })

                round_key = row['round']
                round_id = added_rounds[round_key]

                se_series_id = await uow.se_series.add_one({
                    'series_id': series_id,
                    'short_id': row['short_id'],
                    'round_id': round_id,
                    'next_winner_id': added_series[row['next_winner_id']]
                        if row['next_winner_id'] else None,
                })
                added_series[series_key] = se_series_id

        for num, participant in enumerate(participants, start=1):
            await uow.stage_participant.add_one({
                'account_id': participant.id,
                'order_number': num,
                'status': StageParticipantStatus.PLAYING,
                'stage_id': stage.id,
            })

    def _compose_rounds(self, participant_number: int):
        """ Compose single elimination rounds and series. """
        se_series = pd.DataFrame(data={
            'short_id': [],
            'round_game': [],
            'next_winner_id': [],
            'round': [],
            'series_num': [],
        })

        # Определяем количество пар в первом раунде
        first_round_pairs_count = int(
            math.pow(2, math.ceil(math.log2(participant_number))) / 2
        )

        # заполняем массив количества игр в зависимости от раунда и сетки
        winner_pair_count = []
        for i in range(0, int(math.log2(first_round_pairs_count)) + 1):
            if i == 0:
                winner_pair_count.append(first_round_pairs_count)
            else:
                winner_pair_count.append(int(winner_pair_count[i - 1] / 2))

        series_num = 0

        total_round_count = len(winner_pair_count)

        for round_num in range(0, len(winner_pair_count)):
            for i in range(0, winner_pair_count[round_num]):
                short_id = f'WB R{str(round_num + 1)} G{str(i + 1)}'
                round_game = i + 1
                next_winner_id = None
                round = round_num + 1
                series_num = series_num + 1
                se_series.loc[len(se_series)] = [
                    short_id,
                    round_game,
                    next_winner_id,
                    round,
                    series_num,
                ]

        for index, row in se_series.iterrows():
            if row['round'] < total_round_count:
                val_win = se_series.loc[(
                    (se_series['round_game'] == math.ceil(row['round_game'] / 2))
                    & (se_series['round'] == row['round'] + 1)
                )]['short_id']
                se_series.at[index, 'next_winner_id'] = val_win.item()

        return se_series

    async def get_required_participants_number(
        self,
        uow: AsyncUnitOfWork,
        stage: StageModel,
    ):
        if stage.order_number == 1:
            participants = await self.stage_service.get_participants_for_next_round(uow, stage, None)
            return 2 ** (int(math.log2(len(participants))) + 1)
        else:
            previous_stage = await uow.stages_repo.get_full_tournament_stage(
                StageModel.tournament_id == stage.tournament_id,
                StageModel.order_number == stage.order_number - 1,
            )
            if previous_stage.stage_type == TournamentStageTypes.WILDCARD:
                pre_previous_stage = await uow.stages_repo.get_full_tournament_stage(
                    StageModel.tournament_id == stage.tournament_id,
                    StageModel.order_number == stage.order_number - 2,
                )
                participants = await self.stage_service.get_participants_for_next_round(
                    uow=uow,
                    stage=previous_stage,
                    previous_stage=pre_previous_stage,
                )
            else:
                participants = await self.stage_service.get_participants_for_next_round(
                    uow=uow,
                    stage=stage,
                    previous_stage=previous_stage,
                )
            return 2 ** int(math.log2(len(participants)))
