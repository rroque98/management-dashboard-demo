import React from 'react';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Patient Management Dashboard Demo
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/add">
            Add Patient
          </Button>
          <Button color="inherit" component={Link} to="/custom-fields">
            Manage Custom Fields
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 4 }}>{children}</Container>
    </>
  );
};

export default Layout;
