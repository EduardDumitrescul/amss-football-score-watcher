import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMatch } from '../services/MatchService';
import { getAllTeams } from '../services/TeamService';
import type { CreateMatchFormData } from '../dto/CreateMatchRequest';
import {
    Container,
    Typography,
    Paper,
    Box,
    TextField,
    Button,
    CircularProgress,
    Alert,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material';
import {getAllCompetitions} from "../services/CompetitionService.tsx";
import {getAllEditions} from "../services/EditionService.tsx";

type Team = {
    id: string;
    name: string;
};

type Competition = {
    id: string;
    name: string;
};

type Edition = {
    id: string;
    name: string;
    competitionId: string;
};

type EditionOption = {
    id: string;
    label: string;
};

export const CreateMatchPage: React.FC = () => {
    const [homeTeamId, setHomeTeamId] = useState<string>('');
    const [awayTeamId, setAwayTeamId] = useState<string>('');
    const [editionId, setEditionId] = useState<string>('');
    const [dateTime, setDateTime] = useState<string>(() => {
        const d = new Date();
        const tzOffset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
    });
    const [teams, setTeams] = useState<Team[]>([]);
    const [editionOptions, setEditionOptions] = useState<EditionOption[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const [fetchedTeams, fetchedCompetitions, fetchedEditions] = await Promise.all([
                    getAllTeams(),
                    getAllCompetitions(),
                    getAllEditions()
                ]);

                if (mounted) {
                    setTeams(fetchedTeams);

                    const compMap = new Map<string, string>();
                    fetchedCompetitions.forEach((c: Competition) => compMap.set(c.id, c.name));

                    const options: EditionOption[] = fetchedEditions.map((e: Edition) => {
                        const compName = compMap.get(e.competitionId) || 'Unknown Competition';
                        return {
                            id: e.id,
                            label: `${compName} - ${e.name}`
                        };
                    });

                    options.sort((a, b) => a.label.localeCompare(b.label));
                    setEditionOptions(options);
                }
            } catch (e) {
                if (mounted) setError(e instanceof Error ? e.message : 'Failed to load data');
            } finally {
                if (mounted) setFetching(false);
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!homeTeamId || !awayTeamId) {
            setError('Both teams must be selected.');
            return;
        }
        if (homeTeamId === awayTeamId) {
            setError('Home and away teams must be different.');
            return;
        }
        if (!dateTime) {
            setError('Date and time are required.');
            return;
        }
        if (!editionId) {
            setError('Edition is required.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const normalized = dateTime.length === 16 ? `${dateTime}:00` : dateTime;
            const payload: CreateMatchFormData = {
                homeTeamId,
                awayTeamId,
                matchDate: normalized,
                editionId,
            };
            const newMatch = await createMatch(payload);
            navigate(`/matches/${newMatch.id}`);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred');
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Create New Match
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    {fetching ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="edition-label">Edition</InputLabel>
                                <Select
                                    labelId="edition-label"
                                    id="edition"
                                    value={editionId}
                                    label="Edition"
                                    onChange={(e) => setEditionId(e.target.value as string)}
                                >
                                    {editionOptions.map((opt) => (
                                        <MenuItem key={opt.id} value={opt.id}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <InputLabel id="home-team-label">Home Team</InputLabel>
                                <Select
                                    labelId="home-team-label"
                                    id="home-team"
                                    value={homeTeamId}
                                    label="Home Team"
                                    onChange={(e) => setHomeTeamId(e.target.value as string)}
                                >
                                    {teams.map((t) => (
                                        <MenuItem key={t.id} value={t.id}>
                                            {t.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <InputLabel id="away-team-label">Away Team</InputLabel>
                                <Select
                                    labelId="away-team-label"
                                    id="away-team"
                                    value={awayTeamId}
                                    label="Away Team"
                                    onChange={(e) => setAwayTeamId(e.target.value as string)}
                                >
                                    {teams.map((t) => (
                                        <MenuItem key={t.id} value={t.id}>
                                            {t.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="dateTime"
                                label="Date & Time"
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                                value={dateTime}
                                onChange={(e) => setDateTime(e.target.value)}
                            />

                            {error && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Create Match'}
                            </Button>
                        </>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};