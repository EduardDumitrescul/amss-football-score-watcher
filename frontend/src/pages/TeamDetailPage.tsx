import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import type { Team } from '../models/Team';
import { getTeamById } from '../services/TeamService';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Button,
  Link
} from '@mui/material';

export const TeamDetailPage: React.FC = () => {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError('No team ID provided.');
      setLoading(false);
      return;
    }

    const fetchTeam = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTeamById(id);
        setTeam(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          <strong>Error:</strong> {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/teams')} sx={{ mt: 2 }}>
          Back to List
        </Button>
      </Container>
    );
  }

  if (!team) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">No team data available.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {team.name}
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* Team Name */}
          <Grid xs={12} sm={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Team Name:
            </Typography>
          </Grid>
          <Grid xs={12} sm={8}>
            <Typography variant="body1">
              {team.name}
            </Typography>
          </Grid>

          {/* Team ID */}
          <Grid xs={12} sm={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Team ID:
            </Typography>
          </Grid>
          <Grid xs={12} sm={8}>
            <Typography variant="body1" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {team.id}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start' }}>
          <Button variant="outlined" onClick={() => navigate('/teams')}>
            Back to List
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
