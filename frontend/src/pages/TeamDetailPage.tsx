import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import type { Team } from '../models/Team'; 
import { getTeamById, unassignCoach } from '../services/TeamService';
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
  // Add a new loading state for the fire action
  const [isFiring, setIsFiring] = useState<boolean>(false); 
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fetchTeam = async () => {
    if (!id) {
      setError('No team ID provided.');
      setLoading(false);
      return;
    }
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

  useEffect(() => {
    fetchTeam();
  }, [id]);

  // --- NEW: Handler for the fire coach button ---
  const handleFireCoach = async () => {
    if (!team) return;

    setIsFiring(true);
    setError(null);
    try {
      // Call the service function
      const updatedTeam = await unassignCoach(team.id);
      // Update the local state to show the change immediately
      setTeam(updatedTeam); 
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fire coach.');
    } finally {
      setIsFiring(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show a general error for fetching
  if (error && !isFiring) { // Only show fetch error if not firing
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
        {/* Show a specific error for the firing action */}
        {error && isFiring && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <strong>Error:</strong> {error}
          </Alert>
        )}

        <Typography variant="h4" component="h1" gutterBottom>
          {team.name}
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* Team Name */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Team Name:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="body1">
              {team.name}
            </Typography>
          </Grid>

          {/* Team ID */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Team ID:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="body1" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {team.id}
            </Typography>
          </Grid>

          {/* Assigned Coach */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Assigned Coach:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            {team.coachId ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Link component={RouterLink} to={`/coaches/${team.coachId}`} sx={{ fontWeight: 'medium' }}>
                  {team.coachFirstname} {team.coachLastname}
                </Link>
                {/* --- NEW: Fire Coach Button --- */}
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={handleFireCoach}
                  disabled={isFiring}
                >
                  {isFiring ? <CircularProgress size={20} color="inherit" /> : 'Fire Coach'}
                </Button>
              </Box>
            ) : (
              <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                No Coach Assigned
              </Typography>
            )}
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


