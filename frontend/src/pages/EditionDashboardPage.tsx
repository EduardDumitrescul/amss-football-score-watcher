import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEditionDashboard, updateEdition, deleteEdition } from '../services/EditionService';
import type { EditionDashboardDto } from '../dto/EditionDashboardDto';
import {
    Table, TableBody, TableCell, TableHead, TableRow,
    Paper, Card, CardContent, Typography, Box, IconButton,
    Tooltip, Dialog, DialogTitle, DialogContent, TextField,
    DialogActions, Button, Container
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const EditionDashboardPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState<EditionDashboardDto | null>(null);

    // Edit State
    const [openEdit, setOpenEdit] = useState(false);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        if (id) {
            loadDashboard();
        }
    }, [id]);

    const loadDashboard = () => {
        if(id) {
            getEditionDashboard(id).then(data => {
                setDashboard(data);
                setEditName(data.editionName);
            }).catch(console.error);
        }
    }

    // --- ACTIONS ---
    const handleUpdate = async () => {
        if (!id || !dashboard) return;
        try {
            await updateEdition(id, editName);
            setOpenEdit(false);
            loadDashboard(); // Refresh to see new name
        } catch (e) { console.error(e); }
    };

    const handleDelete = async () => {
        if (!id || !dashboard || !window.confirm("Are you sure you want to delete this edition?")) return;
        try {
            const compId = dashboard.competitionId;
            await deleteEdition(id);
            // Redirect back to the parent Competition page
            navigate(`/competitions/${compId}`);
        } catch (e) { console.error(e); }
    };

    if (!dashboard) return <div style={{ padding: '20px' }}>Loading Dashboard...</div>;

    const hasStandings = dashboard.table && dashboard.table.length > 0;

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>

            <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={2}>
                        <IconButton onClick={() => navigate(`/competitions/${dashboard.competitionId}`)}>
                            <ArrowBackIcon />
                        </IconButton>

                        <Box>
                            <Typography variant="overline" display="block" color="textSecondary">
                                {dashboard.competitionName}
                            </Typography>
                            <Typography variant="h4" component="h1">
                                {dashboard.editionName}
                            </Typography>
                        </Box>
                    </Box>

                    <Box>
                        <Tooltip title="Rename Edition">
                            <IconButton onClick={() => setOpenEdit(true)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Edition">
                            <IconButton color="error" onClick={handleDelete}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Paper>

            {hasStandings && (
                <Paper style={{ marginBottom: '30px', padding: '10px' }}>
                    <Typography variant="h5" style={{ padding: '10px' }}>League Table</Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Team</TableCell>
                                <TableCell align="right">Played</TableCell>
                                <TableCell align="right">W</TableCell>
                                <TableCell align="right">D</TableCell>
                                <TableCell align="right">L</TableCell>
                                <TableCell align="right">GF</TableCell>
                                <TableCell align="right">GA</TableCell>
                                <TableCell align="right">GD</TableCell>
                                <TableCell align="right" style={{ fontWeight: 'bold' }}>Points</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dashboard.table.map((row, index) => (
                                <TableRow key={row.teamId}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <Link to={`/teams/${row.teamId}`} style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>
                                            {row.teamName}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="right">{row.played}</TableCell>
                                    <TableCell align="right">{row.wins}</TableCell>
                                    <TableCell align="right">{row.draws}</TableCell>
                                    <TableCell align="right">{row.losses}</TableCell>
                                    <TableCell align="right">{row.goalsFor}</TableCell>
                                    <TableCell align="right">{row.goalsAgainst}</TableCell>
                                    <TableCell align="right">{row.goalDifference}</TableCell>
                                    <TableCell align="right" style={{ fontWeight: 'bold' }}>{row.poIntegers}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}

            <Typography variant="h5" gutterBottom>Matches</Typography>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {dashboard.rounds.map((roundMatches, index) => (
                    <Card key={index}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">Matchday {index + 1}</Typography>
                            <Table size="small" style={{ tableLayout: 'fixed' }}>
                                <TableBody>
                                    {roundMatches.map(match => (
                                        <TableRow
                                            key={match.id}
                                            hover
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/matches/${match.id}`)}
                                        >
                                            <TableCell style={{ width: '15%' }}>
                                                {new Date(match.matchDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell align="right" style={{ width: '30%' }}>
                                                {match.homeTeamName}
                                            </TableCell>
                                            <TableCell align="center" style={{ width: '10%', fontWeight: 'bold', fontSize: '1.1em' }}>
                                                {match.status === 'FINISHED'
                                                    ? `${match.homeGoals ?? 0} - ${match.awayGoals ?? 0}`
                                                    : 'v'}
                                            </TableCell>
                                            <TableCell align="left" style={{ width: '30%' }}>
                                                {match.awayTeamName}
                                            </TableCell>
                                            <TableCell style={{ width: '15%' }}>
                                                {match.status}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
                <DialogTitle>Rename Edition</DialogTitle>
                <DialogContent style={{ paddingTop: '10px' }}>
                    <TextField
                        label="Edition Name"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
                    <Button onClick={handleUpdate} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};