from cuply.auth.models import UserModel
from cuply.dependencies import UOWDepAsync
from cuply.stages.schemas.swiss import SwissCalculatorDto
import pandas as pd
from collections import defaultdict


class SwissCalculatorService:
    async def get_swiss_calculator(
        self,
        uow: UOWDepAsync,
        tournament_id: int,
        schema: SwissCalculatorDto,
        user: UserModel,
    ):
        rounds = []
        max_matches = schema.wins_count + schema.losses_count
        players = schema.players_count

        for i in range(max_matches):
            if i == 0:
                data_dict = {'wins': [0], 'losses': [0], 'players': [players]}
                df = pd.DataFrame(data=data_dict)
                rounds.append(df)
            else:
                prev_round = rounds[i - 1]

                curr_df = pd.DataFrame(data={'wins': [], 'losses': [], 'players': []})
                # Проходим все ряды в предыдущем раунде для того, чтобы разделить победителей и проигравших
                # если остаток от деления на 2 больше 0
                # в нижний ряд записываем число на 1 меньше половины
                # в верхний ряд записываем число на 1 больше половины

                for row in prev_round.iterrows():
                    curr_players_count = row[1]['players']
                    curr_wins = row[1]['wins']
                    curr_losses = row[1]['losses']
                    if curr_wins < schema.wins_count and curr_losses < schema.losses_count:
                        players_up = round(curr_players_count / 2)
                        players_down = int(curr_players_count / 2)
                        if curr_players_count % 2 == 1 and players_up != 1 and players_down != 1:
                            players_up = players_up + 1
                            players_down = players_down - 1
                        new_df = pd.DataFrame(
                            data={
                                'wins': [curr_wins + 1, curr_wins],
                                'losses': [curr_losses, curr_losses + 1],
                                'players': [players_up, players_down]
                            }
                        )
                        curr_df = pd.concat([curr_df, new_df])
                    else:
                        new_df = pd.DataFrame(
                            data={
                                'wins': [curr_wins],
                                'losses': [curr_losses],
                                'players': [curr_players_count]
                            }
                        )
                        curr_df = pd.concat([curr_df, new_df])
                curr_df = (
                    curr_df.groupby(['wins', 'losses'])
                    .agg({'players': 'sum'})
                    .sort_values(by=['losses'], ascending=True)
                    .sort_values(by=['wins'], ascending=False)
                    .reset_index()
                )
                curr_df['cum_sum'] = curr_df['players'].cumsum()
                curr_df['percentage'] = round(100 * curr_df['cum_sum'] / players, 2)
                rounds.append(curr_df)

        res = defaultdict(dict)
        for i in rounds[len(rounds)-1].iterrows():
             row_number = i[0]
             for key, val in i[1].items():
                res[key][row_number] = val

        return res
