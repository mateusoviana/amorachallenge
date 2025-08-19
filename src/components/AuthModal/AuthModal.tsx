import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  useTheme,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon, Login as LoginIcon, PersonAdd as RegisterIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  message?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, message }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleRegister = () => {
    onClose();
    navigate('/register');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 4, textAlign: 'center' }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: theme.palette.secondary.main, mb: 2 }}>
            Acesso Necessário
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {message || 'Para usar esta funcionalidade, você precisa estar logado na plataforma.'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<LoginIcon />}
            onClick={handleLogin}
            fullWidth
          >
            Fazer Login
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<RegisterIcon />}
            onClick={handleRegister}
            fullWidth
          >
            Criar Conta
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;