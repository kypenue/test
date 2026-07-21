import { Api as api } from "../api";
import {
    EliminationBracketRequestArgs,
    DrawSwissParticipantsArgs,
    GetCurrentUserSeriesArgs,
    GetDEParticipantsArgs,
    GetEliminationsParticipantsArgs,
    GetEliminationsStageRatingArgs,
    GetLastTournamentSeries,
    GetSwissParticipantsArgs,
    GetUserSeriesArgs,
    GetWildcardParticipantsArgs,
    InnerSeries,
    LastSeries,
    MatchesModel,
    PairModel,
    Pairs,
    Participant,
    ParticipantsDraw,
    ParticipantsModel,
    ParticipantsResponse,
    SeriesDE,
    SeriesPlayersWithGroups,
    SeriesWildcard,
    SwissCalculatorArgs,
    SwissSettingsArgs,
    TeamModel,
    TeamsResponse,
    TournamentBlockResponse,
    TournamentCreationModel,
    TournamentListModel,
    TournamentListRequestArgs,
    TournamentModel,
    TournamentParticipantsArgs,
    TournamentPersonalInfoModel,
    TournamentRegisterRequestArgs,
    TournamentRegisterResponse,
    TournamentRegulation,
    TournamentRequestArgs,
    TournamentSetReglamentArgs,
    TournamentSetStatusArgs,
    TournamentsResponse,
    UpdateBracketRequestArgs,
    ForecastBetRatingRequestArgs,
    ForecastBetRatingResponse,
} from "@/shared/types/models/Tournament";
import {
    PaginatedRequest,
    PaginatedResponse,
} from "@/shared/types/models/common";
import { MatchType } from "@g-loot/react-tournament-brackets/dist/esm";

