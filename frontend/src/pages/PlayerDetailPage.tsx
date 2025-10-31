import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Button,
  Divider,
  Modal
} from '@mui/material';
import { getPlayerById } from '../services/PlayerService';
import type { Player } from '../models/Player';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SignContractForm from '../components/SignContractForm';

/**
 * Helper component to display a single piece of player data.
 */
const InfoItem: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
  <Grid item xs={12} sm={6}>
    <Typography variant="overline" color="text.secondary" sx={{ display: 'block' }}>
      {label}
    </Typography>
    <Typography variant="body1" gutterBottom>
      {value || 'N/A'}
    </Typography>
  </Grid>
);

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export const PlayerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchPlayer = useCallback(async () => {
    if (!id) {
      setError('No player ID provided.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getPlayerById(id);
      setPlayer(data);
    } catch (err) {
      console.error('Failed to fetch player:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlayer();
  }, [fetchPlayer]);

  const handleContractSigned = () => {
    setIsFormOpen(false);
    fetchPlayer(); // Refetch player data to show updated contract info
  };

  // Format date for display
  const formattedDateOfBirth = player?.dateOfBirth
    ? new Date(player.dateOfBirth).toLocaleDateString()
    : null;

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/players')}
          sx={{ mt: 2 }}
        >
          Back to Players
        </Button>
      </Container>
    );
  }

  if (!player) {
    return (
      <Container maxWidth="md">
        <Alert severity="info" sx={{ mt: 3 }}>
          Player data is not available.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            {player.firstname} {player.lastname}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/players')}
          >
            Back to List
          </Button>
        </Box>
        
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <InfoItem label="Position" value={player.position} />
          <InfoItem label="Shirt Number" value={player.shirtNumber} />
          <InfoItem label="Nationality" value={player.nationality} />
          <InfoItem label="Date of Birth" value={formattedDateOfBirth} />
          
          {/* Uncomment when Team is ready */}
          {/* <InfoItem 
            label="Team" 
            value={player.team ? player.team.name : 'N/A'} 
          /> */}
        </Grid>

        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setIsFormOpen(true)} 
          sx={{ mt: 3 }}
        >
          Sign Contract
        </Button>

      </Paper>

      <Modal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        aria-labelledby="sign-contract-form-title"
      >
        <Box sx={modalStyle}>
          <SignContractForm playerId={id!} onContractSigned={handleContractSigned} />
        </Box>
      </Modal>

    </Container>
  );
};
