import uuid

import math
from fastapi import HTTPException
from sqlalchemy import or_, and_, nullslast
from starlette import status

import constants
from backlib.pagination import AsyncPaginator
from backlib.repo_helpers import raise_not_found_if_none
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.teams.models import TeamModel, TeamAccessTypes
from cuply.teams.schemas.teams import (
    TeamReadSchema,
    UserTeamCreateSchema,
    TeamUpdateSchema,
    CopyToTournamentWriteSchema,
    TournamentTeamReadSchema,
)
from cuply.tournaments.models import TournamentModel, LifecycleTournamentStatus
from cuply.tournaments.services.permissions import TournamentPermissionService


class UserTeamService:
    async def get(self, uow: AsyncUnitOfWork, team_id: uuid.UUID, user: UserModel):
        team = await uow.team.get_full_team(
            and_(
                or_(
                    TeamModel.creator_id == user.id,
                    TeamModel.access_type == TeamAccessTypes.PUBLIC,
                ),
                TeamModel.tournament_id == None,
                TeamModel.id == team_id,
            )
        )
        raise_not_found_if_none(team, team_id)

        return TeamReadSchema.model_validate(team)

    async def get_all_paginated(
        self,
        uow: AsyncUnitOfWork,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        filter_instance,
        user: UserModel,
    ) -> dict:
        query = uow.team.get_full_team_query(
            and_(
                or_(
                    TeamModel.creator_id == user.id,
                    TeamModel.access_type == TeamAccessTypes.PUBLIC,
                ),
                TeamModel.tournament_id == None,
            )
        )
        paginator = AsyncPaginator(
            session=uow.session,
            model_class=TeamModel,
            schema_class=TeamReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=["name"],
            filter_instance=filter_instance,
            context_data={"user": user},
            query=query
        )
        return await paginator.get_result()

    async def create(self, uow: AsyncUnitOfWork, schema: UserTeamCreateSchema, user: UserModel):
        if schema.access_type == TeamAccessTypes.PUBLIC:
            await TournamentPermissionService().check_can_create_public_team(uow, user)

        team_id = await uow.team.add_one({
            "name": schema.name,
            "access_type": schema.access_type,
            "image_id": schema.image_id,
            "game_id": schema.game_id,
            "creator_id": user.id,
        })
        await uow.commit()

        team = await uow.team.get_full_team(TeamModel.id == team_id)

        return TeamReadSchema.model_validate(team)

    async def update(self, uow: AsyncUnitOfWork, team_id: uuid.UUID, schema: TeamUpdateSchema, user: UserModel):
        team = await uow.team.find_one(id=team_id, tournament_id=None)
        raise_not_found_if_none(team, team_id)

        if team.creator_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=constants.NOT_ENOUGH_PERMISSIONS_MSG,
            )

        if team.access_type == TeamAccessTypes.PUBLIC:
            await TournamentPermissionService().check_can_update_public_team(uow, user)

        await uow.team.edit_one(team_id, {
            "name": schema.name,
            "image_id": schema.image_id,
        })
        await uow.commit()

    async def delete(self, uow: AsyncUnitOfWork, team_id: uuid.UUID, user: UserModel):
        team = await uow.team.find_one(id=team_id, tournament_id=None)
        raise_not_found_if_none(team, team_id)

        if team.creator_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=constants.NOT_ENOUGH_PERMISSIONS_MSG,
            )

        if team.access_type == TeamAccessTypes.PUBLIC:
            await TournamentPermissionService().check_can_delete_public_team(uow, user)

        await uow.team.delete_one(team_id)
        await uow.commit()


