import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Button, 
  Box 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
// Import the Link component from react-router-dom for navigation
import { Link as RouterLink } from 'react-router-dom';


// Define navigation items as objects with labels and paths
const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Coaches', path: '/coaches' },
  { label: 'Create Coach', path: '/coaches/new' }
];

export const TopNavBar: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Icon Button for mobile menu (optional) */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* App Title */}
          <Typography 
            variant="h6" 
            component="div" 
          >
            My App
          </Typography>

          {/* Navigation Links for desktop (Centered) */}
          <Box sx={{ 
              display: { xs: 'none', sm: 'block' },
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            {/* Map over the new navItems array */}
            {navItems.map((item) => (
              <Button 
                key={item.label} 
                sx={{ color: '#fff' }}
                // Use RouterLink for navigation
                component={RouterLink}
                to={item.path}
              >
                {item.label}
              </Button>
            ))}
          </Box>

        </Toolbar>
      </AppBar>
    </Box>
  );
};
