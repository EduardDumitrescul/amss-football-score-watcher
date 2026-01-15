import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Competition } from '../models/Competition';
import type { Edition } from '../models/Edition';
import { getCompetitionById, getEditionsByCompetitionId } from '../services/CompetitionService';
import { createEdition } from '../services/EditionService';
import { getAllTeams } from '../services/TeamService';
import type { Team } from '../models/Team';
import {
    Button, Table, TableBody, TableCell, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem,
    Checkbox, ListItemText, DialogActions
} from '@mui/material';

export const CompetitionDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [competition, setCompetition] = useState<Competition | null>(null);
    const [editions, setEditions] = useState<Edition[]>([]);

    // Create Edition State
    const [open, setOpen] = useState(false);
    const [newEditionName, setNewEditionName] = useState('');
    const [strategy, setStrategy] = useState('ROBIN_ROUND');
    const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
    const [availableTeams, setAvailableTeams] = useState<Team[]>([]);

    useEffect(() => {
        if (id) {
            loadData();
            loadTeams();
        }
    }, [id]);

    const loadData = async () => {
        if (!id) return;
        const comp = await getCompetitionById(id);
        const eds = await getEditionsByCompetitionId(id);
        setCompetition(comp);
        setEditions(eds);
    };

    const loadTeams = async () => {
        const data = await getAllTeams();
        setAvailableTeams(data);
    };

    const handleCreateEdition = async () => {
        if (!id) return;
        await createEdition({
            competitionId: id,
            name: newEditionName,
            strategyType: strategy,
            teamsIds: selectedTeams
        });
        setOpen(false);
        loadData(); // Refresh list
    };

    if (!competition) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>{competition.name} - Editions</h1>
            <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>
                Add New Edition
            </Button>

            <Table style={{ marginTop: '20px' }}>
                <TableHead>
                    <TableRow><TableCell>Edition Name</TableCell></TableRow>
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Create Edition Dialog (Reused logic from previous page, simplified) */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>New Edition for {competition.name}</DialogTitle>
                <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '15px', paddingTop: '10px' }}>
                    <TextField label="Edition Name" value={newEditionName} onChange={e => setNewEditionName(e.target.value)} fullWidth />
                    <Select value={strategy} onChange={e => setStrategy(e.target.value)} fullWidth>
                        <MenuItem value="ROBIN_ROUND">Robin Round</MenuItem>
                        <MenuItem value="KNOCKOUT">Knockout</MenuItem>
                    </Select>

                    {/* Reuse the team selector logic here similar to the previous page */}
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
                    <Button onClick={handleCreateEdition} variant="contained" color="primary">Create</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};