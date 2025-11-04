import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import type { CoachSummary } from '../models/Coach'; 
import { getAllCoaches } from '../services/CoachService';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';

export const CoachListPage: React.FC = () => {
  const [coaches, setCoaches] = useState<CoachSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoaches = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllCoaches();
        setCoaches(data);
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

    fetchCoaches();
  }, []); 

  const handleRowClick = (id: string) => {
    navigate(`/coaches/${id}`);
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        All Coaches
      </Typography>
      
      {coaches.length === 0 ? (
        <Alert severity="info">No coaches found.</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table aria-label="coaches table">
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Full Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coaches.map((coach) => (
                <TableRow 
                  key={coach.id}
                  onClick={() => handleRowClick(coach.id)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'action.selected' },
                    '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                    '&:last-child td, &:last-child th': { border: 0 } 
                  }}
                >
                  <TableCell component="th" scope="row">
                    {coach.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>{coach.fullName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};
