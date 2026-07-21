import math
import random
from uuid import UUID

from backlib.repo_helpers import raise_not_found_if_none
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.matches.models import MatchStatus
from cuply.series.models import (
    SeriesStatus,
    DESeriesModel,
    SeriesModel,
    DESeriesBranchType,
)
from cuply.series.services.forecast_competition import ForecastCompetitionBetService
from cuply.stages.exceptions.de import (
    DERoundCannotBeStartedException,
    NotAllSeriesPlayedDEException,
    DERoundCannotBeEndedException,
)
from cuply.stages.models import (
    DoubleEliminationStageRoundModel,
    DoubleEliminationStageModel,
    StageParticipantModel,
    DoubleEliminationStageRoundStatuses,
    TournamentStageStatus,
    StageParticipantStatus,
)
from cuply.stages.schemas.de import DoubleEliminationStageRoundFullReadSchema
from cuply.stages.services.stages import AbstractRoundService
from cuply.tournaments.services.tournaments import get_participant_id


class DERoundService(AbstractRoundService):
    """ Service to manage double elimination rounds. """
    async def get_round(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        de_stage_id: UUID,
        round_id: UUID,
        new_first: bool,
        user: UserModel,
    ):
        de_round = await uow.de_rounds.get_full_round(
            DoubleEliminationStageRoundModel.id == round_id,
        )
        raise_not_found_if_none(de_round, round_id)
        if not new_first:
            de_round.series = [s for s in de_round.series if s.series.status != SeriesStatus.NOT_ASSIGNED]
        else:
            de_round.series = sorted(
                [s for s in de_round.series if s.series.status != SeriesStatus.NOT_ASSIGNED],
                key=lambda s: s.series.updated_at if s.series else None,
                reverse=True,
            )

        return DoubleEliminationStageRoundFullReadSchema.model_validate(de_round)

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

    async def _create_final_matches(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        matches_number: int,
        use_advanced: bool,
        series_id,
        gamer1_id,
        gamer2_id,
    ):
        participant1_id = await get_participant_id(uow, tournament_id, gamer1_id)
        participant2_id = await get_participant_id(uow, tournament_id, gamer2_id)

        if use_advanced:
            await uow.match_repo.add_one(
                data={
                    "match_number": 1,
                    'tournament_id': tournament_id,
                    'stage_id': stage_id,
                    "series_id": series_id,
                    "home_player_id": gamer1_id,
                    "guest_player_id": gamer2_id,
                    "home_participant_id": participant1_id,
                    "guest_participant_id": participant2_id,
                    "status": MatchStatus.ADVANTAGE,
                },
            )
            matches_number -= 1

        for i in range(matches_number):
            if i % 2 == 0:
                home_player_id, guest_player_id = gamer1_id, gamer2_id
                home_participant_id, guest_participant_id = participant1_id, participant2_id
            else:
                home_player_id, guest_player_id = gamer2_id, gamer1_id
                home_participant_id, guest_participant_id = participant2_id, participant1_id
            await uow.match_repo.add_one(
                data={
                    "match_number": i + 1 if not use_advanced else i + 2,
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
        all_de_series,
        current_de_series,
    ) -> dict[str, DESeriesModel]:
        previous_series = {}

        for de_series_id in all_de_series:
            de_series: DESeriesModel = all_de_series[de_series_id]
            if de_series.next_loser_id in current_de_series:
                previous_series[de_series_id] = de_series
            if de_series.next_winner_id in current_de_series:
                previous_series[de_series_id] = de_series

        return previous_series

    async def start_round(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        de_stage_id: UUID,
        round_id: UUID,
        user: UserModel,
        *args, **kwargs,
    ):
        tournament = await self._get_tournament_or_raise_404(uow, tournament_id)

        await self.permission_service.check_start_round(uow, user, tournament=tournament)

        de_stage: DoubleEliminationStageModel = await uow.de_stage.get_full_stage(
            DoubleEliminationStageModel.id == de_stage_id,
        )

        current_de_round = None
        for de_round in de_stage.rounds:
            if de_round.id == round_id:
                current_de_round = de_round
                break
        raise_not_found_if_none(current_de_round, round_id)

        if current_de_round.status != DoubleEliminationStageRoundStatuses.WAITING_FOR_START:
            raise DERoundCannotBeStartedException()

        all_series_set = True
        for de_series in current_de_round.series:
            series = de_series.series
            if series.status not in [SeriesStatus.PLAYING, SeriesStatus.WALK_OVER]:
                all_series_set = False
                break
        if all_series_set:
            await uow.de_rounds.edit_one(round_id, {
                'status': DoubleEliminationStageRoundStatuses.ROUND_STARTED,
            })
            await uow.commit()
            return

        if current_de_round.round_number == 1:
            de_series = [de_series.series for de_series in current_de_round.series]

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
                    current_series = de_series[i // 2]
                    await self._set_gamers(
                        uow=uow,
                        tournament_id=tournament.id,
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
                            stage_id=de_stage.stage_id,
                            matches_number=de_stage.game_number,
                            series_id=current_series.id,
                            gamer1_id=gamer1.id,
                            gamer2_id=gamer2.id,
                        )
        else:
            final_round_number = None
            all_de_series, current_de_series = {}, {}
            gamer_passed_matches, gamer_home_matches, gamer_guest_matches = {}, {}, {}
            for de_round in de_stage.rounds:
                if final_round_number is None or de_round.round_number > final_round_number:
                    final_round_number = de_round.round_number
                for de_series in de_round.series:
                    all_de_series[de_series.id] = de_series
                    if de_round.id == current_de_round.id:
                        current_de_series[de_series.id] = de_series

                    series: SeriesModel = de_series.series
                    if series.gamer1_id is not None and series.gamer2_id is None:
                        gamer_passed_matches[series.gamer1_id] = gamer_passed_matches.setdefault(series.gamer1_id, 0) + 1
                    elif series.gamer1_id and series.gamer2_id and series.gamer1_score and series.gamer2_score:
                        matches_number = series.gamer1_score + series.gamer2_score

                        home_matches_count = math.ceil(matches_number / 2)
                        guest_matches_count = matches_number - home_matches_count

                        gamer_home_matches[series.gamer1_id] = gamer_home_matches.setdefault(series.gamer1_id, 0) + home_matches_count
                        gamer_guest_matches[series.gamer2_id] = gamer_guest_matches.setdefault(series.gamer2_id, 0) + guest_matches_count

            previous_series = await self._get_previous_series(all_de_series, current_de_series)
            pre_previous_series = await self._get_previous_series(all_de_series, previous_series)

            for de_series_id, de_series in pre_previous_series.items():
                series: SeriesModel = de_series.series
                if series.status not in [SeriesStatus.PLAYED, SeriesStatus.WALK_OVER]:
                    raise NotAllSeriesPlayedDEException()

            upper_bracket_gamers = set()

            next_round_gamers = {}
            for de_series_id, de_series in previous_series.items():
                series: SeriesModel = de_series.series
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

                for next_series_id, gamer_id in [
                    (de_series.next_winner_id, winner_id),
                    (de_series.next_loser_id, loser_id),
                ]:
                    if next_series_id not in current_de_series:
                        continue

                    next_round_gamers.setdefault(next_series_id, []).append(gamer_id)

                    if de_series.branch_type == DESeriesBranchType.WINNER:
                        upper_bracket_gamers.add(gamer_id)

            for de_series_id, gamers in next_round_gamers.items():
                de_series: DESeriesModel = current_de_series[de_series_id]
                series: SeriesModel = de_series.series
                if len(gamers) < 2 or (series.gamer1_id or series.gamer2_id):
                    continue

                gamer1_score, gamer2_score = 0, 0
                if current_de_round.round_number != final_round_number:
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
                else:
                    if gamers[0] in upper_bracket_gamers:
                        gamer1_id, gamer2_id = gamers[0], gamers[1]
                    else:
                        gamer1_id, gamer2_id = gamers[1], gamers[0]

                    if de_stage.winner_bracket_advantage:
                        gamer1_score = 1

                await self._set_gamers(
                    uow=uow,
                    tournament_id=tournament_id,
                    series_id=series.id,
                    gamer1_id=gamer1_id,
                    gamer2_id=gamer2_id,
                    gamer1_score=gamer1_score,
                    gamer2_score=gamer2_score,
                )

                if current_de_round.round_number != final_round_number:
                    if series.status != SeriesStatus.WALK_OVER:
                        await self._create_matches(
                            uow=uow,
                            tournament_id=tournament.id,
                            stage_id=de_stage.stage_id,
                            matches_number=de_stage.game_number,
                            series_id=series.id,
                            gamer1_id=gamer1_id,
                            gamer2_id=gamer2_id,
                        )
                else:
                    await self._create_final_matches(
                        uow=uow,
                        tournament_id=tournament.id,
                        stage_id=de_stage.stage_id,
                        matches_number=de_stage.final_game_number,
                        use_advanced=de_stage.winner_bracket_advantage,
                        series_id=series.id,
                        gamer1_id=gamer1_id,
                        gamer2_id=gamer2_id,
                    )

        await uow.de_rounds.edit_one(round_id, {
            'status': DoubleEliminationStageRoundStatuses.ROUND_STARTED,
        })

        await uow.commit()

    async def end_round(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        de_stage_id: UUID,
        round_id: UUID,
        user: UserModel,
    ):
        tournament = await self._get_tournament_or_raise_404(uow, tournament_id)

        await self.permission_service.check_end_round(uow, user, tournament=tournament)

        de_round: DoubleEliminationStageRoundModel = await uow.de_rounds.get_full_round(
            DoubleEliminationStageRoundModel.id == round_id,
        )
        raise_not_found_if_none(de_round, round_id)

        if de_round.status != DoubleEliminationStageRoundStatuses.ROUND_STARTED:
            raise DERoundCannotBeEndedException()

        all_series = []
        for de_series in de_round.series:
            if de_series.series.status not in [SeriesStatus.PLAYED, SeriesStatus.WALK_OVER]:
                raise NotAllSeriesPlayedDEException()
            all_series.append(de_series.series)

        forecast_bets_service = ForecastCompetitionBetService()
        await forecast_bets_service.set_bet_points_to_series(uow, all_series)

        await uow.de_rounds.edit_one(round_id, {
            'status': DoubleEliminationStageRoundStatuses.ROUND_ENDED,
        })

        next_round: DoubleEliminationStageRoundModel = await uow.de_rounds.find_one(
            de_stage_id=de_round.de_stage_id,
            round_number=de_round.round_number + 1,
        )
        if next_round:
            await uow.de_rounds.edit_one(next_round.id, {
                'status': DoubleEliminationStageRoundStatuses.WAITING_FOR_START,
            })
        else:
            await uow.stages_repo.edit_one(stage_id, {
                'status': TournamentStageStatus.STAGE_ENDED,
            })

        await self._set_participants_statuses(uow, stage_id, de_round)

        await uow.commit()

    async def _set_participants_statuses(
        self,
        uow: AsyncUnitOfWork,
        stage_id: UUID,
        de_round: DoubleEliminationStageRoundModel,
    ):
        """ Update participants statuses in StageParticipantModel for the current stage. """
        # get all participants for the current stage.
        stage_participants = await uow.stage_participant.find_all(stage_id=stage_id)
        stage_participants_dict = {
            participant.account_id: participant for participant in stage_participants
        }

        for de_series in de_round.series:
            series: SeriesModel = de_series.series

            # if the series in loser branch, we have to eliminate loser from the stage.
            if de_series.branch_type == DESeriesBranchType.LOSER:
                loser_id = series.gamer2_id if series.gamer1_score > series.gamer2_score else series.gamer1_id
                if loser_id is None:
                    continue
                stage_participant = stage_participants_dict[loser_id]
                await uow.stage_participant.edit_one(stage_participant.id, {
                    'status': StageParticipantStatus.LOSER,
                })
            # if the series is last (has no links to next ones), we have to make user winner in the stage.
            if (
                de_series.branch_type == DESeriesBranchType.WINNER
                and de_series.next_winner_id is None
                and de_series.next_loser_id is None
            ):
                winner_id = series.gamer1_id if series.gamer1_score > series.gamer2_score else series.gamer2_id
                if winner_id is None:
                    continue
                stage_participant = stage_participants_dict[winner_id]
                await uow.stage_participant.edit_one(stage_participant.id, {
                    'status': StageParticipantStatus.WINNER,
                })
