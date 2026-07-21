import math
import random
from uuid import UUID

from backlib.repo_helpers import raise_not_found_if_none
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.matches.models import MatchStatus
from cuply.series.models import SeriesStatus, SESeriesModel, SeriesModel
from cuply.series.services.forecast_competition import ForecastCompetitionBetService
from cuply.stages.exceptions.se import (
    SERoundCannotBeStartedException,
    NotAllSeriesPlayedSEException,
    SERoundCannotBeEndedException,
)
from cuply.stages.models import (
    StageParticipantModel,
    TournamentStageStatus,
    StageParticipantStatus,
    SingleEliminationStageRoundModel,
    SingleEliminationStageModel,
    SingleEliminationStageRoundStatuses,
)
from cuply.stages.schemas.se import SingleEliminationStageRoundFullReadSchema
from cuply.stages.services.stages import AbstractRoundService
from cuply.tournaments.services.tournaments import get_participant_id


class SERoundService(AbstractRoundService):
    """ Service to manage single elimination rounds. """
    async def get_round(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        se_stage_id: UUID,
        round_id: UUID,
        new_first: bool,
        user: UserModel,
    ):
        se_round = await uow.se_rounds.get_full_round(
            SingleEliminationStageRoundModel.id == round_id,
        )
        raise_not_found_if_none(se_round, round_id)
        if not new_first:
            se_round.series = [s for s in se_round.series if s.series.status != SeriesStatus.NOT_ASSIGNED]
        else:
            se_round.series = sorted(
                [s for s in se_round.series if s.series.status != SeriesStatus.NOT_ASSIGNED],
                key=lambda s: s.series.updated_at if s.series else None,
                reverse=True,
            )

        return SingleEliminationStageRoundFullReadSchema.model_validate(se_round)

    def _standard_seed(self, participants, result, n, k, i):
        if k == 0:
            result.append(participants[int(i) - 1])
        if k > 0:
            self._standard_seed(participants, result, n, k - 1, i)
            self._standard_seed(participants, result, n, k - 1, 2 ** (n - k + 1) - i + 1)

    async def _create_matches(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        matches_number: int,
        series_id,
        gamer1_id,
        gamer2_id,
    ):
        participant1_id = await get_participant_id(uow, tournament_id, gamer1_id)
        participant2_id = await get_participant_id(uow, tournament_id, gamer2_id)
        for i in range(matches_number):
            if i % 2 == 0:
                home_player_id, guest_player_id = gamer1_id, gamer2_id
                home_participant_id, guest_participant_id = participant1_id, participant2_id
            else:
                home_player_id, guest_player_id = gamer2_id, gamer1_id
                home_participant_id, guest_participant_id = participant2_id, participant1_id
            await uow.match_repo.add_one(
                data={
                    "match_number": i + 1,
                    'tournament_id': tournament_id,
                    'stage_id': stage_id,
                    "series_id": series_id,
                    "home_player_id": home_player_id,
                    "guest_player_id": guest_player_id,
                    "home_participant_id": home_participant_id,
                    "guest_participant_id": guest_participant_id,
                    "status": MatchStatus.INITIAL_ACTIVE,
                },
            )

    async def _set_gamers(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        series_id,
        gamer1_id,
        gamer2_id,
        gamer1_score: int,
        gamer2_score: int,
        status: SeriesStatus = None,
    ):
        if status is None:
            if gamer1_id and gamer2_id:
                status = SeriesStatus.PLAYING
            else:
                status = SeriesStatus.WALK_OVER
        participant1_id = await get_participant_id(uow, tournament_id, gamer1_id)
        participant2_id = await get_participant_id(uow, tournament_id, gamer2_id)
        await uow.series.edit_one(
            object_id=series_id,
            data={
                "gamer1_id": gamer1_id,
                "gamer2_id": gamer2_id,
                'participant1_id': participant1_id,
                'participant2_id': participant2_id,
                "gamer1_score": gamer1_score,
                "gamer2_score": gamer2_score,
                "status": status,
            },
        )

    async def _get_previous_series(
        self,
        all_se_series,
        current_se_series,
    ) -> dict[str, SESeriesModel]:
        previous_series = {}

        for se_series_id in all_se_series:
            se_series: SESeriesModel = all_se_series[se_series_id]
            if se_series.next_winner_id in current_se_series:
                previous_series[se_series_id] = se_series

        return previous_series

    async def start_round(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        se_stage_id: UUID,
        round_id: UUID,
        user: UserModel,
        *args, **kwargs,
    ):
        tournament = await self._get_tournament_or_raise_404(uow, tournament_id)

        await self.permission_service.check_start_round(uow, user, tournament=tournament)

        se_stage: SingleEliminationStageModel = await uow.se_stage.get_full_stage(
            SingleEliminationStageModel.id == se_stage_id,
        )

        current_se_round = None
        for se_round in se_stage.rounds:
            if se_round.id == round_id:
                current_se_round = se_round
                break
        raise_not_found_if_none(current_se_round, round_id)

        if current_se_round.status != SingleEliminationStageRoundStatuses.WAITING_FOR_START:
            raise SERoundCannotBeStartedException()

        all_series_set = True
        for se_series in current_se_round.series:
            series = se_series.series
            if series.status not in [SeriesStatus.PLAYING, SeriesStatus.WALK_OVER]:
                all_series_set = False
                break
        if all_series_set:
            await uow.se_rounds.edit_one(round_id, {
                'status': SingleEliminationStageRoundStatuses.ROUND_STARTED,
            })
            await uow.commit()
            return

        if current_se_round.round_number == 1:
            se_series = [se_series.series for se_series in current_se_round.series]

            participants = await uow.stage_participant.get_full_participant(
                StageParticipantModel.stage_id == stage_id,
            )
            accounts = [participant.account for participant in participants]
            new_accounts = []
            self._standard_seed(
                accounts,
                new_accounts,
                math.log(len(participants), 2),
                math.log(len(participants), 2),
                1,
            )
            for i in range(len(new_accounts)):
                if i % 2 == 1:
                    gamer1 = new_accounts[i - 1]
                    gamer2 = new_accounts[i]
                    current_series = se_series[i // 2]
                    await self._set_gamers(
                        uow=uow,
                        tournament_id=tournament_id,
                        series_id=current_series.id,
                        gamer1_id=gamer1.id,
                        gamer2_id=gamer2.id,
                        gamer1_score=0,
                        gamer2_score=0,
                    )
                    if current_series.status != SeriesStatus.WALK_OVER:
                        await self._create_matches(
                            uow=uow,
                            tournament_id=tournament.id,
                            stage_id=se_stage.stage_id,
                            matches_number=se_stage.game_number,
                            series_id=current_series.id,
                            gamer1_id=gamer1.id,
                            gamer2_id=gamer2.id,
                        )
        else:
            final_round_number = None
            all_se_series, current_se_series = {}, {}
            gamer_passed_matches, gamer_home_matches, gamer_guest_matches = {}, {}, {}
            for se_round in se_stage.rounds:
                if final_round_number is None or se_round.round_number > final_round_number:
                    final_round_number = se_round.round_number
                for se_series in se_round.series:
                    all_se_series[se_series.id] = se_series
                    if se_round.id == current_se_round.id:
                        current_se_series[se_series.id] = se_series

                    series: SeriesModel = se_series.series
                    if series.gamer1_id is not None and series.gamer2_id is None:
                        gamer_passed_matches[series.gamer1_id] = gamer_passed_matches.setdefault(series.gamer1_id, 0) + 1
                    elif series.gamer1_id and series.gamer2_id and series.gamer1_score and series.gamer2_score:
                        matches_number = series.gamer1_score + series.gamer2_score

                        home_matches_count = math.ceil(matches_number / 2)
                        guest_matches_count = matches_number - home_matches_count

                        gamer_home_matches[series.gamer1_id] = gamer_home_matches.setdefault(series.gamer1_id, 0) + home_matches_count
                        gamer_guest_matches[series.gamer2_id] = gamer_guest_matches.setdefault(series.gamer2_id, 0) + guest_matches_count

            previous_series = await self._get_previous_series(all_se_series, current_se_series)
            pre_previous_series = await self._get_previous_series(all_se_series, previous_series)

            for se_series_id, se_series in pre_previous_series.items():
                series: SeriesModel = se_series.series
                if series.status not in [SeriesStatus.PLAYED, SeriesStatus.WALK_OVER]:
                    raise NotAllSeriesPlayedSEException()

            upper_bracket_gamers = set()

            next_round_gamers = {}
            for se_series_id, se_series in previous_series.items():
                series: SeriesModel = se_series.series
                gamer1, gamer2 = series.gamer1, series.gamer2

                if any([
                    series.gamer1_score is None,
                    series.gamer2_score is None,
                    series.status not in [SeriesStatus.PLAYED, SeriesStatus.WALK_OVER],
                ]):
                    continue

                if series.status != SeriesStatus.WALK_OVER:
                    if series.gamer1_score > series.gamer2_score:
                        loser_id, winner_id = gamer2.id, gamer1.id
                    else:
                        loser_id, winner_id = gamer1.id, gamer2.id
                else:
                    if gamer1:
                        loser_id, winner_id = None, gamer1.id
                    elif gamer2:
                        loser_id, winner_id = None, gamer2.id
                    else:
                        loser_id, winner_id = None, None

                next_round_gamers.setdefault(se_series.next_winner_id, []).append(winner_id)
                upper_bracket_gamers.add(winner_id)

            for se_series_id, gamers in next_round_gamers.items():
                se_series: SESeriesModel = current_se_series[se_series_id]
                series: SeriesModel = se_series.series
                if len(gamers) < 2 or (series.gamer1_id or series.gamer2_id):
                    continue

                gamer1_score, gamer2_score = 0, 0
                gamer1_id, gamer2_id = gamers[0], gamers[1]

                gamer1_count = (
                    gamer_home_matches.get(gamer1_id, 0)
                    - gamer_guest_matches.get(gamer1_id, 0)
                    + gamer_passed_matches.get(gamer1_id, 0)
                )
                gamer2_count = (
                    gamer_home_matches.get(gamer2_id, 0)
                    - gamer_guest_matches.get(gamer2_id, 0)
                    + gamer_passed_matches.get(gamer2_id, 0)
                )

                if gamer1_count < gamer2_count:
                    ...
                elif gamer1_count > gamer2_count:
                    gamer1_id, gamer2_id = gamer2_id, gamer1_id
                else:
                    random.shuffle(gamers)
                    gamer1_id, gamer2_id = gamers[0], gamers[1]

                await self._set_gamers(
                    uow=uow,
                    tournament_id=tournament_id,
                    series_id=series.id,
                    gamer1_id=gamer1_id,
                    gamer2_id=gamer2_id,
                    gamer1_score=gamer1_score,
                    gamer2_score=gamer2_score,
                )

                if current_se_round.round_number != final_round_number:
                    if series.status != SeriesStatus.WALK_OVER:
                        await self._create_matches(
                            uow=uow,
                            tournament_id=tournament.id,
                            stage_id=se_stage.stage_id,
                            matches_number=se_stage.game_number,
                            series_id=series.id,
                            gamer1_id=gamer1_id,
                            gamer2_id=gamer2_id,
                        )
                else:
                    await self._create_matches(
                        uow=uow,
                        tournament_id=tournament.id,
                        stage_id=se_stage.stage_id,
                        matches_number=se_stage.final_game_number,
                        series_id=series.id,
                        gamer1_id=gamer1_id,
                        gamer2_id=gamer2_id,
                    )

        await uow.se_rounds.edit_one(round_id, {
            'status': SingleEliminationStageRoundStatuses.ROUND_STARTED,
        })

        await uow.commit()

    async def end_round(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        se_stage_id: UUID,
        round_id: UUID,
        user: UserModel,
    ):
        tournament = await self._get_tournament_or_raise_404(uow, tournament_id)

        await self.permission_service.check_end_round(uow, user, tournament=tournament)

        se_round: SingleEliminationStageRoundModel = await uow.se_rounds.get_full_round(
            SingleEliminationStageRoundModel.id == round_id,
        )
        raise_not_found_if_none(se_round, round_id)

        if se_round.status != SingleEliminationStageRoundStatuses.ROUND_STARTED:
            raise SERoundCannotBeEndedException()

        all_series = []
        for se_series in se_round.series:
            if se_series.series.status not in [SeriesStatus.PLAYED, SeriesStatus.WALK_OVER]:
                raise NotAllSeriesPlayedSEException()
            all_series.append(se_series.series)

        forecast_bets_service = ForecastCompetitionBetService()
        await forecast_bets_service.set_bet_points_to_series(uow, all_series)

        await uow.se_rounds.edit_one(round_id, {
            'status': SingleEliminationStageRoundStatuses.ROUND_ENDED,
        })

        next_round: SingleEliminationStageRoundModel = await uow.se_rounds.find_one(
            se_stage_id=se_round.se_stage_id,
            round_number=se_round.round_number + 1,
        )
        if next_round:
            await uow.se_rounds.edit_one(next_round.id, {
                'status': SingleEliminationStageRoundStatuses.WAITING_FOR_START,
            })
        else:
            await uow.stages_repo.edit_one(stage_id, {
                'status': TournamentStageStatus.STAGE_ENDED,
            })

        await self._set_participants_statuses(uow, stage_id, se_round)

        await uow.commit()

    async def _set_participants_statuses(
        self,
        uow: AsyncUnitOfWork,
        stage_id: UUID,
        se_round: SingleEliminationStageRoundModel,
    ):
        """ Update participants statuses in StageParticipantModel for the current stage. """
        stage_participants = await uow.stage_participant.find_all(stage_id=stage_id)
        stage_participants_dict = {
            participant.account_id: participant for participant in stage_participants
        }

        for se_series in se_round.series:
            series: SeriesModel = se_series.series

            if series.status == SeriesStatus.PLAYED:
                loser_id = series.gamer2_id if series.gamer1_score > series.gamer2_score else series.gamer1_id
                if loser_id is None:
                    continue
                stage_participant = stage_participants_dict[loser_id]
                await uow.stage_participant.edit_one(stage_participant.id, {
                    'status': StageParticipantStatus.LOSER,
                })

            if (
                series.status == SeriesStatus.PLAYED
                and se_series.next_winner_id is None
            ):
                winner_id = series.gamer1_id if series.gamer1_score > series.gamer2_score else series.gamer2_id
                if winner_id is None:
                    continue
                stage_participant = stage_participants_dict[winner_id]
                await uow.stage_participant.edit_one(stage_participant.id, {
                    'status': StageParticipantStatus.WINNER,
                })
