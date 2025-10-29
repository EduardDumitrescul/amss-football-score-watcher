import React, { useState, useEffect } from 'react';
import type { Coach } from '../models/Coach'; // Import the shared interface
import { getAllCoaches } from '../services/CoachService'; // Import the new service
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

/**
 * A page component that fetches and displays a list of all coaches
 * using a dedicated service.
 */
export const CoachListPage: React.FC = () => {
  // State to store the list of coaches
  const [coaches, setCoaches] = useState<Coach[]>([]);
  // State to manage loading status
  const [loading, setLoading] = useState<boolean>(true);
  // State to store any potential errors
  const [error, setError] = useState<string | null>(null);

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    // Define an async function to fetch coaches
    const fetchCoaches = async () => {
      setLoading(true);
      setError(null);
      try {
        // --- UPDATED ---
        // Use the service to fetch data instead of fetching directly
        const data = await getAllCoaches();
        setCoaches(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        // Ensure loading is set to false even if there's an error
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []); // Empty dependency array means this runs once on mount

  // --- Render Logic (This part remains the same) ---

  // 1. Show a loading spinner while fetching
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 2. Show an error message if fetching failed
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          <strong>Error:</strong> {error}
        </Alert>
      </Container>
    );
  }

  // 3. Show the main content
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        All Coaches
      </Typography>
      
      {/* Show a message if no coaches are found */}
      {coaches.length === 0 ? (
        <Alert severity="info">No coaches found.</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table aria-label="coaches table">
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>First Name</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Last Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coaches.map((coach) => (
                <TableRow 
                  key={coach.id}
                  sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                    '&:last-child td, &:last-child th': { border: 0 } 
                  }}
                >
                  <TableCell component="th" scope="row">
                    {/* Displaying only a part of UUID for brevity, but full ID is fine */}
                    {coach.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>{coach.firstname}</TableCell>
                  <TableCell>{coach.lastname}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};


