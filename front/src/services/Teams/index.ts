import { Api } from "@/services/api";
import {
    CreateProfileTeam,
    ProfileTeam,
    ProfileTeamsRequest,
    ProfileTeamsResponse,
    TeamDrawResponse,
    UpdateProfileTeam,
    CopyToTournamentWriteSchema,
    TournamentRegisteredUserReadSchema,
    TournamentTeamsParams,
    AssignTeamParams,
    RemoveTeamParams,
} from "@/services/Teams/teams.model";

const BASE_TEAMS_URL = "/teams/" as const;

const TAGS = {
    TEAMS: "TEAMS",
    TEAM: "TEAM",
    AVAILABLE_TEAMS: "AVAILABLE_TEAMS",
    TOURNAMENT_TEAMS: "TOURNAMENT_TEAMS",
    TOURNAMENT_PARTICIPANTS: "TOURNAMENT_PARTICIPANTS",
    TOURNAMENT_PARTICIPANTS_TOSS: "TOURNAMENT_PARTICIPANTS_TOSS",
} as const;

const tagKeys = Object.keys(TAGS);

const teamsService = Api.enhanceEndpoints({
    addTagTypes: tagKeys,
}).injectEndpoints({
    endpoints: (build) => ({
        getProfileTeams: build.query<ProfileTeamsResponse, ProfileTeamsRequest>(
            {
                query: (params) => ({ url: BASE_TEAMS_URL, params }),
                providesTags: [TAGS.TEAMS],
            },
        ),
        createProfileTeam: build.mutation<ProfileTeam, CreateProfileTeam>({
            query: (body) => ({
                url: BASE_TEAMS_URL,
                body,
                method: "POST",
            }),
            invalidatesTags: [TAGS.TEAMS],
        }),

        getProfileTeamById: build.query<ProfileTeam, string>({
            query: (id) => ({
                url: `${BASE_TEAMS_URL}${id}`,
            }),
            providesTags: [TAGS.TEAMS],
        }),
        updateProfileTeamById: build.mutation<void, UpdateProfileTeam>({
            query: ({ id, ...body }) => ({
                url: `${BASE_TEAMS_URL}${id}`,
                body,
                method: "PUT",
            }),
            invalidatesTags: [TAGS.TEAMS],
        }),
        deleteProfileTeamById: build.mutation<void, string>({
            query: (id) => ({
                url: `${BASE_TEAMS_URL}${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TAGS.TEAMS],
        }),

        // Tournament teams endpoints
        getTournamentTeams: build.query<
            ProfileTeamsResponse,
            { tournament_id: number } & TournamentTeamsParams
        >({
            query: ({ tournament_id, ...params }) => ({
                url: `${BASE_TEAMS_URL}tournaments/${tournament_id}/teams`,
                params,
            }),
            providesTags: [TAGS.TOURNAMENT_TEAMS],
        }),
        getTournamentTeamById: build.query<
            ProfileTeam,
            { tournament_id: number; team_id: string }
        >({
            query: ({ tournament_id, team_id }) => ({
                url: `${BASE_TEAMS_URL}tournaments/${tournament_id}/teams/${team_id}`,
            }),
            providesTags: [TAGS.TEAM],
        }),
        updateTournamentTeam: build.mutation<
            void,
            {
                tournament_id: number;
                team_id: string;
                name: string;
                image_id: number | null;
            }
        >({
            query: ({ tournament_id, team_id, ...body }) => ({
                url: `${BASE_TEAMS_URL}tournaments/${tournament_id}/teams/${team_id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: [TAGS.TOURNAMENT_TEAMS, TAGS.TEAM],
        }),
        deleteTournamentTeam: build.mutation<
            void,
            { tournament_id: number; team_id: string }
        >({
            query: ({ tournament_id, team_id }) => ({
                url: `${BASE_TEAMS_URL}tournaments/${tournament_id}/teams/${team_id}`,
                method: "DELETE",
            }),
            invalidatesTags: [
                TAGS.TOURNAMENT_TEAMS,
                TAGS.TEAM,
                TAGS.AVAILABLE_TEAMS,
            ],
        }),

        copyTeamToTournament: build.mutation<
            ProfileTeam,
            { tournament_id: number | string } & CopyToTournamentWriteSchema
        >({
            query: ({ tournament_id, ...body }) => ({
                url: `${BASE_TEAMS_URL}tournaments/${tournament_id}/copy-team`,
                method: "POST",
                body,
            }),
            invalidatesTags: [
                TAGS.TOURNAMENT_TEAMS,
                TAGS.TEAM,
                TAGS.AVAILABLE_TEAMS,
            ],
        }),
        getAvailableTeams: build.query<
            ProfileTeamsResponse,
            { tournament_id: number } & TournamentTeamsParams
        >({
            query: ({ tournament_id, ...params }) => ({
                url: `${BASE_TEAMS_URL}tournaments/${tournament_id}/available-teams`,
                params,
            }),
            providesTags: [TAGS.AVAILABLE_TEAMS],
        }),
        assignTeamToParticipant: build.mutation<void, AssignTeamParams>({
            query: ({ tournament_id, participant_id, team_id }) => ({
                url: `${BASE_TEAMS_URL}tournaments/${tournament_id}/participants/${participant_id}/assign-team/${team_id}`,
                method: "POST",
            }),
            invalidatesTags: [TAGS.TEAMS, "TOURNAMENT_PARTICIPANTS"],
        }),
        removeTeamFromParticipant: build.mutation<void, RemoveTeamParams>({
            query: ({ tournament_id, participant_id }) => ({
                url: `${BASE_TEAMS_URL}tournaments/${tournament_id}/participants/${participant_id}/remove-team`,
                method: "POST",
            }),
            invalidatesTags: [TAGS.TEAMS],
        }),
        drawOne: build.mutation<
            TournamentRegisteredUserReadSchema,
            { tournament_id: number }
        >({
            query: ({ tournament_id }) => ({
                url: `${BASE_TEAMS_URL}tournaments/${tournament_id}/draw-one`,
                method: "POST",
            }),
            invalidatesTags: [TAGS.TOURNAMENT_TEAMS, TAGS.TOURNAMENT_PARTICIPANTS, TAGS.TOURNAMENT_PARTICIPANTS_TOSS],
        }),
    }),
});

export const {
    useGetProfileTeamsQuery,
    useGetProfileTeamByIdQuery,
    useCreateProfileTeamMutation,
    useUpdateProfileTeamByIdMutation,
    useDeleteProfileTeamByIdMutation,
    useGetTournamentTeamsQuery,
    useGetTournamentTeamByIdQuery,
    useUpdateTournamentTeamMutation,
    useDeleteTournamentTeamMutation,
    useCopyTeamToTournamentMutation,
    useGetAvailableTeamsQuery,
    useAssignTeamToParticipantMutation,
    useRemoveTeamFromParticipantMutation,
    useDrawOneMutation,
} = teamsService;
