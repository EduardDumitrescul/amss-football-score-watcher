import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { PlayerCreateForm } from '../components/PlayerCreateForm';
import { createPlayer } from '../services/PlayerService';
import type { PlayerFormData } from '../components/PlayerCreateForm';

export const CreatePlayerPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleCreatePlayer = async (formData: PlayerFormData) => {
    if (!formData.firstname || !formData.lastname) {
      setSubmitError('First Name and Last Name are required.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const newPlayer = await createPlayer(formData);
      navigate(`/players/${newPlayer.id}`);
    } catch (error) {
      console.error('Failed to create player:', error);
      setSubmitError(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Go Back
        </Button>
        <Card elevation={3}>
          <CardHeader
            title="Create New Player"
            subheader="Fill in the details below to add a new player"
            titleTypographyProps={{ variant: 'h4', component: 'h1' }}
            subheaderTypographyProps={{ variant: 'body1' }}
          />
          <CardContent>
            <PlayerCreateForm
              onSubmit={handleCreatePlayer}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
