import type { CreateEditionRequest } from '../dto/CreateEditionRequest';
import type { EditionDashboardDto } from '../dto/EditionDashboardDto';
import type {Edition} from "../models/Edition.ts";

const API_URL = 'http://localhost:8080/api/editions';

export const createEdition = async (request: CreateEditionRequest): Promise<string> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create edition: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
};

export const getAllEditions = async (): Promise<Edition[]> => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch editions: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
};

export const getEditionDashboard = async (editionId: string): Promise<EditionDashboardDto> => {
    const response = await fetch(`${API_URL}/${editionId}/dashboard`);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch dashboard: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
};

export const updateEdition = async (id: string, name: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name })
    });
    if (!response.ok) throw new Error('Failed to update edition');
};

export const deleteEdition = async (id: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete edition');
};