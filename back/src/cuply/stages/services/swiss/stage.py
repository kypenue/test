from uuid import UUID
from typing import List, Optional
from dataclasses import dataclass, field

import pandas as pd

from backlib.repo_helpers import raise_not_found_if_none
from cuply.accounts.models import AccountModel
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.matches.models import MatchResultModel
from cuply.series.models import SeriesStatus, SeriesModel
from cuply.stages.exceptions.stages import StageNotEndedException
from cuply.stages.models import (
    SwissStageModel,
    TournamentStageStatus,
    SwissStageRoundModel,
    StageModel,
    StageParticipantStatus,
    SwissStageRoundStatuses,
    StageParticipantModel,
)
from cuply.stages.exceptions.swiss import (
    MissingFieldsSwissStageException,
    SwissStageAlreadyStartedException,
)
from cuply.stages.schemas.swiss import (
    SwissStageUpdateSchema,
    SeriesReadWithResultStatusSchema,
)
from cuply.stages.services.stages import AbstractStageService
from cuply.teams.models import TeamModel
from cuply.tournaments.models import (
    TournamentModel,
)


@dataclass
class SwissStageParticipant:
    account: AccountModel

    wins: int = 0
    loses: int = 0

    win_matches: int = 0

    home_matches: int = 0
    guest_matches: int = 0

    matches_win_score: int = 0
    matches_lose_score: int = 0

    matches_number: int = 0

    series: set[SeriesReadWithResultStatusSchema] = field(default_factory=lambda: set())

    opponents: set[int] = field(default_factory=lambda: set())

    opponent_win_matches: int = 0
    opponent_matches_number: int = 0
    opponent_win_average: float = 0

    opponent_matches_win_score: int = 0
    opponent_matches_lose_score: int = 0
    opponent_goals_difference_average: float = 0.0

    team: TeamModel | None = None


