// typescript
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextareaAutosize,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { ArrowBack, Add, Delete } from '@mui/icons-material';
import type { MatchDetailsDto, MatchEvent } from '../models/Match';
import { getMatchById, deleteMatch, updateMatch, addEvent } from '../services/MatchService';
import { getPlayerById, getPlayersByTeamId } from '../services/PlayerService';
import type { Player, PlayerSummary } from '../models/Player';

const IN_PROGRESS_WINDOW_MS = 90 * 60 * 1000;

const formatDate = (iso?: string | null) =>
    iso
        ? new Date(iso).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : '—';

const formatStatus = (s?: string | null) =>
    (s || '')
        .toString()
        .split('_')
        .map((w) => (w.length ? w.charAt(0) + w.slice(1).toLowerCase() : w))
        .join(' ');

/** Return a human-readable name for Player or PlayerSummary or raw object */
const toPlayerName = (p?: Player | PlayerSummary | null): string => {
    if (!p) return '';
    // Player detailed
    if ((p as Player).firstname || (p as Player).lastname) {
        const first = String((p as Player).firstname ?? '').trim();
        const last = String((p as Player).lastname ?? '').trim();
        const combined = `${first} ${last}`.trim();
        if (combined) return combined;
    }
    // PlayerSummary
    if ((p as PlayerSummary).fullName) {
        const full = String((p as PlayerSummary).fullName).trim();
        if (full) return full;
    }
    // fallback fields
    // @ts-expect-error defensive access
    if (typeof (p as any).name === 'string' && (p as any).name.trim()) return (p as any).name.trim();
    // fallback id
    return String((p as any).id ?? '');
};

const isoToLocalInput = (iso?: string | null) => {
    if (!iso) {
        const d = new Date();
        const tzOffset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
    }
    const d = new Date(iso);
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
};

