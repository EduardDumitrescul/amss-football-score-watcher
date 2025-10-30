export interface Team {
  id: string;
  name: string;

  // Flattened coach info
  coachId: string | null;
  coachFirstname: string | null;
  coachLastname: string | null;
}

