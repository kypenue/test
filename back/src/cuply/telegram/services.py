import secrets
from collections import defaultdict
from datetime import datetime, timedelta
from typing import List, Optional

import pytz
import telegram
from telegram import ReplyKeyboardMarkup

import config
import constants
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.series.services.series import SeriesService
from cuply.telegram.exceptions import (
    TokenNotFoundError,
    AnotherUsernameError,
    TokenAlreadyUsedError,
    TokenExpiredError,
    UserNotFoundError, UserWithThisAccountAlreadyExists,
)
from cuply.telegram.schemas import UserSetTelegramLoginSchema, TelegramTokenVerifierReadSchema
from cuply.telegram.utils import MessageFormatter
from logs import cuply_logger


class TelegramService:
    """Service для взаимодействия с Telegram API."""

    def __init__(self, token: str = None):
        self.token = token if token is not None else config.ConfigEnv.TELEGRAM_BOT_TOKEN
        self.bot = telegram.Bot(token=self.token)

    async def send_message(self, chat_id: int, message: str, reply_markup=None, parse_mode: str = None,
                           disable_web_page_preview: bool = False, thread_id: Optional[int] = None):
        await self.bot.send_message(
            chat_id=chat_id,
            text=message,
            reply_markup=reply_markup,
            parse_mode=parse_mode,
            disable_web_page_preview=disable_web_page_preview,
            message_thread_id=thread_id,
        )

    async def get_username_by_chat_id(self, chat_id: int) -> Optional[str]:
        chat_info = await self.bot.get_chat(chat_id)
        return chat_info.username


class TelegramTokenVerifierService:
    """Service для верификации аккаунта Telegram."""
    TOKEN_LENGTH = 32

    def __init__(self):
        self.now = datetime.utcnow().replace(tzinfo=pytz.utc)

    async def create_verification_code(
            self,
            uow: AsyncUnitOfWork,
            schema: UserSetTelegramLoginSchema,
            user: UserModel,
    ) -> TelegramTokenVerifierReadSchema:
        """Создаёт токен для верификации Telegram логина."""
        data = schema.model_dump()
        data["user_id"] = user.id
        data["token"] = secrets.token_urlsafe(self.TOKEN_LENGTH)
        data["expires_at"] = self.now + timedelta(seconds=config.ConfigEnv.TELEGRAM_TOKEN_EXPIRATION_TIME_SECONDS)

        verifier_id = await uow.telegram_repo.add_one(data)
        verifier = await uow.telegram_repo.find_one(id=verifier_id)

        await uow.commit()

        return TelegramTokenVerifierReadSchema.model_validate(verifier)

    async def verify_tg_login(
            self,
            uow: AsyncUnitOfWork,
            token: str,
            tg_login: str,
            chat_id: int,
    ):
        """ Verify Telegram login by token. """
        users = await uow.user_repo.find_one(tg_login=tg_login)
        if users:
            raise UserWithThisAccountAlreadyExists()

        verifier = await uow.telegram_repo.find_one(token=token)

        if not verifier:
            raise TokenNotFoundError()
        if str(verifier.tg_login).strip().lower() != str(tg_login).strip().lower():
            raise AnotherUsernameError(specified_username=verifier.tg_login, receiver_username=tg_login)
        if verifier.is_used:
            raise TokenAlreadyUsedError()
        if verifier.expires_at and verifier.expires_at < self.now:
            raise TokenExpiredError()

        # Обновляем информацию о пользователе и помечаем токен как использованный
        await uow.user_repo.edit_one(verifier.user.id, {"tg_login": tg_login, "chat_id": chat_id})
        await uow.telegram_repo.edit_one(verifier.id, {"is_used": True})
        await uow.commit()

    async def get_user_from_telegram_login(
            self,
            uow: AsyncUnitOfWork,
            tg_login: str,
    ) -> UserModel:
        """Получает пользователя по Telegram логину."""
        user = await uow.user_repo.find_one(tg_login=tg_login)

        if not user:
            raise UserNotFoundError()

        return user


