from uuid import UUID
from typing import List, Optional

import math
import pandas as pd

from backlib.repo_helpers import raise_not_found_if_none
from cuply.accounts.models import AccountModel
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.series.models import SeriesStatus, DESeriesBranchType
from cuply.stages.models import (
    StageModel, DoubleEliminationStageModel,
    StageParticipantStatus,
    DoubleEliminationStageRoundModel,
    StageParticipantModel,
    DoubleEliminationStageRoundStatuses,
    TournamentStageTypes,
)
from cuply.stages.services.stages import AbstractStageService
from cuply.teams.schemas.teams import TeamShortReadSchema
from cuply.tournaments.models import (
    TournamentModel, TournamentRegisteredUserModel,
)


class DEStageService(AbstractStageService):
    """ Service to manage double elimination stages. """
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

    async def get_de_stage_or_raise_404(
        self,
        tournament: TournamentModel,
        de_stage_id: UUID,
    ) -> DoubleEliminationStageModel:
        """ Get double elimination stage by id or raise 404 http exception. """
        for stage in tournament.stages:
            if stage.de_stage and stage.de_stage.id == de_stage_id:
                return stage.de_stage
        raise_not_found_if_none(None, de_stage_id)

    async def get_de_round_or_raise_404(
        self,
        de_stage: DoubleEliminationStageModel,
        round_id: UUID,
    ) -> DoubleEliminationStageRoundModel:
        """ Get double elimination round by id or raise 404 http exception. """
        for de_round in de_stage.rounds:
            if de_round.id == round_id:
                return de_round
        raise_not_found_if_none(None, round_id)

    async def get_participants_data(
        self,
        uow: AsyncUnitOfWork,
        de_stage: DoubleEliminationStageModel,
    ) -> dict[int, AccountModel]:
        participants = {}

        stage_participants = await uow.stage_participant.get_full_participant(
            StageParticipantModel.stage_id == de_stage.stage_id
        )
        for stage_participant in stage_participants:
            participants[stage_participant.account_id] = stage_participant.account

        return participants

    async def get_bracket(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        de_stage_id: UUID,
        user: UserModel,
        round_number__gte: Optional[int] = None,
    ):
        de_stage = await uow.de_stage.get_full_stage(DoubleEliminationStageModel.id == de_stage_id)

        stage_rating_data = {}
        stage_participants = await uow.stage_participant.get_full_participant(
            StageParticipantModel.stage_id == de_stage.stage_id,
        )
        for stage_participant in stage_participants:
            stage_rating_data[stage_participant.account_id] = stage_participant.order_number

        participants = await uow.registration_repo.get_full_participants(TournamentRegisteredUserModel.tournament_id == tournament_id)

        tournament_participants_data = {}
        for participant in participants:
            tournament_participants_data[participant.account_id] = participant

        gamer_data = {}

        upper_list, lower_list = [], []
        for de_round in de_stage.rounds:
            if round_number__gte and de_round.round_number < round_number__gte:
                continue

            for de_series in de_round.series:
                series = de_series.series

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
                    "id": de_series.series_id,
                    "name": de_series.short_id,
                    "next_loser_name": de_series.next_loser.short_id
                        if de_series.next_loser else None,
                    "next_winner_name": de_series.next_winner.short_id
                        if de_series.next_winner else None,
                    "nextMatchId": de_series.next_winner.series_id
                        if de_series.next_winner else None,
                    "nextLooserMatchId": de_series.next_loser.series_id
                        if de_series.next_loser else None,
                    "startTime": "",
                    "tournamentRoundText": None,
                    "href": None,
                    "state": state,
                    "participants": participants_data,
                    "series_id": series.id,
                }

                if de_series.branch_type == DESeriesBranchType.WINNER:
                    upper_list.append(series_data)
                else:
                    lower_list.append(series_data)

        return {
            "upper": upper_list,
            "lower": lower_list,
        }

    async def start_stage(
        self,
        uow: AsyncUnitOfWork,
        stage: StageModel,
        previous_stage: StageModel,
        participants: List[AccountModel],
        *args, **kwargs,
    ):
        """ Start double elimination stage in tournament. """
        de_stage = stage.de_stage

        de_series = self._compose_rounds(len(participants))

        first_round_status = (
            DoubleEliminationStageRoundStatuses.WAITING_FOR_DRAW
                if stage.order_number == 1 else DoubleEliminationStageRoundStatuses.WAITING_FOR_START
        )

        added_rounds = {}
        added_series = {}
        for index, row in de_series.iloc[::-1].iterrows():
            round_key = row['round']
            if round_key not in added_rounds:
                round_id = await uow.de_rounds.add_one({
                    'round_number': row['round'],
                    'de_stage_id': de_stage.id,
                    'status': first_round_status
                        if round_key == 1 else DoubleEliminationStageRoundStatuses.ROUND_NOT_STARTED,
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

                de_series_id = await uow.de_series.add_one({
                    'series_id': series_id,
                    'short_id': row['short_id'],
                    'round_id': round_id,
                    'next_winner_id': added_series[row['next_winner_id']]
                        if row['next_winner_id'] else None,
                    'next_loser_id': added_series[row['next_loser_id']]
                        if row['next_loser_id'] else None,
                    'branch_type': row['branch_type'],
                })
                added_series[series_key] = de_series_id

        for num, participant in enumerate(participants, start=1):
            await uow.stage_participant.add_one({
                'account_id': participant.id,
                'order_number': num,
                'status': StageParticipantStatus.PLAYING,
                'stage_id': stage.id,
            })

    def _compose_rounds(self, participant_number: int):
        """ Compose double elimination rounds and series. """
        de_series = pd.DataFrame(data={
            'short_id': [],
            'branch_type': [],
            'round_game': [],
            'next_winner_id': [],
            'next_loser_id': [],
            'round': [],
            'series_num': [],
        })

        # Определяем количество пар в первом раунде
        first_round_pairs_count = int(
            math.pow(2, math.ceil(math.log2(participant_number))) / 2
        )

        # заполняем массив количества игр в зависимости от раунда и сетки
        winner_pair_count, loser_pair_count = [], []
        for i in range(0, int(math.log2(first_round_pairs_count) * 2 + 1)):
            if i == 0:
                winner_pair_count.append(first_round_pairs_count)
                loser_pair_count.append(0)
            elif i == 1:
                winner_pair_count.append(int(winner_pair_count[0] / 2))
                loser_pair_count.append(winner_pair_count[i])
            elif i % 2 == 0:
                winner_pair_count.append(0)
                loser_pair_count.append(loser_pair_count[i - 1])
            elif i % 2 == 1:
                winner_pair_count.append(int(winner_pair_count[i - 2] / 2))
                loser_pair_count.append(winner_pair_count[i])

        series_num = 0

        total_round_count = len(winner_pair_count) + 1

        for round_num in range(0, len(winner_pair_count)):
            # Сетка победителей
            for i in range(0, winner_pair_count[round_num]):
                short_id = f'WB R{str(round_num + 1)} G{str(i + 1)}'
                branch_type = 'WINNER'
                round_game = i + 1
                next_winner_id = None
                next_loser_id = None
                round = round_num + 1
                series_num = series_num + 1
                de_series.loc[len(de_series)] = [
                    short_id,
                    branch_type,
                    round_game,
                    next_winner_id,
                    next_loser_id,
                    round,
                    series_num,
                ]

            # Сетка проигравших
            for i in range(0, loser_pair_count[round_num]):
                short_id = f'LB R{str(round_num + 1)} G{str(i + 1)}'
                branch_type = 'LOSER'
                round_game = i + 1
                next_winner_id = None
                next_loser_id = None
                round = round_num + 1
                series_num = series_num + 1
                de_series.loc[len(de_series)] = [
                    short_id,
                    branch_type,
                    round_game,
                    next_winner_id,
                    next_loser_id,
                    round,
                    series_num,
                ]

        # Суперфинал
        short_id = f'WB R{str(len(winner_pair_count) + 1)} G1'
        branch_type = 'WINNER'
        round_game = 1
        next_winner_id = None
        next_loser_id = None
        round = len(winner_pair_count) + 1
        series_num = series_num + 1
        de_series.loc[len(de_series)] = [
            short_id,
            branch_type,
            round_game,
            next_winner_id,
            next_loser_id,
            round,
            series_num,
        ]

        for index, row in de_series.iterrows():
            # Для первого раунда
            if row['round'] == 1:
                val_win = de_series.loc[(
                    (de_series['round_game'] == math.ceil(row['round_game'] / 2))
                     & (de_series['round'] == 2)
                     & (de_series['branch_type'] == 'WINNER')
                )]['short_id']
                val_lose = de_series.loc[(
                    (de_series['round_game'] == math.ceil(row['round_game'] / 2))
                     & (de_series['round'] == 2)
                     & (de_series['branch_type'] == 'LOSER')
                )]['short_id']
                de_series.at[index, 'next_winner_id'] = val_win.item()
                de_series.at[index, 'next_loser_id'] = val_lose.item()

            # Для остальных раундов
            # Ссылки по победителям
            if (row['round'] % 2 == 0) and (row['round'] < total_round_count) and (row['branch_type'] == 'WINNER'):
                val_win = de_series.loc[(
                    (de_series['round_game'] == math.ceil(row['round_game'] / 2))
                     & (de_series['round'] == row['round'] + 2)
                     & (de_series['branch_type'] == 'WINNER')
                )]['short_id']
                de_series.at[index, 'next_winner_id'] = val_win.item()

                # FORWARD
                if (row['round'] / 2) % 4 == 0:
                    val_lose = de_series.loc[(
                        (de_series['round_game'] == math.ceil(row['round_game']))
                         & (de_series['round'] == row['round'] + 1)
                         & (de_series['branch_type'] == 'LOSER')
                    )]['short_id']
                    de_series.at[index, 'next_loser_id'] = val_lose.item()

                # BACKWARD
                if (row['round'] / 2) % 4 == 1:
                    val_lose = de_series.loc[(
                        (de_series['round_game'] == winner_pair_count[row['round'] - 1] - math.ceil(row['round_game']) + 1)
                         & (de_series['round'] == row['round'] + 1)
                         & (de_series['branch_type'] == 'LOSER')
                    )]['short_id']
                    de_series.at[index, 'next_loser_id'] = val_lose.item()

                # REVERSE
                if (row['round'] / 2) % 4 == 2:
                    _winner_pair_count = winner_pair_count[row['round'] - 1]
                    current_game_index = math.ceil(row['round_game']) - 1
                    val_lose = de_series.loc[(
                        (de_series['round_game'] == (_winner_pair_count // 2 - current_game_index - 1) % _winner_pair_count + 1)
                         & (de_series['round'] == row['round'] + 1)
                         & (de_series['branch_type'] == 'LOSER')
                    )]['short_id']
                    de_series.at[index, 'next_loser_id'] = val_lose.item()

                # SWAP
                if (row['round'] / 2) % 4 == 3:
                    _winner_pair_count = winner_pair_count[row['round'] - 1]
                    current_game_index = math.ceil(row['round_game']) - 1
                    val_lose = de_series.loc[(
                        (de_series['round_game'] == (_winner_pair_count // 2 + current_game_index - 1) % _winner_pair_count + 1)
                         & (de_series['round'] == row['round'] + 1)
                         & (de_series['branch_type'] == 'LOSER')
                    )]['short_id']
                    de_series.at[index, 'next_loser_id'] = val_lose.item()

            # Ссылки по победителям в сетке лузеров для четных раундов
            if (row['round'] % 2 == 0) and (row['round'] < total_round_count) and (row['branch_type'] == 'LOSER'):
                val_win = de_series.loc[(
                    (de_series['round_game'] == math.ceil(row['round_game']))
                     & (de_series['round'] == row['round'] + 1)
                     & (de_series['branch_type'] == 'LOSER')
                )]['short_id']
                de_series.at[index, 'next_winner_id'] = val_win.item()
            if (row['round'] % 2 == 1) and (row['round'] < total_round_count - 1) and (row['branch_type'] == 'LOSER'):
                val_win = de_series.loc[(
                    (de_series['round_game'] == math.ceil(row['round_game'] / 2))
                     & (de_series['round'] == row['round'] + 1)
                     & (de_series['branch_type'] == 'LOSER')
                )]['short_id']
                de_series.at[index, 'next_winner_id'] = val_win.item()

            # Ссылки для суперфинала
            if row['round'] == total_round_count - 1:
                val_win = de_series.loc[(
                    (de_series['round_game'] == math.ceil(row['round_game']))
                     & (de_series['round'] == row['round'] + 1)
                     & (de_series['branch_type'] == 'WINNER')
                )]['short_id']
                de_series.at[index, 'next_winner_id'] = val_win.item()

        return de_series

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
