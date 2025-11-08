export interface TeamSummary {
  id: string;
  name: string;
  coachName: string | null;
}

export interface Team {
  id:string;
  name: string;
  coachId: string | null;
}
