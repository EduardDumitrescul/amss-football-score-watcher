export interface Coach {
  id: string;
  firstname: string;
  lastname: string;
  
  // These are the new flattened properties.
  teamId: string | null;
  teamName: string | null;
}

