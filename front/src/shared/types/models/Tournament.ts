import { MatchType } from "@g-loot/react-tournament-brackets/dist/esm";
import { GameModel, PlatformModel } from "@/shared/types/models/Games";
import { UserModel } from "@/shared/types/models/User";
import {
    StageSchema,
    TournamentSchema,
} from "@/shared/validation/tournamentSchema";
import { TournamentStage } from "@/shared/types/models/Stages";
import { MatchPlayerResultModel } from "@/shared/types/models/Series";
import { PaginatedRequest } from "@/shared/types/models/common";
import { Community } from "@/services/Communities/community.model";
import { PlayableTeam } from "@/services/Teams/teams.model";

export const TOURNAMENT_ROLES_MAP = {
    ORGANIZER: "ORGANIZER",
    MODERATOR: "MODERATOR",
} as const;

export type TOURNAMENT_ROLES = keyof typeof TOURNAMENT_ROLES_MAP;

export interface TournamentRequestArgs {
    id: string;
}

export interface TournamentParticipantsArgs {
    id?: string;
    team_id__isnull?: boolean;
    order_by?: string;
    is_team_shown?: boolean;
    withTeam?: boolean;
    per_page?: number;
    page?: number;
    status?: number;
    search?: string;
    team_id?: string;
}

export interface TournamentRegisterRequestArgs {
    id: string;
    account_id: string;
}

export interface TournamentRegisterResponse {
    id: number;
    tournament: Pick<TournamentModel, "id" | "creator" | "name">;
    user: Pick<UserModel, "id" | "name" | "surname" | "email" | "username">;
    account_id: number;
    status: number;
}

export interface TournamentBlockResponse {
    id: number;
    creator: {
        id: number;
        name: string;
        surname: string;
        username: string;
    };
    user: {
        id: number;
        name: string;
        surname: string;
        username: string;
    };
    blocked_until: string;
}

export interface LogoModel {
    id: number;
    name: string;
    owner_id: number;
    bucket: string;
    object_key: string;
    content_category: string;
    is_removed: boolean;
    created_at: string;
    updated_at: string;
}

export interface TournamentModel {
    id: number;
    name: string;
    creator: CreatorModel;
    game: Omit<GameModel, "created_at" | "updated_at">;
    min_age: number;
    description: string;
    platforms: Array<PlatformModel>;
    registration_start: string;
    registration_end: string;
    tournament_start: string;
    tournament_end: string;
    tournament_format: string;
    participants_number: number;
    rules_info: string;
    contacts_info: string;
    registration_status: number;
    lifecycle_status: number;
    created_at: string;
    updated_at: string;
    regulation: string;
    should_limit_participants: boolean;
    stages: Array<TournamentStage>;
    cover_image?: LogoModel | null;
    header_image?: LogoModel;
    tournament_roles: Array<TOURNAMENT_ROLES>;
    teams_used: boolean;
    community: Pick<
        Community,
        "id" | "title" | "creator" | "games" | "description" | "slug"
    > | null;
}

export interface TournamentCreationModel
    extends Omit<
        TournamentSchema,
        "tournament_dates" | "registration_dates" | "game_id"
    > {
    tournament_format: string | null;
    rules_info: string | null;
    regulation: string | null;
    contacts_info: string | null;
    registration_start: string;
    registration_end: string;
    tournament_start: string;
    tournament_end: string;
    game_id: number;
    cover_image_id: string | null;
    header_image_id: string | null;
    teams_used: boolean;
}

type PaymentType = "FREE" | "PAYED" | "PAYED_COMMUNITY";

