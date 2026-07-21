import abc
from uuid import UUID
from typing import Optional, List

from backlib.repo_helpers import raise_not_found_if_none
from cuply.accounts.models import AccountModel
from cuply.auth.models import UserModel
from cuply.base.services.caching.cache import Cache
from cuply.stages.exceptions.stages import (
    StageNotEndedException,
    StageAlreadyStartedException,
)
from cuply.stages.models import (
    StageModel,
    TournamentStageTypes,
    TournamentStageStatus,
    StageParticipantModel,
    StageParticipantStatus,
)
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.stages.schemas.stages import TournamentStageFullReadSchema
from cuply.tournaments.models import TournamentModel
from cuply.tournaments.services.permissions import TournamentPermissionService


class TournamentStageService:
    """ Service to manage tournaments """
    def __init__(self):
        self.permission_service = TournamentPermissionService()

    async def check_has_enough_data(
        self,
        uow: AsyncUnitOfWork,
        stage: StageModel,
        user: UserModel,
    ):
        """ Checks if the stage has enough data to be started. """
        if not await self.permission_service.check_can_manage_tournament(
            uow, user, tournament_id=stage.tournament_id, raise_exc=False,
        ):
            return None

        stage_service = self.get_stage_type_service(stage)()
        return await stage_service.check_has_enough_data(uow, stage, user)

    async def get_stage_or_raise_404(
        self,
        uow: AsyncUnitOfWork,
        stage_id: UUID,
        *filters,
    ):
        stage = await uow.stages_repo.get_tournament_stage_with_rounds(StageModel.id == stage_id, *filters)
        raise_not_found_if_none(stage, stage_id)
        return stage

    @classmethod
    def get_stage_type_service(cls, stage: StageModel):
        """ Get appropriate service for stage type. """
        from cuply.stages.services.swiss.stage import SwissStageService
        from cuply.stages.services.wildcard.stage import WildcardStageService
        from cuply.stages.services.de.stage import DEStageService
        from cuply.stages.services.se.stage import SEStageService

        match stage.stage_type:
            case TournamentStageTypes.LEAGUE:
                raise NotImplementedError()
            case TournamentStageTypes.SINGLE_ELIMINATION:
                stage_service = SEStageService
            case TournamentStageTypes.DOUBLE_ELIMINATION:
                stage_service = DEStageService
            case TournamentStageTypes.SWISS:
                stage_service = SwissStageService
            case TournamentStageTypes.WILDCARD:
                stage_service = WildcardStageService
            case _:
                raise NotImplementedError()

        return stage_service

    async def get_stage(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        user: UserModel,
    ) -> TournamentStageFullReadSchema:
        """ Get stage details in tournament. """
        stage = await self.get_stage_or_raise_404(
            uow, stage_id, StageModel.tournament_id == tournament_id,
        )
        return TournamentStageFullReadSchema.model_validate(
            stage, context={
                'has_enough_data': await self.check_has_enough_data(uow, stage, user),
            },
        )

    async def get_stages(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        user: UserModel,
    ) -> List[TournamentStageFullReadSchema]:
        """ Get stages in tournament. """
        stages = await uow.stages_repo.get_tournament_stages_with_rounds(StageModel.tournament_id == tournament_id)
        return [
            TournamentStageFullReadSchema.model_validate(
                stage, context={
                    'has_enough_data': await self.check_has_enough_data(uow, stage, user),
                },
            ) for stage in stages
        ]

    async def start_stage(
        self,
        uow: AsyncUnitOfWork,
        stage: StageModel,
        previous_stage: Optional[StageModel],
    ):
        """ Start current stage. """
        if stage.status != TournamentStageStatus.STAGE_NOT_STARTED:
            raise StageAlreadyStartedException()

        if previous_stage and previous_stage.status != TournamentStageStatus.STAGE_ENDED:
            raise StageNotEndedException()

        participants = await self.get_participants_for_next_round(uow, stage, previous_stage)

        stage_service = self.get_stage_type_service(stage)()
        await stage_service.start_stage(uow, stage, previous_stage, participants)

        if previous_stage and previous_stage.stage_type == TournamentStageTypes.SWISS:
            await Cache.delete(key=f"stages/{previous_stage.id}/swiss-rating")

        await uow.stages_repo.edit_one(stage.id, {
            'status': TournamentStageStatus.STAGE_STARTED,
        })

    async def get_participants_for_next_round(
        self,
        uow: AsyncUnitOfWork,
        stage: StageModel,
        previous_stage: Optional[StageModel],
    ):
        """ Get participants for next round. """
        if previous_stage is None:
            all_participants = await uow.registration_repo.get_approved_users(tournament_id=stage.tournament_id)
            return [participant.account for participant in all_participants]
        else:
            return await self.get_end_participants(uow, previous_stage)

    async def get_required_participants_number(
        self,
        uow: AsyncUnitOfWork,
        stage: StageModel,
    ) -> Optional[int]:
        stage_service = self.get_stage_type_service(stage)()
        return await stage_service.get_required_participants_number(uow, stage)

    async def get_start_participants(
        self,
        uow: AsyncUnitOfWork,
        stage: StageModel,
    ):
        stage_service = self.get_stage_type_service(stage)()
        return await stage_service.get_start_participants(uow, stage)

    async def get_end_participants(
        self,
        uow: AsyncUnitOfWork,
        stage: StageModel,
    ):
        stage_service = self.get_stage_type_service(stage)()
        return await stage_service.get_end_participants(uow, stage)


class AbstractStageService(abc.ABC):
    def __init__(self):
        self.stage_service = TournamentStageService()

    async def check_has_enough_data(
        self,
        uow: AsyncUnitOfWork,
        stage: StageModel,
        user: UserModel,
    ):
        return True

    @abc.abstractmethod
    async def start_stage(
        self,
        uow: AsyncUnitOfWork,
        stage: StageModel,
        previous_stage: StageModel,
        participants: List[AccountModel],
        *args, **kwargs,
    ):
        ...

    async def get_required_participants_number(
        self,
        uow: AsyncUnitOfWork,
        stage: StageModel,
    ):
        return None

    async def get_start_participants(
        self,
        uow: AsyncUnitOfWork,
        stage: StageModel,
        *args, **kwargs,
    ) -> List[AccountModel]:
        stage_participants = await uow.stage_participant.get_full_participant(
            StageParticipantModel.stage_id == stage.id,
        )
        return [participant.account for participant in stage_participants]

    async def get_end_participants(
        self,
        uow: AsyncUnitOfWork,
        stage: StageModel,
        *args, **kwargs,
    ) -> List[AccountModel]:
        stage_participants = await uow.stage_participant.get_full_participant(
            StageParticipantModel.stage_id == stage.id,
            StageParticipantModel.status == StageParticipantStatus.WINNER,
        )
        return [participant.account for participant in stage_participants]


class AbstractRoundService(abc.ABC):
    def __init__(self):
        from cuply.tournaments.services.permissions import TournamentPermissionService

        self.permission_service = TournamentPermissionService()

    @abc.abstractmethod
    async def get_round(self, *args, **kwargs):
        ...

    @abc.abstractmethod
    async def start_round(self, *args, **kwargs):
        ...

    @abc.abstractmethod
    async def end_round(self, *args, **kwargs):
        ...

    async def _get_tournament_or_raise_404(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
    ) -> TournamentModel:
        """ Get tournament by id or raise 404 http exception. """
        tournament = await uow.tournament_repo.find_one(id=tournament_id)
        raise_not_found_if_none(tournament, tournament_id)
        return tournament
