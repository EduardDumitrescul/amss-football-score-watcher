import React from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
} from '@mui/material';
import { Person } from '@mui/icons-material';

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
      sx={{ mt: 3 }} // Margin top for spacing from title
      noValidate
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="First Name"
            variant="outlined"
            name="firstname"
            value={formData.firstname}
            onChange={onFieldChange}
            required
            fullWidth
            disabled={isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Last Name"
            variant="outlined"
            name="lastname"
            value={formData.lastname}
            onChange={onFieldChange}
            required
            fullWidth
            disabled={isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ position: 'relative', mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isSubmitting}
          size="large"
        >
          {isSubmitting ? 'Creating...' : 'Create Coach'}
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
