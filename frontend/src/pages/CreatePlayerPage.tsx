import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper } from '@mui/material';
import { PlayerCreateForm } from '../components/PlayerCreateForm';
import { createPlayer } from '../services/PlayerService';
import type { PlayerFormData } from '../services/playerService';
// import { getAllTeams } from '../services/teamService'; // Uncomment when Team is ready
// import type { Team } from '../models/Team'; // Uncomment when Team is ready

export const CreatePlayerPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // --- Uncomment when Team is ready ---
  // const [teams, setTeams] = useState<Team[]>([]);
  // const [isLoadingTeams, setIsLoadingTeams] = useState(true);

  // useEffect(() => {
  //   const fetchTeams = async () => {
  //     try {
  //       const data = await getAllTeams();
  //       setTeams(data);
  //     } catch (error) {
  //       setSubmitError('Failed to load teams.');
  //     } finally {
  //       setIsLoadingTeams(false);
  //     }
  //   };
  //   fetchTeams();
  // }, []);

  /**
   * Handles the form submission logic.
   */
  const handleCreatePlayer = async (formData: PlayerFormData) => {
    // Basic validation
    if (!formData.firstname || !formData.lastname) {
      setSubmitError('First Name and Last Name are required.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Call the service to create the player
      const newPlayer = await createPlayer(formData);
      // Navigate to the new player's detail page
      navigate(`/players/${newPlayer.id}`);
    } catch (error) {
      console.error('Failed to create player:', error);
      setSubmitError(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Show loading state while fetching teams (uncomment when ready) ---
  // if (isLoadingTeams) {
  //   return (
  //     <Container maxWidth="md">
  //       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
  //         <CircularProgress />
  //       </Box>
  //     </Container>
  //   );
  // }

  return (
    <Container maxWidth="md">
      <Paper sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create New Player
        </Typography>
        <PlayerCreateForm 
          onSubmit={handleCreatePlayer}
          isSubmitting={isSubmitting}
          submitError={submitError}
          // teams={teams} // Uncomment when Team is ready
        />
      </Paper>
    </Container>
  );
};

