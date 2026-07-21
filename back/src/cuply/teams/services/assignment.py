import uuid

from fastapi import HTTPException

from backlib.repo_helpers import raise_not_found_if_none
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.teams.services.teams import TournamentTeamService
from cuply.tournaments.models import RegistrationStatus
from cuply.tournaments.services.permissions import TournamentPermissionService


class TournamentTeamAssignmentService(TournamentTeamService):
    async def create_assignment(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        participant_id: int,
        team_id: uuid.UUID,
        user: UserModel,
    ):
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await TournamentPermissionService().check_can_assign_team_to_user(uow, user, tournament=tournament)

        participant = await uow.registration_repo.find_one(id=participant_id)
        raise_not_found_if_none(participant, participant_id)

        team = await uow.team.find_one(id=team_id, tournament_id=tournament.id)
        raise_not_found_if_none(team, team_id)

        if participant.status != RegistrationStatus.APPROVED:
            raise HTTPException(
                status_code=400,
                detail="Данный участник еще не подтвержден",
            )

        await uow.registration_repo.edit_one(
            participant.id, {
                'team_id': team.id,
            }
        )
        await uow.commit()

    async def remove_assignment(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        participant_id: int,
        user: UserModel,
    ):
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await TournamentPermissionService().check_can_assign_team_to_user(uow, user, tournament=tournament)

        participant = await uow.registration_repo.find_one(id=participant_id)
        raise_not_found_if_none(participant, participant_id)

        await uow.registration_repo.edit_one(
            participant.id, {
                'team_id': None,
            }
        )
        await uow.commit()
