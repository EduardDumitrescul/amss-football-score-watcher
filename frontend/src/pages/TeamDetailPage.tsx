import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import type { Team } from '../models/Team'; 
import type { Coach } from '../models/Coach';
import { getTeamById, unassignCoach } from '../services/TeamService';
import { getCoachById } from '../services/CoachService';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Button,
  Link,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { ArrowBack, Group, Person, Shield } from '@mui/icons-material';

export const TeamDetailPage: React.FC = () => {
  const [team, setTeam] = useState<Team | null>(null);
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCoach, setLoadingCoach] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [coachError, setCoachError] = useState<string | null>(null);
  const [isFiring, setIsFiring] = useState<boolean>(false); 
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fetchTeam = useCallback(async () => {
    if (!id) {
      setError('No team ID provided.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const teamData = await getTeamById(id);
      setTeam(teamData);

      if (teamData.coachId) {
        setLoadingCoach(true);
        setCoachError(null);
        try {
          const coachData = await getCoachById(teamData.coachId);
          setCoach(coachData);
        } catch (e) {
          setCoachError(e instanceof Error ? e.message : 'Failed to fetch coach details.');
        } finally {
          setLoadingCoach(false);
        }
      } else {
        setCoach(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handleFireCoach = async () => {
    if (!team) return;

    setIsFiring(true);
    setError(null);
    try {
      const updatedTeam = await unassignCoach(team.id);
      setTeam(updatedTeam); 
      setCoach(null); // Coach is unassigned
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate('/teams')} 
        sx={{ mb: 2 }}
      >
        Back to Team List
      </Button>
      <Grid container spacing={3}>
        {/* Team Details Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><Group /></Avatar>}
              title={<Typography variant="h5">{team.name}</Typography>}
              subheader="Team Details"
            />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon><Shield /></ListItemIcon>
                  <ListItemText primary="Team ID" secondary={team.id} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Coach Details Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader
              avatar={<Avatar><Person /></Avatar>}
              title={<Typography variant="h5">Coach</Typography>}
            />
            <CardContent>
              {loadingCoach ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress size={20} /></Box>
              ) : coachError ? (
                <Alert severity="error">{coachError}</Alert>
              ) : coach ? (
                <Box>
                  <Typography variant="h6">
                    <Link component={RouterLink} to={`/coaches/${coach.id}`}>
                      {coach.firstname} {coach.lastname}
                    </Link>
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={handleFireCoach}
                    disabled={isFiring}
                    sx={{ mt: 2 }}
                  >
                    {isFiring ? <CircularProgress size={20} color="inherit" /> : 'Fire Coach'}
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    No coach assigned.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    sx={{ mt: 2 }} 
                    onClick={() => navigate(`/teams/${team.id}/assign-coach`)} 
                  >
                    Assign Coach
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

