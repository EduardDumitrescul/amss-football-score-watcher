import React from 'react';
import { TopNavBar } from './components/TopNavBar';
import { CssBaseline, Container, Typography } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import CreateCoachPage from './pages/CreateCoachPage';
import { CoachListPage } from './pages/CoachListPage';
import { CoachDetailPage } from './pages/CoachDetailPage';
import { CreateTeamPage } from './pages/CreateTeamPage';
import { TeamDetailPage } from './pages/TeamDetailPage';
import { TeamListPage } from './pages/TeamListPage';

// Placeholder for the home page content
const HomePage = () => (
  <Container sx={{ mt: 4 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      Welcome to the App
    </Typography>
    <Typography variant="body1">
      This is the main content area below the navigation bar.
    </Typography>
  </Container>
);


function App() {
  return (
    <React.Fragment>
      <CssBaseline /> 
      <TopNavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/coaches" element={<CoachListPage/>} />
        <Route path="/coaches/new" element={<CreateCoachPage />} />
        <Route path="/coaches/:id" element={<CoachDetailPage />} />

        <Route path="/teams" element={<TeamListPage />} />
        <Route path="/teams/new" element={<CreateTeamPage />} />
        <Route path="/teams/:id" element={<TeamDetailPage />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;