from typing import List
from uuid import UUID

from fastapi import HTTPException
from starlette import status

from constants import NOT_ENOUGH_PERMISSIONS_MSG, SERIES_FEEDBACK_ALREADY_EXISTS_MSG, SERIES_FEEDBACK_NO_MATCHES_MSG
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.series.models import SeriesFeedbackModel
from cuply.series.schemas.feedback import (
    SeriesFeedbackReadSchema,
    SeriesFeedbackWithAuthorReadSchema,
    SeriesFeedbackCreateSchema,
    SeriesFeedbackFullCreateSchema,
)


class SeriesFeedbackService:
    async def get_feedbacks_on_user(
        self,
        tournament_id: int,
        series_id: UUID,
        uow: AsyncUnitOfWork,
        user: UserModel,
    ) -> List[SeriesFeedbackReadSchema]:
        feedbacks = await uow.series_feedback_repo.get_full_series_feedback(
            SeriesFeedbackModel.series_id == series_id,
            SeriesFeedbackModel.opponent_id == user.id
        )
        return [SeriesFeedbackReadSchema.model_validate(item) for item in feedbacks]

    async def get_feedbacks(
        self,
        tournament_id: int,
        series_id: UUID,
        uow: AsyncUnitOfWork,
        user: UserModel,
    ) -> List[SeriesFeedbackWithAuthorReadSchema]:
        feedbacks = await uow.series_feedback_repo.get_full_series_feedback(
            SeriesFeedbackModel.series_id == series_id,
        )

        not_have_access = True
        for feedback in feedbacks:
            if feedback.author_id == user.id or feedback.opponent_id == user.id:
                not_have_access = False
        if len(feedbacks) == 0:
            not_have_access = False

        if not_have_access:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=NOT_ENOUGH_PERMISSIONS_MSG
            )

        return [SeriesFeedbackWithAuthorReadSchema.model_validate(item) for item in feedbacks]

    async def add_feedback(
        self,
        tournament_id: int,
        series_id: UUID,
        schema: SeriesFeedbackCreateSchema,
        uow: AsyncUnitOfWork,
        user: UserModel,
    ) -> SeriesFeedbackReadSchema:
        feedbacks = await uow.series_feedback_repo.get_full_series_feedback(
            SeriesFeedbackModel.series_id == series_id,
        )

        for feedback in feedbacks:
            if feedback.author_id == user.id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=SERIES_FEEDBACK_ALREADY_EXISTS_MSG
                )

        matches = await uow.match_repo.find_matches_by_series(series_id=series_id)
        if len(matches) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=SERIES_FEEDBACK_NO_MATCHES_MSG
            )

        if matches[0].guest_player_id == user.id:
            opponent_id = matches[0].home_player_id
        else:
            opponent_id = matches[0].guest_player_id

        feedback_to_add = SeriesFeedbackFullCreateSchema(
            series_id=series_id,
            author_id=user.id,
            opponent_id=opponent_id,
            comment=schema.comment,
            opponent_mark=schema.opponent_mark
        )
        feedback_id = await uow.series_feedback_repo.add_one(
            feedback_to_add.model_dump(exclude_unset=True)
        )

        await uow.commit()

        feedback = await uow.series_feedback_repo.get_full_series_feedback(
            SeriesFeedbackModel.id == feedback_id,
        )
        return SeriesFeedbackReadSchema.model_validate(feedback)
