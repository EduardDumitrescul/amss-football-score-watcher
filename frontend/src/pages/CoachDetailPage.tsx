import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Coach } from '../models/Coach'; // Assuming path is correct
import { getCoachById } from '../services/CoachService'; // Assuming path is correct
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Button
} from '@mui/material';

export const CoachDetailPage: React.FC = () => {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get the 'id' from the URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError('No coach ID provided.');
      setLoading(false);
      return;
    }

    // FIX: Removed the erroneous '_bak' from the function definition
    const fetchCoach = async () => {
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
    };

    fetchCoach();
  }, [id]); // Re-run effect if ID changes

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
        <Button 
          variant="outlined" 
          onClick={() => navigate('/coaches')}
          sx={{ mt: 2 }}
        >
          Back to List
        </Button>
      </Container>
    );
  }

  if (!coach) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">No coach data available.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Coach Details
        </Typography>
        
        {/* FIX: The 'item' prop is not used on Grid children in MUI v5. 
          You just place the breakpoint props (xs, sm) directly on the Grid
          component, and it will act as an item.
        */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* Label */}
          <Grid xs={12} sm={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              First Name:
            </Typography>
          </Grid>
          {/* Value */}
          <Grid xs={12} sm={8}>
            <Typography variant="body1">
              {coach.firstname}
            </Typography>
          </Grid>

          {/* Label */}
          <Grid xs={12} sm={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Last Name:
            </Typography>
          </Grid>
          {/* Value */}
          <Grid xs={12} sm={8}>
            <Typography variant="body1">
              {coach.lastname}
            </Typography>
          </Grid>

          {/* Label */}
          <Grid xs={12} sm={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              ID:
            </Typography>
          </Grid>
          {/* Value */}
          <Grid xs={12} sm={8}>
            <Typography variant="body1" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {coach.id}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start' }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/coaches')}
          >
            Back to List
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

