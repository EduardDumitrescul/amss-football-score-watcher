export interface CreateCompetitionRequest {
    competitionName: string;
    editionName: string; 
    strategyType: string;
    teamIds: string[];
}