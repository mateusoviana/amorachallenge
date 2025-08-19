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
import { PersonAdd as RegisterIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const Register: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'buyer' as 'buyer' | 'realtor',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
      });

      if (success) {
        navigate('/');
      } else {
        setError('Erro ao criar conta. Email pode já estar em uso.');
      }
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: theme.palette.secondary.main, mb: 2 }}>
            Criar Conta
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Cadastre-se para acessar todas as funcionalidades da aMORA
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
              label="Nome completo"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              placeholder="Seu nome completo"
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              placeholder="seu@email.com"
            />

            <FormControl fullWidth required>
              <InputLabel>Tipo de usuário</InputLabel>
              <Select
                value={formData.userType}
                label="Tipo de usuário"
                onChange={(e) => setFormData(prev => ({ ...prev, userType: e.target.value as 'buyer' | 'realtor' }))}
              >
                <MenuItem value="buyer">Comprador</MenuItem>
                <MenuItem value="realtor">Corretor</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Senha"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              placeholder="Mínimo 6 caracteres"
            />

            <TextField
              fullWidth
              label="Confirmar senha"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
              placeholder="Digite a senha novamente"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<RegisterIcon />}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>

            <Button
              variant="text"
              onClick={() => navigate('/login')}
              sx={{ mt: 1 }}
            >
              Já tem conta? Fazer login
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
      </Paper>
    </Container>
  );
};

export default Register;