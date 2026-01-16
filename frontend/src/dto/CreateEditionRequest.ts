export interface CreateEditionRequest {
    name: string;
    competitionId: string;
    strategyType: string;
    teamsIds: string[];
}