export interface TournamentListModel {
    id: number;
    name: string;
    description: string;
    tournament_format: string;
    rules_info: string;
    regulation: string | null;
    contacts_info: string;
    game_id: number;
    registration_type: string;
    registration_start: string;
    registration_end: string;
    tournament_start: string;
    tournament_end: string;
    registration_status: number;
    lifecycle_status: number;
    min_age: number;
    participants_number: number;
    should_limit_participants: boolean;
    cover_image?: LogoModel | null;
    header_image: LogoModel;
    stages: Array<StageSchema>;
    platforms: Array<PlatformModel>;
    game: Omit<GameModel, "created_at" | "updated_at">;
    teams_used: boolean;
}

export interface CreatorModel {
    id: number;
    name: string;
    surname: string;
    email: string;
    username: string;
}

export interface ParticipantsModel {
    id: number;
    tournament: Pick<TournamentModel, "id" | "name" | "creator">;
    account: Participant;
    status: 1 | 2 | 3 | 4;
    created_at: string;
    updated_at: string;
    team: TeamModel | null;
    is_team_shown: boolean;
}

export type ParticipantAccountUser = Pick<
    UserModel,
    | "id"
    | "name"
    | "surname"
    | "username"
    | "city"
    | "country"
    | "birth_date"
    | "tg_login"
>;

export interface Participant {
    id: number;
    game: Pick<GameModel, "id" | "name">;
    platform: Pick<PlatformModel, "id" | "name">;
    login: string;
    user: ParticipantAccountUser;
    created_at: string;
    updated_at: string;
    team?: TeamModel | null;
}

export interface Tournament {
    id: number;
    name: string;
    creator: CreatorModel;
}

export interface TeamModel {
    id: number;
    name: string;
    description: string | null;
    tournament: Tournament;
    creator: CreatorModel;
    logo: LogoModel | null;
    image?: LogoModel | null;
    logo_id?: number;
}

export interface TournamentPersonalInfoModel {
    participant: {
        id: number;
        tournament: Pick<TournamentModel, "id" | "name" | "creator">;
        account: Participant;
        status: number;
        team: TeamModel;
        is_team_shown: boolean;
        created_at: string;
        updated_at: string;
    };
}

export interface UpdateBracketRequestArgs {
    tournamentId: string;
    seriesId: string;
    player1_id?: string;
    player2_id?: string;
}

export interface MatchesModel {
    upper: MatchType[];
    lower: MatchType[];
}

export interface Series {
    id: string;
    tournament_id: number;
    short_id: string;
    branch_type: number;
    state: number;
    is_bye: boolean;
    is_initial: boolean;
    round: number;
    next_winner_id: string;
    gamer1_id?: number;
    gamer2_id?: number | null;
    updated_at: string;
}

export interface PairModel {
    gamer1: ParticipantsModel;
    gamer2?: ParticipantsModel;
    series?: Series;
    id?: string;
}

export interface SwissPairModel {
    gamer1: Participant;
    gamer2?: Participant;
    id?: string;
}

export interface Pairs {
    id: string;
    tournament_id: number;
    short_id: string;
    branch_type: number;
    state: number;
    is_bye: boolean;
    is_initial: boolean;
    round: number;
    next_winner_id: string;
    next_loser_id: string;
    gamers_assigned_at: string;
    gamer1: Participant;
    gamer2: Participant | null;
    is_team_shown: boolean;
    created_at: string;
    updated_at: string;
}

export interface FullSeries extends Series {
    gamer1: ParticipantsModel;
    gamer2?: ParticipantsModel;
    gamer1_score: number;
    gamer2_score: number;
    matches: MatchInSeries[];
}

export interface NewParticipant {
    account: Participant;
    created_at: string;
    id: number;
    status: number;
    tournament_id: number;
    updated_at: string;
    team: PlayableTeam;
}

export interface LastSeries extends Series {
    gamer1: Participant;
    gamer2?: Participant;
    gamer1_score: number;
    gamer2_score: number;
    matches: MatchInSeries[];
    participant1: NewParticipant;
    participant2: NewParticipant;
}

export interface TournamentRegulation {
    id: number;
    name: string;
    creator: CreatorModel;
    regulation: string;
}