class TelegramCommandHandlerService:
    """Service для обработки команд Telegram."""

    def __init__(self,
                 verifier_service: TelegramTokenVerifierService,
                 telegram_service: TelegramService,
                 series_service: SeriesService):
        self.verifier_service = verifier_service
        self.telegram_service = telegram_service
        self.series_service = series_service
        self.message_formatter = MessageFormatter()

    async def handle_verification_start_command(self, uow: AsyncUnitOfWork, token: str, username: str, chat_id: int):
        """Обрабатывает команду /start TOKEN для верификации."""
        user = await self.verifier_service.verify_tg_login(uow, token=token, tg_login=username, chat_id=chat_id)
        feedback = constants.TG_ACCOUNT_VERIFIED
        await self.telegram_service.send_message(chat_id=chat_id, message=feedback)

        # Отправляем меню с кнопкой "Мои игры"
        keyboard = ReplyKeyboardMarkup(
            [["Мои игры"]],
            resize_keyboard=True,
            one_time_keyboard=False
        )
        menu_message = "Добро пожаловать! Выберите действие:"
        await self.telegram_service.send_message(
            chat_id=chat_id,
            message=menu_message,
            reply_markup=keyboard
        )

    async def handle_welcome_start_command(self, uow: AsyncUnitOfWork, username: str, chat_id: int):
        """Обрабатывает команду /start для обычных пользователей."""
        try:
            user = await self.verifier_service.get_user_from_telegram_login(uow, tg_login=username)
        except UserNotFoundError:
            # Пользователь не зарегистрирован
            await self.telegram_service.send_message(
                chat_id=chat_id,
                message="Вы не зарегистрированы. Пожалуйста, используйте ссылку для верификации вашего аккаунта."
            )
            return

        # Пользователь зарегистрирован, отправляем меню
        keyboard = ReplyKeyboardMarkup(
            [["Мои игры"]],
            resize_keyboard=True,
            one_time_keyboard=False
        )
        menu_message = "Добро пожаловать! Выберите действие:"
        await self.telegram_service.send_message(
            chat_id=chat_id,
            message=menu_message,
            reply_markup=keyboard
        )

    async def handle_games_command(self, uow: AsyncUnitOfWork, username: str, chat_id: int):
        """Обрабатывает команду /games или кнопку 'Мои игры'."""
        try:
            user = await self.verifier_service.get_user_from_telegram_login(uow, tg_login=username)
        except UserNotFoundError:
            cuply_logger.info(f"User '{username}' not found by Telegram")
            await self.telegram_service.send_message(
                chat_id=chat_id,
                message="Пользователь не найден. Пожалуйста, свяжите ваш аккаунт."
            )
            return

        # Получаем серии со статусом PLAYING
        series_list = await self.series_service.get_playing_series_for_user(uow, user.id)

        if not series_list:
            await self.telegram_service.send_message(chat_id=chat_id, message="Игры не найдены.")
            return

        # Группируем серии по турнирам с необходимой информацией
        tournaments = defaultdict(list)

        for series in series_list:
            tournament = series.tournament
            if not tournament:
                continue  # Пропускаем серии без турнира

            tournament_id = tournament.id
            tournament_name = series.tournament.name
            tournament_link = f"{config.ConfigEnv.APP_URL}/tournaments/{tournament_id}"

            game_name = series.gamer1.game.name if series.gamer1 and series.gamer1.game else "Неизвестная игра"

            home_username = series.gamer1.login if series.gamer1 and series.gamer1.login else "Unknown"

            guest_username = series.gamer2.login if series.gamer2 and series.gamer2.login else "Unknown"
            match_link = f"{config.ConfigEnv.APP_URL}/tournaments/{tournament_id}/series/{series.id}"

            # Определяем соперника
            if series.gamer1.user_id == user.id:
                opponent_account = series.gamer2
            else:
                opponent_account = series.gamer1

            opponent_city = opponent_account.user.city
            opponent_tg = opponent_account.user.tg_login
            opponent_username = opponent_account.login
            if opponent_tg:
                opponent_link = f"[{opponent_username}](https://t.me/{opponent_tg})"
            else:
                opponent_link = f"{opponent_username}"
            # Формируем запись в турнире
            tournaments[tournament_id].append({
                'tournament_name': tournament_name,
                'tournament_link': tournament_link,
                'game_name': game_name,
                'match': f"[{home_username} - {guest_username}]({match_link})",
                'opponent': f"{opponent_link} ({opponent_city if opponent_city else "Город не указан"})"
            })

        if not tournaments:
            await self.telegram_service.send_message(chat_id=chat_id, message="Игры не найдены.")
            return

        # Формируем текстовое сообщение с использованием MessageFormatter
        response = MessageFormatter.format_games_message(tournaments)

        # Проверяем длину сообщения и разбиваем его, если необходимо
        MAX_LENGTH = 4096
        messages = []
        current_message = ""

        for line in response.split("\n"):
            # +1 для символа переноса строки
            if len(current_message) + len(line) + 1 > MAX_LENGTH:
                messages.append(current_message)
                current_message = line
            else:
                current_message += "\n" + line if current_message else line

        if current_message:
            messages.append(current_message)

        for msg in messages:
            await self.telegram_service.send_message(
                chat_id=chat_id,
                message=msg,
                parse_mode="Markdown",
                disable_web_page_preview=True
            )

    @staticmethod
    def split_message(message: str, max_length: int = 4096) -> List[str]:
        """Разбивает сообщение на части, не превышающие max_length."""
        messages = []
        current_message = ""

        for line in message.split("\n"):
            # +1 для символа переноса строки
            if len(current_message) + len(line) + 1 > max_length:
                messages.append(current_message)
                current_message = line
            else:
                current_message += "\n" + line if current_message else line

        if current_message:
            messages.append(current_message)

        return messages
