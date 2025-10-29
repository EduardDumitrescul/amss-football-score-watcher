import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link as RouterLink } from 'react-router-dom';

// --- Menu Definitions ---
const homeNavItem = { label: 'Home', path: '/' };

const coachMenuItems = [
  { label: 'View Coaches', path: '/coaches' },
  { label: 'New Coach', path: '/coaches/new' }
];

const teamMenuItems = [
  { label: 'View Teams', path: '/teams' },
  { label: 'New Team', path: '/teams/new' }
];

// --- NEW ---
const playerMenuItems = [
  { label: 'View Players', path: '/players' },
  { label: 'New Player', path: '/players/new' }
];
// --- END NEW ---


/**
 * Reusable hook to manage a dropdown menu
 */
const useMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return { anchorEl, isOpen, openMenu, closeMenu };
};

/**
 * Reusable Menu Component
 */
const DropdownMenu: React.FC<{
  id: string;
  anchorEl: null | HTMLElement;
  isOpen: boolean;
  onClose: () => void;
  items: Array<{ label: string, path: string }>;
}> = ({ id, anchorEl, isOpen, onClose, items }) => (
  <Menu
    id={id}
    anchorEl={anchorEl}
    open={isOpen}
    onClose={onClose}
    // Fix for deprecation warning:
    slotProps={{
      paper: {
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }
    }}
    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
  >
    {items.map((item) => (
      <MenuItem
        key={item.label}
        onClick={onClose} // Close menu on item click
        component={RouterLink}
        to={item.path}
      >
        {item.label}
      </MenuItem>
    ))}
  </Menu>
);


export const TopNavBar: React.FC = () => {
  // Create menu state hooks
  const coachesMenu = useMenu();
  const teamsMenu = useMenu();
  const playersMenu = useMenu(); // --- NEW ---

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Mobile Menu Icon */}
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
          <Typography variant="h6" component="div">
            My App
          </Typography>

          {/* Desktop Links (Centered) */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              gap: 1, // Add spacing between buttons
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
              onClick={coachesMenu.openMenu}
              endIcon={<ArrowDropDownIcon />}
              aria-controls={coachesMenu.isOpen ? 'coaches-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={coachesMenu.isOpen ? 'true' : undefined}
            >
              Coaches
            </Button>

            {/* Teams Menu Button */}
            <Button
              sx={{ color: '#fff' }}
              onClick={teamsMenu.openMenu}
              endIcon={<ArrowDropDownIcon />}
              aria-controls={teamsMenu.isOpen ? 'teams-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={teamsMenu.isOpen ? 'true' : undefined}
            >
              Teams
            </Button>
            
            {/* --- NEW Player Menu Button --- */}
            <Button
              sx={{ color: '#fff' }}
              onClick={playersMenu.openMenu}
              endIcon={<ArrowDropDownIcon />}
              aria-controls={playersMenu.isOpen ? 'players-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={playersMenu.isOpen ? 'true' : undefined}
            >
              Players
            </Button>
            {/* --- END NEW --- */}

          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Menus (Rendered outside the AppBar) */}
      <DropdownMenu
        id="coaches-menu"
        {...coachesMenu}
        onClose={coachesMenu.closeMenu}
        items={coachMenuItems}
      />
      <DropdownMenu
        id="teams-menu"
        {...teamsMenu}
        onClose={teamsMenu.closeMenu}
        items={teamMenuItems}
      />
      {/* --- NEW Player Menu --- */}
      <DropdownMenu
        id="players-menu"
        {...playersMenu}
        onClose={playersMenu.closeMenu}
        items={playerMenuItems}
      />
      {/* --- END NEW --- */}
    </Box>
  );
};

