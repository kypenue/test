from typing import List
from uuid import UUID

from backlib.pagination import ListPaginator
from cuply.auth.models import UserModel
from cuply.base.services.caching.cache import Cache
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.series.schemas.series import TeamShortReadSchema
from cuply.stages.models import (
    SwissStageModel,
    SwissStageRoundModel,
    SwissStageRoundStatuses,
    StageModel,
    TournamentStageTypes,
    StageParticipantModel,
    StageParticipantStatus,
)
from cuply.stages.schemas.swiss import SwissRatingReadSchema
from cuply.stages.services.swiss.stage import SwissStageService, SwissStageParticipant


class SwissRatingService:
    def __init__(self):
        self.swiss_stage_service = SwissStageService()

    def is_last_round(self, swiss_stage: SwissStageModel):
        max_round: SwissStageRoundModel | None = None
        for swiss_round in swiss_stage.rounds:
            if max_round is None or swiss_round.round_number > max_round.round_number:
                max_round = swiss_round
        if not max_round:
            return False
        return max_round.status in [SwissStageRoundStatuses.ROUND_STARTED, SwissStageRoundStatuses.ROUND_ENDED]

    def get_from_participant_data(self, participant_data: dict) -> List[int]:
        ordered_participants = sorted(
            participant_data, key=lambda p_id: (
                -participant_data[p_id].wins,
                participant_data[p_id].loses,
                -participant_data[p_id].opponent_win_average,
                -participant_data[p_id].opponent_goals_difference_average,
            ),
        )
        return ordered_participants

    async def get_rating(
        self,
        uow: AsyncUnitOfWork,
        tournament_id: int,
        stage_id: UUID,
        swiss_stage_id: UUID,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        user: UserModel,
    ):
        value: list = await Cache.get(key=f"stages/{stage_id}/swiss-rating")
        if value:
            return await ListPaginator(
                session=uow.session,
                model_class=None,
                schema_class=SwissRatingReadSchema,
                items=value,
                page=page,
                per_page=per_page,
                order_by=order_by,
                search=search,
            ).get_result()

        tournament = await self.swiss_stage_service.get_tournament_or_raise_404(uow, tournament_id)

        stage: StageModel = await uow.stages_repo.find_one(
            tournament_id=tournament.id,
            id=stage_id,
        )
        next_stage: StageModel = await uow.stages_repo.find_one(
            tournament_id=tournament.id,
            order_number=stage.order_number + 1,
        )

        swiss_stage = await uow.swiss_stage_repo.get_full_stage(SwissStageModel.id == swiss_stage_id)

        participant_data = await self.swiss_stage_service.get_participants_data(uow, tournament, swiss_stage)
        ordered_participants = self.get_from_participant_data(participant_data)

        is_last_round = self.is_last_round(swiss_stage)

        is_wildcard_next = next_stage and next_stage.stage_type == TournamentStageTypes.WILDCARD
        if is_wildcard_next:
            next_stage_participants = await uow.stage_participant.get_full_participant(
                StageParticipantModel.stage_id == next_stage.id,
            )
            next_stage_participants = {
                participant.account_id: participant.status for participant in next_stage_participants
            }
        else:
            next_stage_participants = {}

        result = []

        for num, participant_id in enumerate(ordered_participants, start=1):
            participant = participant_data[participant_id]

            if participant.wins == swiss_stage.wins_needed:
                if is_wildcard_next:
                    next_stage_status = next_stage_participants.get(participant_id)
                    if next_stage_status == StageParticipantStatus.WINNER:
                        status = "SUCCEEDED"
                    elif next_stage_status == StageParticipantStatus.LOSER:
                        status = "DEFEATED"
                    else:
                        status = "WILD_CARD_CALC"
                else:
                    status = "SUCCEEDED"
            elif participant.loses == swiss_stage.loses_needed:
                status = "DEFEATED"
            else:
                if not is_last_round:
                    status = "PLAYING"
                elif is_wildcard_next:
                    next_stage_status = next_stage_participants.get(participant_id)
                    if next_stage_status == StageParticipantStatus.WINNER:
                        status = "SUCCEEDED"
                    elif next_stage_status == StageParticipantStatus.LOSER:
                        status = "DEFEATED"
                    else:
                        status = "WILD_CARD"
                else:
                    status = "PLAYING"

            result.append(
                {
                    'number': num,
                    'account': participant.account,

                    'team': participant.team,

                    'status': status,

                    'wins_number': participant.wins,
                    'loses_number': participant.loses,

                    'opponent_win_matches': participant.opponent_win_matches,
                    'opponent_matches_number': participant.opponent_matches_number,
                    'opponent_win_average': participant.opponent_win_average,

                    'opponent_matches_win_score': participant.opponent_matches_win_score,
                    'opponent_matches_lose_score': participant.opponent_matches_lose_score,
                    'opponent_goals_difference_average': participant.opponent_goals_difference_average,

                    'series': participant.series,
                }
            )

        await Cache.set(
            key=f"stages/{stage_id}/swiss-rating",
            value=[SwissRatingReadSchema.model_validate(item).model_dump(mode='json') for item in result]
        )

        return await ListPaginator(
            session=uow.session,
            model_class=None,
            schema_class=SwissRatingReadSchema,
            items=result,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
        ).get_result()
