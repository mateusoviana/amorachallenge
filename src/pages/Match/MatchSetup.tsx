import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Grid,
  Card,
  CardContent,
  useTheme,
  Alert,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Settings as SettingsIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface MatchPreferences {
  priceRange: [number, number];
  areaRange: [number, number];
  bedrooms: number[];
  bathrooms: number[];
  neighborhoods: string[];
  cities: string[];
}

const MatchSetup: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<MatchPreferences>({
    priceRange: [0, 2000000],
    areaRange: [0, 500],
    bedrooms: [1, 2, 3],
    bathrooms: [1, 2],
    neighborhoods: [],
    cities: ['São Paulo'],
  });

  const neighborhoods = [
    'Centro', 'Vila Madalena', 'Pinheiros', 'Itaim Bibi', 
    'Jardins', 'Moema', 'Vila Olímpia', 'Brooklin'
  ];

  const cities = [
    'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 
    'Salvador', 'Recife', 'Fortaleza', 'Curitiba'
  ];

  const handlePreferenceChange = (field: keyof MatchPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSavePreferences = () => {
    // Salvar preferências no localStorage ou backend
    localStorage.setItem('matchPreferences', JSON.stringify(preferences));
    localStorage.setItem('matchSetupCompleted', 'true');
    navigate('/match/swipe');
  };

  const handleSkipSetup = () => {
    // Usar preferências padrão
    const defaultPreferences: MatchPreferences = {
      priceRange: [0, 2000000],
      areaRange: [0, 500],
      bedrooms: [1, 2, 3],
      bathrooms: [1, 2],
      neighborhoods: [],
      cities: ['São Paulo'],
    };
    localStorage.setItem('matchPreferences', JSON.stringify(defaultPreferences));
    localStorage.setItem('matchSetupCompleted', 'true');
    navigate('/match/swipe');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <FavoriteIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mr: 2 }} />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
            aMORA Match
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Configure suas preferências para encontrar o imóvel ideal
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SettingsIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
          <Typography variant="h5" component="h2">
            Suas Preferências
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Faixa de Preço */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Faixa de Preço
            </Typography>
            <Slider
              value={preferences.priceRange}
              onChange={(event, newValue) => handlePreferenceChange('priceRange', newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={2000000}
              step={50000}
              valueLabelFormat={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                R$ {(preferences.priceRange[0] / 1000).toFixed(0)}k
              </Typography>
              <Typography variant="body2" color="text.secondary">
                R$ {(preferences.priceRange[1] / 1000).toFixed(0)}k
              </Typography>
            </Box>
          </Grid>

          {/* Área */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Área (m²)
            </Typography>
            <Slider
              value={preferences.areaRange}
              onChange={(event, newValue) => handlePreferenceChange('areaRange', newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={500}
              step={10}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {preferences.areaRange[0]}m²
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {preferences.areaRange[1]}m²
              </Typography>
            </Box>
          </Grid>

          {/* Quartos */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Quartos</InputLabel>
              <Select
                multiple
                value={preferences.bedrooms}
                onChange={(event) => handlePreferenceChange('bedrooms', event.target.value)}
                input={<OutlinedInput label="Quartos" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {[1, 2, 3, 4, 5, 6].map((bedroom) => (
                  <MenuItem key={bedroom} value={bedroom}>
                    {bedroom} {bedroom === 1 ? 'quarto' : 'quartos'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Banheiros */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Banheiros</InputLabel>
              <Select
                multiple
                value={preferences.bathrooms}
                onChange={(event) => handlePreferenceChange('bathrooms', event.target.value)}
                input={<OutlinedInput label="Banheiros" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {[1, 2, 3, 4, 5].map((bathroom) => (
                  <MenuItem key={bathroom} value={bathroom}>
                    {bathroom} {bathroom === 1 ? 'banheiro' : 'banheiros'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Cidades */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Cidades</InputLabel>
              <Select
                multiple
                value={preferences.cities}
                onChange={(event) => handlePreferenceChange('cities', event.target.value)}
                input={<OutlinedInput label="Cidades" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Bairros */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Bairros (opcional)</InputLabel>
              <Select
                multiple
                value={preferences.neighborhoods}
                onChange={(event) => handlePreferenceChange('neighborhoods', event.target.value)}
                input={<OutlinedInput label="Bairros (opcional)" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {neighborhoods.map((neighborhood) => (
                  <MenuItem key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Alert severity="info" sx={{ mt: 3, mb: 3 }}>
          <Typography variant="body2">
            Você pode alterar essas preferências a qualquer momento durante o uso do aMORA Match.
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            variant="outlined"
            onClick={handleSkipSetup}
            sx={{ flex: 1 }}
          >
            Pular Configuração
          </Button>
          <Button
            variant="contained"
            onClick={handleSavePreferences}
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              flex: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
              },
            }}
          >
            Começar a Swipear
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default MatchSetup;
