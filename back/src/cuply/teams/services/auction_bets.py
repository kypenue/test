import json
import uuid
import datetime

from fastapi import HTTPException
from starlette import status

from backlib.pagination import AsyncPaginator
from backlib.repo_helpers import raise_not_found_if_none
from cuply.accounts.models import AccountModel
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.teams.models import TeamModel, TeamAccessTypes, AuctionBetModel
from cuply.teams.schemas.auction_bets import AuctionReadSchema, TeamWithMaxBetReadSchema, AuctionBetShortReadSchema
from cuply.tournaments.models import TournamentModel, LifecycleTournamentStatus, TournamentRegisteredUserModel
from cuply.tournaments.services.permissions import TournamentPermissionService


class AuctionService:
    async def get_init_data(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
    ) -> AuctionReadSchema:
        tournament: TournamentModel = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        auction_data = {
            "bet_step": tournament.bet_step,
            "min_bet": tournament.min_bet,
            "max_bet": tournament.max_bet,
            "bet_duration_seconds": tournament.bet_duration_seconds,
            "bet_extension_seconds": tournament.bet_extension_seconds,
        }
        lots = []

        is_started = False

        for team in await uow.team.get_full_teams(
            TeamModel.tournament_id == tournament.id,
            TeamModel.access_type == TeamAccessTypes.TOURNAMENT
        ):
            max_bet = await uow.auction_bet.get_max_bet_for_team(team.id)
            if team.auction_deadline:
                seconds_left = (team.auction_deadline - datetime.datetime.utcnow()).total_seconds()
                seconds_left = seconds_left if seconds_left > 0 else 0
                is_started = True
            else:
                seconds_left = None
            lots.append({
                "team": team,
                "max_bet": max_bet,
                "seconds_left": seconds_left,
            })

        lots.sort(key=lambda lot: lot["team"].name)
        lots.sort(key=lambda lot: lot["max_bet"] is None)

        auction_data["is_started"] = is_started
        auction_data["lots"] = lots

        return AuctionReadSchema.model_validate(auction_data)

    async def get_history_paginated(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        team_id: uuid.UUID,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        user: UserModel,
    ) -> AuctionBetShortReadSchema:
        tournament: TournamentModel = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        team: TeamModel = await uow.team.get_full_team(TeamModel.id == team_id,
                                                       TeamModel.access_type == TeamAccessTypes.TOURNAMENT)
        raise_not_found_if_none(team, team_id)

        if not user:
            raise HTTPException(
                detail="Пользователь не авторизован",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if team.tournament_id != tournament.id:
            raise HTTPException(
                detail="Данная команда не принадлежит указанному турниру",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if not team.auction_deadline:
            raise HTTPException(
                detail="Аукцион для этой команды еще не начался",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        paginator = AsyncPaginator(
            session=uow.session,
            model_class=AuctionBetModel,
            schema_class=AuctionBetShortReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            query=uow.auction_bet.get_full_bet_query(TeamModel.id == team.id),
        )
        return await paginator.get_result()

    async def make_bet(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        team_id: uuid.UUID,
        bet: int,
        creator: UserModel | None,
    ) -> TeamWithMaxBetReadSchema:
        tournament: TournamentModel = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        team: TeamModel = await uow.team.get_full_team(TeamModel.id==team_id, TeamModel.access_type==TeamAccessTypes.TOURNAMENT)
        raise_not_found_if_none(team, team_id)

        if not creator:
            raise HTTPException(
                detail="Пользователь не авторизован",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if team.tournament_id != tournament.id:
            raise HTTPException(
                detail="Данная команда не принадлежит указанному турниру",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        participant = await uow.registration_repo.get_full_participant(AccountModel.user_id==creator.id, TournamentRegisteredUserModel.tournament_id==tournament.id)
        if not participant:
            raise HTTPException(
                detail="Вы не являетесь участником данного турнира",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if participant.team:
            raise HTTPException(
                detail="Вам уже назначена команда",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        now = datetime.datetime.utcnow()
        if now > team.auction_deadline:
            raise HTTPException(
                detail="Период ставок для данной команды завершен",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if not (bet % tournament.bet_step == 0):
            raise HTTPException(
                detail="Предложенная ставка не соответствует необходимому шагу",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        max_bets_per_team = {}
        for tmp_team in await uow.team.find_all(tournament_id=tournament.id, access_type=TeamAccessTypes.TOURNAMENT):
            max_auction_bet = await uow.auction_bet.get_max_bet_for_team(tmp_team.id)
            max_bets_per_team[tmp_team.id] = max_auction_bet

        for max_auction_bet in max_bets_per_team.values():
            if max_auction_bet and max_auction_bet.participant_id == participant.id:
                raise HTTPException(
                    detail="У вас уже имеются активные ставки, которые еще не побиты другими участниками",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

        max_auction_bet = max_bets_per_team[team.id]

        if max_auction_bet and bet > max_auction_bet.bet + tournament.max_bet or not max_auction_bet and bet > tournament.max_bet:
            raise HTTPException(
                detail="Предложенная ставка больше максимальной",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if bet < tournament.min_bet:
            raise HTTPException(
                detail="Предложенная ставка меньше минимальной",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if not team.auction_deadline:
            raise HTTPException(
                detail="Аукцион для этой команды еще не начался",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        team_auction_deadline = team.auction_deadline
        if team_auction_deadline - now < datetime.timedelta(seconds=tournament.bet_extension_seconds):
            team_auction_deadline = now + datetime.timedelta(seconds=tournament.bet_extension_seconds)

        await uow.team.edit_one(team.id, {
            'auction_deadline': team_auction_deadline,
        })
        auction_bet_id = await uow.auction_bet.add_one({
            'bet': bet,
            'team_id': team.id,
            'participant_id': participant.id,
        })
        auction_bet = await uow.auction_bet.find_one(id=auction_bet_id)

        seconds_left = (team_auction_deadline - datetime.datetime.utcnow()).total_seconds()
        seconds_left = seconds_left if seconds_left > 0 else 0

        result = await self.get_init_data(uow, tournament_id)
        await uow.websocket_team_message.add_one({
            'tournament_id': tournament.id,
            'value': {
                'data': json.loads(result.model_dump_json())
            },
        })

        await uow.commit()

        return TeamWithMaxBetReadSchema.model_validate({
            'team': team,
            'max_bet': auction_bet,
            'seconds_left': seconds_left,
        })

    async def start_auction(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        user: UserModel,
    ):
        tournament: TournamentModel = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await TournamentPermissionService().check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            raise_exc=False,
        )

        if not tournament.teams_used:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Для данного турнира не используются команды"
            )

        for team in await uow.team.find_all(tournament_id=tournament.id, access_type=TeamAccessTypes.TOURNAMENT):
            if team.auction_deadline is not None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Аукцион для данного турнира уже запущен"
                )

        if not tournament.lifecycle_status in [
            LifecycleTournamentStatus.REGISTRATION_NOT_STARTED,
            LifecycleTournamentStatus.REGISTRATION_OPENED,
            LifecycleTournamentStatus.REGISTRATION_CLOSED,
            LifecycleTournamentStatus.TEAM_DRAW_STARTED,
        ]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Запуск аукциона на данном этапе невозможен"
            )

        if (
            tournament.max_bet is None
            or tournament.min_bet is None
            or tournament.bet_step is None
            or tournament.bet_extension_seconds is None
            or tournament.bet_duration_seconds is None
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Не установлены все параметры аукциона"
            )

        now = datetime.datetime.utcnow()

        for team in await uow.team.find_all(tournament_id=tournament.id, access_type=TeamAccessTypes.TOURNAMENT):
            await uow.team.edit_one(team.id, {
                'auction_deadline': now + datetime.timedelta(seconds=tournament.bet_duration_seconds),
            })

        await uow.commit()
