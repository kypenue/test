import type {
    PaginatedRequest,
    PaginatedResponse,
} from "@/shared/types/models/common";
import type { FileModel } from "@/services/Files/file.model";
import type { GameModel } from "@/shared/types/models/Games";
import type { CreatorModel, Gamer } from "@/shared/types/models/Tournament";

export type AccessType =
    | "PUBLIC"
    | "PRIVATE"
    | "TOURNAMENT"
    | "TOURNAMENT_INTERNAL";

export interface Image {
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

export interface PlayableTeam {
    id: string;
    name: string;
    access_type: AccessType;
    image: FileModel | null;
    game: Omit<GameModel, "created_at" | "updated_at"> & {
        image: string | null;
    };
}

export interface ProfileTeam {
    id: string;
    name: string;
    tournament: { id: number; name: string; description: string | null } | null;
    source_team: PlayableTeam | null;
    created_at: string;
    updated_at: string;
    access_type: AccessType;
    image: FileModel | null;
    creator: CreatorModel | null;
    game: Omit<GameModel, "created_at" | "updated_at"> & {
        image: Image | null; //TODO: проверить так ли
    };
    available_places: number | null;
    taken_places: number;
}

interface Request {
    search?: string;
    access_type?: AccessType;
    creator_id?: number | string;
    tournament_id?: number | string;
    source_team_id?: string;
    game_id?: number | string;
}

export type ProfileTeamsRequest = PaginatedRequest<Request>;
export type ProfileTeamsResponse = PaginatedResponse<Array<ProfileTeam>>;

export interface CreateProfileTeam {
    name: string;
    access_type: AccessType;
    image_id: number | null;
    game_id: number;
}

export interface UpdateProfileTeam {
    id: string;
    name: string;
    image_id: number | null;
}

// Additional types for new endpoints
export interface CopyToTournamentWriteSchema {
    team_id: string;
    access_type: AccessType;
}

export interface TournamentRegisteredUserReadSchema {
    id: number;
    tournament_id: number;
    account: Gamer;
    status: string;
    team: {
        id: string;
        name: string;
        access_type: AccessType;
        image: FileModel | null;
        game: Omit<GameModel, "created_at" | "updated_at"> & {
            image: string | null;
        };
    } | null;
    created_at: string;
    updated_at: string;
}

interface TournamentTeamsRequest {
    search?: string;
    access_type?: AccessType;
    creator_id?: number;
    source_team_id?: string;
    game_id?: number;
}

export type TournamentTeamsParams = PaginatedRequest<TournamentTeamsRequest>;

export interface AssignTeamParams {
    tournament_id: number;
    participant_id: number;
    team_id: string;
}

export interface RemoveTeamParams {
    tournament_id: number;
    participant_id: number;
}

export interface TeamDrawResponse {
    id: number;
    tournament_id: number;
    account: Gamer;
    status: number;
    team: {
        id: string;
        name: string;
        access_type: string;
        image: Image;
        game: Omit<GameModel, "created_at" | "updated_at"> & {
            image: Image | null;
        };
    };
    created_at: string;
    updated_at: string;
}
