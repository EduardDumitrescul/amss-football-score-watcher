import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert, 
  List, 
  ListItemText, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Avatar,
  ListItemButton
} from '@mui/material';
import { ArrowBack, Person } from '@mui/icons-material';
import { getTeamById, assignCoachToTeam } from '../services/TeamService';
import { getAvailableCoaches } from '../services/CoachService';
import type { Team } from '../models/Team';
import type { CoachSummary } from '../models/Coach';

export const AssignCoachPage: React.FC = () => {
  const { id: teamId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [team, setTeam] = useState<Team | null>(null);
  const [availableCoaches, setAvailableCoaches] = useState<CoachSummary[]>([]);
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!teamId) {
        setError('No team ID provided');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [teamData, coachesData] = await Promise.all([
          getTeamById(teamId),
          getAvailableCoaches(),
        ]);
        setTeam(teamData);
        setAvailableCoaches(coachesData);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamId]);

  const handleAssignCoach = async () => {
    if (!teamId || !selectedCoachId) return;

    setIsAssigning(true);
    setError(null);

    try {
      await assignCoachToTeam(teamId, selectedCoachId);
      navigate(`/teams/${teamId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to assign coach');
    } finally {
      setIsAssigning(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="outlined" onClick={() => navigate(`/teams/${teamId}`)} sx={{ mt: 2 }}>
          Back to Team
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(`/teams/${teamId}`)} sx={{ mb: 2 }}>
        Back to Team
      </Button>
      <Card elevation={3}>
        <CardHeader 
          title={`Assign Coach to ${team?.name}`}
          subheader="Select a coach from the list of available coaches below."
        />
        <CardContent>
          {availableCoaches.length > 0 ? (
            <List>
              {availableCoaches.map((coach) => (
                <ListItemButton 
                  key={coach.id} 
                  selected={selectedCoachId === coach.id}
                  onClick={() => setSelectedCoachId(coach.id)}
                >
                  <Avatar sx={{ mr: 2 }}><Person /></Avatar>
                  <ListItemText primary={coach.fullName} />
                </ListItemButton>
              ))}
            </List>
          ) : (
            <Typography>No available coaches found.</Typography>
          )}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              onClick={handleAssignCoach}
              disabled={!selectedCoachId || isAssigning}
            >
              {isAssigning ? <CircularProgress size={24} /> : 'Assign Selected Coach'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};