class TournamentTeamService:
    max_participants_per_team: int
    teams_distribution: dict[str, int]

    async def _can_add_team(
        self,
        uow: AsyncUnitOfWork,
        tournament: TournamentModel,
        user: UserModel,
    ):
        await TournamentPermissionService().check_can_add_tournament_team(uow, user, tournament=tournament)

        if not tournament.teams_used:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Для данного турнира не включена возможность использования команд",
            )

        if tournament.lifecycle_status in [
            LifecycleTournamentStatus.TOURNAMENT_STARTED,
            LifecycleTournamentStatus.TOURNAMENT_ENDED,
            LifecycleTournamentStatus.TOURNAMENT_ARCHIVED,
        ]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Добавление команд на данном этапе уже невозможно",
            )

    async def get(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        team_id: uuid.UUID,
        user: UserModel,
    ) -> TournamentTeamReadSchema:
        team = await uow.team.get_full_team(
            TeamModel.tournament_id == tournament_id,
            TeamModel.id == team_id,
        )
        raise_not_found_if_none(team, team_id)

        await self.load_participants_info(uow, tournament_id)

        return TournamentTeamReadSchema.model_validate(team, context=self.get_participants_info(team))

    async def load_participants_info(self, uow, tournament_id):
        teams = await uow.team.find_all(tournament_id=tournament_id, access_type=TeamAccessTypes.TOURNAMENT)

        participants_number = await uow.registration_repo.get_approved_registration_count(tournament_id)
        self.max_participants_per_team = math.ceil(participants_number / len(teams)) if len(teams) else 0
        self.teams_distribution = await uow.team.get_tournament_teams_distribution(tournament_id)

    def get_participants_info(self, team: TeamModel):
        taken_places = self.teams_distribution.get(str(team.id), 0)

        if team.access_type == TeamAccessTypes.TOURNAMENT_INTERNAL:
            available_places = None
        else:
            available_places = max(self.max_participants_per_team - taken_places, 0)

        return {
            "available_places": available_places,
            "taken_places": taken_places,
        }

    async def get_all_paginated(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        filter_instance,
        user: UserModel,
    ) -> dict:
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await self.load_participants_info(uow, tournament_id)

        async def get_places_context(item: TeamModel, context_data):
            return self.get_participants_info(item)

        query = uow.team.get_full_team_query(
            TeamModel.tournament_id == tournament_id,
        )
        paginator = AsyncPaginator(
            session=uow.session,
            model_class=TeamModel,
            schema_class=TournamentTeamReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=["name"],
            filter_instance=filter_instance,
            context_data={"user": user},
            context_function=get_places_context,
            query=query
        )
        return await paginator.get_result()

    async def get_available_teams_paginated(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        filter_instance,
        user: UserModel,
    ) -> dict:
        tournament: TournamentModel = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        current_tournament_teams = await uow.team.find_all(tournament_id=tournament.id)

        query = uow.team.get_full_team_query(
            and_(
                or_(
                    and_(
                        TeamModel.creator_id == tournament.creator_id,
                        TeamModel.access_type == TeamAccessTypes.PRIVATE,
                    ),
                    TeamModel.access_type == TeamAccessTypes.PUBLIC,
                    TeamModel.tournament_id == tournament.id,
                ),
                TeamModel.game_id == tournament.game_id,
                TeamModel.id.not_in([team.source_team_id for team in current_tournament_teams]),
            )
        ).order_by(nullslast(TeamModel.tournament_id.asc()))

        paginator = AsyncPaginator(
            session=uow.session,
            model_class=TeamModel,
            schema_class=TeamReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=["name"],
            filter_instance=filter_instance,
            context_data={"user": user},
            query=query
        )
        return await paginator.get_result()

    async def copy_team_to_tournament(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        schema: CopyToTournamentWriteSchema,
        user: UserModel,
    ):
        tournament: TournamentModel = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await self._can_add_team(uow, tournament, user)

        team = await uow.team.find_one(id=schema.team_id, tournament_id=None)
        raise_not_found_if_none(team, schema.team_id)

        if team.creator_id != tournament.id and team.access_type not in [TeamAccessTypes.PUBLIC, TeamAccessTypes.PRIVATE]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=constants.NOT_ENOUGH_PERMISSIONS_MSG,
            )

        if team.game_id != tournament.game_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Переданная команда относится к другой игре",
            )

        the_same_source_team = await uow.team.find_one(source_team_id=team.id, tournament_id=tournament.id)
        if the_same_source_team:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Данная команда уже существует в данном турнире",
            )

        if schema.access_type not in [TeamAccessTypes.TOURNAMENT, TeamAccessTypes.TOURNAMENT_INTERNAL]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Некорректный тип для копирования команды в турнир",
            )

        team_id = await uow.team.add_one({
            "name": team.name,
            "access_type": schema.access_type,
            "image_id": team.image_id,
            "game_id": team.game_id,
            "creator_id": user.id,
            "tournament_id": tournament.id,
            "source_team_id": team.id,
        })
        await uow.commit()

        team = await uow.team.get_full_team(TeamModel.id == team_id)

        return TeamReadSchema.model_validate(team)

    async def update(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        team_id: uuid.UUID,
        schema: TeamUpdateSchema,
        user: UserModel,
    ):
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        team = await uow.team.find_one(id=team_id, tournament_id=tournament_id)
        raise_not_found_if_none(team, team_id)

        await TournamentPermissionService().check_can_edit_tournament_team(uow, user, tournament_id=tournament_id)

        if tournament.lifecycle_status in [
            LifecycleTournamentStatus.TOURNAMENT_STARTED,
            LifecycleTournamentStatus.TOURNAMENT_ENDED,
            LifecycleTournamentStatus.TOURNAMENT_ARCHIVED,
        ]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Изменение команд на данном этапе уже невозможно",
            )

        data = {
            "name": schema.name,
            "image_id": schema.image_id,
        }
        await uow.team.edit_one(team_id, data)
        await uow.commit()

    async def delete(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        team_id: uuid.UUID,
        user: UserModel,
    ):
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        team = await uow.team.find_one(id=team_id, tournament_id=tournament_id)
        raise_not_found_if_none(team, team_id)

        await TournamentPermissionService().check_can_edit_tournament_team(uow, user, tournament_id=tournament_id)

        if tournament.lifecycle_status in [
            LifecycleTournamentStatus.TOURNAMENT_STARTED,
            LifecycleTournamentStatus.TOURNAMENT_ENDED,
            LifecycleTournamentStatus.TOURNAMENT_ARCHIVED,
        ]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Изменение команд на данном этапе уже невозможно",
            )

        await uow.team.delete_one(team_id)
        await uow.commit()
