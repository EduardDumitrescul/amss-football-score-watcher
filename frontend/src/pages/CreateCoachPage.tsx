import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  CardHeader,
  Alert,
  Button,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { CoachForm } from '../components/CoachForm';
import type { CoachFormData } from '../components/CoachForm';
import { createCoach } from '../services/CoachService';

const initialState: CoachFormData = {
  firstname: '',
  lastname: '',
};

/**
 * A "smart" page component that manages state and logic
 * for creating a new coach.
 */
export const CreateCoachPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CoachFormData>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const newCoach = await createCoach(formData);
      navigate(`/coaches/${newCoach.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
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
            title="Create New Coach"
            subheader="Fill in the details below to add a new coach"
            titleTypographyProps={{ variant: 'h4', component: 'h1' }}
            subheaderTypographyProps={{ variant: 'body1' }}
          />
          <CardContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <CoachForm
              formData={formData}
              isSubmitting={isSubmitting}
              onFieldChange={handleFieldChange}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};