import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

const MatchRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const setupCompleted = localStorage.getItem('matchSetupCompleted');
    const hasPreferences = localStorage.getItem('matchPreferences');

    if (setupCompleted === 'true' && hasPreferences) {
      // Se já foi configurado, vai direto para o swipe
      navigate('/match/swipe');
    } else {
      // Se não foi configurado, vai para o setup
      navigate('/match/setup');
    }
  }, [navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body1" color="text.secondary">
        Carregando aMORA Match...
      </Typography>
    </Box>
  );
};

export default MatchRedirect;
