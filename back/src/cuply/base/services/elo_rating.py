class EloRatingService:
    INITIAL_RATING = 950
    MIN_RATING = 250

    @staticmethod
    def calculate_expected_score(player_rating: float, opponent_rating: float) -> float:
        return 1 / (1 + 10 ** ((opponent_rating - player_rating) / 400))

    @staticmethod
    def get_k_factor(rating: float) -> int:
        if rating <= 1800:
            return 40
        elif rating <= 2100:
            return 20
        elif rating <= 2400:
            return 10
        else:
            return 5

    @staticmethod
    def update_rating(current_rating: float, score: float, expected: float) -> float:
        k = EloRatingService.get_k_factor(current_rating)
        new_rating = current_rating + k * (score - expected)
        # rating cant be lower than MIN_RATING
        return max(new_rating, EloRatingService.MIN_RATING)

    @classmethod
    def update_ratings_for_match(
            cls,
            player_a_rating: float,
            player_b_rating: float,
            player_a_score: float  # 1.0 - win, 0.5 - draw, 0.0 - lost
    ) -> tuple[float, float]:
        if player_a_score == 1:
            player_b_score = 0
        elif player_a_score == 0:
            player_b_score = 1
        else:
            player_b_score = 0.5

        expected_a = cls.calculate_expected_score(player_a_rating, player_b_rating)
        expected_b = cls.calculate_expected_score(player_b_rating, player_a_rating)

        new_rating_a = cls.update_rating(player_a_rating, player_a_score, expected_a)
        new_rating_b = cls.update_rating(player_b_rating, player_b_score, expected_b)

        return new_rating_a, new_rating_b
