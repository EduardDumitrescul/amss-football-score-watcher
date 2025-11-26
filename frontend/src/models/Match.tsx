import type {Team} from "./Team.tsx";
import type {Player} from "./Player.tsx";

export enum MatchStatus {
    SCHEDULED = 'SCHEDULED',
    IN_PROGRESS = 'IN_PROGRESS',
    FINISHED = 'FINISHED'
}

export enum MatchEventType {
    GOAL = 'GOAL',
    OWN_GOAL = 'OWN_GOAL',
    ASSIST = 'ASSIST',
    YELLOW_CARD = 'YELLOW_CARD',
    RED_CARD = 'RED_CARD',
    SUBSTITUTION = 'SUBSTITUTION',
    OUT = 'OUT',
    FAULT = 'FAULT',
    PENALTY_SCORED = 'PENALTY_SCORED',
    PENALTY_MISSED = 'PENALTY_MISSED',
    OFFSIDE = 'OFFSIDE',
    INJURY = 'INJURY',
    START = 'START',
    END = 'END'
}

export interface MatchEvent {
    id: string;
    matchId: string;
    type: MatchEventType;
    primaryPlayerId?: string;
    secondaryPlayerId?: string;
    minute?: number;
    details?: string;
}

export interface Match {
    id: string;
    homeTeamName: string;
    awayTeamName: string;
    matchDate: string; // ISO datetime (backend LocalDateTime)
    homeGoals?: number;
    awayGoals?: number;
    status: MatchStatus;
    events?: MatchEvent[];
}

export interface MatchDetailsDto {
    id: string;
    homeTeam?: Team | null;
    awayTeam?: Team | null;
    matchDate?: string | null;
    homeGoals?: number | null;
    awayGoals?: number | null;
    status: MatchStatus | string;
    validated: boolean;
    events?: MatchEvent[] | null;
}