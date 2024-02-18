import { CSSProperties } from 'react';
import { Container, Typography } from '@mui/material';

export const NotFound = () => {
  return (
    <Container style={notFoundTextWrapperStyle}>
      <Typography variant="h1" gutterBottom sx={{ 'text-align': 'center' }}>
        404
      </Typography>
      <Typography variant="h5" gutterBottom sx={{ 'text-align': 'center' }}>
        Page Not Found
      </Typography>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ 'text-align': 'center' }}
      >
        The page you're looking for doesn't exist or has been moved.
      </Typography>
    </Container>
  );
};

const notFoundTextWrapperStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '80vh',
  textAlign: 'center',
};
