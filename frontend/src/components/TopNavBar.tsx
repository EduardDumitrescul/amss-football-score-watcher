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

// Define the navigation items
const navItems = ['Home', 'About', 'Contact'];

export const TopNavBar: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* The AppBar's Toolbar is already a flex container and 
        provides a 'relative' position context, which we need 
        for absolute positioning the links.
      */}
      <AppBar position="static">
        <Toolbar>
          {/* Icon Button for mobile menu (optional) */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { sm: 'none' } }} // Show only on small screens
          >
            <MenuIcon />
          </IconButton>

          {/* App Title */}
          <Typography 
            variant="h6" 
            component="div" 
            // We remove { flexGrow: 1 } so it doesn't push the links
          >
            My App
          </Typography>

          {/* Navigation Links for desktop (Now Centered) */}
          <Box sx={{ 
              display: { xs: 'none', sm: 'block' }, // Hide on extra-small screens
              
              // --- This is the fix ---
              // 1. Set position to absolute
              position: 'absolute',
              // 2. Move the left edge to the 50% mark
              left: '50%',
              // 3. Translate it back by 50% of *its own width*
              transform: 'translateX(-50%)'
              // --- End of fix ---
            }}
          >
            {navItems.map((item) => (
              <Button key={item} sx={{ color: '#fff' }}>
                {item}
              </Button>
            ))}
          </Box>

        </Toolbar>
      </AppBar>
    </Box>
  );
};
