import uuid
import random

import math
from fastapi import HTTPException
from starlette import status

from backlib.repo_helpers import raise_not_found_if_none
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.teams.models import TeamAccessTypes
from cuply.teams.services.teams import TournamentTeamService
from cuply.tournaments.models import (
    RegistrationStatus,
    LifecycleTournamentStatus,
    TournamentModel,
    TournamentRegisteredUserModel,
)
from cuply.tournaments.schemas.registration import TournamentRegisteredUserReadSchema
from cuply.tournaments.services.permissions import TournamentPermissionService


class TournamentTeamDrawService(TournamentTeamService):
    async def draw_one_participant(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        user: UserModel,
    ):
        tournament: TournamentModel = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await TournamentPermissionService().check_can_draw_teams(uow, user, tournament=tournament)

        if not tournament.teams_used:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Для данного турнира не включена возможность использования команд",
            )

        if tournament.lifecycle_status not in [LifecycleTournamentStatus.REGISTRATION_CLOSED, LifecycleTournamentStatus.TEAM_DRAW_STARTED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Жеребьевка команд недоступна на данном этапе турнира",
            )

        if tournament.lifecycle_status != LifecycleTournamentStatus.TEAM_DRAW_STARTED:
            await uow.tournament_repo.edit_one(tournament.id, {
                'lifecycle_status': LifecycleTournamentStatus.TEAM_DRAW_STARTED,
            })

        teams = await uow.team.find_all(tournament_id=tournament.id, access_type=TeamAccessTypes.TOURNAMENT)

        participants_number = await uow.registration_repo.get_approved_registration_count(tournament.id)

        max_participants_per_team = math.ceil(participants_number / len(teams))

        teams_distribution = await uow.team.get_tournament_teams_distribution(tournament.id)

        participants = await uow.registration_repo.find_all(tournament_id=tournament.id, team_id=None, status=RegistrationStatus.APPROVED)
        if not participants:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Не осталось свободных участников",
            )

        chosen_participant = random.choice(participants)

        team_candidates = [team for team in teams if teams_distribution.get(str(team.id), 0) < max_participants_per_team]
        if not participants:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Не осталось свободных команд",
            )

        chosen_team = random.choice(team_candidates)

        if len(participants) <= 1:
            await uow.tournament_repo.edit_one(tournament.id, {
                'lifecycle_status': LifecycleTournamentStatus.TEAM_DRAW_ENDED,
            })

        await uow.registration_repo.edit_one(chosen_participant.id, {
            'team_id': chosen_team.id,
        })

        await uow.commit()

        participant = await uow.registration_repo.get_full_participant(
            TournamentRegisteredUserModel.id == chosen_participant.id
        )
        return TournamentRegisteredUserReadSchema.model_validate(participant)