export type TournamentListRequestArgs = PaginatedRequest<{
    tournament_end__lt?: number;
    tournament_end__gte?: number;
    lifecycle_status__neq?: number;
    lifecycle_status__in?: Array<number>;
    show_recommended?: boolean;
    show_my?: boolean;
    community_id?: string;
    can_manage?: boolean;
}>;

export interface TournamentSetStatusArgs {
    id: number;
    lifecycle_status: number;
}

export interface SwissCalculatorArgs {
    tournamentId: string;
    losses_count: number;
    players_count: number;
    wins_count: number;
}

export interface SwissSettingsArgs {
    tournamentId: string;
    stageId: string;
    swissStageId: string;
    loses_needed: number;
    wins_needed: number;
}

export const _STAGES_URL = {
    SWISS: "swiss-stages",
    WILDCARD: "wildcard-stages",
    DOUBLE_ELIMINATION: "de-stages",
    SINGLE_ELIMINATION: "se-stages",
    GROUPS: "groups-stages",
} as const;

export interface DrawSwissParticipantsArgs {
    tournamentId: string;
    stageId: string;
    swissStageId?: string;
    deStageId?: string;
    seStageId?: string;
    roundId: string;
    stageType: (typeof _STAGES_URL)[keyof typeof _STAGES_URL];
}

export interface GetSwissStageRatingArgs {
    tournamentId: string;
    stageId: string;
    swissStageId: string;
    page?: number;
    per_page?: number;
    order_by?: string;
    search?: string;
}

export interface GetSwissParticipantsArgs {
    tournamentId: string;
    stageId: string;
    deStageId?: string;
    seStageId?: string;
    swissStageId?: string;
    stageType?: string;
    roundId: string;
    assigned?: boolean;
    per_page?: number;
    page?: number;
    status?: string;
    new_first?: boolean;
}

export interface GetEliminationsStageRatingArgs {
    tournamentId: string;
    stageId: string;
    deStageId?: string;
    seStageId?: string;
    stageType: string;
    page?: number;
    per_page?: number;
    order_by?: string;
    search?: string;
}

export interface GetEliminationsParticipantsArgs {
    tournamentId: string;
    stageId: string;
    deStageId?: string;
    seStageId?: string;
    stageType: string;
    roundId: string;
    is_assigned?: boolean;
    per_page?: number;
    page?: number;
    status?: string;
}

export interface GetWildcardParticipantsArgs {
    tournamentId: string;
    stageId: string;
    wildcardStageId: string;
    roundId: string;
    assigned?: boolean;
    per_page?: number;
    page?: number;
    status?: number;
}

export interface GetDEParticipantsArgs {
    tournamentId: string;
    stageId: string;
    deStageId?: string;
    seStageId?: string;
    roundId: string;
    assigned?: boolean;
    per_page?: number;
    page?: number;
    status?: number;
}

export interface GetUserSeriesArgs {
    userId: string | number;
    per_page?: number;
    page?: number;
    order_by?: string;
}

export interface GetCurrentUserSeriesArgs {
    per_page?: number;
    page?: number;
}

export interface TournamentSetReglamentArgs {
    id: number;
    tournament_format?: string;
    rules_info?: string;
    regulation?: string;
    contacts_info?: string | null;
    cover_image_id?: number | null;
    header_image_id?: number | null;
}

export interface SeriesPlayersWithGroups {
    id: string;
    round_number: number;
    status: string;
    series: Series[];
    series_groups: SeriesGroup[];
}

export interface SeriesWildcard {
    id: string;
    round_number: number;
    status: string;
    series: Array<{ id: string; series: InnerSeries }>;
}

export interface SeriesGroup {
    id: string;
    wins_number: number;
    loses_number: number;
    participants_number: number;
    series: Series[];
}

export const SERIES_STATUSES = {
    NOT_ASSIGNED: "NOT_ASSIGNED",
    NOT_STARTED: "NOT_STARTED",
    PLAYING: "PLAYING",
    PLAYED: "PLAYED",
} as const;

