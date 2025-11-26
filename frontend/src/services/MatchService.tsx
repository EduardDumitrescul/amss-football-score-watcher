import type {TeamSummary} from "../models/Team.tsx";
import type {MatchDetailsDto} from "../models/Match.tsx";
import type {CreateMatchFormData} from "../dto/CreateMatchRequest.ts";

const API_BASE_URL = 'http://localhost:8080/api/matches';

export const getAllMatches = async (): Promise<TeamSummary[]> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch teams');
    }
    return await response.json() as TeamSummary[];
};

export const getMatchById = async (id: string): Promise<MatchDetailsDto> => {
    const url = `${API_BASE_URL}/${encodeURIComponent(id)}`;
    const response = await fetch(url);

    if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`Failed to fetch match (${response.status} ${response.statusText})${body ? `: ${body}` : ''}`);
    }

    return (await response.json()) as MatchDetailsDto;
};

export const createMatch = async (data: CreateMatchFormData): Promise<MatchDetailsDto> => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`Failed to create match (${response.status} ${response.statusText})${body ? `: ${body}` : ''}`);
    }

    return (await response.json()) as MatchDetailsDto;
};

export const deleteMatch = async (id: string): Promise<void> => {
    if (!id) {
        throw new Error('Invalid match id');
    }
    const url = `${API_BASE_URL}/${encodeURIComponent(id)}`;
    const response = await fetch(url, { method: 'DELETE' });

    if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`Failed to delete match (${response.status} ${response.statusText})${body ? `: ${body}` : ''}`);
    }
};

export const updateMatchDate = async (id: string, matchDate: string): Promise<any> => {
    if (!id) throw new Error('Invalid match id');
    const url = `${API_BASE_URL}/${encodeURIComponent(id)}`;
    const body = JSON.stringify({ matchDate });
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body,
    });

    if (!response.ok) {
        const bodyText = await response.text().catch(() => '');
        throw new Error(`Failed to update match (${response.status} ${response.statusText})${bodyText ? `: ${bodyText}` : ''}`);
    }

    return response.json();
};

export const updateMatch = async (id: string, patch: Partial<Record<string, any>>): Promise<MatchDetailsDto> => {
    if (!id) throw new Error('Invalid match id');
    const url = `${API_BASE_URL}/${encodeURIComponent(id)}`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
    });

    if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`Failed to update match (${response.status} ${response.statusText})${body ? `: ${body}` : ''}`);
    }

    return (await response.json()) as MatchDetailsDto;
};

export const addEvent = async (matchId: string, event: {
    type: string;
    primaryPlayerId?: string | null;
    secondaryPlayerId?: string | null;
    minute?: number | null;
    details?: string | null;
}): Promise<any> => {
    if (!matchId) throw new Error('Invalid match id');
    const url = `${API_BASE_URL}/${encodeURIComponent(matchId)}/events`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
    });

    if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`Failed to add event (${response.status} ${response.statusText})${body ? `: ${body}` : ''}`);
    }

    return await response.json();
};