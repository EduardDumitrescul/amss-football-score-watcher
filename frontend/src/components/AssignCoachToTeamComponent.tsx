import React, { useState, useEffect } from 'react';
import type { Coach } from '../models/Coach';
import type { Team } from '../models/Team';
import { getAvailableTeams, assignCoachToTeam } from '../services/TeamService';
import {
  Typography,
  Alert,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
  CircularProgress
} from '@mui/material';

// Define the props for the new component
interface AssignCoachToTeamProps {
  coach: Coach;
  onAssignmentSuccess: () => void; // Callback to refresh parent data
}

export const AssignCoachToTeam: React.FC<AssignCoachToTeamProps> = ({ coach, onAssignmentSuccess }) => {
  // State for the assignment UI
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [loadingTeams, setLoadingTeams] = useState<boolean>(true);

  // Fetch available teams when the component mounts
  useEffect(() => {
    const fetchAvailableTeams = async () => {
      setLoadingTeams(true);
      setAssignmentError(null);
      try {
        const teamsData = await getAvailableTeams();
        setAvailableTeams(teamsData);
      } catch (e) {
        if (e instanceof Error) {
          setAssignmentError(e.message);
        } else {
          setAssignmentError('An unknown error occurred while fetching teams.');
        }
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchAvailableTeams();
  }, []); // Run once on mount

  const handleTeamSelectChange = (e: SelectChangeEvent) => {
    setSelectedTeamId(e.target.value as string);
  };

  const handleAssignCoach = async () => {
    if (!coach.id || !selectedTeamId) {
      setAssignmentError('Please select a team to assign.');
      return;
    }

    setAssignmentError(null);
    try {
      // Call the service to assign the coach
      await assignCoachToTeam(selectedTeamId, coach.id);
      
      // Call the success callback to refresh the parent page
      onAssignmentSuccess();
      setSelectedTeamId(''); // Reset dropdown
      
    } catch (err) {
      if (err instanceof Error) {
        setAssignmentError(err.message);
      } else {
        setAssignmentError('An unknown error occurred during assignment.');
      }
    }
  };

  // Only render if the coach is unassigned
  if (coach.teamId) {
    return null;
  }

  return (
    <Box sx={{ mt: 4, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Assign to a Team
      </Typography>
      
      {assignmentError && (
        <Alert severity="error" sx={{ mb: 2 }}>{assignmentError}</Alert>
      )}
      
      {loadingTeams ? (
         <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
           <CircularProgress />
         </Box>
      ) : availableTeams.length > 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="team-select-label">Available Teams</InputLabel>
            <Select
              labelId="team-select-label"
              value={selectedTeamId}
              label="Available Teams"
              onChange={handleTeamSelectChange}
            >
              {availableTeams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAssignCoach}
            disabled={!selectedTeamId}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Assign Coach
          </Button>
        </Box>
      ) : (
        <Alert severity="info">No available teams to assign.</Alert>
      )}
    </Box>
  );
};
