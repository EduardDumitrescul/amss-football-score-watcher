import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, 
  TextField, 
  Box, 
  Typography, 
  Grid
} from '@mui/material';
import { Autocomplete } from '@mui/material';
import { signContract } from '../services/PlayerService';
import type { CreateContractRequest } from '../dto/CreateContractRequest';
import { getAllTeams } from '../services/TeamService';
import type { TeamSummary } from '../models/Team';

interface SignContractFormProps {
    playerId: string;
    onContractSigned: () => void;
}

export const SignContractForm: React.FC<SignContractFormProps> = ({ playerId, onContractSigned }) => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState<TeamSummary[]>([]);
    const [formData, setFormData] = useState<CreateContractRequest>({
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
        <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{
                mt: 3,
                p: 2,
                width: '100%'
            }}
        >
            <Typography variant="h6" gutterBottom>
                Sign New Contract
            </Typography>
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <Autocomplete
                        options={teams}
                        getOptionLabel={(team) => team.name}
                        renderInput={(params) => <TextField {...params} label="Team" />}
                        onChange={(_, newValue) => {
                            setFormData(prev => ({ ...prev, teamId: newValue ? newValue.id : '' }));
                        }}
                        fullWidth
                        />
                </Grid>
                <Grid xs={12}>
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
                <Grid xs={12}>
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
                <Grid xs={12}>
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