import { BRACKETS_TYPE, STAGES_TYPE } from "@/shared/constants/bracketsTypes";

export interface StagesRequestArgs {
    tournamentId: number;
}

export interface StageRequestArgs {
    tournamentId: number;
    stageId: string;
}

export const SWISS_ROUND_STATUSES = {
    ROUND_NOT_STARTED: "ROUND_NOT_STARTED",
    WAITING_FOR_DRAW: "WAITING_FOR_DRAW",
    DRAW_STARTED: "DRAW_STARTED",
    WAITING_FOR_START: "WAITING_FOR_START",
    ROUND_STARTED: "ROUND_STARTED",
    ROUND_ENDED: "ROUND_ENDED",
} as const;

export const SWISS_ROUND_STATUSES_TEXT = {
    ROUND_NOT_STARTED: "Раунд не начат",
    ROUND_STARTED: "Раунд начат",
    ROUND_ENDED: "Раунд окончен",
} as const;

export interface SwissRounds {
    id: string;
    round_number: number;
    status: keyof typeof SWISS_ROUND_STATUSES;
}

export interface SingleEliminationStage {
    id: string;
    game_number: number;
    final_game_number: number;
    winner_bracket_advantage: boolean;
    rounds: null;
}

export interface DoubleEliminationStage {
    id: string;
    game_number: number;
    final_game_number: number;
    winner_bracket_advantage: boolean;
    rounds: null;
}

export interface SwissStage {
    id: string;
    stage_type: string; //SWISS_CLASSIC
    add_intermediate?: boolean; // TODO: Убрать
    intermediate_type: string; //WILDCARD TODO: Убрать
    wins_needed: number;
    loses_needed: number;
    rounds: Array<SwissRounds>;
}

export interface LeagueStage {
    id: string;
    rounds: null;
}

export interface WildcardStage {
    id: string;
    game_number: number;
    rounds: null;
}

export interface TournamentStage {
    id: string;
    order_number: number;
    status: STAGES_TYPE;
    stage_type: BRACKETS_TYPE;
    has_enough_data: boolean | null;
    se_stage: SingleEliminationStage | null;
    de_stage: DoubleEliminationStage | null;
    swiss_stage: SwissStage | null;
    league_stage: LeagueStage | null;
    wildcard_stage: WildcardStage | null;
}
