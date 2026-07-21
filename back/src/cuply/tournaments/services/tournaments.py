""" Services to interact with tournaments """
from datetime import datetime
from typing import Optional

import pytz
from fastapi import HTTPException

from backlib.pagination import AsyncPaginator
from backlib.repo_helpers import raise_not_found_if_none
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.stages.services.stages import TournamentStageService
from cuply.tournaments.exceptions.tournaments import TournamentNotStartedYetException, CannotStartTournamentException
from cuply.tournaments.filters.tournaments import TournamentFilter
from cuply.tournaments.schemas.tournaments import (
    TournamentReadSchema,
    TournamentCreateSchema,
    TournamentUpdateSchema,
    TournamentPersonalReadSchema,
    TournamentRegulationReadSchema,
    TournamentSetLifecycleStatusSchema,
    TournamentPartialUpdateSchema,
)
from cuply.stages.models import TournamentStageStatus, StageModel
from cuply.tournaments.models import (
    TournamentModel,
    RegistrationStatus,
    LifecycleTournamentStatus,
    TournamentRoleTypes,
    TournamentPaymentType,
)
from cuply.tournaments.services.permissions import TournamentPermissionService


class TournamentService:
    """ Service to interact with tournaments. """
    AVAILABLE_UNFINISHED_TOURNAMENTS_IN_COMMUNITY_NUMBER = 5
    AVAILABLE_UNFINISHED_PAYED_TOURNAMENTS_NUMBER = 3
    AVAILABLE_UNFINISHED_FREE_TOURNAMENTS_NUMBER = 1

    def __init__(self):
        self.now = datetime.utcnow().replace(tzinfo=pytz.utc)
        self.permission_service = TournamentPermissionService()

    async def _get_registration_status(
        self,
        uow: AsyncUnitOfWork,
        user: UserModel,
        tournament: TournamentModel,
    ) -> RegistrationStatus:
        """ Get registration status for tournament for current user. """
        if user is None:
            return RegistrationStatus.NOT_REGISTERED

        registration = await uow.registration_repo.get_full_user_tournament_participant(
            tournament_id=tournament.id,
            user_id=user.id,
        )

        if registration is None:
            return RegistrationStatus.NOT_REGISTERED

        return registration.status

    async def get(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        user: UserModel,
    ) -> TournamentReadSchema:
        """ Get tournament by id. """
        tournament = await uow.tournament_repo.get_full_tournament(TournamentModel.id == tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        is_moderator = await self.permission_service.check_can_manage_tournament(
            uow, user,
            tournament=tournament,
            raise_exc=False,
        )

        if (
            user is None or not is_moderator
            and self.now < tournament.registration_end
            and tournament.lifecycle_status is None
        ):
            raise_not_found_if_none(tournament, tournament_id)

        registration_status = await self._get_registration_status(uow, user, tournament)
        return TournamentReadSchema.model_validate(
            tournament,
            context={
                "registration_status": registration_status,
                "tournament_roles": [
                    role.role_type for role in tournament.roles if user and role.user_id == user.id
                ],
            },
        )

    async def get_all_paginated(
        self,
        uow: AsyncUnitOfWork,
        show_recommended: Optional[bool],
        show_my: Optional[bool],
        can_manage: Optional[bool],
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        filter_instance: TournamentFilter,
        user: UserModel,
    ) -> dict:
        """ Get all tournaments paginated. """
        async def get_tournament_context(item: TournamentModel, context_data: dict):
            current_user = context_data["user"]
            registration_status = await self._get_registration_status(uow, current_user, item)
            return {
                "registration_status": registration_status,
                "tournament_roles": [
                    role.role_type for role in item.roles
                        if current_user and role.user_id == current_user.id
                ],
            }

        query = None
        if show_recommended is True:
            query = uow.tournament_repo.get_recommended_tournaments_query()
        if show_my is True:
            query = uow.tournament_repo.get_my_tournaments_query(user=user)
        if can_manage is True:
            query = uow.tournament_repo.get_can_manage_query(user=user)

        if query is None:
            query = uow.tournament_repo.get_full_tournament_query()

        paginator = AsyncPaginator(
            session=uow.session,
            model_class=TournamentModel,
            schema_class=TournamentReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=["name"],
            filter_instance=filter_instance,
            context_function=get_tournament_context,
            context_data={"user": user},
            query=query,
        )
        return await paginator.get_result()

    async def create(
        self,
        uow: AsyncUnitOfWork,
        schema: TournamentCreateSchema,
        user: UserModel,
    ) -> TournamentReadSchema:
        """ Create new tournament. """
        data = schema.model_dump()

        tournament_min_age = data.get("tournament_min_age")

        game_id = data.get("game_id")
        game = await uow.game_repo.find_one(id=game_id)
        raise_not_found_if_none(game, game_id)
        if game.min_age is not None and (tournament_min_age is None or tournament_min_age < game.min_age):
            raise HTTPException(
                status_code=400,
                detail=f"Минимальный возраст участия в турнире для данной игры: {game.min_age}",
            )

        stages = data.pop("stages")

        community = None
        community_id = data.get("community_id")
        if community_id:
            community = await uow.community_repo.find_one(id=community_id)
            raise_not_found_if_none(community, community_id)

        if community:
            await self.permission_service.check_create_community_tournament(
                uow, user, community=community, raise_exc=True,
            )
            unfinished_count = await uow.tournament_repo.count_unfinished_by_community(community_id)
            if unfinished_count >= self.AVAILABLE_UNFINISHED_TOURNAMENTS_IN_COMMUNITY_NUMBER:
                raise HTTPException(
                    status_code=400,
                    detail=f"В данном пространстве уже {self.AVAILABLE_UNFINISHED_TOURNAMENTS_IN_COMMUNITY_NUMBER} "
                           f"незавершённых турниров",
                )
            payment_type = TournamentPaymentType.PAYED_COMMUNITY
        else:
            can_create_paid_tournament = await self.permission_service.check_create_paid_tournament(
                uow, user, community=community, raise_exc=False,
            )
            if can_create_paid_tournament:
                unfinished_count = await uow.tournament_repo.count_unfinished_by_creator(
                    user.id, TournamentPaymentType.PAYED,
                )
                if unfinished_count >= self.AVAILABLE_UNFINISHED_PAYED_TOURNAMENTS_NUMBER:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Один пользователь не может создать более "
                               f"{self.AVAILABLE_UNFINISHED_PAYED_TOURNAMENTS_NUMBER} незавершённых турниров",
                    )
                payment_type = TournamentPaymentType.PAYED
            else:
                await self.permission_service.check_create_free_tournament(
                    uow, user, community=community, raise_exc=True,
                )
                unfinished_count = await uow.tournament_repo.count_unfinished_by_creator(
                    user.id, TournamentPaymentType.FREE,
                )
                if unfinished_count >= self.AVAILABLE_UNFINISHED_FREE_TOURNAMENTS_NUMBER:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Один пользователь не может создать более "
                               f"{self.AVAILABLE_UNFINISHED_FREE_TOURNAMENTS_NUMBER} незавершённых бесплатных турниров",
                    )
                if len(stages) > 1:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Бесплатные турниры не могут быть многоступенчатые",
                    )
                payment_type = TournamentPaymentType.FREE

        platforms = data.pop('platforms')

        data["creator_id"] = user.id
        data["payment_type"] = payment_type
        data["lifecycle_status"] = LifecycleTournamentStatus.REGISTRATION_NOT_STARTED
        tournament_id = await uow.tournament_repo.add_one(data)

        stage_mapping = {
            'se_stage': {
                'repo': uow.se_stage,
                'field_name': 'single_elimination_stage_id',
            },
            'de_stage': {
                'repo': uow.de_stage,
                'field_name': 'double_elimination_stage_id',
            },
            'swiss_stage': {
                'repo': uow.swiss_stage_repo,
                'field_name': 'swiss_stage_id',
            },
            'league_stage': {
                'repo': uow.league_repo,
                'field_name': 'league_stage_id',
            },
            'wildcard_stage': {
                'repo': uow.wildcard_stage_repo,
                'field_name': 'wildcard_stage_id',
            },
        }

        for stage in stages:
            stage['tournament_id'] = tournament_id
            stage['status'] = TournamentStageStatus.STAGE_NOT_STARTED

            stages_data = {}
            for item, item_data in stage_mapping.items():
                if item in stage:
                    stages_data[item] = stage.pop(item)

            stage_id = await uow.stages_repo.add_one(stage)

            for item in stages_data:
                if stages_data[item]:
                    data = stages_data[item]
                    data['stage_id'] = stage_id
                    await stage_mapping[item]['repo'].add_one(data)

        for platform_id in platforms:
            await uow.tournament_platforms.add_one({
                'tournament_id': tournament_id,
                'platform_id': platform_id
            })

        await uow.tournament_roles_repo.add_one({
            'tournament_id': tournament_id,
            'user_id': user.id,
            'role_type': TournamentRoleTypes.ORGANIZER,
        })

        await uow.commit()

        tournament = await uow.tournament_repo.get_full_tournament(TournamentModel.id == tournament_id)

        registration_status = await self._get_registration_status(uow, user, tournament)
        return TournamentReadSchema.model_validate(
            tournament,
            context={
                "registration_status": registration_status,
                "tournament_roles": [
                    role.role_type for role in tournament.roles if user and role.user_id == user.id
                ],
            },
        )

    async def set_lifecycle_status(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        schema: TournamentSetLifecycleStatusSchema,
        user: UserModel,
    ):
        """ Create new tournament. """
        data = schema.model_dump()

        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await self.permission_service.check_update_tournament(uow, user, tournament=tournament)

        lifecycle_status = data.get('lifecycle_status')
        if lifecycle_status and lifecycle_status == LifecycleTournamentStatus.TOURNAMENT_STARTED:
            registration_number = await uow.registration_repo.get_approved_registration_count(tournament_id)
            if registration_number < 3:
                raise CannotStartTournamentException()

        await uow.tournament_repo.edit_one(tournament_id, data)

        await uow.commit()

    async def update(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        schema: TournamentUpdateSchema,
        user: UserModel,
    ) -> TournamentReadSchema:
        """ Update tournament by id. """
        data = schema.model_dump()

        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await self.permission_service.check_update_tournament(uow, user, tournament=tournament)

        await uow.tournament_repo.edit_one(tournament_id, data)
        tournament = await uow.tournament_repo.get_full_tournament(TournamentModel.id == tournament_id)

        await uow.commit()

        registration_status = await self._get_registration_status(uow, user, tournament)
        return TournamentReadSchema.model_validate(
            tournament,
            context={
                "registration_status": registration_status,
                "tournament_roles": [
                    role.role_type for role in tournament.roles if user and role.user_id == user.id
                ],
            },
        )

    async def patch(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        schema: TournamentPartialUpdateSchema,
        user: UserModel,
    ) -> TournamentReadSchema:
        """ Update tournament by id. """
        data = schema.model_dump(exclude_unset=True)

        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await self.permission_service.check_update_tournament(uow, user, tournament=tournament)

        await uow.tournament_repo.edit_one(tournament_id, data)
        await uow.commit()

        tournament = await uow.tournament_repo.get_full_tournament(TournamentModel.id == tournament_id)

        registration_status = await self._get_registration_status(uow, user, tournament)
        return TournamentReadSchema.model_validate(
            tournament,
            context={
                "registration_status": registration_status,
                "tournament_roles": [
                    role.role_type for role in tournament.roles if user and role.user_id == user.id
                ],
            },
        )

    async def start_next_stage(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        user: UserModel,
    ):
        """ Start next stage in tournament. """
        tournament: TournamentModel = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await self.permission_service.check_start_tournament_stage(uow, user, tournament=tournament)

        if tournament.lifecycle_status != LifecycleTournamentStatus.TOURNAMENT_STARTED:
            raise TournamentNotStartedYetException()

        all_stages = await uow.stages_repo.get_tournament_stages_with_rounds(
            StageModel.tournament_id == tournament_id,
        )

        previous_stage = None
        for stage in all_stages:
            if stage.status == TournamentStageStatus.STAGE_NOT_STARTED:
                stage_service = TournamentStageService()
                await stage_service.start_stage(uow, stage, previous_stage)
                break
            previous_stage = stage
        else:
            ...

        await uow.commit()

    async def open_registration(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        user: UserModel,
    ):
        """ Manually open tournament registration. """
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await self.permission_service.check_open_registration(uow, user, tournament=tournament)

        await uow.tournament_repo.edit_one(
            tournament_id, {"lifecycle_status": LifecycleTournamentStatus.REGISTRATION_OPENED},
        )
        await uow.commit()

    async def close_registration(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        user: UserModel,
    ):
        """ Manually close tournament registration. """
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await self.permission_service.check_close_registration(uow, user, tournament=tournament)

        await uow.tournament_repo.edit_one(
            tournament_id, {"lifecycle_status": LifecycleTournamentStatus.REGISTRATION_CLOSED},
        )
        await uow.commit()

    async def open_tournament(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        user: UserModel,
    ):
        """ Manually open tournament. """
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await self.permission_service.check_open_tournament(uow, user, tournament=tournament)

        registration_number = await uow.registration_repo.get_approved_registration_count(tournament_id)
        if registration_number < 3:
            raise CannotStartTournamentException()

        await uow.tournament_repo.edit_one(
            tournament_id, {"lifecycle_status": LifecycleTournamentStatus.TOURNAMENT_STARTED},
        )
        await uow.commit()

    async def close_tournament(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        user: UserModel,
    ):
        """ Manually close tournament. """
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        await self.permission_service.check_close_tournament(uow, user, tournament=tournament)

        await uow.tournament_repo.edit_one(
            tournament_id, {"lifecycle_status": LifecycleTournamentStatus.TOURNAMENT_ENDED},
        )
        await uow.commit()

    async def get_personal_info(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        user: UserModel,
    ):
        tournament = await uow.tournament_repo.get_full_tournament(TournamentModel.id == tournament_id)
        raise_not_found_if_none(tournament, tournament_id)

        registration = await uow.registration_repo.get_full_user_tournament_participant(
            tournament_id=tournament_id, user_id=user.id,
        )
        if not registration:
            raise HTTPException(
                status_code=404,
                detail="Tournament registration not found.",
            )

        return TournamentPersonalReadSchema.model_validate(
            tournament,
            context={"participant": registration},
        )

    async def get_with_regulation(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        user: UserModel,
    ) -> TournamentRegulationReadSchema:
        tournament = await uow.tournament_repo.get_full_tournament(
            TournamentModel.id == tournament_id,
        )
        raise_not_found_if_none(tournament, tournament_id)

        return TournamentRegulationReadSchema.model_validate(tournament)


async def get_participant_id(
    uow: AsyncUnitOfWork,
    tournament_id: int,
    account_id: int | None,
) -> int | None:
    if account_id is None:
        return None
    if account_id:
        participant = await uow.registration_repo.find_one(
            tournament_id=tournament_id,
            account_id=account_id,
        )
        participant_id = participant.id if participant else None
    else:
        participant_id = None
    return participant_id
