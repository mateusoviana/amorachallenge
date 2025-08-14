import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  useTheme,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { Apartment, Group } from '../../types';

const AddApartment: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mock groups para demonstração
  const mockGroups: Group[] = [
    {
      id: '1',
      name: 'Grupo Público',
      description: 'Imóveis públicos disponíveis para todos os usuários',
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [],
      apartments: [],
    },
    {
      id: '2',
      name: 'Meus Favoritos',
      description: 'Imóveis de interesse pessoal',
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [],
      apartments: [],
    },
  ];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    neighborhood: '',
    city: '',
    state: '',
    bedrooms: '',
    bathrooms: '',
    parkingSpaces: '',
    area: '',
    isPublic: false,
    selectedGroups: [] as string[],
    images: [] as string[],
  });

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGroupsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setFormData(prev => ({
      ...prev,
      selectedGroups: value,
    }));
  };

  const handleAddImage = () => {
    const imageUrl = prompt('Digite a URL da imagem:');
    if (imageUrl) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = ['title', 'description', 'price', 'address', 'neighborhood', 'city', 'state', 'bedrooms', 'bathrooms', 'parkingSpaces', 'area'];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setError(`Campo ${field} é obrigatório`);
        return false;
      }
    }

    if (formData.price && parseFloat(formData.price) <= 0) {
      setError('Preço deve ser maior que zero');
      return false;
    }

    if (formData.area && parseFloat(formData.area) <= 0) {
      setError('Área deve ser maior que zero');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newApartment: Omit<Apartment, 'id' | 'createdAt' | 'updatedAt' | 'owner'> = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        address: formData.address,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        parkingSpaces: parseInt(formData.parkingSpaces),
        area: parseFloat(formData.area),
        isPublic: formData.isPublic,
        ownerId: user?.id || '',
        groups: mockGroups.filter(group => formData.selectedGroups.includes(group.id)),
        images: formData.images,
      };

      console.log('Novo apartamento:', newApartment);
      
      setSuccess('Apartamento cadastrado com sucesso!');
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      setError('Erro ao cadastrar apartamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Você precisa estar logado para cadastrar apartamentos.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: theme.palette.secondary.main, mb: 2 }}>
            Cadastrar Novo Imóvel
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Preencha as informações do imóvel que deseja cadastrar no sistema.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Informações Básicas */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.secondary.main }}>
                Informações Básicas
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título do Imóvel"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                placeholder="Ex: Apartamento Moderno no Centro"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                multiline
                rows={4}
                placeholder="Descreva as características, localização e benefícios do imóvel..."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preço (R$)"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                required
                type="number"
                placeholder="450000"
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>R$</Typography>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Área (m²)"
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                required
                type="number"
                placeholder="75"
                InputProps={{
                  endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>m²</Typography>,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.secondary.main }}>
                Características
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Quartos"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                required
                type="number"
                inputProps={{ min: 1, max: 10 }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Banheiros"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                required
                type="number"
                inputProps={{ min: 1, max: 10 }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Vagas de Garagem"
                value={formData.parkingSpaces}
                onChange={(e) => handleInputChange('parkingSpaces', e.target.value)}
                required
                type="number"
                inputProps={{ min: 0, max: 10 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.secondary.main }}>
                Localização
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Endereço"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
                placeholder="Rua das Flores, 123"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bairro"
                value={formData.neighborhood}
                onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                required
                placeholder="Centro"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cidade"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
                placeholder="São Paulo"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estado"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                required
                placeholder="SP"
                inputProps={{ maxLength: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.secondary.main }}>
                Configurações
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPublic}
                    onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                    color="primary"
                  />
                }
                label="Imóvel Público (visível para todos os usuários)"
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                {user.userType === 'realtor' 
                  ? 'Corretores podem cadastrar imóveis públicos que aparecerão para todos os usuários.'
                  : 'Compradores podem cadastrar imóveis privados apenas para grupos específicos.'
                }
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Grupos</InputLabel>
                <Select
                  multiple
                  value={formData.selectedGroups}
                  onChange={handleGroupsChange}
                  input={<OutlinedInput label="Grupos" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const group = mockGroups.find(g => g.id === value);
                        return <Chip key={value} label={group?.name || value} size="small" />;
                      })}
                    </Box>
                  )}
                >
                  {mockGroups.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.secondary.main }}>
                Imagens
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  onClick={handleAddImage}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Adicionar Imagem
                </Button>

                {formData.images.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.images.map((image, index) => (
                      <Chip
                        key={index}
                        label={`Imagem ${index + 1}`}
                        onDelete={() => handleRemoveImage(index)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Botões de Ação */}
            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  size="large"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  size="large"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Imóvel'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddApartment;
