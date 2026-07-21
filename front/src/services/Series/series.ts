import { Api as api } from "../api";
import {
    FullSeries,
    InnerSeries,
    TournamentModel,
    TournamentRegisterResponse,
} from "@/shared/types/models/Tournament";
import {
    AllSeriesRequestArgs,
    CreateSeriesForecastBetRequestArgs,
    GetOpponentMarkArgs,
    GetOpponentMarkResponse,
    GetPreviousSeriesOfUsersArgs,
    MatchModel,
    MatchRequestArgs,
    SeriesForecastBetResponse,
    SeriesOfTournamentUsersRequestArgs,
    SeriesRequestArgs,
    SeriesVoteStatusRequestArgs,
    SeriesVoteStatusResponse,
    SetMatchRequestArgs,
    SetOpponentMarkRequestArgs,
    UpdateMatchRequestArgs,
} from "@/shared/types/models/Series";
import { PaginatedResponse } from "@/shared/types/models/common";

export const addTagTypes = [
    "SERIES_ALL",
    "SERIES_PERSONAL",
    "SERIES_ROUND",
    "MATCHES",
    "MATCH",
    "MARK",
    "BETS",
] as const;
const seriesApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getMySeries: build.query<
                PaginatedResponse<Array<InnerSeries>>,
                AllSeriesRequestArgs
            >({
                query: ({ tournamentId, ...params }) => ({
                    url: `/tournaments/${tournamentId}/series/my`,
                    params,
                }),
                providesTags: ["SERIES_ALL"],
            }),
            getSeriesById: build.query<TournamentModel, SeriesRequestArgs>({
                query: ({ tournamentId, seriesId }) => ({
                    url: `/tournament/${tournamentId}/series/${seriesId}`,
                }),
                providesTags: ["SERIES_ROUND"],
            }),
            getMatchesById: build.query<Array<MatchModel>, SeriesRequestArgs>({
                query: ({ tournamentId, seriesId }) => ({
                    url: `/tournaments/${tournamentId}/series/${seriesId}/matches`,
                }),
                transformResponse: (data: MatchesResponse) => {
                    return data.payload;
                },
                providesTags: ["MATCHES"],
            }),
            getMatchById: build.query<MatchModel, MatchRequestArgs>({
                query: ({ tournamentId, seriesId, matchId }) => ({
                    url: `/tournaments/${tournamentId}/series/${seriesId}/matches/${matchId}`,
                }),
                providesTags: ["MATCH"],
            }),
            setMatchResult: build.mutation<
                TournamentRegisterResponse,
                SetMatchRequestArgs
            >({
                query: ({ tournamentId, seriesId, matchId, ...body }) => ({
                    url: `/tournaments/${tournamentId}/series/${seriesId}/matches/${matchId}/match-results`,
                    method: "POST",
                    body,
                }),
                invalidatesTags: ["MATCH", "SERIES_ROUND", "SERIES_PERSONAL"],
            }),
            updateMatchResults: build.mutation<
                TournamentRegisterResponse,
                UpdateMatchRequestArgs
            >({
                query: ({
                    tournamentId,
                    seriesId,
                    matchId,
                    matchResultId,
                    ...body
                }) => ({
                    url: `/tournaments/${tournamentId}/series/${seriesId}/matches/${matchId}/match-results/${matchResultId}`,
                    method: "PATCH",
                    body,
                }),
                invalidatesTags: ["MATCH", "SERIES_ROUND", "SERIES_PERSONAL"],
            }),
            setOpponentMark: build.mutation<
                GetOpponentMarkResponse,
                SetOpponentMarkRequestArgs
            >({
                query: ({ tournamentId, seriesId, ...body }) => ({
                    url: `/tournament/${tournamentId}/series/${seriesId}`,
                    method: "POST",
                    body,
                }),
                invalidatesTags: ["MARK"],
            }),
            getOpponentMark: build.query<
                GetOpponentMarkResponse,
                GetOpponentMarkArgs
            >({
                query: ({ tournamentId, seriesId }) => ({
                    url: `/tournament/${tournamentId}/series/${seriesId}`,
                }),
                providesTags: ["MARK"],
            }),
            getCurrentTournamentUserSeries: build.query<
                PaginatedResponse<Array<InnerSeries>>,
                SeriesOfTournamentUsersRequestArgs
            >({
                query: ({ tournamentId, userId }) => ({
                    url: `/tournaments/${tournamentId}/users/${userId}/series`,
                }),
                providesTags: ["SERIES_PERSONAL"],
            }),
            getPreviousSeriesOfUsers: build.query<
                PaginatedResponse<Array<InnerSeries>>,
                GetPreviousSeriesOfUsersArgs
            >({
                query: ({ user1_id, user2_id }) => ({
                    url: `/tournaments/series/pair`,
                    params: { user1_id, user2_id },
                }),
                providesTags: ["SERIES_PERSONAL"],
            }),
            getSeriesBetStatus: build.query<
                SeriesVoteStatusResponse,
                SeriesVoteStatusRequestArgs
            >({
                query: ({ tournamentId, seriesId }) => ({
                    url: `/tournaments/${tournamentId}/series/${seriesId}/forecast-bets/my`,
                }),
                providesTags: ["BETS"],
            }),
            createForecastBet: build.mutation<
                SeriesForecastBetResponse,
                CreateSeriesForecastBetRequestArgs
            >({
                query: ({ tournamentId, seriesId, participantId }) => ({
                    url: `/tournaments/${tournamentId}/series/${seriesId}/forecast-bets`,
                    method: "POST",
                    body: { winner_id: participantId },
                }),
                invalidatesTags: ["BETS"],
            }),
        }),
        overrideExisting: false,
    });
export { seriesApi };

export interface MatchesResponse {
    page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
    payload: Array<MatchModel>;
}

export const {
    useGetMySeriesQuery,
    useGetMatchesByIdQuery,
    useGetMatchByIdQuery,
    useSetMatchResultMutation,
    useSetOpponentMarkMutation,
    useUpdateMatchResultsMutation,
    useGetCurrentTournamentUserSeriesQuery,
    useGetPreviousSeriesOfUsersQuery,
    useGetSeriesBetStatusQuery,
    useCreateForecastBetMutation,
} = seriesApi;
