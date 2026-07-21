""" Repositories for tournaments registration models. """
from typing import Iterable

from sqlalchemy import select, and_, func, case
from sqlalchemy.orm import joinedload

from backlib.repos import BaseSyncRepo, BaseAsyncRepo
from cuply.accounts.models import AccountModel
from cuply.auth.models import UserModel
from cuply.games.models import GameModel
from cuply.tournaments.models import TournamentRegisteredUserModel, RegistrationStatus
from cuply.teams.models import TeamModel


class TournamentRegisteredUserSyncRepo(BaseSyncRepo):
    """ Sync repository for TournamentRegisteredUserModel. """
    model = TournamentRegisteredUserModel


class TournamentRegisteredUserAsyncRepo(BaseAsyncRepo):
    """ Async repository for TournamentRegisteredUserModel. """
    model = TournamentRegisteredUserModel

    def get_full_participant_query(self, *filters):
        return (
            select(TournamentRegisteredUserModel)
            .join(
                AccountModel,
                AccountModel.id == TournamentRegisteredUserModel.account_id,
            ).join(
                UserModel,
                UserModel.id == AccountModel.user_id,
            ).options(
                joinedload(TournamentRegisteredUserModel.account).options(
                    joinedload(AccountModel.user),
                    joinedload(AccountModel.platform),
                    joinedload(AccountModel.game).options(
                        joinedload(GameModel.image)
                    ),
                ),
                joinedload(TournamentRegisteredUserModel.team).options(
                    joinedload(TeamModel.game),
                    joinedload(TeamModel.image),
                    joinedload(TeamModel.creator),
                ),
                joinedload(TournamentRegisteredUserModel.tournament),
            )
            .filter(*filters)
        )

    async def get_full_participant(self, *filters):
        result = await self.session.execute(self.get_full_participant_query(*filters))
        return result.scalar_one_or_none()

    async def get_full_participants(self, *filters):
        result = await self.session.execute(self.get_full_participant_query(*filters))
        return result.scalars().all()

    async def get_full_user_tournament_participant(self, user_id, tournament_id):
        query = select(TournamentRegisteredUserModel).join(
            TournamentRegisteredUserModel.account
        ).join(AccountModel.user).join(AccountModel.platform).join(AccountModel.game).options(
            joinedload(TournamentRegisteredUserModel.account).options(
                joinedload(AccountModel.game).options(
                    joinedload(GameModel.image)
                ),
                joinedload(AccountModel.platform),
                joinedload(AccountModel.user)
            ),
            joinedload(TournamentRegisteredUserModel.team).options(
                joinedload(TeamModel.tournament),
                joinedload(TeamModel.image),
                joinedload(TeamModel.creator),
            ),
            joinedload(TournamentRegisteredUserModel.tournament),
        ).filter(TournamentRegisteredUserModel.tournament_id == tournament_id, AccountModel.user_id == user_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    def get_for_tournament_query(
        self,
        tournament_id: int,
        assigned_to_tournament: bool = None,
        users: list[int] = None,
    ):
        """ Find registration of user for tournament. """
        if assigned_to_tournament is False:
            query = self.get_filter_query(
                UserModel.id.not_in(users),
            )
        elif assigned_to_tournament is True:
            query = self.get_full_participant_query(
                UserModel.id.in_(users),
            )
        else:
            query = self.get_full_participant_query(
                TournamentRegisteredUserModel.tournament_id == tournament_id,
            )

        query = query.order_by(case(
            (TournamentRegisteredUserModel.status == RegistrationStatus.PENDING, 1),
            (TournamentRegisteredUserModel.status == RegistrationStatus.NOT_REGISTERED, 2),
            (TournamentRegisteredUserModel.status == RegistrationStatus.APPROVED, 3),
            (TournamentRegisteredUserModel.status == RegistrationStatus.DENIED, 4),
            else_=5,
        ))

        return query

    async def get_approved_registration_count(self, tournament_id: int) -> int:
        """ Get the number of registrations approved for tournament. """
        query = select(func.count()).select_from(TournamentRegisteredUserModel).where(
            and_(
                TournamentRegisteredUserModel.tournament_id == tournament_id,
                TournamentRegisteredUserModel.status == RegistrationStatus.APPROVED,
            )
        )
        result = await self.session.execute(query)
        return result.scalar()

    async def get_approved_registration_count_for_team(self, tournament_id: int, team_id: int) -> int:
        """ Get the number of team registrations approved for tournament. """
        query = select(func.count()).select_from(TournamentRegisteredUserModel).where(
            and_(
                TournamentRegisteredUserModel.tournament_id == tournament_id,
                TournamentRegisteredUserModel.team_id == team_id,
                TournamentRegisteredUserModel.status == RegistrationStatus.APPROVED,
            )
        )
        result = await self.session.execute(query)
        return result.scalar()

    async def get_approved_users(self, tournament_id: int) -> Iterable[TournamentRegisteredUserModel]:
        result = await self.session.execute(
            self.get_full_participant_query(
                TournamentRegisteredUserModel.tournament_id == tournament_id,
                TournamentRegisteredUserModel.status == RegistrationStatus.APPROVED
            )
        )
        return result.scalars().all()