export const MatchDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [match, setMatch] = useState<MatchDetailsDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [updating, setUpdating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [editing, setEditing] = useState<boolean>(false);
    const [editDateTime, setEditDateTime] = useState<string>('');

    // id -> display name cache
    const [playersMap, setPlayersMap] = useState<Record<string, string>>({});
    const playersMapRef = useRef<Record<string, string>>({});
    useEffect(() => {
        playersMapRef.current = playersMap;
    }, [playersMap]);

    // Event dialog state
    const [eventDialogOpen, setEventDialogOpen] = useState<boolean>(false);
    const [eventSubmitting, setEventSubmitting] = useState<boolean>(false);
    const [eventType, setEventType] = useState<string>('GOAL');
    const [primaryPlayerId, setPrimaryPlayerId] = useState<string>('');
    const [secondaryPlayerId, setSecondaryPlayerId] = useState<string>('');
    const [eventMinute, setEventMinute] = useState<string>('');
    const [eventDetails, setEventDetails] = useState<string>('');
    const [players, setPlayers] = useState<{ id: string; name: string }[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<string>('');

    // Load match
    useEffect(() => {
        if (!id) return;
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getMatchById(id);
                if (!mounted) return;
                setMatch(data);
            } catch (e) {
                if (!mounted) return;
                setError(e instanceof Error ? e.message : 'Failed to load match');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [id]);

    // Sync playersMap from DTO-provided names and fetch missing names (no render-loop)
    useEffect(() => {
        const events = match?.events ?? [];
        if (events.length === 0) return;

        let mounted = true;
        (async () => {
            const ids = new Set<string>();
            const entries: [string, string][] = [];

            events.forEach((ev) => {
                const p1 = (ev as any).primaryPlayerId;
                const p2 = (ev as any).secondaryPlayerId;
                if (p1) {
                    const sid = String(p1);
                    ids.add(sid);
                    const dtoName = (ev as any).primaryPlayerName;
                    if (dtoName) entries.push([sid, dtoName]);
                }
                if (p2) {
                    const sid = String(p2);
                    ids.add(sid);
                    const dtoName = (ev as any).secondaryPlayerName;
                    if (dtoName) entries.push([sid, dtoName]);
                }
            });

            const toFetch = Array.from(ids).filter((i) => !playersMapRef.current[i] && !entries.find((e) => e[0] === i));
            const fetched: [string, string][] = [];

            if (toFetch.length > 0) {
                await Promise.all(
                    toFetch.map(async (pid) => {
                        try {
                            const p = await getPlayerById(pid);
                            fetched.push([pid, toPlayerName(p)]);
                        } catch {
                            // ignore
                        }
                    })
                );
            }

            if (!mounted) return;
            if (entries.length === 0 && fetched.length === 0) return;

            setPlayersMap((prev) => {
                const copy = { ...prev };
                let changed = false;
                for (const [k, v] of [...entries, ...fetched]) {
                    if (copy[k] !== v) {
                        copy[k] = v;
                        changed = true;
                    }
                }
                return changed ? copy : prev;
            });
        })();

        return () => {
            mounted = false;
        };
    }, [match?.events]);

    // Auto-sync status based on match date
    useEffect(() => {
        if (!match) return;
        let mounted = true;
        const run = async () => {
            if (!id || !match?.matchDate) return;
            const matchMs = new Date(String(match.matchDate)).getTime();
            if (Number.isNaN(matchMs)) return;
            const now = Date.now();
            let desired: string | null = null;
            if (now < matchMs) desired = 'SCHEDULED';
            else if (now >= matchMs && now < matchMs + IN_PROGRESS_WINDOW_MS) desired = 'IN_PROGRESS';
            else desired = 'FINISHED';

            if (desired && match.status !== desired) {
                setUpdating(true);
                try {
                    const updated = await updateMatch(id, { status: desired });
                    if (mounted && updated) setMatch(updated);
                } catch {
                    // ignore
                } finally {
                    if (mounted) setUpdating(false);
                }
            }
        };

        run();
        const iv = window.setInterval(run, 30_000);
        return () => {
            mounted = false;
            clearInterval(iv);
        };
    }, [match, id]);

    // When match changes populate edit date
    useEffect(() => {
        if (match?.matchDate) setEditDateTime(isoToLocalInput(String(match.matchDate)));
    }, [match?.matchDate]);

    const handleDelete = async () => {
        if (!id) return;
        if (!window.confirm('Delete this match? This action cannot be undone.')) return;
        setDeleting(true);
        setError(null);
        try {
            await deleteMatch(id);
            navigate('/matches');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to delete match');
            setDeleting(false);
        }
    };

    const handleStartEdit = () => {
        setEditDateTime(isoToLocalInput(match?.matchDate ?? null));
        setEditing(true);
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setError(null);
        setEditDateTime(isoToLocalInput(match?.matchDate ?? null));
    };

    const handleSaveEdit = async () => {
        if (!id) return;
        if (!editDateTime) {
            setError('Date and time are required.');
            return;
        }
        setUpdating(true);
        setError(null);
        try {
            const normalized = editDateTime.length === 16 ? `${editDateTime}:00` : editDateTime;
            const updated = await updateMatch(id, { matchDate: normalized });
            setMatch(updated);
            setEditing(false);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to update match date');
        } finally {
            setUpdating(false);
        }
    };

    const openAddEvent = async () => {
        if (!match) return;
        setEventDialogOpen(true);
        setEventType('GOAL');
        setPrimaryPlayerId('');
        setSecondaryPlayerId('');
        setEventMinute('');
        setEventDetails('');
        const defaultTeamId = match.homeTeam?.id ? String(match.homeTeam.id) : match.awayTeam?.id ? String(match.awayTeam.id) : '';
        setSelectedTeamId(defaultTeamId);
        if (!defaultTeamId) {
            setPlayers([]);
            return;
        }
        try {
            const list = await getPlayersByTeamId(defaultTeamId);
            setPlayers(list.map((p: PlayerSummary) => ({ id: String(p.id), name: toPlayerName(p) })));
        } catch {
            setPlayers([]);
        }
    };

    const handleTeamChange = async (e: SelectChangeEvent<string>) => {
        const teamId = String(e.target.value || '');
        setSelectedTeamId(teamId);
        setPrimaryPlayerId('');
        setSecondaryPlayerId('');
        if (!teamId) {
            setPlayers([]);
            return;
        }
        try {
            const list = await getPlayersByTeamId(teamId);
            setPlayers(list.map((p: PlayerSummary) => ({ id: String(p.id), name: toPlayerName(p) })));
        } catch {
            setPlayers([]);
        }
    };

    const handleSubmitAddEvent = async () => {
        if (!id) return;
        setEventSubmitting(true);
        setError(null);
        try {
            const payload = {
                type: eventType,
                primaryPlayerId: primaryPlayerId || null,
                secondaryPlayerId: secondaryPlayerId || null,
                minute: eventMinute ? Number(eventMinute) : null,
                details: eventDetails || null
            };
            await addEvent(id, payload);
            const refreshed = await getMatchById(id);
            setMatch(refreshed);
            setEventDialogOpen(false);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to add event');
        } finally {
            setEventSubmitting(false);
        }
    };

    const onTeamClick = (teamId?: string | null) => {
        if (!teamId) return;
        navigate(`/teams/${teamId}`);
    };

    // sort events by minute
    const sortedEvents = (match?.events ?? []).slice().sort((a: MatchEvent, b: MatchEvent) => {
        const ma = a?.minute ?? 0;
        const mb = b?.minute ?? 0;
        return ma - mb;
    });

    const renderPlayerCell = (idValue?: string | number | null, fallback?: string): JSX.Element => {
        const sid = idValue ? String(idValue) : undefined;
        const display = sid ? playersMap[sid] ?? fallback ?? sid : fallback ?? '—';

        if (!sid) {
            return <TableCell>{display}</TableCell>;
        }

        return (
            <TableCell>
                <Tooltip title="View player" arrow>
                    <Button
                        variant="text"
                        onClick={() => navigate(`/players/${sid}`)}
                        sx={{ textTransform: 'none', p: 0, minWidth: 0 }}
                    >
                        {display}
                    </Button>
                </Tooltip>
            </TableCell>
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error && !match) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!match) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="info">Match not found</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/matches')}>
                    Back to Match List
                </Button>

                <Stack direction="row" spacing={1} alignItems="center">
                    {!editing ? (
                        <Button onClick={handleStartEdit} variant="outlined" disabled={updating}>
                            Edit date
                        </Button>
                    ) : (
                        <Button onClick={handleSaveEdit} variant="contained" disabled={updating}>
                            Save
                        </Button>
                    )}

                    {editing ? (
                        <Button onClick={handleCancelEdit} variant="text" disabled={updating}>
                            Cancel
                        </Button>
                    ) : (
                        <Button
                            startIcon={deleting ? <CircularProgress size={18} color="inherit" /> : <Delete />}
                            onClick={handleDelete}
                            color="error"
                            variant="outlined"
                            disabled={deleting}
                        >
                            Delete
                        </Button>
                    )}

                    {match?.status === 'IN_PROGRESS' && (
                        <Button startIcon={<Add />} variant="contained" onClick={openAddEvent}>
                            Add Event
                        </Button>
                    )}
                </Stack>
            </Box>

            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ textAlign: 'left', flex: 1 }}>
                        <Tooltip title="View team" arrow>
                            <Button
                                onClick={() => onTeamClick(match.homeTeam?.id ?? null)}
                                disabled={!match.homeTeam?.id}
                                sx={{ textTransform: 'none' }}
                            >
                                {match.homeTeam?.name ?? 'Home'}
                            </Button>
                        </Tooltip>
                    </Box>

                    <Box sx={{ textAlign: 'center', width: 240, flex: '0 0 auto' }}>
                        <Typography variant="h4" component="div">
                            {`${match.homeGoals ?? 0} — ${match.awayGoals ?? 0}`}
                        </Typography>
                        <Chip label={formatStatus(match.status)} sx={{ mt: 1 }} />
                        <Box sx={{ mt: 1 }}>
                            {!editing ? (
                                <Typography variant="body2">{formatDate(String(match.matchDate ?? null))}</Typography>
                            ) : (
                                <TextField
                                    type="datetime-local"
                                    size="small"
                                    value={editDateTime}
                                    onChange={(e) => setEditDateTime(e.target.value)}
                                />
                            )}
                        </Box>
                    </Box>

                    <Box sx={{ textAlign: 'right', flex: 1 }}>
                        <Tooltip title="View team" arrow>
                            <Button
                                onClick={() => onTeamClick(match.awayTeam?.id ?? null)}
                                disabled={!match.awayTeam?.id}
                                variant="text"
                                sx={{ textTransform: 'none' }}
                            >
                                {match.awayTeam?.name ?? 'Away'}
                            </Button>
                        </Tooltip>
                    </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="h6" sx={{ mb: 1 }}>
                    Events
                </Typography>

                <TableContainer component={Paper} variant="outlined">
                    <Table size="small" aria-label="match events">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: 80 }}>Minute</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Primary</TableCell>
                                <TableCell>Secondary</TableCell>
                                <TableCell>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedEvents.map((ev) => (
                                <TableRow key={String((ev as any).id ?? Math.random())}>
                                    <TableCell>{ev.minute ?? '—'}</TableCell>
                                    <TableCell>{(ev as any).type ?? '—'}</TableCell>
                                    {renderPlayerCell((ev as any).primaryPlayerId, (ev as any).primaryPlayerName ?? undefined)}
                                    {renderPlayerCell((ev as any).secondaryPlayerId, (ev as any).secondaryPlayerName ?? undefined)}
                                    <TableCell>{ev.details ?? '—'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={eventDialogOpen} onClose={() => setEventDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Event</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="event-team-label">Team</InputLabel>
                            <Select
                                labelId="event-team-label"
                                label="Team"
                                value={selectedTeamId}
                                onChange={handleTeamChange}
                                displayEmpty
                                renderValue={(val) => {
                                    if (!val) return '—';
                                    if (String(val) === String(match.homeTeam?.id)) return match.homeTeam?.name ?? 'Home';
                                    if (String(val) === String(match.awayTeam?.id)) return match.awayTeam?.name ?? 'Away';
                                    return String(val);
                                }}
                            >
                                <MenuItem value="">
                                    —
                                </MenuItem>
                                {match.homeTeam?.id && (
                                    <MenuItem value={String(match.homeTeam.id)}>{match.homeTeam.name ?? 'Home'}</MenuItem>
                                )}
                                {match.awayTeam?.id && (
                                    <MenuItem value={String(match.awayTeam.id)}>{match.awayTeam.name ?? 'Away'}</MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size="small">
                            <InputLabel id="event-type-label">Event Type</InputLabel>
                            <Select
                                labelId="event-type-label"
                                label="Event Type"
                                value={eventType}
                                onChange={(e) => setEventType(String(e.target.value))}
                                size="small"
                            >
                                <MenuItem value="GOAL">Goal</MenuItem>
                                <MenuItem value="YELLOW_CARD">Yellow Card</MenuItem>
                                <MenuItem value="RED_CARD">Red Card</MenuItem>
                                <MenuItem value="SUBSTITUTION">Substitution</MenuItem>
                                <MenuItem value="OTHER">Other</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size="small">
                            <InputLabel id="primary-player-label">Primary player</InputLabel>
                            <Select
                                labelId="primary-player-label"
                                label="Primary player"
                                value={primaryPlayerId}
                                onChange={(e: SelectChangeEvent<string>) => setPrimaryPlayerId(String(e.target.value || ''))}
                                size="small"
                                displayEmpty
                                renderValue={(val) => players.find((p) => p.id === String(val))?.name ?? (String(val) || '—')}
                            >
                                <MenuItem value="">—</MenuItem>
                                {players.map((p) => (
                                    <MenuItem key={p.id} value={p.id}>
                                        {p.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size="small">
                            <InputLabel id="secondary-player-label">Secondary player</InputLabel>
                            <Select
                                labelId="secondary-player-label"
                                label="Secondary player"
                                value={secondaryPlayerId}
                                onChange={(e: SelectChangeEvent<string>) => setSecondaryPlayerId(String(e.target.value || ''))}
                                size="small"
                                displayEmpty
                                renderValue={(val) => players.find((p) => p.id === String(val))?.name ?? (String(val) || '—')}
                            >
                                <MenuItem value="">—</MenuItem>
                                {players.map((p) => (
                                    <MenuItem key={p.id} value={p.id}>
                                        {p.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Minute"
                            size="small"
                            type="number"
                            value={eventMinute}
                            onChange={(e) => setEventMinute(e.target.value)}
                            fullWidth
                        />

                        <TextareaAutosize
                            minRows={3}
                            placeholder="Details (optional)"
                            style={{ width: '100%', padding: 8 }}
                            value={eventDetails}
                            onChange={(e) => setEventDetails(e.target.value)}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEventDialogOpen(false)} disabled={eventSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmitAddEvent} variant="contained" disabled={eventSubmitting}>
                        {eventSubmitting ? 'Adding...' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MatchDetailsPage;
