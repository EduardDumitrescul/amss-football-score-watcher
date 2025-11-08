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
  Modal,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { getPlayerById } from '../services/PlayerService';
import { getTeamById } from '../services/TeamService';
import { getContractsByPlayerId } from '../services/ContractService';
import type { Player } from '../models/Player';
import type { Team } from '../models/Team';
import type { Contract } from '../models/ContractDto';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SignContractForm } from '../components/SignContractForm';

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
  const [team, setTeam] = useState<Team | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchPlayerAndTeam = useCallback(async () => {
    if (!id) {
      setError('No player ID provided.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const playerData = await getPlayerById(id);
      setPlayer(playerData);
      console.log(playerData)

      if (playerData.teamId) {
        const teamData = await getTeamById(playerData.teamId);
        setTeam(teamData);
      }

      const contractsData = await getContractsByPlayerId(id);
      console.log(contractsData)
      setContracts(contractsData);
    } catch (err) {
      console.error('Failed to fetch player or team:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlayerAndTeam();
  }, [fetchPlayerAndTeam]);

  const handleContractSigned = () => {
    setIsFormOpen(false);
    fetchPlayerAndTeam(); // Refetch player and team data to show updated contract info
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
        </Grid>

        {team && (
          <Box sx={{ mt: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Current Team
            </Typography>
            <Typography variant="body1">
              {team.name}
            </Typography>
          </Box>
        )}

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

      <Paper sx={{ mt: 4, p: 3, bordertRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Contract History
        </Typography>
        <List>
          {contracts.map((contract) => (
            <ListItem key={contract.id}>
              <ListItemText
                primary={`${contract.teamName}`}
                secondary={`From ${new Date(contract.startDate).toLocaleDateString()} to ${new Date(contract.endDate).toLocaleDateString()} - Salary: ${contract.salaryPerYear}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

    </Container>
  );
};
