interface LeaderboardItem {
    game_name: string;
    games_count: number;
    login: string;
    position: number;
    rating: number;
}

export interface RatingResponse {
    page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
    payload: Array<LeaderboardItem>;
}

export interface RatingRequest {
    game_id: number;
    page?: number;
    per_page?: number;
    platform_id?: number;
}
