import type { FileModel } from "@/services/Files/file.model";

export interface GameModel {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
    min_age?: number | null;
    disclaimer?: string | null;
    legal_info?: string | null;
    image?: FileModel | null;
    cover_image?: FileModel | null;
}

export interface PlatformModel {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface GamerModel {
    id: number;
    game: GameModel;
    platform: PlatformModel;
    login: string;
    user_id?: number;
    created_at: string;
    updated_at: string;
}

export interface GamerMutationModel {
    id: number;
    game_id: string;
    platform_id: string;
    login: string;
}

export interface GamerCreateMutationModel
    extends Omit<GamerMutationModel, "id"> { }

export interface GamersTableColumns extends GamerModel {
    gamesDictionary: Array<GameModel>;
    platformsDictionary: Array<PlatformModel>;
}

export interface GamerAccountsRequestArgs {
    page?: number;
    per_page?: number;
    order_by?: string;
    search?: string;
    user_id?: string;
    game_id?: string | number;
    platform_id?: string;
}
