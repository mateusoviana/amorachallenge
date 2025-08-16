import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  useTheme,
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const Login: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/');
      } else {
        setError('Erro ao fazer login. Verifique suas credenciais.');
      }
    } catch (err) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: theme.palette.secondary.main, mb: 2 }}>
            Entrar na aMORA
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Faça login para acessar todas as funcionalidades
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              placeholder="seu@email.com"
            />

            <TextField
              fullWidth
              label="Senha"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              placeholder="Sua senha"
            />



            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              sx={{ mt: 2 }}
            >
              Entrar
            </Button>

            <Button
              variant="text"
              onClick={() => navigate('/')}
              sx={{ mt: 1 }}
            >
              Voltar para Home
            </Button>
          </Box>
        </form>

        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
            Acesso seguro:
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            • Use suas credenciais cadastradas no sistema
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            • O tipo de usuário é definido no seu perfil
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;