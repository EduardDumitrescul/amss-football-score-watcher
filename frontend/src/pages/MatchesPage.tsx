import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Paper, Box, CircularProgress, Alert, TableContainer,
    Table, TableHead, TableBody, TableRow, TableCell, Button, FormControl,
    InputLabel, Select, MenuItem, OutlinedInput, ListItemText, Checkbox
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { Match } from "../models/Match";
import { MatchStatus } from "../models/Match";
import { getAllMatches, updateMatch } from "../services/MatchService";

const IN_PROGRESS_WINDOW_MS = 90 * 60 * 1000;

export const MatchesPage: React.FC = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStatuses, setSelectedStatuses] = useState<MatchStatus[]>([]);
    const navigate = useNavigate();
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAllMatches();
                setMatches(data);
                // run immediate status sync for list
                await syncListStatuses(data);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();

        intervalRef.current = window.setInterval(async () => {
            try {
                await syncListStatuses(matches);
            } catch {
                // ignore
            }
        }, 30_000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const determineDesired = (m: Match): string | null => {
        if (!m?.matchDate) return null;
        const matchMs = new Date(String(m.matchDate)).getTime();
        if (Number.isNaN(matchMs)) return null;
        const now = Date.now();
        if (now < matchMs) return 'SCHEDULED';
        if (now >= matchMs && now < (matchMs + IN_PROGRESS_WINDOW_MS)) return 'IN_PROGRESS';
        return 'FINISHED';
    };

    const safeUpdateForList = async (m: Match): Promise<any | null> => {
        if (!m || !m.id) return null;
        const desired = determineDesired(m);
        if (!desired || m.status === desired) return null;
        try {
            // direct transition; ignore per-item failures so list sync continues
            const updated = await updateMatch(m.id, { status: desired });
            return updated;
        } catch {
            return null;
        }
    };

    const syncListStatuses = async (list: Match[]) => {
        if (!list || list.length === 0) return;
        const results = await Promise.allSettled(list.map(async (m) => {
            const updated = await safeUpdateForList(m);
            if (updated) {
                setMatches(prev => prev.map(p => p.id === updated.id ? updated : p));
            }
        }));
        // ignore results
    };

    const sortedMatches = matches
        .slice()
        .sort((a: Match, b: Match) => {
            const aDate = a.matchDate ? new Date(a.matchDate).getTime() : 0;
            const bDate = b.matchDate ? new Date(b.matchDate).getTime() : 0;
            return aDate - bDate;
        });

    const filteredMatches = sortedMatches.filter((m: Match) => {
        return selectedStatuses.length === 0 || selectedStatuses.includes(m.status);
    });

    const handleStatusChange = (e: SelectChangeEvent<unknown>) => {
        const value = e.target.value as string[] | string;
        const arr = typeof value === 'string' ? value.split(',') : value;
        setSelectedStatuses(arr as MatchStatus[]);
    };

    const formatStatus = (s: MatchStatus) =>
        s.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');

    const handleRowClick = (id: string) => {
        navigate(`/matches/${id}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1">Matches</Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <FormControl size="small" sx={{ minWidth: 240 }}>
                            <InputLabel id="status-filter-label">Status</InputLabel>
                            <Select
                                labelId="status-filter-label"
                                multiple
                                value={selectedStatuses}
                                onChange={handleStatusChange}
                                input={<OutlinedInput label="Status" />}
                                renderValue={(selected) => {
                                    const arr = selected as MatchStatus[];
                                    return arr.length ? arr.map(formatStatus).join(', ') : 'All';
                                }}
                            >
                                {Object.values(MatchStatus).map((status) => (
                                    <MenuItem key={status} value={status}>
                                        <Checkbox checked={selectedStatuses.includes(status)} />
                                        <ListItemText primary={formatStatus(status)} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button variant="contained" onClick={() => navigate('/matches/create')}>Add A New Match</Button>
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                )}

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Home</TableCell>
                                <TableCell>Away</TableCell>
                                <TableCell>Score</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredMatches.map((match: Match) => (
                                <TableRow key={match.id} hover onClick={() => handleRowClick(match.id)} sx={{ cursor: 'pointer' }}>
                                    <TableCell component="th" scope="row">{match.homeTeamName}</TableCell>
                                    <TableCell component="th" scope="row">{match.awayTeamName}</TableCell>
                                    <TableCell component="th" scope="row">{`${match.homeGoals ?? 0} - ${match.awayGoals ?? 0}`}</TableCell>
                                    <TableCell component="th" scope="row">{formatStatus(match.status)}</TableCell>
                                    <TableCell component="th" scope="row">
                                        {match.matchDate ? new Date(match.matchDate).toLocaleString(undefined, {
                                            year: 'numeric', month: 'short', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        }) : '—'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default MatchesPage;
