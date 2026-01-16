export interface MatchListDto {
    id: string;
    homeTeamName: string;
    awayTeamName: string;
    homeGoals: number;
    awayGoals: number;
    matchDate: string;
    status: string;
}

export interface StandingsEntryDto {
    teamId: string;
    teamName: string;
    poIntegers: number;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
}

export interface EditionDashboardDto {
    editionId: string;
    competitionId: string;
    editionName: string;
    competitionName: string;
    table: StandingsEntryDto[]; // Empty if Knockout
    rounds: MatchListDto[][];
}