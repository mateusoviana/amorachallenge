import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { AlertsManager } from '../../components/AlertsManager';

const Alerts: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sistema de Alertas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure alertas personalizados e seja notificado quando novos imóveis que atendem seus critérios forem adicionados à plataforma.
        </Typography>
      </Box>
      
      <AlertsManager />
    </Container>
  );
};

export default Alerts;