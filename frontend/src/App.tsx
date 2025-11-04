import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, Container, Typography } from '@mui/material';
import { TopNavBar } from './components/TopNavBar';
import { CoachListPage } from './pages/CoachListPage';
import { CoachDetailPage } from './pages/CoachDetailPage';
import { TeamListPage } from './pages/TeamListPage';
import { TeamDetailPage } from './pages/TeamDetailPage';
import { CreateTeamPage } from './pages/CreateTeamPage';
import { PlayerListPage } from './pages/PlayerListPage';
import { PlayerDetailPage } from './pages/PlayerDetailPage';
import { CreatePlayerPage } from './pages/CreatePlayerPage';
import CreateCoachPage from './pages/CreateCoachPage';

// Placeholder for Home
const HomePage: React.FC = () => (
  <Container sx={{ mt: 4 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      Welcome to the Football App
    </Typography>
  </Container>
);


function App() {
  return (
    <React.Fragment>
      <CssBaseline />
        {/* TopNavBar is inside BrowserRouter so it can use RouterLink */}
        <TopNavBar />

        {/* Define all application routes */}
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<HomePage />} />

          {/* Coach Routes */}
          <Route path="/coaches" element={<CoachListPage />} />
          <Route path="/coaches/new" element={<CreateCoachPage />} />
          <Route path="/coaches/:id" element={<CoachDetailPage />} />

          {/* Team Routes */}
          <Route path="/teams" element={<TeamListPage />} />
          <Route path="/teams/new" element={<CreateTeamPage />} />
          <Route path="/teams/:id" element={<TeamDetailPage />} />

          {/* --- NEW Player Routes --- */}
          <Route path="/players" element={<PlayerListPage />} />
          <Route path="/players/new" element={<CreatePlayerPage />} />
          <Route path="/players/:id" element={<PlayerDetailPage />} />
          {/* --- END NEW --- */}

          {/* Fallback route for 404 */}
          <Route 
            path="*" 
            element={
              <Container sx={{ mt: 4 }}>
                <Typography variant="h4">404 - Page Not Found</Typography>
              </Container>
            } 
          />
        </Routes>
    </React.Fragment>
  );
}

export default App;

