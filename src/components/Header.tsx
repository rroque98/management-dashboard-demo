import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import LogoutButton from './Auth/LogoutButton';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Patient Management Dashboard Demo
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Patient List
          </Button>
          <Button color="inherit" component={Link} to="/add">
            Add Patient
          </Button>
          <Button color="inherit" component={Link} to="/custom-fields">
            Manage Custom Fields
          </Button>
          {user && (
            <Box>
              <LogoutButton />
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
