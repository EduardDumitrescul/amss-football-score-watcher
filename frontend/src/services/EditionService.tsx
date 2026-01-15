import type { CreateEditionRequest } from '../dto/CreateEditionRequest';
import type { EditionDashboardDto } from '../dto/EditionDashboardDto';

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

export const getEditionDashboard = async (editionId: string): Promise<EditionDashboardDto> => {
    const response = await fetch(`${API_URL}/${editionId}/dashboard`);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch dashboard: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
};