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

// Define team menu items
const teamMenuItems = [
  { label: 'View Teams', path: '/teams' },
  { label: 'New Team', path: '/teams/new' }
];


export const TopNavBar: React.FC = () => {
  // State for Coaches menu
  const [coachAnchorEl, setCoachAnchorEl] = React.useState<null | HTMLElement>(null);
  const isCoachMenuOpen = Boolean(coachAnchorEl);

  // State for Teams menu
  const [teamAnchorEl, setTeamAnchorEl] = React.useState<null | HTMLElement>(null);
  const isTeamMenuOpen = Boolean(teamAnchorEl);

  // --- Specific handlers for each menu ---
  const handleCoachMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCoachAnchorEl(event.currentTarget);
  };
  const handleCoachMenuClose = () => {
    setCoachAnchorEl(null);
  };
  
  const handleTeamMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setTeamAnchorEl(event.currentTarget);
  };
  const handleTeamMenuClose = () => {
    setTeamAnchorEl(null);
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
              onClick={handleCoachMenuOpen} // Open coaches menu
              endIcon={<ArrowDropDownIcon />} // Add dropdown arrow
              aria-controls={isCoachMenuOpen ? 'coaches-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={isCoachMenuOpen ? 'true' : undefined}
            >
              Coaches
            </Button>

            {/* Teams Menu Button */}
            <Button
              sx={{ color: '#fff' }}
              onClick={handleTeamMenuOpen} // Open teams menu
              endIcon={<ArrowDropDownIcon />}
              aria-controls={isTeamMenuOpen ? 'teams-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={isTeamMenuOpen ? 'true' : undefined}
            >
              Teams
            </Button>

            {/* Coaches Dropdown Menu */}
            <Menu
              id="coaches-menu"
              anchorEl={coachAnchorEl}
              open={isCoachMenuOpen}
              onClose={handleCoachMenuClose}
              // Fix: Replaced deprecated MenuListProps with slotProps.list
              slotProps={{
                list: {
                  'aria-labelledby': 'coaches-button',
                },
              }}
            >
              {coachMenuItems.map((item) => (
                <MenuItem 
                  key={item.label} 
                  onClick={handleCoachMenuClose} // Close coaches menu
                  component={RouterLink}
                  to={item.path}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>

            {/* Teams Dropdown Menu */}
            <Menu
              id="teams-menu"
              anchorEl={teamAnchorEl}
              open={isTeamMenuOpen}
              onClose={handleTeamMenuClose}
              // Fix: Replaced deprecated MenuListProps with slotProps.list
              slotProps={{
                list: {
                  'aria-labelledby': 'teams-button',
                },
              }}
            >
              {teamMenuItems.map((item) => (
                <MenuItem 
                  key={item.label} 
                  onClick={handleTeamMenuClose} // Close teams menu
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

