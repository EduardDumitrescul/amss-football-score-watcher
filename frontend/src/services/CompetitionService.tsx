import type { Competition } from '../models/Competition';
import type { CreateCompetitionRequest } from '../dto/CreateCompetitionRequest';
import type { Edition } from '../models/Edition';

const API_URL = 'http://localhost:8080/api/competitions';
const EDITION_API_URL = 'http://localhost:8080/api/editions';

export const getAllCompetitions = async (): Promise<Competition[]> => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch competitions: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
};

export const getCompetitionById = async (id: string): Promise<Competition> => {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch competition: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
};

export const createCompetition = async (request: CreateCompetitionRequest): Promise<string> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create competition: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    return await response.json();
};

export const getEditionsByCompetitionId = async (competitionId: string): Promise<Edition[]> => {
    const response = await fetch(`${EDITION_API_URL}/by-competition/${competitionId}`);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch editions: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
};

export const updateCompetition = async (id: string, name: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitionName: name })
    });
    if (!response.ok) throw new Error('Failed to update competition');
};

export const deleteCompetition = async (id: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete competition');
};