# cuply/accounts/services/stats_service.py

from typing import List

from sqlalchemy import or_

from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.matches.models import MatchModel, MatchStatus
from cuply.tournaments.schemas.tournaments import TournamentStatsByAccountReadSchema, TournamentShortReadSchema
from logs import cuply_logger

FINAL_STATUSES = {
    MatchStatus.CONFIRMED,
    MatchStatus.CONFIRMED_BY_CRON,
    MatchStatus.CONFIRMED_BY_ORGANIZER,
    MatchStatus.NOT_NECESSARY,
    MatchStatus.ADVANTAGE,
}


class StatsService:
    """
    Сервис для подсчёта статистики в разрезе одного аккаунта (AccountModel).
    - Общая статистика по всем матчам.
    - Статистика по каждому турниру (где данный аккаунт участвовал).
    """

    async def get_account_overall_stats(
            self,
            uow: AsyncUnitOfWork,
            account_id: int
    ) -> dict:
        """
        Считает и возвращает общую статистику (словарь) по всем матчам аккаунта,
        включая:
          - 'rating' (None)
          - 'matches_count'
          - 'wins'
          - 'draws'
          - 'losses'
          - 'goals_scored'
          - 'goals_conceded'
          - 'wins_percent'
          - 'avg_goals_scored'
          - 'avg_goals_conceded'
          - 'clean_sheets_percent'
          - 'biggest_win'
          - 'biggest_loss'
        """
        # 1. Убеждаемся, что аккаунт существует
        account = await uow.account_repo.find_one(id=account_id)
        if not account:
            return {}  # или кинуть исключение
        cuply_logger.info(f"Account ('{account.id}', '{account.login}')")
        # 2. Получаем все матчи, где данный аккаунт - home или guest
        #    Обычно удобнее иметь метод get_full_match_query() / find_all()
        #    фильтруем по (home_player_id == account_id) or (guest_player_id == account_id).
        query = uow.match_repo.get_full_match_query(
            or_(
                MatchModel.home_player_id == account_id,
                MatchModel.guest_player_id == account_id
            ),
            MatchModel.tournament_id != None,
            MatchModel.series_id != None,
        )
        matches = (await uow.session.execute(query)).scalars().all()
        cuply_logger.info(f"Matches count: {len(matches)}")
        # 3. Подсчитываем агрегаты
        stats = self._calculate_stats(matches, account_id)
        return stats

    async def get_account_tournaments_stats(
            self,
            uow: AsyncUnitOfWork,
            account_id: int
    ) -> List[TournamentStatsByAccountReadSchema]:
        """
        Возвращает список статистик аккаунта по каждому турниру.
        Если tournaments[] получается пустым (нет турнирных матчей),
        вернём пустой список.
        """

        account = await uow.account_repo.find_one(id=account_id)
        if not account:
            return []
        cuply_logger.info(f"Account ('{account.id}', '{account.login}')")

        # Фильтруем матчи по (home_player_id == account_id) OR (guest_player_id == account_id).
        query = uow.match_repo.get_full_match_query(
            or_(
                MatchModel.home_player_id == account_id,
                MatchModel.guest_player_id == account_id
            ),
            MatchModel.tournament_id != None,
            MatchModel.series_id != None,
        )
        matches = (await uow.session.execute(query)).scalars().all()
        cuply_logger.info(f"Matches count: {len(matches)}")

        if not matches:
            return []

        # Группируем матчи по tournament_id
        from collections import defaultdict
        matches_by_tournament = defaultdict(list)
        for m in matches:
            if m.tournament_id is not None:
                matches_by_tournament[m.tournament_id].append(m)

        if not matches_by_tournament:
            # Нет ни одного матча с tournament_id != None
            return []

        # Подтянем турниры одним запросом
        all_t_ids = list(matches_by_tournament.keys())
        tournaments = await uow.tournament_repo.find_all_in_ids(all_t_ids)
        tours_map = {t.id: t for t in tournaments}

        result: List[TournamentStatsByAccountReadSchema] = []

        for t_id, t_matches in matches_by_tournament.items():
            tour_obj = tours_map.get(t_id)
            if not tour_obj:
                continue  # на всякий случай

            # Считаем статистику именно по t_matches
            stats_dict = self._calculate_stats(t_matches, account_id)

            # Собираем схемой
            item = TournamentStatsByAccountReadSchema(
                tournament=TournamentShortReadSchema.model_validate(tour_obj),
                rating=stats_dict["rating"],  # None
                matches_count=stats_dict["matches_count"],
                wins=stats_dict["wins"],
                draws=stats_dict["draws"],
                losses=stats_dict["losses"],
                goals_scored=stats_dict["goals_scored"],
                goals_conceded=stats_dict["goals_conceded"],
                wins_percent=stats_dict["wins_percent"],
                avg_goals_scored=stats_dict["avg_goals_scored"],
                avg_goals_conceded=stats_dict["avg_goals_conceded"],
                clean_sheets_percent=stats_dict["clean_sheets_percent"],
                biggest_win=stats_dict["biggest_win"],
                biggest_loss=stats_dict["biggest_loss"],
            )
            result.append(item)

        return result

    def _calculate_stats(self, matches: List[MatchModel], account_id: int) -> dict:
        """
        Считает все метрики по списку матчей: wins/draws/losses/goals/etc.
        Возвращает словарь, где rating = None, как просили.
        """
        total_matches = 0
        wins = 0
        draws = 0
        losses = 0
        goals_scored = 0
        goals_conceded = 0
        clean_sheets = 0
        biggest_win = 0
        biggest_loss = 0
        biggest_win_str = None
        biggest_loss_str = None
        for match in matches:
            # игнорируем матчи без результата
            if not match.result:
                continue
            # или игнорируем, если статус не финальный?
            # if match.status not in FINAL_STATUSES:
            #     continue

            home_score = match.result.home_score
            guest_score = match.result.guest_score

            # Определим, играем ли мы за home или guest
            if match.home_player_id == account_id:
                gs = home_score
                gc = guest_score
            else:
                gs = guest_score
                gc = home_score

            # увеличиваем счётчик матчей
            total_matches += 1
            goals_scored += gs
            goals_conceded += gc

            # исход
            if gs > gc:
                wins += 1
                diff = gs - gc
                if diff > biggest_win:
                    biggest_win = diff
                    biggest_win_str = f"{gs}:{gc}"
            elif gs == gc:
                draws += 1
            else:
                losses += 1
                diff = gc - gs
                if diff > biggest_loss:
                    biggest_loss = diff
                    biggest_loss_str = f"{gc}:{gs}"

            # cухой матч
            if gc == 0:
                clean_sheets += 1

        # Считаем проценты и средние
        wins_percent = 0.0
        avg_goals_scored = 0.0
        avg_goals_conceded = 0.0
        clean_sheets_percent = 0.0

        if total_matches > 0:
            wins_percent = round(wins * 100.0 / total_matches, 2)
            avg_goals_scored = round(goals_scored / total_matches, 2)
            avg_goals_conceded = round(goals_conceded / total_matches, 2)
            clean_sheets_percent = round(clean_sheets * 100.0 / total_matches, 2)

        return {
            "rating": None,  # пока None
            "matches_count": total_matches,
            "wins": wins,
            "draws": draws,
            "losses": losses,
            "goals_scored": goals_scored,
            "goals_conceded": goals_conceded,
            "wins_percent": wins_percent,
            "avg_goals_scored": avg_goals_scored,
            "avg_goals_conceded": avg_goals_conceded,
            "clean_sheets_percent": clean_sheets_percent,
            "biggest_win": biggest_win_str,
            "biggest_loss": biggest_loss_str,
        }
