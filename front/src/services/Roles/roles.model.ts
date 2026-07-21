import {
    PaginatedRequest,
    PaginatedResponse,
} from "@/shared/types/models/common";
import {
    TOURNAMENT_ROLES,
    TournamentModel,
} from "@/shared/types/models/Tournament";
import { UserModel } from "@/shared/types/models/User";

export type GetRolesByTournamentIdArgs = PaginatedRequest<{
    tournamentId: string;
    role_type?: TOURNAMENT_ROLES;
}>;

export interface AssignTournamentRoleArgs {
    tournamentId: string;
    user_id: string;
    role_type: TOURNAMENT_ROLES;
}

export interface RemoveTournamentRoleArgs {
    tournamentId: string;
    roleId: string;
}

export interface TournamentRole {
    id: string;
    user: UserModel;
    tournament: Pick<TournamentModel, "id" | "name" | "creator">;
    role_type: TOURNAMENT_ROLES;
}

export type AssignTournamentRolesResponse = TournamentRole;

export type GetRolesByTournamentIdResponse = PaginatedResponse<
    Array<TournamentRole>
>;
