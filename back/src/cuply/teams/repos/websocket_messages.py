from sqlalchemy import select, exists
from sqlalchemy.orm import selectinload

from config import ConfigEnv
from backlib.repos import BaseAsyncRepo
from cuply.teams.models import WebSocketTeamMessageModel, WebSocketTeamMessageDeliveryModel


class WebSocketTeamMessageAsyncRepo(BaseAsyncRepo):
    model = WebSocketTeamMessageModel

    def get_full_message_query(self, *filters):
        return select(WebSocketTeamMessageModel).filter(*filters).options(
            selectinload(WebSocketTeamMessageModel.deliveries)
        )

    async def get_full_message(self, *filters):
        result = await self.session.execute(self.get_full_message_query(*filters))
        return result.scalar_one_or_none()

    async def get_full_messages(self, *filters):
        result = await self.session.execute(self.get_full_message_query(*filters))
        return result.scalars().all()

    async def get_not_delivered_messages(
        self, *filters,
    ):
        result = await self.session.execute(
            self.get_full_message_query(
                ~exists().where(
                    (WebSocketTeamMessageDeliveryModel.message_id == WebSocketTeamMessageModel.id) &
                    (WebSocketTeamMessageDeliveryModel.worker_id == ConfigEnv.WORKER_ID) &
                    (WebSocketTeamMessageDeliveryModel.created_at >= ConfigEnv.WORKER_START_DATETIME),
                ),
                *filters,
            ),
        )
        return result.scalars().all()


class WebSocketTeamMessageDeliveryAsyncRepo(BaseAsyncRepo):
    model = WebSocketTeamMessageDeliveryModel
