import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {Competition} from '../models/Competition';
import { getAllCompetitions, createCompetition } from '../services/CompetitionService';
import { getAllTeams } from '../services/TeamService'; // Assuming you have this
import type {Team} from '../models/Team';
import {
    Button, Table, TableBody, TableCell, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, TextField, MenuItem,
    Select, Checkbox, ListItemText, DialogActions
} from '@mui/material'; // Adjust imports if not using MUI

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
            loadCompetitions();
        } catch (e) { console.error("Failed to create", e); }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Competitions</h1>
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Create New Competition
            </Button>

            <Table style={{ marginTop: '20px' }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>ID</TableCell>
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
                            <TableCell>{comp.id}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Create Dialog */}
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

                    <h3>Select Teams ({selectedTeams.length})</h3>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc' }}>
                        {availableTeams.map(team => (
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
        </div>
    );
};