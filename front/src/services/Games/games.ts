import { Api as api } from "../api";
import type {
    GameModel,
    GamerCreateMutationModel,
    GamerModel,
    GamerMutationModel,
    PlatformModel,
} from "@/shared/types/models/Games";
import type { GamerAccountsRequestArgs } from "@/shared/types/models/Games";
import type { PaginatedResponse } from "@/shared/types/models/common";
import type { Tournament } from "@/shared/types/models/Tournament";

const addTags = {
    GAMES: "GAMES",
    PLATFORMS: "PLATFORMS",
    GAMERS: "GAMERS",
    STATS: "STATS",
} as const;
export const addTagTypes = Object.keys(addTags);
const userApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getGames: build.query<Array<GameModel>, void>({
                query: () => ({ url: "/games/" }),
                providesTags: ["GAMES"],
                transformResponse: (data: GamesResponse) => {
                    return data.payload;
                },
            }),
            getPlatforms: build.query<Array<PlatformModel>, void>({
                query: () => ({ url: "/platforms/" }),
                providesTags: ["PLATFORMS"],
                transformResponse: (data: PlatformResponse) => {
                    return data.payload;
                },
            }),
            getGamers: build.query<Array<GamerModel>, void>({
                query: () => ({ url: "accounts/me" }),
                providesTags: ["GAMERS"],
                transformResponse: (data: GamerResponse) => {
                    return data.payload;
                },
            }),
            getCurrentUserGamerAccounts: build.query<
                PaginatedResponse<Array<GamerModel>>,
                GamerAccountsRequestArgs
            >({
                query: (params) => ({ url: "accounts/me", params }),
                providesTags: ["GAMERS"],
            }),
            getGamerAccounts: build.query<
                PaginatedResponse<Array<GamerModel>>,
                GamerAccountsRequestArgs
            >({
                query: (params) => ({ url: `accounts/`, params }),
                providesTags: ["GAMERS"],
            }),
            updateGamer: build.mutation<void, GamerMutationModel>({
                query: ({ id, ...body }) => ({
                    url: `/accounts/${id}`,
                    method: "PUT",
                    body,
                }),
                invalidatesTags: ["GAMERS"],
            }),
            createGamer: build.mutation<void, GamerCreateMutationModel>({
                query: ({ ...body }) => ({
                    url: "/accounts/",
                    method: "POST",
                    body,
                }),
                invalidatesTags: ["GAMERS"],
            }),
            deleteGamer: build.mutation<void, string>({
                query: (id) => ({
                    url: `/accounts/${id}`,
                    method: "DELETE",
                }),
                invalidatesTags: ["GAMERS"],
            }),
            getGamerStats: build.query<GamerStats, string>({
                query: (id) => `/accounts/${id}/stats`,
                providesTags: [addTags.STATS],
            }),
            getGamerStatsByTournament: build.query<
                Array<GamerTournamentsStats>,
                string
            >({
                query: (id) => `/accounts/${id}/stats/by-tournaments`,
                providesTags: [addTags.STATS],
            }),
        }),
        overrideExisting: false,
    });
export { userApi };

export interface GamesResponse {
    page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
    payload: Array<GameModel>;
}

export interface PlatformResponse {
    page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
    payload: Array<PlatformModel>;
}

export interface GamerResponse {
    page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
    payload: Array<GamerModel>;
}

interface GamerStats {
    avg_goals_conceded: number;
    avg_goals_scored: number;
    biggest_loss: string;
    biggest_win: string;
    clean_sheets_percent: number;
    draws: number;
    goals_conceded: number;
    goals_scored: number;
    losses: number;
    matches_count: number;
    rating: number | null;
    wins: number;
    wins_percent: number;
}

export interface GamerTournamentsStats extends GamerStats {
    tournament: Tournament;
}

export const {
    useGetGamesQuery,
    useGetPlatformsQuery,
    useGetGamersQuery,
    useUpdateGamerMutation,
    useCreateGamerMutation,
    useDeleteGamerMutation,
    useGetCurrentUserGamerAccountsQuery,
    useGetGamerAccountsQuery,
    useGetGamerStatsQuery,
    useGetGamerStatsByTournamentQuery,
} = userApi;
