import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, 
  TextField, 
  Box, 
  Typography, 
  Grid,
  Alert
} from '@mui/material';
import { Autocomplete } from '@mui/material';
import { signContract } from '../services/PlayerService';
import type { CreateContractRequest } from '../dto/CreateContractRequest';
import { getAllTeams } from '../services/TeamService';
import type { TeamSummary } from '../models/Team';
import type { Contract } from '../models/ContractDto';

interface SignContractFormProps {
    playerId: string;
    onContractSigned: () => void;
    latestContract: Contract | null;
}

export const SignContractForm: React.FC<SignContractFormProps> = ({ playerId, onContractSigned, latestContract }) => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState<TeamSummary[]>([]);
    const [formData, setFormData] = useState<CreateContractRequest>({
        playerId: playerId,
        teamId: '',
        startDate: '',
        endDate: '',
        salaryPerYear: 0,
    });
    const [error, setError] = useState<string | null>(null);

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
        setError(null);

        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            setError('End date must be after start date.');
            return;
        }

        if (latestContract && new Date(formData.startDate) < new Date(latestContract.startDate)) {
            setError('New contract cannot start before the latest contract.');
            return;
        }

        try {
            await signContract(formData);
            onContractSigned();
            navigate(`/players/${playerId}`);
        } catch (error: any) {
            console.error('Failed to sign contract', error);
            setError(error.response?.data?.message || 'Failed to sign contract.');
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
            {latestContract && (
                <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                        Latest Contract Details
                    </Typography>
                    <Typography variant="body2">
                        Team: {latestContract.teamName}
                    </Typography>
                    <Typography variant="body2">
                        Start Date: {new Date(latestContract.startDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                        End Date: {new Date(latestContract.endDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                        Salary: {latestContract.salaryPerYear}
                    </Typography>
                </Box>
            )}
            <Typography variant="h6" gutterBottom>
                Sign New Contract
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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