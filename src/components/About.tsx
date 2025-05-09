import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="md" sx={{ paddingY: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About This Application
        </Typography>
        
        <Typography variant="body1" paragraph>
          This application is a patient management system built with React, TypeScript, and Material UI.
          It provides a powerful data grid for visualizing and managing patient information.
        </Typography>
        
        <Typography variant="body1" paragraph>
          The application features include:
        </Typography>
        
        <Box component="ul" sx={{ marginLeft: 2 }}>
          <Typography component="li" variant="body1">
            Advanced data grid with sorting, filtering, and grouping capabilities
          </Typography>
          <Typography component="li" variant="body1">
            Patient information management
          </Typography>
          <Typography component="li" variant="body1">
            Test rig for data grid performance testing
          </Typography>
        </Box>
        
        <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
          Technologies Used
        </Typography>
        
        <Box component="ul" sx={{ marginLeft: 2 }}>
          <Typography component="li" variant="body1">React 19</Typography>
          <Typography component="li" variant="body1">TypeScript</Typography>
          <Typography component="li" variant="body1">Material UI</Typography>
          <Typography component="li" variant="body1">MUI X Data Grid Premium</Typography>
          <Typography component="li" variant="body1">Vite</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default About; 