export const addTagTypes = [
    "BRACKET",
    "TOURNAMENT",
    "TOURNAMENTS",
    "TOURNAMENT_PARTICIPANTS",
    "TOURNAMENT_PARTICIPANTS_TOSS",
    "TOURNAMENT_PERSONAL",
    "PAIRS",
    "TOURNAMENT_PARTICIPANTS_PAIR",
    "SERIES",
    "BLOCKED_USERS",
    "SWISS_ROUND_PARTICIPANTS",
    "STAGE",
    "STAGES",
    "USER_SERIES",
    "WILDCARD_ROUND_PARTICIPANTS",
    "DE_ROUND_PARTICIPANTS",
    "ELIMINATION_ROUND_PARTICIPANTS",
    "FORECAST_BETS_RATING",
] as const;
const tournamentApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            createTournament: build.mutation<
                TournamentModel,
                TournamentCreationModel
            >({
                query: (body) => ({
                    url: `/tournaments/`,
                    method: "POST",
                    body,
                }),
                invalidatesTags: ["TOURNAMENT_PARTICIPANTS"],
            }),
            getTournamentById: build.query<
                TournamentModel,
                TournamentRequestArgs
            >({
                query: ({ id }) => ({ url: `/tournaments/${id}` }),
                providesTags: ["TOURNAMENT"],
            }),
            getTournamentByIdPersonalInfo: build.query<
                TournamentPersonalInfoModel,
                TournamentRequestArgs
            >({
                query: ({ id }) => ({ url: `/tournaments/${id}/me` }),
                providesTags: ["TOURNAMENT_PERSONAL"],
            }),
            getTournamentParticipants: build.query<
                PaginatedResponse<Array<ParticipantsModel>>,
                TournamentParticipantsArgs
            >({
                query: ({ id, ...params }) => ({
                    url: `/tournaments/${id}/participants`,
                    params: params,
                }),
                providesTags: ["TOURNAMENT_PARTICIPANTS"],
            }),
            getTournamentParticipantsToss: build.query<
                Array<ParticipantsModel>,
                TournamentParticipantsArgs
            >({
                query: ({ id }) => ({
                    url: `/tournaments/${id}/participants?order_by=updated_at&order_by=team_id&team_id__isnull=true&is_team_shown=false&per_page=1000&status=3`,
                }),
                transformResponse: (data: ParticipantsResponse) => {
                    return data.payload;
                },
                providesTags: ["TOURNAMENT_PARTICIPANTS_TOSS"],
            }),
            getTournamentParticipantsPairs: build.query<
                Array<ParticipantsModel>,
                TournamentParticipantsArgs
            >({
                query: ({ id }) => ({
                    url: `/tournaments/${id}/participants?assigned_to_tournament=false&per_page=1000&status=3`,
                }),
                transformResponse: (data: ParticipantsResponse) => {
                    return data.payload;
                },
                providesTags: ["TOURNAMENT_PARTICIPANTS_PAIR"],
            }),
            setParticipantStatus: build.mutation<
                TournamentRegisterResponse,
                { tournamentId: string; participantId: number; status: number }
            >({
                query: ({ tournamentId, participantId, ...body }) => ({
                    url: `/tournaments/${tournamentId}/participants/${participantId}`,
                    method: "POST",
                    body,
                }),
                invalidatesTags: ["TOURNAMENT_PARTICIPANTS"],
            }),
            setParticipantBlock: build.mutation<
                TournamentBlockResponse,
                { userId: number; blocked_until?: string }
            >({
                query: ({ userId }) => ({
                    url: `/tournaments/users/${userId}/block`,
                    method: "POST",
                    body: {
                        blocked_until: "2040-07-15T00:30:00+03:00",
                    },
                }),
                invalidatesTags: ["TOURNAMENT_PARTICIPANTS"],
            }),
            getBlockedParticipants: build.query<
                PaginatedResponse<Array<ParticipantsModel>>,
                TournamentParticipantsArgs
            >({
                query: ({ id }) => ({
                    url: `/tournaments/users/block`,
                }),
                providesTags: ["BLOCKED_USERS"],
            }),
            removeParticipantBlock: build.mutation<
                TournamentBlockResponse,
                { userId: number }
            >({
                query: ({ userId }) => ({
                    url: `/tournaments/users/${userId}/block`,
                    method: "DELETE",
                }),
                invalidatesTags: ["TOURNAMENT_PARTICIPANTS", "BLOCKED_USERS"],
            }),
            registerForTournament: build.mutation<
                TournamentRegisterResponse,
                TournamentRegisterRequestArgs
            >({
                query: ({ id, ...body }) => ({
                    url: `/tournaments/${id}/register`,
                    method: "POST",
                    body,
                }),
                invalidatesTags: ["TOURNAMENT"],
            }),
            getTeams: build.query<Array<TeamModel>, TournamentRequestArgs>({
                query: ({ id }) => ({ url: `/tournaments/${id}/teams` }),
                transformResponse: (data: TeamsResponse) => {
                    return data.payload;
                },
                providesTags: ["TOURNAMENT_PARTICIPANTS"],
            }),
            setParticipantTeam: build.mutation<
                ParticipantsModel,
                { tournamentId: string; participantId: number }
            >({
                query: ({ tournamentId, participantId }) => ({
                    url: `/tournaments/${tournamentId}/participants/${participantId}/assign-team`,
                    method: "POST",
                }),
                invalidatesTags: [
                    "TOURNAMENT_PARTICIPANTS",
                    "TOURNAMENT_PARTICIPANTS_TOSS",
                ],
            }),
            getBracket: build.query<
                MatchesModel | MatchType[],
                EliminationBracketRequestArgs
            >({
                query: ({ tournamentId, stageId, deStageId, seStageId }) => {
                    return {
                        url: `/tournaments/${tournamentId}/stages/${stageId}/${deStageId ? "de-stages" : "se-stages"}/${deStageId || seStageId}/bracket`,
                    };
                },
                providesTags: ["BRACKET"],
            }),
            updateBracket: build.mutation<
                MatchesModel,
                UpdateBracketRequestArgs
            >({
                query: ({ tournamentId, seriesId, ...body }) => ({
                    url: `/tournaments/${tournamentId}/move-player/${seriesId}`,
                    body,
                    method: "PUT",
                }),
                invalidatesTags: ["BRACKET"],
            }),
            setBracket: build.mutation<MatchesModel, TournamentRequestArgs>({
                query: ({ id }) => ({
                    url: `/tournaments/${id}/compose-bracket`,
                    method: "POST",
                }),
            }),
            getTournamentRegulations: build.query<
                TournamentRegulation,
                TournamentRequestArgs
            >({
                query: ({ id }) => ({ url: `/tournaments/${id}/regulations` }),
                providesTags: ["TOURNAMENT"],
            }),
            setNewRound: build.mutation<any, TournamentRequestArgs>({
                query: ({ id }) => ({
                    url: `/tournaments/${id}/open-new-round`,
                    method: "POST",
                }),
                invalidatesTags: ["BRACKET"],
            }),
            getTournaments: build.query<
                PaginatedResponse<Array<TournamentListModel>>,
                TournamentListRequestArgs
            >({
                query: ({ ...params }) => ({
                    url: "/tournaments/",
                    params: params,
                }),
                providesTags: ["TOURNAMENTS"],
            }),
            setTournamentStatus: build.mutation<any, TournamentSetStatusArgs>({
                query: ({ id, ...body }) => ({
                    url: `/tournaments/${id}/set-lifecycle-status`,
                    method: "POST",
                    body,
                }),
                invalidatesTags: ["TOURNAMENT", "TOURNAMENTS"],
            }),
            setTournamentReglament: build.mutation<
                TournamentModel,
                TournamentSetReglamentArgs
            >({
                query: ({ id, ...body }) => ({
                    url: `/tournaments/${id}`,
                    method: "PATCH",
                    body,
                }),
                invalidatesTags: ["TOURNAMENT"],
            }),
            countSwissTable: build.mutation<any, SwissCalculatorArgs>({
                query: ({ tournamentId, ...body }) => ({
                    url: `/tournaments/${tournamentId}/swiss-calculator`,
                    method: "POST",
                    body,
                }),
                invalidatesTags: ["TOURNAMENTS", "TOURNAMENT"],
            }),
            saveSwissSettings: build.mutation<any, SwissSettingsArgs>({
                query: ({ tournamentId, stageId, swissStageId, ...body }) => ({
                    url: `/tournaments/${tournamentId}/stages/${stageId}/swiss-stages/${swissStageId}`,
                    method: "PUT",
                    body,
                }),
                invalidatesTags: [
                    "TOURNAMENTS",
                    "TOURNAMENT",
                    "STAGE",
                    "STAGES",
                ],
            }),
            drawAllParticipants: build.mutation<any, DrawSwissParticipantsArgs>(
                {
                    query: ({
                        tournamentId,
                        stageId,
                        swissStageId,
                        roundId,
                        stageType,
                        deStageId,
                        seStageId,
                        ...body
                    }) => ({
                        url: `/tournaments/${tournamentId}/stages/${stageId}/${stageType}-stages/${swissStageId || deStageId || seStageId}/rounds/${roundId}/draw-all`,
                        method: "POST",
                        body,
                    }),
                    invalidatesTags: [
                        "SWISS_ROUND_PARTICIPANTS",
                        "PAIRS",
                        "TOURNAMENT_PARTICIPANTS_PAIR",
                        "ELIMINATION_ROUND_PARTICIPANTS",
                    ],
                },
            ),
            drawOneParticipant: build.mutation<any, DrawSwissParticipantsArgs>({
                query: ({
                    tournamentId,
                    stageId,
                    swissStageId,
                    roundId,
                    stageType,
                    deStageId,
                    seStageId,
                    ...body
                }) => ({
                    url: `/tournaments/${tournamentId}/stages/${stageId}/${stageType}-stages/${swissStageId || deStageId || seStageId}/rounds/${roundId}/draw-one`,
                    method: "POST",
                    body,
                }),
                invalidatesTags: [
                    "SWISS_ROUND_PARTICIPANTS",
                    "PAIRS",
                    "TOURNAMENT_PARTICIPANTS_PAIR",
                    "ELIMINATION_ROUND_PARTICIPANTS",
                ],
            }),
            getSwissParticipantsForDraw: build.query<
                Array<ParticipantsDraw>,
                GetSwissParticipantsArgs
            >({
                query: ({ tournamentId, stageId, swissStageId, roundId }) => ({
                    url: `/tournaments/${tournamentId}/stages/${stageId}/swiss-stages/${swissStageId}/rounds/${roundId}/draw-participants`,
                }),
                providesTags: ["SWISS_ROUND_PARTICIPANTS"],
            }),
            getParticipantsPair: build.query<
                SeriesPlayersWithGroups,
                GetSwissParticipantsArgs
            >({
                query: ({
                    tournamentId,
                    stageId,
                    swissStageId,
                    deStageId,
                    seStageId,
                    stageType,
                    roundId,
                    ...body
                }) => {
                    return {
                        url: `/tournaments/${tournamentId}/stages/${stageId}/${stageType}-stages/${swissStageId || seStageId || deStageId || "swiss"}/rounds/${roundId}`,
                        params: body,
                    };
                },
                providesTags: [
                    "SWISS_ROUND_PARTICIPANTS",
                    "ELIMINATION_ROUND_PARTICIPANTS",
                ],
            }),
            getEliminationParticipantsForDraw: build.query<
                Array<Participant>,
                GetEliminationsParticipantsArgs
            >({
                query: ({
                    tournamentId,
                    stageId,
                    deStageId,
                    seStageId,
                    stageType,
                    roundId,
                    ...body
                }) => ({
                    url: `/tournaments/${tournamentId}/stages/${stageId}/${stageType}-stages/${deStageId || seStageId}/rounds/${roundId}/draw-participants`,
                    params: body,
                }),
                providesTags: ["ELIMINATION_ROUND_PARTICIPANTS"],
            }),
            getEliminationParticipantsPair: build.query<
                SeriesPlayersWithGroups,
                GetEliminationsParticipantsArgs
            >({
                query: ({
                    tournamentId,
                    stageId,
                    seStageId,
                    deStageId,
                    stageType,
                    roundId,
                    ...body
                }) => ({
                    url: `/tournaments/${tournamentId}/stages/${stageId}/${stageType}-stages/${deStageId || seStageId}/rounds/${roundId}`,
                    params: body,
                }),
                providesTags: ["ELIMINATION_ROUND_PARTICIPANTS"],
            }),
            getWildcardParticipantsPair: build.query<
                SeriesWildcard,
                GetWildcardParticipantsArgs
            >({
                query: ({
                    tournamentId,
                    stageId,
                    wildcardStageId,
                    roundId,
                    ...body
                }) => ({
                    url: `/tournaments/${tournamentId}/stages/${stageId}/wildcard-stages/${wildcardStageId}/rounds/${roundId}`,
                    params: body,
                }),
                providesTags: ["WILDCARD_ROUND_PARTICIPANTS"],
            }),
            getLastTournamentSeries: build.query<
                PaginatedResponse<Array<LastSeries>>,
                PaginatedRequest<GetLastTournamentSeries>
            >({
                query: ({ ...params }) => ({
                    url: `/tournaments/series/all-series`,
                    params,
                }),
            }),
            getUserSeries: build.query<
                PaginatedResponse<Array<InnerSeries>>,
                GetUserSeriesArgs
            >({
                query: ({ userId, ...params }) => ({
                    url: `/tournaments/users/${userId}/series`,
                    params,
                }),
                providesTags: ["USER_SERIES"],
            }),
            getCurrentUserSeries: build.query<
                PaginatedResponse<Array<InnerSeries>>,
                GetCurrentUserSeriesArgs
            >({
                query: () => ({
                    url: `/tournaments/series/my`,
                }),
                providesTags: ["USER_SERIES"],
            }),
            getForecastBetRating: build.query<
                ForecastBetRatingResponse,
                ForecastBetRatingRequestArgs
            >({
                query: ({ tournamentId }) => ({
                    url: `/tournaments/${tournamentId}/forecast-bets-rating`,
                }),
                providesTags: ["FORECAST_BETS_RATING"],
            }),
        }),
        overrideExisting: false,
    });
