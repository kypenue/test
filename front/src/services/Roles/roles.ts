import { Api as api } from "../api";
import { PolicyModel } from "@/shared/types/models/Base";
import {
    AssignTournamentRoleArgs,
    AssignTournamentRolesResponse,
    GetRolesByTournamentIdArgs,
    GetRolesByTournamentIdResponse,
    RemoveTournamentRoleArgs,
} from "@/services/Roles/roles.model";

export const addTagTypes = ["PERSONAL_ROLES", "TOURNAMENT_ROLES"] as const;
const baseApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getTournamentRoles: build.query<
                GetRolesByTournamentIdResponse,
                GetRolesByTournamentIdArgs
            >({
                query: ({ tournamentId, ...params }) => ({
                    url: `/tournaments/${tournamentId}/roles`,
                    params,
                }),
                providesTags: ["TOURNAMENT_ROLES"],
            }),
            removeTournamentRole: build.mutation<
                void,
                RemoveTournamentRoleArgs
            >({
                query: ({ tournamentId, roleId }) => ({
                    url: `/tournaments/${tournamentId}/roles/${roleId}`,
                    method: "DELETE",
                }),
                invalidatesTags: ["TOURNAMENT_ROLES"],
            }),
            assignTournamentRole: build.mutation<
                AssignTournamentRolesResponse,
                AssignTournamentRoleArgs
            >({
                query: ({ tournamentId, ...body }) => ({
                    url: `/tournaments/${tournamentId}/roles`,
                    method: "POST",
                    body: body,
                }),
                invalidatesTags: ["TOURNAMENT_ROLES"],
            }),
            getCookiesPolicy: build.query<PolicyModel, void>({
                query: () => ({ url: "/base/cookie-policy" }),
                providesTags: ["TOURNAMENT_ROLES"],
            }),
        }),
        overrideExisting: false,
    });

export const {
    useGetTournamentRolesQuery,
    useRemoveTournamentRoleMutation,
    useAssignTournamentRoleMutation,
} = baseApi;
