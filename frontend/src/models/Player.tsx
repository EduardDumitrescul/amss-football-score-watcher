/**
 * Frontend interface for a Player.
 * This should match the PlayerDto from the backend.
 */
export interface Player {
  id: string; // UUID is a string in JSON
  firstname: string;
  lastname: string;
  position?: string;
  shirtNumber?: number;
  nationality?: string;
  dateOfBirth?: string; // Dates are typically strings (ISO format) in JSON
  
  // Add team when it's ready in the DTO
  // team?: {
  //   id: string;
  //   name: string;
  // };
}

