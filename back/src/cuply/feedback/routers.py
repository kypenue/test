from fastapi import APIRouter, BackgroundTasks
from starlette import status
from starlette.responses import Response

from cuply.dependencies import UOWDepAsync
from cuply.feedback.services import FeedbackService
from cuply.feedback.schemas import FeedbackCreateSchema

router = APIRouter(
    prefix="/feedback",
    tags=["Feedback"],
)


feedback_service = FeedbackService()


@router.post(
    path="/send-feedback",
)
async def add_series_feedback(
    schema: FeedbackCreateSchema,
    uow: UOWDepAsync,
    background_tasks: BackgroundTasks,
):
    async with uow:
        await feedback_service.create(
            schema=schema, uow=uow, background_tasks=background_tasks,
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
