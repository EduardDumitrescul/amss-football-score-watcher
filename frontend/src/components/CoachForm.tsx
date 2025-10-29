import React from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';

export interface CoachFormData {
  firstname: string;
  lastname: string;
}

interface CoachFormProps {
  /** The current state of the form fields */
  formData: CoachFormData;
  /** Flag to disable the form while submitting */
  isSubmitting: boolean;
  /** Generic change handler for text inputs */
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Form submission handler */
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * A presentational component for the coach creation form.
 */
export const CoachForm: React.FC<CoachFormProps> = ({
  formData,
  isSubmitting,
  onFieldChange,
  onSubmit,
}) => {
  return (
    <Box 
      component="form" 
      onSubmit={onSubmit} 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 3 // Adds spacing between form elements
      }}
      noValidate
    >
      <TextField
        label="First Name"
        variant="outlined"
        name="firstname" // Matches CoachFormData
        value={formData.firstname}
        onChange={onFieldChange}
        required
        disabled={isSubmitting}
      />

      <TextField
        label="Last Name"
        variant="outlined"
        name="lastname" // Matches CoachFormData
        value={formData.lastname}
        onChange={onFieldChange}
        required
        disabled={isSubmitting}
      />

      <Box sx={{ position: 'relative', mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isSubmitting}
          size="large"
        >
          {isSubmitting ? 'Creating Coach...' : 'Create Coach'}
        </Button>
        {isSubmitting && (
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
    </Box>
  );
};
