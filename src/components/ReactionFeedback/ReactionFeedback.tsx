import React from 'react';
import { Box, Typography, Fade } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';

interface ReactionFeedbackProps {
  show: boolean;
  change: 'up' | 'down' | 'same';
  position: number;
}

const ReactionFeedback: React.FC<ReactionFeedbackProps> = ({ show, change, position }) => {
  if (!show) return null;

  const getIcon = () => {
    switch (change) {
      case 'up': return <TrendingUp sx={{ color: '#4caf50' }} />;
      case 'down': return <TrendingDown sx={{ color: '#f44336' }} />;
      default: return <TrendingFlat sx={{ color: '#ff9800' }} />;
    }
  };

  const getMessage = () => {
    switch (change) {
      case 'up': return `Subiu para ${position}º lugar!`;
      case 'down': return `Desceu para ${position}º lugar`;
      default: return `Manteve ${position}º lugar`;
    }
  };

  return (
    <Fade in={show} timeout={300}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          bgcolor: 'rgba(0,0,0,0.8)',
          color: 'white',
          px: 2,
          py: 1,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pointerEvents: 'none',
        }}
      >
        {getIcon()}
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {getMessage()}
        </Typography>
      </Box>
    </Fade>
  );
};

export default ReactionFeedback;