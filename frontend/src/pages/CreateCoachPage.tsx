import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
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
const CreateCoachPage: React.FC = () => {
  // State for the form fields
  const [formData, setFormData] = useState<CoachFormData>(initialState);
  
  // State for loading and submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for handling errors and success messages
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // --- Event Handlers ---

  /** Handles changes in standard text fields */
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /** Handles the form submission */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    
    // Reset status
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const newCoach = await createCoach(formData);
      setSuccess(`Successfully created coach: ${newCoach.firstname} ${newCoach.lastname}!`);
      setFormData(initialState); // Clear the form on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Rendering ---
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 4,
        backgroundColor: '#f4f6f8',
        minHeight: '100vh',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: '500px',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create New Coach
        </Typography>

        {/* Success Message */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Error Message */}
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
      </Paper>
    </Box>
  );
};

export default CreateCoachPage;