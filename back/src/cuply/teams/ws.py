import asyncio
from collections import defaultdict

from fastapi import WebSocket

from config import ConfigEnv
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from logs import cuply_logger

POLLING_INTERVAL: float = 0.3


class TournamentWebsocketConnectionManager:
    def __init__(self):
        self.active_connections = defaultdict(list)

    async def connect(self, tournament_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[tournament_id].append(websocket)

    def disconnect(self, tournament_id, websocket: WebSocket):
        if websocket in self.active_connections[tournament_id]:
            self.active_connections[tournament_id].remove(websocket)

    async def broadcast(self, tournament_id: int, message: dict):
        for conn in self.active_connections[tournament_id]:
            try:
                await conn.send_json(message)
            except Exception:
                self.disconnect(tournament_id, conn)

    async def start_polling(self):
        while True:
            try:
                await asyncio.sleep(POLLING_INTERVAL)
                uow = AsyncUnitOfWork()
                async with uow:
                    await self.poll_messages(uow)
            except Exception as ex:
                cuply_logger.exception(ex)

    async def poll_messages(self, uow: AsyncUnitOfWork):
        messages = await uow.websocket_team_message.get_not_delivered_messages()

        for message in messages:
            await self.broadcast(message.tournament_id, message.value)

            await uow.websocket_team_message_delivery.add_one({
                'worker_id': ConfigEnv.WORKER_ID,
                'message_id': message.id,
            })

        if messages:
            await uow.commit()


manager = TournamentWebsocketConnectionManager()
