export interface AuctionTeamImage {
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

export interface AuctionTeamGame {
    id: number;
    name: string;
    image: string | null;
}

export interface AuctionTeam {
    id: string;
    name: string;
    access_type: string;
    image: AuctionTeamImage;
    game: AuctionTeamGame;
}

export interface AuctionUser {
    id: number;
    name: string;
    surname: string;
    username: string;
    birth_date: string;
    city: string;
    country: string;
    tg_login: string | null;
}

export interface AuctionAccountGame {
    id: number;
    name: string;
    image: string | null;
}

export interface AuctionAccountPlatform {
    id: number;
    name: string;
}

export interface AuctionAccount {
    id: number;
    game: AuctionAccountGame;
    platform: AuctionAccountPlatform;
    login: string;
    user: AuctionUser;
    created_at: string;
    updated_at: string;
    rating: number;
}

export interface AuctionParticipant {
    id: number;
    tournament_id: number;
    account: AuctionAccount;
    status: number;
    team: string | null;
    created_at: string;
    updated_at: string;
}

export interface AuctionBet {
    id: string;
    bet: number;
    participant: AuctionParticipant;
}

export interface AuctionLot {
    team: AuctionTeam;
    max_bet: AuctionBet | null;
    seconds_left: number;
}

export interface AuctionData {
    bet_step: number;
    min_bet: number;
    max_bet: number;
    bet_duration_seconds: number;
    bet_extension_seconds: number;
    lots: AuctionLot[];
    is_started?: boolean;
}

export interface AuctionWebSocketResponse {
    action: string;
    data: AuctionData;
    error_message?: string;
    result?: string;
} 