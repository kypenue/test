from collections import defaultdict


class MessageFormatter:
    """Утилитный класс для формирования сообщений Telegram."""

    @staticmethod
    def format_games_message(tournaments: defaultdict) -> str:
        """
        Формирует сообщение с информацией об играх.

        Args:
            tournaments (defaultdict): Словарь, сгруппированный по турнирам, содержащий информацию о матчах.

        Returns:
            str: Отформатированное сообщение для отправки пользователю.
        """
        if not tournaments:
            return "Игры не найдены."

        # Формируем текстовое сообщение
        response = "Ваши текущие игры:\n\n"
        for tournament_id, games in tournaments.items():
            tournament = games[0]
            link = tournament['tournament_link']
            response += (f"🏆 *Турнир*\n"
                         f"[{tournament['tournament_name']}]({link}) ({tournament['game_name']})\n\n")

            game_messages = []
            for game in games:
                game_info = (
                    f"🤝 *Соперник*: {game['opponent']}\n"
                    f"🔗 *Серия*: {game['match']}\n"
                )
                game_messages.append(game_info)  # Добавляем информацию об игре
            # Добавляем разделитель только между играми, если их больше одной
            if len(game_messages) > 1:
                response += "\n\n".join(game_messages)
            else:
                response += "\n".join(game_messages)

        return response