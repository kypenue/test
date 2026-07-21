import random
from typing import Iterable, Optional
from uuid import UUID

from backlib.repo_helpers import raise_not_found_if_none
from cuply.accounts.models import AccountModel
from cuply.accounts.schemas import AccountReadSchema
from cuply.auth.models import UserModel
from cuply.base.services.caching.cache import Cache
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.matches.models import MatchStatus
from cuply.series.models import (
    SeriesStatus,
)
from cuply.stages.exceptions.swiss import SwissRoundCannotBeDrawnException
from cuply.stages.models import (
    SwissStageModel,
    SwissStageRoundModel,
    SwissStageSeriesGroupModel,
    SwissStageRoundStatuses,
    StageParticipantModel,
)
from cuply.stages.services.swiss.rating import SwissRatingService
from cuply.stages.services.swiss.stage import (
    SwissStageService,
    SwissStageParticipant,
)
from cuply.teams.schemas.teams import TeamReadSchema
from cuply.tournaments.models import (
    TournamentModel,
)
from cuply.tournaments.services.permissions import TournamentPermissionService
from cuply.tournaments.services.tournaments import get_participant_id


class SwissDrawService:
    """ Service to manage drawing in swiss tournaments. """
    swiss_stage_service: SwissStageService

    def __init__(self):
        self.swiss_stage_service = SwissStageService()
        self.swiss_rating_service = SwissRatingService()
        self.permission_service = TournamentPermissionService()

    async def _get_already_drawn_accounts(
        self,
        swiss_round: SwissStageRoundModel,
    ) -> set[int]:
        """ Get accounts that are already drawn. """
        drawn_accounts = set()

        for swiss_series_group in swiss_round.series_groups:
            for swiss_series in swiss_series_group.series:
                if swiss_series.series.gamer1_id:
                    drawn_accounts.add(swiss_series.series.gamer1_id)
                if swiss_series.series.gamer2_id:
                    drawn_accounts.add(swiss_series.series.gamer2_id)

        return drawn_accounts

    async def _get_round_accounts(
        self,
        uow: AsyncUnitOfWork,
        tournament: TournamentModel,
        swiss_stage: SwissStageModel,
        swiss_round: SwissStageRoundModel,
    ) -> set[int]:
        """ Get accounts that should be drawn. """
        if swiss_round.round_number == 1:
            stage_participants = await uow.stage_participant.get_full_participant(
                StageParticipantModel.stage_id == swiss_stage.stage_id
            )
            accounts_to_draw = set()
            for stage_participant in stage_participants:
                accounts_to_draw.add(stage_participant.account.id)
        else:
            previous_round: SwissStageRoundModel | None = None
            for other_swiss_round in swiss_stage.rounds:
                if other_swiss_round.round_number == swiss_round.round_number - 1:
                    previous_round = other_swiss_round
                    break

            raise_not_found_if_none(previous_round, swiss_round.round_number - 1)

            accounts_to_draw = set()
            for series_group in previous_round.series_groups:
                for swiss_series in series_group.series:
                    series = swiss_series.series
                    if series.gamer1:
                        accounts_to_draw.add(series.gamer1.id)
                    if series.gamer2:
                        accounts_to_draw.add(series.gamer2.id)

        return accounts_to_draw

    async def get_accounts_to_draw(
        self,
        uow: AsyncUnitOfWork,
        tournament: TournamentModel,
        swiss_stage: SwissStageModel,
        swiss_round: SwissStageRoundModel,
        participants_data: dict[int, SwissStageParticipant],
    ):
        drawn_accounts = await self._get_already_drawn_accounts(swiss_round)
        current_round_accounts = await self._get_round_accounts(uow, tournament, swiss_stage, swiss_round)

        account_ids_to_draw = current_round_accounts - drawn_accounts

        account_to_delete = set()
        for account_id in account_ids_to_draw:
            wins_number = participants_data[account_id].wins
            loses_number = participants_data[account_id].loses
            if wins_number >= swiss_stage.wins_needed or loses_number >= swiss_stage.loses_needed:
                account_to_delete.add(account_id)

        return account_ids_to_draw - account_to_delete, drawn_accounts

    async def get_accounts_to_draw_by_series_groups(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        swiss_stage_id: UUID,
        round_id: UUID,
        user: UserModel,
    ):
        """ Get participant to draw. """
        tournament, swiss_stage, swiss_round = await self._get_entities_and_check_if_round_can_be_drawn(
            uow=uow,
            tournament_id=tournament_id,
            stage_id=stage_id,
            swiss_stage_id=swiss_stage_id,
            round_id=round_id,
            user=user,
            check_can_be_drawn=False,
        )

        participants_data = await self.swiss_stage_service.get_participants_data(uow, tournament, swiss_stage)

        current_round_accounts, _ = await self.get_accounts_to_draw(
            uow=uow,
            tournament=tournament,
            swiss_stage=swiss_stage,
            swiss_round=swiss_round,
            participants_data=participants_data,
        )

        result = []
        for swiss_group in swiss_round.series_groups:
            _, account_ids = self._get_accounts_for_series_group(
                account_ids=current_round_accounts,
                participants_data=participants_data,
                series_group=swiss_group,
            )

            accounts = []
            for account_id in account_ids:
                participant = participants_data[account_id]
                accounts.append({
                    'account': AccountReadSchema.model_validate(participants_data[account_id].account),
                    'team': TeamReadSchema.model_validate(participant.team) if participant.team else None,
                })

            result.append({
                'id': swiss_group.id,
                'wins_number': swiss_group.wins_number,
                'loses_number': swiss_group.loses_number,
                'participants': accounts,
            })

        result.sort(key=lambda x: x['wins_number'])

        return result

    def _get_min_series_group(
        self,
        swiss_round: SwissStageRoundModel,
        account_ids_to_draw: set[int],
        participants_data: dict[int, SwissStageParticipant],
    ):
        min_series_group: SwissStageSeriesGroupModel | None = None
        for series_group in swiss_round.series_groups:

            participants_number = 0
            for account_id in account_ids_to_draw:
                participant = participants_data[account_id]
                if participant.wins == series_group.wins_number and participant.loses == series_group.loses_number:
                    participants_number += 1

            if not min_series_group or series_group.wins_number < min_series_group.wins_number:
                if participants_number > 1:
                    min_series_group = series_group

        return min_series_group

    def _check_can_round_be_drawn(self, swiss_round: SwissStageRoundModel):
        if swiss_round.status not in [
            SwissStageRoundStatuses.WAITING_FOR_DRAW,
            SwissStageRoundStatuses.DRAW_STARTED,
        ]:
            raise SwissRoundCannotBeDrawnException()

    def _get_accounts_for_series_group(
        self,
        account_ids: Iterable,
        participants_data: dict[int, SwissStageParticipant],
        series_group: SwissStageSeriesGroupModel,
    ) -> (Optional[AccountModel], set[int]):
        advantage_account, strict_accounts = None, set()

        for account_id in account_ids:
            account_wins_number = participants_data[account_id].wins
            account_loses_number = participants_data[account_id].loses
            if (account_wins_number == series_group.wins_number - 1 and
                    account_loses_number == series_group.loses_number + 1):
                advantage_account = account_id
            if account_wins_number == series_group.wins_number and account_loses_number == series_group.loses_number:
                strict_accounts.add(account_id)

        return advantage_account, strict_accounts

    def _shuffle_accounts(
        self,
        account1_id: int, account2_id: int,
        participants_data: dict[int, SwissStageParticipant],
    ):
        account1_data, account2_data = participants_data[account1_id], participants_data[account2_id]

        if account1_data.home_matches > account2_data.home_matches:
            account1_id, account2_id = account2_id, account1_id
        elif account1_data.home_matches < account2_data.home_matches:
            ...
        else:
            account_ids = [account1_id, account2_id]
            random.shuffle(account_ids)
            account1_id, account2_id = account_ids[0], account_ids[1]

        return account1_id, account2_id

    def _get_played_together_account(
        self,
        account_ids: set[int],
        participants_data: dict[int, SwissStageParticipant],
    ) -> set[int]:
        played_together_ids: set[int] = set()

        for account_id in account_ids:
            opponents_ids = participants_data[account_id].opponents
            other_account_ids = account_ids - {account_id}
            if other_account_ids & opponents_ids:
                played_together_ids.add(account_id)

        return played_together_ids

    async def _get_entities_and_check_if_round_can_be_drawn(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        swiss_stage_id: UUID,
        round_id: UUID,
        user: UserModel,
        check_draw_permission: bool = True,
        check_can_be_drawn: bool = True,
    ) -> (TournamentModel, SwissStageModel, SwissStageRoundModel):
        tournament = await self.swiss_stage_service.get_tournament_or_raise_404(uow, tournament_id)
        if check_draw_permission:
            await self.permission_service.check_draw_round(uow, user, tournament=tournament)

        swiss_stage = await uow.swiss_stage_repo.get_full_stage(
            SwissStageModel.id == swiss_stage_id,
        )
        swiss_round = await self.swiss_stage_service.get_swiss_round_or_raise_404(
            swiss_stage=swiss_stage,
            round_id=round_id,
        )
        if check_can_be_drawn:
            self._check_can_round_be_drawn(swiss_round)

        return tournament, swiss_stage, swiss_round

    async def _clear_cache(self, stage_id: UUID):
        await Cache.delete(key=f"stages/{stage_id}/swiss-rating")

    def _get_last_participant(self, account_ids, participants_data):
        rating_accounts = self.swiss_rating_service.get_from_participant_data(participants_data)[::-1]
        for rating_account in rating_accounts:
            if participants_data[rating_account].account.id in account_ids:
                return participants_data[rating_account].account.id

    async def draw_one(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        swiss_stage_id: UUID,
        round_id: UUID,
        user: UserModel,
    ) -> dict | None:
        """ Draw one series in swiss series group. """
        tournament, swiss_stage, swiss_round = await self._get_entities_and_check_if_round_can_be_drawn(
            uow=uow,
            tournament_id=tournament_id,
            stage_id=stage_id,
            swiss_stage_id=swiss_stage_id,
            round_id=round_id,
            user=user,
        )

        participants_data = await self.swiss_stage_service.get_participants_data(uow, tournament, swiss_stage)

        account_ids_to_draw, drawn_accounts = await self.get_accounts_to_draw(
            uow=uow,
            tournament=tournament,
            swiss_stage=swiss_stage,
            swiss_round=swiss_round,
            participants_data=participants_data,
        )

        min_series_group = self._get_min_series_group(
            swiss_round=swiss_round,
            account_ids_to_draw=account_ids_to_draw,
            participants_data=participants_data,
        )

        advantage_account, appropriate_accounts = self._get_accounts_for_series_group(
            account_ids=account_ids_to_draw,
            participants_data=participants_data,
            series_group=min_series_group,
        )

        played_together = self._get_played_together_account(
            account_ids=appropriate_accounts,
            participants_data=participants_data,
        )

        if len(drawn_accounts) == 0 and len(account_ids_to_draw) % 2 == 1:
            account1_id, account2_id = self._get_last_participant(account_ids_to_draw, participants_data), None
            account1, account2 = participants_data[account1_id].account, None
            if account1_id in played_together:
                played_together.remove(account1_id)
            if account1_id in appropriate_accounts:
                appropriate_accounts.remove(account1_id)
        else:
            if not advantage_account:
                if played_together:
                    account1_id = random.choice(list(played_together))
                    played_together.remove(account1_id)
                    appropriate_accounts.remove(account1_id)
                else:
                    account1_id = random.choice(list(appropriate_accounts))
                    appropriate_accounts.remove(account1_id)
            else:
                account1_id = advantage_account

            account2_candidates = set(appropriate_accounts) - participants_data[account1_id].opponents
            if not account2_candidates:
                account2_candidates = appropriate_accounts

            account2_id = random.choice(list(account2_candidates))
            appropriate_accounts.remove(account2_id)
            if account2_id in played_together:
                played_together.remove(account2_id)

            account1_id, account2_id = self._shuffle_accounts(
                participants_data=participants_data,
                account1_id=account1_id,
                account2_id=account2_id,
            )
            account1 = participants_data[account1_id].account
            account2 = participants_data[account2_id].account


        participant1_id = await get_participant_id(uow, tournament_id, account1.id)
        participant2_id = await get_participant_id(uow, tournament_id, account2.id if account2 else None)

        series_id = await uow.series.add_one(data={
            'gamer1_id': account1.id,
            'gamer2_id': account2.id if account2 else None,
            'participant1_id': participant1_id,
            'participant2_id': participant2_id,
            'stage_id': stage_id,
            'tournament_id': tournament_id,
            'status': SeriesStatus.PLAYING if account2 else SeriesStatus.WALK_OVER,
        })
        await uow.swiss_series.add_one({
            'swiss_series_group_id': min_series_group.id,
            'series_id': series_id,
        })
        if account2:
            await uow.match_repo.add_one({
                'match_number': 1,
                'tournament_id': tournament_id,
                'stage_id': stage_id,
                'status': MatchStatus.INITIAL_ACTIVE,
                'series_id': series_id,
                'home_player_id': account1.id,
                'guest_player_id': account2.id,
                'home_participant_id': participant1_id,
                'guest_participant_id': participant2_id,
            })

        account_ids_to_draw.remove(account1_id)
        if account2_id:
            account_ids_to_draw.remove(account2_id)

        if len(account_ids_to_draw) == 0:
            await uow.swiss_round_repo.edit_one(round_id, {
                'status': SwissStageRoundStatuses.WAITING_FOR_START,
            })
        elif swiss_round.status == SwissStageRoundStatuses.WAITING_FOR_DRAW:
            await uow.swiss_round_repo.edit_one(round_id, {
                'status': SwissStageRoundStatuses.DRAW_STARTED,
            })

        await self._clear_cache(stage_id)

        await uow.commit()

        participant1, participant2 = participants_data.get(account1_id), participants_data.get(account2_id)

        return {
            'gamer1': {
                'account': AccountReadSchema.model_validate(participant1.account) if participant1 else None,
                'team': TeamReadSchema.model_validate(participant1.team) if participant1 and participant1.team else None,
            },
            'gamer2': {
                'account': AccountReadSchema.model_validate(participant2.account) if participant2 else None,
                'team': TeamReadSchema.model_validate(participant2.team) if participant2 and participant2.team else None,
            },
        }

    async def draw_all(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        swiss_stage_id: UUID,
        round_id: UUID,
        user: UserModel,
    ):
        """ Draw all series in swiss series group. """
        tournament, swiss_stage, swiss_round = await self._get_entities_and_check_if_round_can_be_drawn(
            uow=uow,
            tournament_id=tournament_id,
            stage_id=stage_id,
            swiss_stage_id=swiss_stage_id,
            round_id=round_id,
            user=user,
        )

        participants_data = await self.swiss_stage_service.get_participants_data(uow, tournament, swiss_stage)

        account_ids_to_draw, drawn_accounts = await self.get_accounts_to_draw(
            uow=uow,
            tournament=tournament,
            swiss_stage=swiss_stage,
            swiss_round=swiss_round,
            participants_data=participants_data,
        )

        min_series_group = self._get_min_series_group(
            swiss_round=swiss_round,
            account_ids_to_draw=account_ids_to_draw,
            participants_data=participants_data,
        )

        advantage_account, appropriate_accounts = self._get_accounts_for_series_group(
            account_ids=account_ids_to_draw,
            participants_data=participants_data,
            series_group=min_series_group,
        )

        played_together = self._get_played_together_account(
            account_ids=appropriate_accounts,
            participants_data=participants_data,
        )

        new_drawn_accounts = []

        series_to_add_data, swiss_series_to_add_data, matches_to_add_data = [], [], []

        while len(appropriate_accounts) >= 2:
            if len(drawn_accounts) == 0 and len(account_ids_to_draw) % 2 == 1:
                account1_id, account2_id = self._get_last_participant(account_ids_to_draw, participants_data), None
                account1, account2 = participants_data[account1_id].account, None
                if account1_id in played_together:
                    played_together.remove(account1_id)
                if account1_id in appropriate_accounts:
                    appropriate_accounts.remove(account1_id)
            else:
                if not advantage_account:
                    if played_together:
                        account1_id = random.choice(list(played_together))
                        played_together.remove(account1_id)
                        appropriate_accounts.remove(account1_id)
                    else:
                        account1_id = random.choice(list(appropriate_accounts))
                        appropriate_accounts.remove(account1_id)
                else:
                    account1_id = advantage_account
                    advantage_account = None

                account2_candidates = set(appropriate_accounts) - participants_data[account1_id].opponents
                if not account2_candidates:
                    account2_candidates = appropriate_accounts

                account2_id = random.choice(list(account2_candidates))
                appropriate_accounts.remove(account2_id)
                if account2_id in played_together:
                    played_together.remove(account2_id)

                account1_id, account2_id = self._shuffle_accounts(
                    participants_data=participants_data,
                    account1_id=account1_id,
                    account2_id=account2_id,
                )
                account1 = participants_data[account1_id].account
                account2 = participants_data[account2_id].account

            participant1_id = await get_participant_id(uow, tournament_id, account1.id)
            participant2_id = await get_participant_id(uow, tournament_id, account2.id if account2 else None)

            series_to_add_data.append({
                'gamer1_id': account1.id,
                'gamer2_id': account2.id if account2 else None,
                'participant1_id': participant1_id,
                'participant2_id': participant2_id,
                'stage_id': stage_id,
                'tournament_id': tournament_id,
                'status': SeriesStatus.PLAYING if account2 else SeriesStatus.WALK_OVER,
            })
            swiss_series_to_add_data.append({
                'swiss_series_group_id': min_series_group.id,
            })
            if account2:
                matches_to_add_data.append({
                    'tournament_id': tournament_id,
                    'stage_id': stage_id,
                    'status': MatchStatus.INITIAL_ACTIVE,
                    'home_player_id': account1.id,
                    'guest_player_id': account2.id,
                    'home_participant_id': participant1_id,
                    'guest_participant_id': participant2_id,
                })

            account_ids_to_draw.remove(account1_id)
            if account2_id:
                account_ids_to_draw.remove(account2_id)

            new_drawn_accounts.append((account1, account2))

        series_ids = await uow.series.add_bulk(series_to_add_data)

        match_index = 0
        for index, series_id in enumerate(series_ids):
            swiss_series_to_add_data[index]['series_id'] = series_id
            if series_to_add_data[index]['status'] == SeriesStatus.PLAYING:
                matches_to_add_data[match_index]['series_id'] = series_id
                match_index += 1

        await uow.swiss_series.add_bulk(swiss_series_to_add_data)
        await uow.match_repo.add_bulk(matches_to_add_data)

        if len(account_ids_to_draw) == 0:
            await uow.swiss_round_repo.edit_one(round_id, {
                'status': SwissStageRoundStatuses.WAITING_FOR_START,
            })
        elif swiss_round.status == SwissStageRoundStatuses.WAITING_FOR_DRAW:
            await uow.swiss_round_repo.edit_one(round_id, {
                'status': SwissStageRoundStatuses.DRAW_STARTED,
            })

        await self._clear_cache(stage_id)

        await uow.commit()

        result = []
        for accounts in new_drawn_accounts:
            account1, account2 = accounts[0], accounts[1]
            participant1, participant2 = participants_data.get(account1.id if account1 else None), participants_data.get(account2.id if account2 else None)
            result.append(
                {
                    'gamer1': {
                        'account': AccountReadSchema.model_validate(participant1.account) if participant1 else None,
                        'team': TeamReadSchema.model_validate(participant1.team) if participant1 and participant1.team else None,
                    },
                    'gamer2': {
                        'account': AccountReadSchema.model_validate(participant2.account) if participant2 else None,
                        'team': TeamReadSchema.model_validate(participant2.team) if participant2 and participant2.team else None,
                    },
                }
            )

        return result
