import type { Team, TeamSummary } from '../models/Team';
import type { CreateTeamFormData } from '../dto/CreateTeamRequest';

const API_BASE_URL = 'http://localhost:8080/api/teams';

/**
 * Fetches all teams from the backend API.
 */
export const getAllTeams = async (): Promise<TeamSummary[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch teams');
  }
  return await response.json() as TeamSummary[];
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
 * Creates a new team.
 */
export const createTeam = async (teamData: CreateTeamFormData): Promise<Team> => {
  console.log('Creating team with data:', teamData);
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teamData),
  });
  if (!response.ok) {
    throw new Error('Failed to create team');
  }
  const newTeam = await response.json();
  console.log('Team created successfully:', newTeam);
  return newTeam as Team;
};

/**
 * Fetches all teams that do not have a coach assigned.
 */
export const getAvailableTeams = async (): Promise<Team[]> => {
  const response = await fetch(`${API_BASE_URL}/available`);
  if (!response.ok) {
    throw new Error('Failed to fetch available teams');
  }
  return await response.json() as Team[];
};

/**
 * Assigns a specific coach to a specific team.
 */
export const assignCoachToTeam = async (teamId: string, coachId: string): Promise<Team> => {
  const response = await fetch(`${API_BASE_URL}/${teamId}/assignCoach/${coachId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to assign coach: ${response.statusText}`);
  }
  return await response.json() as Team;
};

// --- NEW FUNCTION ---
/**
 * Un-assigns (fires) a coach from a team.
 * @param teamId The ID of the team to update.
 * @returns The updated Team object.
 */
export const unassignCoach = async (teamId: string): Promise<Team> => {
  const response = await fetch(`${API_BASE_URL}/${teamId}/unassignCoach`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to unassign coach: ${response.statusText}`);
  }
  return await response.json() as Team;
};
