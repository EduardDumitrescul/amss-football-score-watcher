import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';

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
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h5" gutterBottom>
        Player Details
      </Typography>
      
      {/* Error message display */}
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* First Name */}
        <Grid item xs={12} sm={6}>
          <div>
            <TextField
              required
              fullWidth
              id="firstname"
              label="First Name"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </Grid>

        {/* Last Name */}
        <Grid xs={12} sm={6}>
          <div>
            <TextField
              required
              fullWidth
              id="lastname"
              label="Last Name"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </Grid>

        {/* Position */}
        <Grid xs={12} sm={6}>
          <div>
            <TextField
              fullWidth
              id="position"
              label="Position (e.g., Forward)"
              name="position"
              value={formData.position}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </Grid>

        {/* Shirt Number */}
        <Grid xs={12} sm={6}>
          <div>
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
            />
          </div>
        </Grid>

        {/* Nationality */}
        <Grid xs={12} sm={6}>
          <div>
            <TextField
              fullWidth
              id="nationality"
              label="Nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </Grid>

        {/* Date of Birth */}
        <Grid xs={12} sm={6}>
          <div>
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
            />
          </div>
        </Grid>
        
      </Grid>

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, height: 40 }} // Fixed height
        disabled={isSubmitting}
      >
        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create Player'}
      </Button>
    </Box>
  );
};

