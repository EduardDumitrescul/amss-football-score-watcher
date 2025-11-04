import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, 
  Select, 
  MenuItem, 
  TextField, 
  FormControl, 
  InputLabel, 
  Box, 
  Typography, 
  Grid
} from '@mui/material';
import { signContract } from '../services/PlayerService';
import type { ContractFormData } from '../services/PlayerService';
import { getAllTeams } from '../services/TeamService';
import type { SelectChangeEvent } from '@mui/material';

interface SignContractFormProps {
    playerId: string;
    onContractSigned: () => void;
}

export const SignContractForm: React.FC<SignContractFormProps> = ({ playerId, onContractSigned }) => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState<Team[]>([]);
    const [formData, setFormData] = useState<ContractFormData>({
        playerId: playerId,
        teamId: '',
        startDate: '',
        endDate: '',
        salaryPerYear: 0,
    });

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const teamsData = await getAllTeams();
                setTeams(teamsData);
            } catch (error) {
                console.error('Failed to fetch teams', error);
            }
        };

        fetchTeams();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name as string]: value }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        setFormData(prev => ({ ...prev, teamId: e.target.value as string }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signContract(formData);
            onContractSigned();
            navigate(`/players/${playerId}`);
        } catch (error) {
            console.error('Failed to sign contract', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                Sign New Contract
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl fullWidth required>
                        <InputLabel id="team-select-label">Team</InputLabel>
                        <Select
                            labelId="team-select-label"
                            id="teamId"
                            name="teamId"
                            value={formData.teamId}
                            onChange={handleSelectChange}
                        >
                            <MenuItem value=""><em>Select a team</em></MenuItem>
                            {teams.map(team => (
                                <MenuItem key={team.id} value={team.id}>
                                    {team.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="startDate"
                        label="Start Date"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="endDate"
                        label="End Date"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="salaryPerYear"
                        label="Salary Per Year"
                        type="number"
                        value={formData.salaryPerYear}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>
            </Grid>
            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign Contract
            </Button>
        </Box>
    );
};