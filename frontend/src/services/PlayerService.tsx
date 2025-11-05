import type { PlayerFormData } from '../components/PlayerCreateForm';
import type { Player, PlayerSummary } from '../models/Player';
import type { CreateContractRequest } from '../dto/CreateContractRequest';

// Base URL for the Player API
const API_BASE_URL = 'http://localhost:8080/api/players';

/**
 * Fetches all players from the backend.
 */
export const getAllPlayers = async (): Promise<PlayerSummary[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch players: ${response.statusText}`);
  }
  return response.json() as Promise<PlayerSummary[]>;
};

/**
 * Fetches a single player by their ID.
 * @param id The UUID of the player.
 */
export const getPlayerById = async (id: string): Promise<Player> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Player not found with id: ${id}`);
    }
    throw new Error(`Failed to fetch player: ${response.statusText}`);
  }
  return response.json() as Promise<Player>;
};

/**

=* Creates a new player.
 * @param playerData The data from the create form.
 */
export const createPlayer = async (playerData: PlayerFormData): Promise<Player> => {
  // Handle empty strings for optional fields
  const payload = {
    ...playerData,
    position: playerData.position || null,
    shirtNumber: playerData.shirtNumber || null,
    nationality: playerData.nationality || null,
    dateOfBirth: playerData.dateOfBirth || null,
  };

  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create player: ${response.statusText}`);
  }
  return response.json() as Promise<Player>;
};

/**
 * Signs a contract for a player with a team.
 * @param contractData The data from the contract form.
 */
export const signContract = async (contractData: CreateContractRequest): Promise<Player> => {
  const response = await fetch(`${API_BASE_URL}/sign-contract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contractData),
  });

  if (!response.ok) {
    throw new Error(`Failed to sign contract: ${response.statusText}`);
  }
  return response.json() as Promise<Player>;
};
