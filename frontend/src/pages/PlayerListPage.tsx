import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { getAllPlayers } from '../services/PlayerService';
import type { Player } from '../models/Player';

export const PlayerListPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAllPlayers();
        setPlayers(data);
      } catch (err) {
        console.error('Failed to fetch players:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const handleRowClick = (id: string) => {
    navigate(`/players/${id}`);
  };

  // Show loading spinner
  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Show error message
  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Players
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/players/new"
        >
          Add New Player
        </Button>
      </Box>

      {/* Show table of players */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: 'action.hover' } }}>
              <TableCell>Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Nationality</TableCell>
              <TableCell>Shirt Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No players found.
                </TableCell>
              </TableRow>
            ) : (
              players.map((player) => (
                <TableRow
                  key={player.id}
                  hover
                  onClick={() => handleRowClick(player.id)}
                  sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {player.firstname} {player.lastname}
                  </TableCell>
                  <TableCell>{player.position || 'N/A'}</TableCell>
                  <TableCell>{player.nationality || 'N/A'}</TableCell>
                  <TableCell>{player.shirtNumber || 'N/A'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