export const SERIES_RESULT_STATUSES = {
    DRAW: "DRAW",
    WIN: "WIN",
    LOSE: "LOSE",
} as const;

export const SERIES_STATUSES_TEXT = {
    NOT_ASSIGNED: "Не назачены игроки",
    NOT_STARTED: "Не начат",
    PLAYING: "В игре",
    PLAYED: "Закончен",
} as const;

export interface Series {
    id: string;
    series: InnerSeries;
    status: keyof typeof SERIES_STATUSES;
}

export interface InnerSeries {
    id: string;
    gamer1_score: number;
    gamer2_score: number;
    gamer1: Gamer;
    gamer2: Gamer;
    matches: MatchInSeries[];
    status: keyof typeof SERIES_STATUSES;
    result_status?: keyof typeof SERIES_RESULT_STATUSES;
    tournament_id: string;
    participant1?: NewParticipant;
    participant2?: NewParticipant;
}

export interface MatchInSeries {
    guest_player_id: number;
    home_player_id: number;
    match_number: null | number;
    status: number;
    id: string;
    result: MatchPlayerResultModel;
}

export interface Gamer {
    id: number;
    game: Game;
    platform: Platform;
    login: string;
    user: User;
    created_at: string;
    updated_at: string;
}

export interface Game {
    id: number;
    name: string;
}

export interface Platform {
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
    surname: string;
    username: string;
    birth_date: string;
    city: string;
    country: string;
    tg_login: string;
}

export type ParticipantModelDraw = Pick<ParticipantsModel, "account" | "team">;

export interface ParticipantsDraw {
    id: number;
    wins_number: number;
    loses_number: number;
    participants: Array<ParticipantModelDraw>;
}

export interface ParticipantsResponse {
    page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
    payload: Array<ParticipantsModel>;
}

export interface TeamsResponse {
    page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
    payload: Array<TeamModel>;
}

export interface TournamentsResponse {
    page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
    payload: Array<TournamentListModel>;
}

export const SWISS_RATING_STATUSES = {
    WILD_CARD_CALC: "Ожидает WILD CARD",
    DEFEATED: "Участие завершено",
    PLAYING: "В игре",
    SUCCEEDED: "В следующий этап",
    WILD_CARD: "WILD CARD",
};

export interface SwissRatingModel {
    number: number;
    account: Gamer;
    status: keyof typeof SWISS_RATING_STATUSES;
    wins_number: number;
    loses_number: number;
    opponent_equal_win_and_loses_number: number;
    opponent_wins: number;
    opponent_matches_number: number;
    opponent_matches_win_score: number;
    opponent_matches_lose_score: number;
    opponent_matches_score_diff_avg: number;
    opponent_goals_difference_average: number;
    opponent_win_average: number;
    series: InnerSeries[];
    team?: TeamModel | null;
}

export interface EliminationBracketRequestArgs {
    tournamentId: string;
    stageId: string;
    deStageId?: string;
    seStageId?: string;
}

export interface WinnerDE {
    id: string;
    short_id: string;
    branch_type: string;
}

export interface SeriesGroupDE {
    id: string;
    round_number: number;
    status: string;
    series: InnerSeries;
    branch_type: string;
    short_id: string;
    next_winner: WinnerDE;
    next_loser: WinnerDE;
}

export interface SeriesDE {
    id: string;
    round_number: number;
    status: string;
    series: Array<SeriesGroupDE>;
}

export interface GetLastTournamentSeries {
    status: keyof typeof SERIES_STATUSES;
}

export interface ForecastBetRatingRequestArgs {
    tournamentId: string;
}

export interface ForecastBetRatingItem {
    user: User;
    rating: number;
}

export interface ForecastBetRatingResponse {
    page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
    payload: ForecastBetRatingItem[];
}
