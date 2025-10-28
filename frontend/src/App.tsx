import React from 'react';
import { TopNavBar } from './components/TopNavBar';
import { CssBaseline, Container, Typography } from '@mui/material';

function App() {
  return (
    <React.Fragment>
      {/* CssBaseline normalizes styles across browsers */}
      <CssBaseline /> 
      
      {/* Your new navigation bar */}
      <TopNavBar />

      {/* Your main app content */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to the App
        </Typography>
        <Typography variant="body1">
          This is the main content area below the navigation bar.
        </Typography>
      </Container>
    </React.Fragment>
  );
}

export default App;