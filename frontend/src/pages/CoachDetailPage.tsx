import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import type { Coach } from '../models/Coach';
import { getCoachById } from '../services/CoachService';
import { AssignCoachToTeam } from '../components/AssignCoachToTeamComponent'; 
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Box,
  Grid,
  Divider
} from '@mui/material';

// Helper component to display a single detail
const DetailItem: React.FC<{ title: string; value: string | null | undefined }> = ({ title, value }) => (
  <Grid item xs={12} sm={6}>
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1">
      {value || <em>Not set</em>}
    </Typography>
  </Grid>
);

export const CoachDetailPage: React.FC = () => {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get the 'id' from the URL
  const { id } = useParams<{ id: string }>();

  // Wrap fetchCoach in useCallback
  const fetchCoach = useCallback(async () => {
    if (!id) {
      setError("No coach ID provided.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getCoachById(id);
      setCoach(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]); // Dependency array includes 'id'

  // Initial fetch
  useEffect(() => {
    fetchCoach();
  }, [fetchCoach]); // Dependency array includes 'fetchCoach'

  // Callback for the assignment component to trigger a refresh
  const handleAssignmentSuccess = () => {
    // Re-fetch the coach data to show the updated team
    fetchCoach(); 
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
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
      </Container>
    );
  }

  if (!coach) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">Coach data could not be loaded.</Alert>
      </Container>
    );
  }

  // Display Coach Details
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Coach Details
      </Typography>
      
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <DetailItem title="Coach ID" value={`${coach.id.substring(0, 8)}...`} />
            <DetailItem title="First Name" value={coach.firstname} />
            <DetailItem title="Last Name" value={coach.lastname} />
            
            {/* Display Current Team */}
            <DetailItem title="Current Team" value={coach.teamName ? coach.teamName : "Unassigned"} />
          </Grid>
        </CardContent>
      </Card>
      
      {/* --- New Assign Coach Component --- */}
      {/* This component will only render its UI if the coach is unassigned 
        and will handle all its own logic.
      */}
      <AssignCoachToTeam 
        coach={coach} 
        onAssignmentSuccess={handleAssignmentSuccess} 
      />
      
    </Container>
  );
};

