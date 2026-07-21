import {
    CreatorModel,
    Game,
    TOURNAMENT_ROLES,
} from "@/shared/types/models/Tournament";
import { FileModel } from "@/services/Files/file.model";
import { UserModel } from "@/shared/types/models/User";
import {
    PaginatedRequest,
    PaginatedResponse,
} from "@/shared/types/models/common";

export interface GetCommunityByIdArgs {
    communityId: string;
}

export interface CreateCommunityArgs {
    title: string;
    description: string;
    social_links: string[];
    game_ids: number[];
    avatar_id: number;
    header_id: number;
}

export interface Community {
    id: string;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    creator: CreatorModel;
    avatar: FileModel;
    header: FileModel;
    social_links: string[];
    games: Game[];
    community_roles: string[];
    slug: string;
}

export type GetCommunityByIdResponse = Community;

//TODO: уточнить
export type GetCommunitiesResponse = PaginatedResponse<
    Array<
        Pick<
            Community,
            "id" | "title" | "creator" | "games" | "description" | "slug"
        >
    >
>;

export type GetCommunitiesArgs = PaginatedRequest<{
    creator_id?: string | number;
}>;

export interface UpdateCommunityArgs {
    communityId: string;
    title?: string;
    description?: string;
    social_links?: string[];
    game_ids?: number[];
    avatar_id?: number;
    header_id?: number;
    slug?: string;
}

export interface DeleteCommunityArgs {
    communityId: string;
}

export interface AssignCommunityRoleArgs {
    user_id: number;
    role_type: TOURNAMENT_ROLES;
    communityId: string;
}

export interface CommunityRole {
    id: string;
    user: UserModel;
    community: Pick<
        Community,
        "id" | "title" | "creator" | "games" | "description"
    >;
    role_type: TOURNAMENT_ROLES;
}

export interface RemoveCommunityRoleArgs {
    communityId: string;
    userRoleId: string;
}

export type AssignCommunityRoleResponse = CommunityRole;

export type GetCommunityRolesResponse = Array<CommunityRole>;
