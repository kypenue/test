import {
    CreatorModel,
    NewParticipant,
    Participant,
    Series,
    TeamModel,
} from "@/shared/types/models/Tournament";

export interface AllSeriesRequestArgs {
    tournamentId: string;
    order_by?: string;
}

export interface SeriesRequestArgs {
    tournamentId: string;
    seriesId: string;
}

export interface MatchRequestArgs {
    matchId: string;
    tournamentId: string;
    seriesId: string;
}

export interface SeriesOfTournamentUsersRequestArgs {
    userId: string;
    tournamentId: string;
}

export interface GetPreviousSeriesOfUsersArgs {
    user1_id: string;
    user2_id: string;
}

export interface SetMatchRequestArgs {
    id?: string;
    matchId: string;
    tournamentId: string;
    seriesId: string;
    home_score: number;
    guest_score: number;
    video_link?: string | null;
}

export interface UpdateMatchRequestArgs {
    matchId: string;
    tournamentId: string;
    seriesId: string;
    matchResultId: string;
    home_score: number;
    guest_score: number;
    video_link: string;
}

export interface SetOpponentMarkRequestArgs {
    tournamentId: string;
    seriesId: string;
    comment: string;
    opponent_mark: number;
}

export interface GetOpponentMarkResponse {
    id: string;
    comment: string;
    opponent_mark: number;
    created_at: string;
}

export interface GetOpponentMarkArgs {
    tournamentId: string;
    seriesId: string;
}

export interface MatchModel {
    id: string;
    home_player_account: MatchPlayerModel;
    guest_player_account: MatchPlayerModel;
    home_player_team: MatchPlayerTeamModel;
    guest_player_team: MatchPlayerTeamModel;
    home_player_match_result: MatchPlayerResultModel | number;
    guest_player_match_result: MatchPlayerResultModel | number;
    status: number;
    created_at: string;
    updated_at: string;
}

export type MatchPlayerModel = Participant;

export interface MatchPlayerResultModel {
    id: string;
    home_score: number;
    guest_score: number;
    video_link: string;
}

export type MatchPlayerTeamModel = TeamModel;

// Vote interfaces
export interface SeriesVoteStatusRequestArgs {
    tournamentId: string;
    seriesId: string;
}

export const BET_STATUSES = {
    FORECAST_COMPETITION_NOT_ALLOWED: "FORECAST_COMPETITION_NOT_ALLOWED",
    BET_ALLOWED: "BET_ALLOWED",
    BET_FOUND: "BET_FOUND",
    SERIES_ALREADY_PLAYED: "SERIES_ALREADY_PLAYED",
} as const;

export type BET_STATUS = keyof typeof BET_STATUSES;

export interface SeriesVoteStatusResponse {
    status: BET_STATUS;
    bet?: SeriesBet;
}

export interface SeriesBet {
    id: string;
    points: number;
    winner: Participant;
}

export interface CreateSeriesForecastBetRequestArgs {
    tournamentId: string;
    seriesId: string;
    participantId: number;
}

export interface SeriesForecastBetResponse {
    creator: CreatorModel;
    id: string;
    points: number;
    series: Series;
    winner: MatchPlayerModel;
}
