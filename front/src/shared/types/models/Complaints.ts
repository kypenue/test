import { MatchModel } from "@/shared/types/models/Series";
import { GamerModel } from "@/shared/types/models/Games";
import { UserModel } from "@/shared/types/models/User";

export interface MatchComplaintsRequestArgs {
    tournamentId: string;
    seriesId: string;
    matchId: string;
    order_by?: string;
}

export interface SeriesComplaintsRequestArgs {
    tournamentId: string;
    seriesId: string;
    order_by?: string;
}

export interface TournamentComplaintsRequestArgs {
    tournamentId: string;
    order_by?: string;
    page: number;
    per_page: number;
}

export interface CreateComplaintsRequestArgs {
    matchId: string;
    tournamentId: string;
    seriesId: string;
    comment: string;
}

export interface UpdateComplaintsRequestArgs {
    matchId: string;
    tournamentId: string;
    seriesId: string;
    complaintId: string;
    resolution_text?: string;
    status: number;
}

export interface ComplaintsAuthor extends GamerModel {
    user: Pick<
        UserModel,
        "id" | "name" | "surname" | "username" | "birth_date"
    >;
}

export interface ComplaintModel {
    id: string;
    author: ComplaintsAuthor;
    comment: string;
    resolution_text: string | null;
    status: number;
    creation_way: number;
    match: MatchModel;
    series_id: string;
    tournament_id: number;
    created_at: string;
    updated_at: string;
}
