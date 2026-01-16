import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Competition } from '../models/Competition';
import type { Edition } from '../models/Edition';
import {
    getCompetitionById,
    getEditionsByCompetitionId,
    updateCompetition,
    deleteCompetition
} from '../services/CompetitionService';
import {
    createEdition,
    updateEdition,
    deleteEdition
} from '../services/EditionService';
import { getAllTeams } from '../services/TeamService';
import type { Team } from '../models/Team';
import {
    Button, Table, TableBody, TableCell, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem,
    Checkbox, ListItemText, DialogActions, Paper, Box, Typography,
    IconButton, Tooltip, Container
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export const CompetitionDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [competition, setCompetition] = useState<Competition | null>(null);
    const [editions, setEditions] = useState<Edition[]>([]);

    const [openCreate, setOpenCreate] = useState(false);
    const [newEditionName, setNewEditionName] = useState('');
    const [strategy, setStrategy] = useState('ROBIN_ROUND');
    const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
    const [availableTeams, setAvailableTeams] = useState<Team[]>([]);

    const [openEditComp, setOpenEditComp] = useState(false);
    const [compNameEdit, setCompNameEdit] = useState('');

    const [openEditEdition, setOpenEditEdition] = useState(false);
    const [editionToEdit, setEditionToEdit] = useState<Edition | null>(null);
    const [editionNameEdit, setEditionNameEdit] = useState('');

    useEffect(() => {
        if (id) {
            loadData();
            loadTeams();
        }
    }, [id]);

    const loadData = async () => {
        if (!id) return;
        try {
            const comp = await getCompetitionById(id);
            const eds = await getEditionsByCompetitionId(id);
            setCompetition(comp);
            setEditions(eds);
        } catch (error) {
            console.error("Failed to load data", error);
        }
    };

    const loadTeams = async () => {
        const data = await getAllTeams();
        setAvailableTeams(data);
    };

    const handleDeleteCompetition = async () => {
        if (!id || !window.confirm("Are you sure you want to delete this competition and all its editions?")) return;
        try {
            await deleteCompetition(id);
            navigate('/competitions');
        } catch (e) { console.error(e); }
    };

    const handleUpdateCompetition = async () => {
        if (!id) return;
        try {
            await updateCompetition(id, compNameEdit);
            setOpenEditComp(false);
            loadData();
        } catch (e) { console.error(e); }
    };

    const handleCreateEdition = async () => {
        if (!id) return;
        try {
            await createEdition({
                competitionId: id,
                name: newEditionName,
                strategyType: strategy,
                teamsIds: selectedTeams
            });
            setOpenCreate(false);
            setNewEditionName('');
            setSelectedTeams([]);
            loadData();
        } catch (e) { console.error(e); }
    };

    const handleDeleteEdition = async (editionId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click
        if (!window.confirm("Are you sure you want to delete this edition?")) return;
        try {
            await deleteEdition(editionId);
            loadData();
        } catch (e) { console.error(e); }
    };

    const openEditionEditDialog = (edition: Edition, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click
        setEditionToEdit(edition);
        setEditionNameEdit(edition.name);
        setOpenEditEdition(true);
    };

    const handleUpdateEdition = async () => {
        if (!editionToEdit) return;
        try {
            await updateEdition(editionToEdit.id, editionNameEdit);
            setOpenEditEdition(false);
            setEditionToEdit(null);
            loadData();
        } catch (e) { console.error(e); }
    };

    if (!competition) return <div>Loading...</div>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Paper elevation={3} style={{ padding: '20px' }}>

                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="h4" component="h1">
                            {competition.name}
                            <Typography component="span" variant="h6" color="textSecondary" style={{ marginLeft: '10px' }}>
                                (Editions)
                            </Typography>
                        </Typography>

                        <Tooltip title="Edit Competition Name">
                            <IconButton onClick={() => { setCompNameEdit(competition.name); setOpenEditComp(true); }}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Competition">
                            <IconButton color="error" onClick={handleDeleteCompetition}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenCreate(true)}
                    >
                        ADD NEW EDITION
                    </Button>
                </Box>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Edition Name</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {editions.map(ed => (
                            <TableRow
                                key={ed.id}
                                hover
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/editions/${ed.id}/dashboard`)}
                            >
                                <TableCell>{ed.name}</TableCell>
                                <TableCell style={{ color: '#666' }}>{ed.id}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={(e) => openEditionEditDialog(ed, e)} size="small">
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={(e) => handleDeleteEdition(ed.id, e)} color="error" size="small">
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="sm">
                <DialogTitle>New Edition for {competition.name}</DialogTitle>
                <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '15px', paddingTop: '10px' }}>
                    <TextField label="Edition Name" value={newEditionName} onChange={e => setNewEditionName(e.target.value)} fullWidth />
                    <Select value={strategy} onChange={e => setStrategy(e.target.value)} fullWidth>
                        <MenuItem value="ROBIN_ROUND">Robin Round (League)</MenuItem>
                        <MenuItem value="ROBIN_ROUND_DOUBLE">Double Robin Round</MenuItem>
                        <MenuItem value="KNOCKOUT">Knockout</MenuItem>
                    </Select>

                    <Typography variant="subtitle1">Select Teams ({selectedTeams.length})</Typography>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px' }}>
                        {availableTeams
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(team => (
                                <div key={team.id} style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                                    <Checkbox
                                        checked={selectedTeams.includes(team.id)}
                                        onChange={(e) => {
                                            if(e.target.checked) setSelectedTeams([...selectedTeams, team.id]);
                                            else setSelectedTeams(selectedTeams.filter(id => id !== team.id));
                                        }}
                                    />
                                    <ListItemText primary={team.name} />
                                </div>
                            ))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
                    <Button onClick={handleCreateEdition} variant="contained" color="primary">Create</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditComp} onClose={() => setOpenEditComp(false)}>
                <DialogTitle>Edit Competition</DialogTitle>
                <DialogContent style={{ paddingTop: '10px' }}>
                    <TextField
                        label="Competition Name"
                        value={compNameEdit}
                        onChange={e => setCompNameEdit(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditComp(false)}>Cancel</Button>
                    <Button onClick={handleUpdateCompetition} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditEdition} onClose={() => setOpenEditEdition(false)}>
                <DialogTitle>Rename Edition</DialogTitle>
                <DialogContent style={{ paddingTop: '10px' }}>
                    <TextField
                        label="Edition Name"
                        value={editionNameEdit}
                        onChange={e => setEditionNameEdit(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditEdition(false)}>Cancel</Button>
                    <Button onClick={handleUpdateEdition} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};