class SwissStageService(AbstractStageService):
    """ Service to manage swiss stages. """
    def __init__(self):
        from cuply.tournaments.services.tournaments import TournamentPermissionService

        super().__init__()

        self.permission_service = TournamentPermissionService()

    async def get_end_participants(self, uow: AsyncUnitOfWork, stage: StageModel, *args, **kwargs):
        from cuply.stages.services.swiss.rating import SwissRatingService

        if stage.status != TournamentStageStatus.STAGE_ENDED:
            raise StageNotEndedException()

        swiss_stage: SwissStageModel = await uow.swiss_stage_repo.get_full_stage(
            SwissStageModel.id == stage.swiss_stage.id,
        )

        tournament = await uow.tournament_repo.find_one(id=stage.tournament_id)

        rating_service = SwissRatingService()
        participants_data = await self.get_participants_data(uow, tournament, swiss_stage)
        ordered_participants_ids = rating_service.get_from_participant_data(participants_data)

        result = []
        for account_id in ordered_participants_ids:
            participant = participants_data[account_id]
            if participant.wins == swiss_stage.wins_needed:
                result.append(participant.account)

        return result

    async def check_has_enough_data(
        self,
        uow: AsyncUnitOfWork,
        stage: StageModel,
        user: UserModel,
    ) -> Optional[bool]:
        """ Checks if the stage has enough data to be started. """
        if stage.swiss_stage and not (stage.swiss_stage.wins_needed and stage.swiss_stage.loses_needed):
            return False
        return True

    async def get_tournament_or_raise_404(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
    ) -> TournamentModel:
        """ Get tournament by id or raise 404 http exception. """
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)
        return tournament

    async def get_swiss_stage_or_raise_404(
        self,
        tournament: TournamentModel,
        swiss_stage_id: UUID,
    ) -> SwissStageModel:
        """ Get swiss stage by id or raise 404 http exception. """
        for stage in tournament.stages:
            if stage.swiss_stage and stage.swiss_stage.id == swiss_stage_id:
                return stage.swiss_stage
        raise_not_found_if_none(None, swiss_stage_id)

    async def get_swiss_round_or_raise_404(
        self,
        swiss_stage: SwissStageModel,
        round_id: UUID,
    ) -> SwissStageRoundModel:
        """ Get swiss round by id or raise 404 http exception. """
        for swiss_round in swiss_stage.rounds:
            if swiss_round.id == round_id:
                return swiss_round
        raise_not_found_if_none(None, round_id)

    async def start_stage(
        self,
        uow: AsyncUnitOfWork,
        stage: StageModel,
        previous_stage: StageModel,
        participants: List[AccountModel],
        *args, **kwargs,
    ):
        """ Start swiss stage in tournament. """
        swiss_stage = stage.swiss_stage

        if not swiss_stage.wins_needed or not swiss_stage.loses_needed:
            raise MissingFieldsSwissStageException()

        rounds = self._compose_rounds(len(participants), swiss_stage.wins_needed, swiss_stage.loses_needed)

        for round_num, round_data in enumerate(rounds, start=1):
            new_round_id = await uow.swiss_round_repo.add_one({
                'round_number': round_num,
                'swiss_stage_id': swiss_stage.id,
                'status': SwissStageRoundStatuses.WAITING_FOR_DRAW
                            if round_num == 1 else SwissStageRoundStatuses.ROUND_NOT_STARTED,
            })
            for _, series_group_data in round_data.iterrows():
                await uow.swiss_series_group_repo.add_one({
                    'round_id': new_round_id,
                    'wins_number': int(series_group_data['wins']),
                    'loses_number': int(series_group_data['loses']),
                    'participants_number': int(series_group_data['participants']),
                })

        for num, participant in enumerate(participants, start=1):
            await uow.stage_participant.add_one({
                'order_number': num,
                'status': StageParticipantStatus.PLAYING,
                'account_id': participant.id,
                'stage_id': stage.id,
            })

    def _compose_rounds(self, participant_number: int, wins_needed: int, loses_needed: int):
        """ Compose swiss rounds and series groups. """
        rounds = []

        max_matches = wins_needed + loses_needed - 1
        for i in range(max_matches):
            if i == 0:
                df = pd.DataFrame(data={
                    'wins': [0],
                    'loses': [0],
                    'participants': [participant_number],
                })
                rounds.append(df)
            else:
                previous_round = rounds[i - 1]

                current_df = pd.DataFrame(data={'wins': [], 'loses': [], 'participants': []})

                for row in previous_round.iterrows():
                    current_participant_number = row[1]['participants']
                    current_wins = row[1]['wins']
                    current_loses = row[1]['loses']
                    if current_wins < wins_needed and current_loses < loses_needed:
                        players_up = round(current_participant_number / 2)
                        players_down = int(current_participant_number / 2)
                        if players_up % 2 == 1 and players_down % 2 == 1 and players_up != 1 and players_down != 1:
                            players_up = players_up + 1
                            players_down = players_down - 1
                        new_df = pd.DataFrame(data={
                            'wins': [current_wins + 1, current_wins],
                            'loses': [current_loses, current_loses + 1],
                            'participants': [players_up, players_down],
                        })
                        current_df = pd.concat([current_df, new_df])

                current_df = current_df.groupby(['wins', 'loses']).agg(
                    {'participants': 'sum'}
                ).sort_values(by=['wins'], ascending=False).reset_index()
                current_df['cum_sum'] = current_df['participants'].cumsum()
                current_df['percentage'] = round(current_df['cum_sum'] / participant_number * 100, 2)
                rounds.append(current_df)

        return rounds

    async def update_stage(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        swiss_stage_id: UUID,
        schema: SwissStageUpdateSchema,
        user: UserModel,
    ):
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await self.permission_service.check_update_stage(uow, user, tournament=tournament)

        stage = await uow.stages_repo.find_one(id=stage_id)
        if stage.status != TournamentStageStatus.STAGE_NOT_STARTED:
            raise SwissStageAlreadyStartedException()

        await uow.swiss_stage_repo.edit_one(swiss_stage_id, schema.model_dump())
        await uow.commit()

    async def get_participants_data(
        self,
        uow: AsyncUnitOfWork,
        tournament: TournamentModel,
        swiss_stage: SwissStageModel,
    ) -> dict[int, SwissStageParticipant]:
        tournament_teams = await uow.team.get_full_teams(TeamModel.tournament_id == tournament.id)
        tournament_teams = {team.id: team for team in tournament_teams}

        tournament_participants = await uow.registration_repo.find_all(tournament_id=tournament.id)
        tournament_participants = {participant.account_id: participant for participant in tournament_participants}

        participants = {}

        stage_participants = await uow.stage_participant.get_full_participant(
            StageParticipantModel.stage_id == swiss_stage.stage_id
        )
        for stage_participant in stage_participants:
            tournament_participant = tournament_participants.get(stage_participant.account_id)
            participants[stage_participant.account_id] = SwissStageParticipant(
                account=stage_participant.account,
                team=tournament_teams.get(tournament_participant.team_id),
            )

        for swiss_round in swiss_stage.rounds:
            for swiss_group in swiss_round.series_groups:
                for swiss_series in swiss_group.series:
                    series: SeriesModel = swiss_series.series

                    if series.status not in [SeriesStatus.PLAYED, SeriesStatus.WALK_OVER]:
                        continue

                    if series.status != SeriesStatus.WALK_OVER:
                        participants[series.gamer1_id].opponents.add(series.gamer2_id)
                        participants[series.gamer2_id].opponents.add(series.gamer1_id)

                    if series.status == SeriesStatus.WALK_OVER:
                        participants[series.gamer1_id].wins += 1
                        participants[series.gamer1_id].series.add(
                            SeriesReadWithResultStatusSchema.model_validate(
                                series, context={"result_status": "WIN"},
                            )
                        )
                    else:
                        if series.gamer1_score > series.gamer2_score:
                            participants[series.gamer1_id].wins += 1
                            participants[series.gamer1_id].series.add(
                                SeriesReadWithResultStatusSchema.model_validate(
                                    series, context={"result_status": "WIN"},
                                )
                            )
                            participants[series.gamer2_id].loses += 1
                            participants[series.gamer2_id].series.add(
                                SeriesReadWithResultStatusSchema.model_validate(
                                    series, context={"result_status": "LOSE"},
                                )
                            )
                        else:
                            participants[series.gamer1_id].loses += 1
                            participants[series.gamer1_id].series.add(
                                SeriesReadWithResultStatusSchema.model_validate(
                                    series, context={"result_status": "LOSE"},
                                )
                            )
                            participants[series.gamer2_id].wins += 1
                            participants[series.gamer2_id].series.add(
                                SeriesReadWithResultStatusSchema.model_validate(
                                    series, context={"result_status": "WIN"},
                                )
                            )

                    for match in series.matches:
                        match_result: MatchResultModel = match.result
                        if not match_result:
                            continue

                        home_player, guest_player = match.home_player_id, match.guest_player_id

                        participants[home_player].home_matches += 1
                        participants[guest_player].guest_matches += 1

                        participants[home_player].matches_win_score += match_result.home_score
                        participants[home_player].matches_lose_score += match_result.guest_score
                        participants[guest_player].matches_win_score += match_result.guest_score
                        participants[guest_player].matches_lose_score += match_result.home_score

                        participants[home_player].matches_number += 1
                        participants[guest_player].matches_number += 1

                        if match_result.home_score > match_result.guest_score:
                            participants[home_player].win_matches += 1
                        else:
                            participants[guest_player].win_matches += 1

        for account_id in participants:
            for opponent_account_id in participants[account_id].opponents:
                opponent = participants[opponent_account_id]

                participants[account_id].opponent_win_matches += opponent.win_matches
                participants[account_id].opponent_matches_number += opponent.matches_number

                participants[account_id].opponent_matches_win_score += opponent.matches_win_score
                participants[account_id].opponent_matches_lose_score += opponent.matches_lose_score

            if participants[account_id].opponent_matches_number:
                opponent_matches_win_score = participants[account_id].opponent_matches_win_score
                opponent_matches_lose_score = participants[account_id].opponent_matches_lose_score
                opponent_matches_number = participants[account_id].opponent_matches_number

                participants[account_id].opponent_goals_difference_average = (
                    opponent_matches_win_score - opponent_matches_lose_score
                ) / opponent_matches_number

                participants[account_id].opponent_win_average = (
                    participants[account_id].opponent_win_matches / participants[account_id].opponent_matches_number
                )

            participants[account_id].series = sorted(
                list(participants[account_id].series), key=lambda s: s.created_at,
            )[-5:]

        return participants
