import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  Button
} from '@mui/material';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { getCoachById } from '../services/CoachService';
import type { Coach } from '../models/Coach';
import { Person, Shield, Group, ArrowBack } from '@mui/icons-material';

export const CoachDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [coach, setCoach] = useState<Coach | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Coach ID is missing.');
      setIsLoading(false);
      return;
    }

    const fetchCoach = async () => {
      setIsLoading(true);
      try {
        const data = await getCoachById(id);
        setCoach(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoach();
  }, [id]);

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!coach) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning" sx={{ mt: 3 }}>
          Coach not found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
        <Button 
            startIcon={<ArrowBack />} 
            onClick={() => navigate('/coaches')} 
            sx={{ mb: 2 }}
        >
            Back to Coach List
        </Button>
        <Card elevation={3}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Person />
                    </Avatar>
                }
                title={<Typography variant="h4">{`${coach.firstname} ${coach.lastname}`}</Typography>}
                subheader="Coach Details"
            />
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <List>
                            <ListItem>
                                <ListItemIcon><Shield /></ListItemIcon>
                                <ListItemText primary="Coach ID" secondary={coach.id} />
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <CardHeader title="Current Team" />
                            <CardContent>
                                {coach.teamId ? (
                                    <Typography variant="body1">
                                        <Link component={RouterLink} to={`/teams/${coach.teamId}`}>
                                            {coach.teamName}
                                        </Link>
                                    </Typography>
                                ) : (
                                    <Typography>Not currently coaching a team.</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    </Container>
  );
};
