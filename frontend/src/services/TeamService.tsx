import type { Team } from '../models/Team';
import type { TeamFormData } from '../pages/CreateTeamPage';

const API_BASE_URL = 'http://localhost:8080/api/teams';

/**
 * Fetches all teams from the backend API.
 */
export const getAllTeams = async (): Promise<Team[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch teams: ${response.statusText}`);
  }
  return await response.json() as Team[];
};

/**
 * Fetches a single team by its ID.
 */
export const getTeamById = async (id: string): Promise<Team> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Team not found with id: ${id}`);
    }
    throw new Error(`Failed to fetch team: ${response.statusText}`);
  }
  return await response.json() as Team;
};

/**
 * Submits new team data to the backend.
 */
export const createTeam = async (teamData: TeamFormData): Promise<Team> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teamData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create team: ${response.statusText}`);
  }
  return await response.json() as Team;
};
