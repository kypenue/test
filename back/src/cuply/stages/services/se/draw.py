import random
from typing import Optional, List
from uuid import UUID

from backlib.repo_helpers import raise_not_found_if_none
from cuply.accounts.schemas import AccountReadSchema
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.matches.models import MatchStatus
from cuply.series.models import (
    SeriesStatus,
    SeriesModel,
    SESeriesModel,
)
from cuply.stages.exceptions.de import DERoundCannotBeDrawnException
from cuply.stages.models import (
    StageParticipantModel,
    SingleEliminationStageModel,
    SingleEliminationStageRoundModel,
    SingleEliminationStageRoundStatuses,
)
from cuply.stages.services.se.stage import SEStageService
from cuply.tournaments.models import (
    TournamentModel,
)
from cuply.tournaments.services.permissions import TournamentPermissionService
from cuply.tournaments.services.tournaments import get_participant_id


class SEDrawService:
    """ Service to manage drawing in swiss tournaments. """
    se_stage_service: SEStageService

    def __init__(self):
        self.se_stage_service = SEStageService()
        self.permission_service = TournamentPermissionService()

    async def _get_already_drawn_accounts(
        self,
        se_round: SingleEliminationStageRoundModel,
    ) -> List[Optional[int]]:
        """ Get accounts that are already drawn. """
        drawn_accounts = []

        for se_series in se_round.series:
            if se_series.series.status not in [SeriesStatus.NOT_ASSIGNED]:
                drawn_accounts.append(se_series.series.gamer1_id)
                drawn_accounts.append(se_series.series.gamer2_id)

        return drawn_accounts

    async def _get_round_accounts(
        self,
        uow: AsyncUnitOfWork,
        tournament: TournamentModel,
        se_stage: SingleEliminationStageModel,
        se_round: SingleEliminationStageRoundModel,
    ) -> List[int]:
        """ Get accounts that should be drawn. """
        stage_participants = await uow.stage_participant.get_full_participant(
            StageParticipantModel.stage_id == se_stage.stage_id
        )

        accounts_to_draw = []
        for stage_participant in stage_participants:
            accounts_to_draw.append(stage_participant.account_id)

        return accounts_to_draw

    async def _get_accounts_to_draw(
        self,
        uow: AsyncUnitOfWork,
        tournament: TournamentModel,
        se_stage: SingleEliminationStageModel,
        se_round: SingleEliminationStageRoundModel,
    ) -> (List[int], List[Optional[int]]):
        drawn_account_ids = await self._get_already_drawn_accounts(se_round)
        current_round_account_ids = await self._get_round_accounts(uow, tournament, se_stage, se_round)

        account_ids_to_draw = (
            list(set(current_round_account_ids) - set(drawn_account_ids))
        )

        return account_ids_to_draw, drawn_account_ids

    async def get_accounts_to_draw(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        se_stage_id: UUID,
        round_id: UUID,
        is_assigned: bool,
        user: UserModel,
    ):
        """ Get participant to draw. """
        tournament, se_stage, se_round = await self._get_entities_and_check_if_round_can_be_drawn(
            uow=uow,
            tournament_id=tournament_id,
            stage_id=stage_id,
            se_stage_id=se_stage_id,
            round_id=round_id,
            user=user,
            check_can_be_drawn=False,
        )

        participants_data = await self.se_stage_service.get_participants_data(uow, se_stage)

        account_ids_to_draw, drawn_account_ids = await self._get_accounts_to_draw(
            uow=uow,
            tournament=tournament,
            se_stage=se_stage,
            se_round=se_round,
        )

        if is_assigned:
            account_ids = drawn_account_ids
        else:
            account_ids = account_ids_to_draw

        result = []
        for account_id in account_ids:
            if account_id:
                result.append(
                    AccountReadSchema.model_validate(
                        participants_data[account_id],
                    ),
                )

        return result

    def _check_can_round_be_drawn(self, se_round: SingleEliminationStageRoundModel):
        if se_round.status not in [
            SingleEliminationStageRoundStatuses.WAITING_FOR_DRAW,
            SingleEliminationStageRoundStatuses.DRAW_STARTED,
        ]:
            raise DERoundCannotBeDrawnException()

    async def _get_entities_and_check_if_round_can_be_drawn(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        se_stage_id: UUID,
        round_id: UUID,
        user: UserModel,
        check_draw_permission: bool = True,
        check_can_be_drawn: bool = True,
    ) -> (TournamentModel, SingleEliminationStageModel, SingleEliminationStageRoundModel):
        tournament = await self.se_stage_service.get_tournament_or_raise_404(uow, tournament_id)
        if check_draw_permission:
            await self.permission_service.check_draw_round(uow, user, tournament=tournament)

        se_stage = await uow.se_stage.get_full_stage(
            SingleEliminationStageModel.id == se_stage_id,
        )
        raise_not_found_if_none(se_stage, se_stage_id)

        se_round = await self.se_stage_service.get_se_round_or_raise_404(
            se_stage=se_stage,
            round_id=round_id,
        )
        if check_can_be_drawn:
            self._check_can_round_be_drawn(se_round)

        return tournament, se_stage, se_round

    async def _get_free_series(
        self,
        tournament: TournamentModel,
        se_stage: SingleEliminationStageModel,
        se_round: SingleEliminationStageRoundModel,
    ) -> List[SESeriesModel]:
        result = []
        for se_series in se_round.series:
            series: SeriesModel = se_series.series
            if not series.gamer1_id and not series.gamer2_id:
                result.append(se_series)
        return result

    async def draw_one(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        se_stage_id: UUID,
        round_id: UUID,
        user: UserModel,
    ) -> dict | None:
        """ Draw one series in single elimination stage. """
        tournament, se_stage, se_round = await self._get_entities_and_check_if_round_can_be_drawn(
            uow=uow,
            tournament_id=tournament_id,
            stage_id=stage_id,
            se_stage_id=se_stage_id,
            round_id=round_id,
            user=user,
        )

        participants_data = await self.se_stage_service.get_participants_data(uow, se_stage)

        account_ids_to_draw, drawn_accounts = await self._get_accounts_to_draw(
            uow=uow,
            tournament=tournament,
            se_stage=se_stage,
            se_round=se_round,
        )

        available_series = await self._get_free_series(tournament, se_stage, se_round)
        se_series = random.choice(available_series)

        gamer1_id = random.choice(account_ids_to_draw)
        gamer1 = participants_data[gamer1_id]

        gamer2_candidates = account_ids_to_draw.copy()
        gamer2_candidates.remove(gamer1_id)

        if len(available_series) == len(account_ids_to_draw):
            gamer2_id = None
        else:
            gamer2_candidates.extend((len(available_series) * 2 - 1 - len(gamer2_candidates)) * [None])
            gamer2_id = random.choice(gamer2_candidates)

        gamer2 = participants_data[gamer2_id] if gamer2_id else None

        available_series.remove(se_series)

        participant1_id = await get_participant_id(uow, tournament_id, gamer1_id)
        participant2_id = await get_participant_id(uow, tournament_id, gamer2_id)

        series_id = await uow.series.edit_one(se_series.series_id, data={
            'gamer1_id': gamer1.id,
            'gamer2_id': gamer2.id if gamer2 else None,
            'participant1_id': participant1_id,
            'participant2_id': participant2_id,
            'stage_id': stage_id,
            'tournament_id': tournament_id,
            'status': SeriesStatus.PLAYING if gamer2 else SeriesStatus.WALK_OVER,
        })
        if gamer2:
            for match_id in range(se_stage.game_number):
                if match_id % 2 == 0:
                    home_player_id, guest_player_id = gamer1.id, gamer2.id
                    home_participant_id, guest_participant_id = participant1_id, participant2_id
                else:
                    home_player_id, guest_player_id = gamer2.id, gamer1.id
                    home_participant_id, guest_participant_id = participant2_id, participant1_id
                await uow.match_repo.add_one({
                    'match_number': match_id + 1,
                    'tournament_id': tournament_id,
                    'stage_id': stage_id,
                    'status': MatchStatus.INITIAL_ACTIVE,
                    'series_id': series_id,
                    'home_player_id': home_player_id,
                    'guest_player_id': guest_player_id,
                    'home_participant_id': home_participant_id,
                    'guest_participant_id': guest_participant_id,
                })

        if len(available_series) == 0:
            await uow.se_rounds.edit_one(round_id, {
                'status': SingleEliminationStageRoundStatuses.WAITING_FOR_START,
            })
        elif se_round.status == SingleEliminationStageRoundStatuses.WAITING_FOR_DRAW:
            await uow.swiss_round_repo.edit_one(round_id, {
                'status': SingleEliminationStageRoundStatuses.DRAW_STARTED,
            })

        await uow.commit()

        return {
            'gamer1': AccountReadSchema.model_validate(gamer1) if gamer1 else None,
            'gamer2': AccountReadSchema.model_validate(gamer2) if gamer2 else None,
        }

    async def draw_all(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        se_stage_id: UUID,
        round_id: UUID,
        user: UserModel,
    ):
        """ Draw all series in single elimination stage. """
        tournament, se_stage, se_round = await self._get_entities_and_check_if_round_can_be_drawn(
            uow=uow,
            tournament_id=tournament_id,
            stage_id=stage_id,
            se_stage_id=se_stage_id,
            round_id=round_id,
            user=user,
        )

        participants_data = await self.se_stage_service.get_participants_data(uow, se_stage)

        account_ids_to_draw, drawn_accounts = await self._get_accounts_to_draw(
            uow=uow,
            tournament=tournament,
            se_stage=se_stage,
            se_round=se_round,
        )

        available_series = await self._get_free_series(tournament, se_stage, se_round)

        new_drawn_accounts = []

        series_to_edit_data, matches_to_add_data = [], []

        while len(available_series) > 0:
            se_series = random.choice(available_series)

            gamer1_id = random.choice(account_ids_to_draw)
            gamer1 = participants_data[gamer1_id]

            gamer2_candidates = account_ids_to_draw.copy()
            gamer2_candidates.remove(gamer1_id)

            if len(available_series) == len(account_ids_to_draw):
                gamer2_id = None
            else:
                gamer2_candidates.extend((len(available_series) * 2 - 1 - len(gamer2_candidates)) * [None])
                gamer2_id = random.choice(gamer2_candidates)

            gamer2 = participants_data[gamer2_id] if gamer2_id else None

            available_series.remove(se_series)

            account_ids_to_draw.remove(gamer1_id)
            if gamer2_id:
                account_ids_to_draw.remove(gamer2_id)

            participant1_id = await get_participant_id(uow, tournament_id, gamer1_id)
            participant2_id = await get_participant_id(uow, tournament_id, gamer2_id)

            series_to_edit_data.append({
                'id': se_series.series_id,
                'gamer1_id': gamer1.id,
                'gamer2_id': gamer2.id if gamer2 else None,
                'participant1_id': participant1_id,
                'participant2_id': participant2_id,
                'stage_id': stage_id,
                'tournament_id': tournament_id,
                'status': SeriesStatus.PLAYING if gamer2 else SeriesStatus.WALK_OVER,
            })
            if gamer2:
                for match_id in range(se_stage.game_number):
                    if match_id % 2 == 0:
                        home_player_id, guest_player_id = gamer1.id, gamer2.id
                        home_participant_id, guest_participant_id = participant1_id, participant2_id
                    else:
                        home_player_id, guest_player_id = gamer2.id, gamer1.id
                        home_participant_id, guest_participant_id = participant2_id, participant1_id
                    matches_to_add_data.append({
                        'match_number': match_id + 1,
                        'tournament_id': tournament_id,
                        'stage_id': stage_id,
                        'status': MatchStatus.INITIAL_ACTIVE,
                        'series_id': se_series.series_id,
                        'home_player_id': home_player_id,
                        'guest_player_id': guest_player_id,
                        'home_participant_id': home_participant_id,
                        'guest_participant_id': guest_participant_id,
                    })

            new_drawn_accounts.append((gamer1, gamer2))

        if series_to_edit_data:
            await uow.series.edit_bulk(series_to_edit_data)
        if matches_to_add_data:
            await uow.match_repo.add_bulk(matches_to_add_data)

        await uow.se_rounds.edit_one(round_id, {
            'status': SingleEliminationStageRoundStatuses.WAITING_FOR_START,
        })

        await uow.commit()

        return [{
            'gamer1': AccountReadSchema.model_validate(accounts[0]) if accounts[0] else None,
            'gamer2': AccountReadSchema.model_validate(accounts[1]) if accounts[1] else None,
        } for accounts in new_drawn_accounts]
