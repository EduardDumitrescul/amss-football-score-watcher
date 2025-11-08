import axios from 'axios';
import type { Contract } from '../models/ContractDto';

const API_URL = 'http://localhost:8080/api/contracts';

export const getContractsByPlayerId = async (playerId: string): Promise<Contract[]> => {
    const response = await axios.get(`${API_URL}/player/${playerId}`);
    return response.data;
};
