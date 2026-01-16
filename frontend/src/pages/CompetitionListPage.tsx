import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Competition } from '../models/Competition';
import { getAllCompetitions, createCompetition } from '../services/CompetitionService';
import { getAllTeams } from '../services/TeamService';
import type { Team } from '../models/Team';
import {
    Button, Table, TableBody, TableCell, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, TextField, MenuItem,
    Select, Checkbox, ListItemText, DialogActions, Paper, Box, Typography, Container
} from '@mui/material';

export const CompetitionListPage = () => {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [open, setOpen] = useState(false);

    // Form State
    const [compName, setCompName] = useState('');
    const [editionName, setEditionName] = useState('Default Edition');
    const [strategy, setStrategy] = useState('ROBIN_ROUND');
    const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
    const [availableTeams, setAvailableTeams] = useState<Team[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        loadCompetitions();
        loadTeams();
    }, []);

    const loadCompetitions = async () => {
        try {
            const data = await getAllCompetitions();
            setCompetitions(data);
        } catch (e) { console.error(e); }
    };

    const loadTeams = async () => {
        try {
            const data = await getAllTeams();
            setAvailableTeams(data);
        } catch (e) { console.error(e); }
    };

    const handleCreate = async () => {
        try {
            await createCompetition({
                competitionName: compName,
                editionName: editionName,
                strategyType: strategy,
                teamIds: selectedTeams
            });
            setOpen(false);
            // Reset form
            setCompName('');
            setEditionName('Default Edition');
            setSelectedTeams([]);
            loadCompetitions();
        } catch (e) { console.error("Failed to create", e); }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
                    <Typography variant="h4" component="h1">
                        Competitions
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpen(true)}
                        style={{ height: 'fit-content' }}
                    >
                        CREATE NEW COMPETITION
                    </Button>
                </Box>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {competitions.map((comp) => (
                            <TableRow
                                key={comp.id}
                                hover
                                onClick={() => navigate(`/competitions/${comp.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell>{comp.name}</TableCell>
                                <TableCell style={{ color: '#666' }}>{comp.id}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create Competition</DialogTitle>
                <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '15px', paddingTop: '10px' }}>
                    <TextField label="Competition Name" value={compName} onChange={e => setCompName(e.target.value)} fullWidth />
                    <TextField label="First Edition Name" value={editionName} onChange={e => setEditionName(e.target.value)} fullWidth />

                    <Select value={strategy} onChange={e => setStrategy(e.target.value as string)} fullWidth>
                        <MenuItem value="ROBIN_ROUND">Robin Round (League)</MenuItem>
                        <MenuItem value="ROBIN_ROUND_DOUBLE">Double Robin Round</MenuItem>
                        <MenuItem value="KNOCKOUT">Knockout Tournament</MenuItem>
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
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate} variant="contained" color="primary">Create</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};