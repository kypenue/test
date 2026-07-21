import uuid
from typing import List, Literal

from fastapi import HTTPException
from starlette import status

import constants
from cuply.auth.models import UserModel
from cuply.communities.models import CommunityRoleTypes, CommunityModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.tournaments.models import TournamentModel, TournamentRoleTypes
from cuply.users.models import SystemRoleTypes


class TournamentPermissionService:
    """ Service to check tournament permissions. """
    async def _get_system_roles(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
    ):
        roles = await uow.system_role_repo.find_all(user_id=user.id)
        return roles

    async def _get_tournament_roles(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        tournament: TournamentModel = None,
        tournament_id: int = None,
    ):
        if tournament is not None:
            tournament_id = tournament.id

        if tournament_id is None:
            return []

        roles = await uow.tournament_roles_repo.find_all(
            user_id=user.id, tournament_id=tournament_id,
        )
        return roles

    async def _get_community_roles(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
    ):
        if community is not None:
            community_id = community.id

        if community_id is None:
            return []

        roles = await uow.community_roles_repo.find_all(
            user_id=user.id, community_id=community_id,
        )
        return roles

    async def _check_tournament_in_community(
        self,
        uow: AsyncUnitOfWork,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        if community or community_id:
            if community is not None:
                community_id = community.id
            if tournament_id and not tournament:
                tournament = await uow.tournament_repo.find_one(id=tournament_id)
            if tournament and tournament.community_id != community_id:
                if raise_exc:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=constants.NOT_ENOUGH_PERMISSIONS_MSG,
                    )
                return False
        return True

    async def check_roles(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        allowed_system_roles: List[SystemRoleTypes] | Literal['__all__'],
        allowed_tournament_roles: List[TournamentRoleTypes],
        allowed_community_roles: List[CommunityRoleTypes],
        *,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        if user is None:
            if raise_exc:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=constants.NOT_ENOUGH_PERMISSIONS_MSG,
                )
            return False

        if isinstance(allowed_system_roles, str) and allowed_system_roles == '__all__':
            return True

        if tournament_id and not tournament:
            tournament = await uow.tournament_repo.get_full_tournament(TournamentModel.id == tournament_id)

        if tournament and not community and not community_id:
            community_id = tournament.community_id
        if community_id and not community:
            community = await uow.community_repo.get_full_community(CommunityModel.id == community_id)

        system_roles = await self._get_system_roles(uow, user)
        for system_role in system_roles:
            if system_role.role_type in allowed_system_roles:
                return True

        await self._check_tournament_in_community(
            uow=uow,
            tournament=tournament,
            community=community,
            raise_exc=raise_exc,
        )

        community_roles = await self._get_community_roles(
            uow, user,
            community=community,
        )
        for community_role in community_roles:
            if community_role.role_type in allowed_community_roles:
                return True

        tournament_roles = await self._get_tournament_roles(
            uow, user,
            tournament=tournament,
        )
        for user_role in tournament_roles:
            if user_role.role_type in allowed_tournament_roles:
                return True

        if raise_exc:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=constants.NOT_ENOUGH_PERMISSIONS_MSG,
            )
        return False

    async def check_can_manage_tournament(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        return await self.check_roles(
            uow, user,
            allowed_system_roles=[SystemRoleTypes.ADMIN],
            allowed_tournament_roles=[TournamentRoleTypes.ORGANIZER, TournamentRoleTypes.MODERATOR],
            allowed_community_roles=[CommunityRoleTypes.ORGANIZER, CommunityRoleTypes.MODERATOR],
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_create_community_tournament(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        """ Check if user can create tournament. """
        return await self.check_roles(
            uow, user,
            allowed_system_roles=[SystemRoleTypes.ADMIN],
            allowed_tournament_roles=[],
            allowed_community_roles=[CommunityRoleTypes.ORGANIZER, CommunityRoleTypes.MODERATOR],
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_create_paid_tournament(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        """ Check if user can create tournament. """
        return await self.check_roles(
            uow, user,
            allowed_system_roles=[SystemRoleTypes.ADMIN, SystemRoleTypes.TOURNAMENT_CREATOR],
            allowed_tournament_roles=[],
            allowed_community_roles=[],
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_create_free_tournament(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        """ Check if user can create tournament. """
        return await self.check_roles(
            uow, user,
            allowed_system_roles='__all__',
            allowed_tournament_roles=[],
            allowed_community_roles=[],
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_update_tournament(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        """ Check if user can update tournament. """
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_open_registration(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *, tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        """ Check if user can open tournament registration. """
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_close_registration(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *, tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        """ Check if user can close tournament registration. """
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_can_set_registration_status(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        """ Check if user can delete allowed platform from tournament. """
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_open_tournament(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *, tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        """ Check if user can open tournament. """
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_close_tournament(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *, tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        """ Check if user can close tournament. """
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_start_tournament_stage(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *, tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_update_stage(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *, tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_start_round(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *, tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_end_round(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *, tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_draw_round(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *, tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_block_user(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        """ Check if user can block user from taking part it tournament. """
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_unblock_user(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        """ Check if user can unblock user from taking part it tournament. """
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_add_allowed_platform_in_tournament(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        """ Check if user can add allowed platform to tournament. """
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_remove_allowed_platform_from_tournament(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        """ Check if user can delete allowed platform from tournament. """
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_confirm_match_as_organizer(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_get_complaint(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_update_complaint(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_get_tournament_user_roles(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_set_tournament_user_roles(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        return await self.check_roles(
            uow, user,
            allowed_system_roles=[SystemRoleTypes.ADMIN],
            allowed_tournament_roles=[TournamentRoleTypes.ORGANIZER],
            allowed_community_roles=[CommunityRoleTypes.ORGANIZER],
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_delete_tournament_user_roles(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        return await self.check_roles(
            uow, user,
            allowed_system_roles=[SystemRoleTypes.ADMIN],
            allowed_tournament_roles=[TournamentRoleTypes.ORGANIZER],
            allowed_community_roles=[CommunityRoleTypes.ORGANIZER],
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_get_community_user_roles(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        return await self.check_roles(
            uow, user,
            allowed_system_roles=[SystemRoleTypes.ADMIN],
            allowed_tournament_roles=[],
            allowed_community_roles=[CommunityRoleTypes.ORGANIZER, CommunityRoleTypes.MODERATOR],
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_set_community_user_roles(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        return await self.check_roles(
            uow, user,
            allowed_system_roles=[SystemRoleTypes.ADMIN],
            allowed_tournament_roles=[],
            allowed_community_roles=[CommunityRoleTypes.ORGANIZER],
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_delete_community_user_roles(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        return await self.check_roles(
            uow, user,
            allowed_system_roles=[SystemRoleTypes.ADMIN],
            allowed_tournament_roles=[],
            allowed_community_roles=[CommunityRoleTypes.ORGANIZER],
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_get_system_user_roles(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        raise_exc: bool = True,
    ):
        return await self.check_roles(
            uow, user,
            allowed_system_roles=[SystemRoleTypes.ADMIN],
            allowed_tournament_roles=[],
            allowed_community_roles=[],
            raise_exc=raise_exc,
        )

    async def check_set_system_user_roles(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        raise_exc: bool = True,
    ):
        return await self.check_roles(
            uow, user,
            allowed_system_roles=[SystemRoleTypes.ADMIN],
            allowed_tournament_roles=[],
            allowed_community_roles=[],
            raise_exc=raise_exc,
        )

    async def check_delete_system_user_roles(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        raise_exc: bool = True,
    ):
        return await self.check_roles(
            uow, user,
            allowed_system_roles=[SystemRoleTypes.ADMIN],
            allowed_tournament_roles=[],
            allowed_community_roles=[],
            raise_exc=raise_exc,
        )

    async def check_create_community(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        """ Check if user can create community. """
        return await self.check_roles(
            uow, user,
            allowed_system_roles=[SystemRoleTypes.ADMIN, SystemRoleTypes.COMMUNITY_CREATOR],
            allowed_tournament_roles=[],
            allowed_community_roles=[],
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_update_community(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        """ Check if user can update community. """
        return await self.check_roles(
            uow, user,
            allowed_system_roles=[SystemRoleTypes.ADMIN],
            allowed_tournament_roles=[],
            allowed_community_roles=[CommunityRoleTypes.ORGANIZER],
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_delete_community(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        """ Check if user can delete community. """
        return await self.check_roles(
            uow, user,
            allowed_system_roles=[SystemRoleTypes.ADMIN],
            allowed_tournament_roles=[],
            allowed_community_roles=[CommunityRoleTypes.ORGANIZER],
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_can_create_public_team(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        return await self.check_roles(
            uow, user,
            allowed_system_roles=[SystemRoleTypes.ADMIN],
            allowed_tournament_roles=[],
            allowed_community_roles=[],
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_can_update_public_team(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        return await self.check_roles(
            uow, user,
            allowed_system_roles=[SystemRoleTypes.ADMIN],
            allowed_tournament_roles=[],
            allowed_community_roles=[],
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_can_delete_public_team(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        return await self.check_roles(
            uow, user,
            allowed_system_roles=[SystemRoleTypes.ADMIN],
            allowed_tournament_roles=[],
            allowed_community_roles=[],
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_can_edit_tournament_team(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        raise_exc: bool = True,
    ):
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_can_add_tournament_team(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        raise_exc: bool = True,
    ):
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_can_delete_tournament_team(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        raise_exc: bool = True,
    ):
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_can_assign_team_to_user(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        raise_exc: bool = True,
    ):
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )

    async def check_can_draw_teams(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        *,
        tournament: TournamentModel = None,
        tournament_id: int = None,
        community: CommunityModel = None,
        community_id: uuid.UUID = None,
        raise_exc: bool = True,
    ):
        """ Check if user can assign team to user. """
        return await self.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            tournament_id=tournament_id,
            community=community,
            community_id=community_id,
            raise_exc=raise_exc,
        )
