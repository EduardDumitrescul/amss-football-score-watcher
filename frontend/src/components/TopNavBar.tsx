import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Button, 
  Box,
  Menu, // Import Menu component
  MenuItem // Import MenuItem component
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; // Icon for dropdown
import { Link as RouterLink } from 'react-router-dom';

// Define navigation items
const homeNavItem = { label: 'Home', path: '/' };

// Define coach menu items
const coachMenuItems = [
  { label: 'View Coaches', path: '/coaches' },
  { label: 'New Coach', path: '/coaches/new' }
];

export const TopNavBar: React.FC = () => {
  // State to manage the anchor element of the menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  // Function to open the menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to close the menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
            {/* Home Button */}
            <Button 
              sx={{ color: '#fff' }}
              component={RouterLink}
              to={homeNavItem.path}
            >
              {homeNavItem.label}
            </Button>
            
            {/* Coaches Menu Button */}
            <Button
              sx={{ color: '#fff' }}
              onClick={handleMenuOpen} // Open menu on click
              endIcon={<ArrowDropDownIcon />} // Add dropdown arrow
              aria-controls={isMenuOpen ? 'coaches-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={isMenuOpen ? 'true' : undefined}
            >
              Coaches
            </Button>

            {/* Coaches Dropdown Menu */}
            <Menu
              id="coaches-menu"
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'coaches-button',
              }}
            >
              {coachMenuItems.map((item) => (
                <MenuItem 
                  key={item.label} 
                  onClick={handleMenuClose} // Close menu on item click
                  component={RouterLink}
                  to={item.path}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>

        </Toolbar>
      </AppBar>
    </Box>
  );
};
