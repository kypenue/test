import { Api as api } from "../api";
import {
    AssignCommunityRoleArgs,
    AssignCommunityRoleResponse,
    CreateCommunityArgs,
    DeleteCommunityArgs,
    GetCommunitiesArgs,
    GetCommunitiesResponse,
    GetCommunityByIdArgs,
    GetCommunityByIdResponse,
    GetCommunityRolesResponse,
    RemoveCommunityRoleArgs,
    UpdateCommunityArgs,
} from "@/services/Communities/community.model";

export const addTagTypes = [
    "COMMUNITY",
    "COMMUNITIES",
    "COMMUNITY_ROLES",
] as const;
const baseApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getCommunityById: build.query<
                GetCommunityByIdResponse,
                GetCommunityByIdArgs
            >({
                query: ({ communityId }) => ({
                    url: `/communities/${communityId}`,
                }),
                providesTags: ["COMMUNITY"],
            }),
            getCommunities: build.query<
                GetCommunitiesResponse,
                GetCommunitiesArgs
            >({
                query: (params) => ({ url: `/communities`, params }),
                providesTags: ["COMMUNITIES"],
            }),
            createCommunity: build.mutation<void, CreateCommunityArgs>({
                query: (body) => ({
                    url: `/communities/`,
                    method: "POST",
                    body,
                }),
                invalidatesTags: ["COMMUNITIES"],
            }),
            updateCommunity: build.mutation<void, UpdateCommunityArgs>({
                query: ({ communityId, ...body }) => ({
                    url: `/communities/${communityId}`,
                    method: "PUT",
                    body,
                }),
                invalidatesTags: ["COMMUNITY"],
            }),
            deleteCommunity: build.mutation<void, DeleteCommunityArgs>({
                query: ({ communityId }) => ({
                    url: `/communities/${communityId}`,
                    method: "DELETE",
                }),
                invalidatesTags: ["COMMUNITY"],
            }),
            assignCommunityRole: build.mutation<
                AssignCommunityRoleResponse,
                AssignCommunityRoleArgs
            >({
                query: ({ communityId, ...body }) => ({
                    url: `/communities/${communityId}/roles`,
                    method: "POST",
                    body,
                }),
                invalidatesTags: ["COMMUNITY_ROLES"],
            }),
            removeCommunityRole: build.mutation<void, RemoveCommunityRoleArgs>({
                query: ({ communityId, userRoleId }) => ({
                    url: `/communities/${communityId}/roles/${userRoleId}`,
                    method: "DELETE",
                }),
                invalidatesTags: ["COMMUNITY_ROLES"],
            }),
            getCommunityRoles: build.query<
                GetCommunityRolesResponse,
                GetCommunityByIdArgs
            >({
                query: ({ communityId }) => ({
                    url: `/communities/${communityId}/roles`,
                    method: "GET",
                }),
                providesTags: ["COMMUNITY_ROLES"],
            }),
        }),
        overrideExisting: false,
    });
export { baseApi };

export const {
    useGetCommunitiesQuery,
    useGetCommunityByIdQuery,

    useUpdateCommunityMutation,
} = baseApi;