export { tournamentApi };

export const {
    useGetTournamentByIdQuery,
    useRegisterForTournamentMutation,
    useGetTournamentParticipantsQuery,
    useSetParticipantStatusMutation,
    useGetTeamsQuery,
    useSetParticipantTeamMutation,
    useGetTournamentParticipantsTossQuery,
    useGetTournamentByIdPersonalInfoQuery,
    useGetBracketQuery,
    useSetBracketMutation,
    useUpdateBracketMutation,
    useGetTournamentRegulationsQuery,
    useSetNewRoundMutation,
    useSetParticipantBlockMutation,
    useCreateTournamentMutation,
    useGetTournamentsQuery,
    useSetTournamentStatusMutation,
    useSetTournamentReglamentMutation,
    useGetBlockedParticipantsQuery,
    useRemoveParticipantBlockMutation,
    useCountSwissTableMutation,
    useSaveSwissSettingsMutation,
    useGetSwissParticipantsForDrawQuery,
    useDrawAllParticipantsMutation,
    useDrawOneParticipantMutation,
    useGetParticipantsPairQuery,
    useGetUserSeriesQuery,
    useGetWildcardParticipantsPairQuery,
    useGetLastTournamentSeriesQuery,
    useGetEliminationParticipantsForDrawQuery,
    useGetEliminationParticipantsPairQuery,
    useGetForecastBetRatingQuery,
} = tournamentApi;
