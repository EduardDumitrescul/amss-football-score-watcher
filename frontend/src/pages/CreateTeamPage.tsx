import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTeam } from '../services/TeamService'; 
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';

export interface TeamFormData {
    name: string;
}

export const CreateTeamPage: React.FC = () => {
  // Simplify state to just the team name
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // No longer need to fetch coaches
  // useEffect(() => { ... });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) {
      setError('Team name is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create the team with just the name.
      // This is compatible with TeamFormData since coachId is optional.
      const teamData: TeamFormData = { name };
      const newTeam = await createTeam(teamData); 
      
      // Navigate to the new team's detail page
      navigate(`/teams/${newTeam.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Team
        </Typography>
        
        {/* Removed coach loading ternary */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Team Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name} // Bind to name state
            onChange={handleChange} // Use simplified handler
          />
          
          {/* Removed the Coach Selection FormControl */}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Team'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};


