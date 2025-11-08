/**
 * Frontend interface for a Player.
 * This should match the PlayerDto from the backend.
 */
export interface Player {
  id: string; 
  firstname: string;
  lastname: string;
  position?: string;
  shirtNumber?: number;
  nationality?: string;
  dateOfBirth?: string;
  teamId?: string;
}

export interface PlayerSummary {
  id: string;
  fullName: string;
  position?: string;
  shirtNumber?: number;
  teamName?: string;
}
