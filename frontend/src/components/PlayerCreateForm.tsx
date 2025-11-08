import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Person,
  SportsSoccer,
  Numbers,
  Flag,
  CalendarMonth,
} from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';

// This is the shape of data from the PlayerCreateForm
export interface PlayerFormData {
  firstname: string;
  lastname: string;
  position?: string;
  shirtNumber?: number;
  nationality?: string;
  dateOfBirth?: string; // Should be in 'YYYY-MM-DD' format or null
  // teamId?: string; // Uncomment when Team is ready
}

// Props for the form component
interface PlayerCreateFormProps {
  onSubmit: (formData: PlayerFormData) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  // teams: Team[]; // Uncomment when Team is ready
}

export const PlayerCreateForm: React.FC<PlayerCreateFormProps> = ({
  onSubmit,
  isSubmitting,
  submitError,
  // teams, // Uncomment when Team is ready
}) => {
  
  // Form state
  const [formData, setFormData] = useState<PlayerFormData>({
    firstname: '',
    lastname: '',
    position: '',
    shirtNumber: undefined,
    nationality: '',
    dateOfBirth: '',
    // teamId: '', // Uncomment when Team is ready
  });

  // Generic change handler for text fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value,
    }));
  };

  // Handler for date field
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: e.target.value || undefined, // Store as 'YYYY-MM-DD' string or undefined
    }));
  };

  // Handler for select dropdown (uncomment when ready)
  // const handleTeamChange = (e: SelectChangeEvent) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     teamId: e.target.value as string,
  //   }));
  // };


  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass the current form state to the parent's submit function
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
      
      {/* Error message display */}
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* First Name */}
        <Grid xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="firstname"
            label="First Name"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
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

        {/* Last Name */}
        <Grid xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="lastname"
            label="Last Name"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
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

        {/* Position */}
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            id="position"
            label="Position (e.g., Forward)"
            name="position"
            value={formData.position}
            onChange={handleChange}
            disabled={isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SportsSoccer />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Shirt Number */}
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            id="shirtNumber"
            label="Shirt Number"
            name="shirtNumber"
            type="number"
            value={formData.shirtNumber || ''} // Handle undefined for number input
            onChange={handleChange}
            disabled={isSubmitting}
            inputProps={{ min: 1, max: 99 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Numbers />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Nationality */}
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            id="nationality"
            label="Nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            disabled={isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Flag />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Date of Birth */}
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            id="dateOfBirth"
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth || ''}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true, // Keep the label floated
            }}
            disabled={isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonth />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
      </Grid>

      {/* Submit Button */}
      <Box sx={{ position: 'relative', mt: 3 }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ height: 40 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Player'}
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

