import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useGroups } from '../../hooks/useGroups';
import { useUserApartments } from '../../hooks/useUserApartments';
import { GroupNotificationService } from '../../services/groupNotificationService';
import { Apartment, Group } from '../../types';
import { scrapingService } from '../../services/scrapingService';
import { ImageUpload } from '../../components/ImageUpload';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`apartment-tabpanel-${index}`}
      aria-labelledby={`apartment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AddApartment: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { userGroups } = useGroups();
  const { userApartments, updateApartment, deleteApartment, addApartment } = useUserApartments();
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Detectar se um apartamento foi passado via state para edição
  useEffect(() => {
    const editApartment = location.state?.editApartment;
    if (editApartment) {
      handleEditApartment(editApartment);
      // Limpar o state para evitar re-edição ao recarregar
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condominiumFee: '',
    iptu: '',
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
    notifyGroups: true,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      images,
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
      // Verificar se há URL de origem do import
      const sourceUrl = sessionStorage.getItem('importSourceUrl');
      
      const newApartment: Omit<Apartment, 'id' | 'createdAt' | 'updatedAt' | 'owner'> = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        condominiumFee: parseFloat(formData.condominiumFee) || 0,
        iptu: parseFloat(formData.iptu) || 0,
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
        groups: userGroups.filter(group => formData.selectedGroups.includes(group.id)),
        images: formData.images,
        sourceType: sourceUrl ? 'link' : 'manual',
        sourceUrl: sourceUrl || undefined,
      };

      const createdApartment = await addApartment(newApartment);
      
      // Limpar URL de origem após salvar
      sessionStorage.removeItem('importSourceUrl');
      
      // Notificar grupos se solicitado
      if (formData.notifyGroups && formData.selectedGroups.length > 0 && user) {
        for (const groupId of formData.selectedGroups) {
          const group = userGroups.find(g => g.id === groupId);
          if (group) {
            await GroupNotificationService.notifyGroupMembers(createdApartment, group, user.id);
          }
        }
      }
      
      setSuccess('Apartamento cadastrado com sucesso!');
      
      // Limpar formulário
      setFormData({
        title: '',
        description: '',
        price: '',
        condominiumFee: '',
        iptu: '',
        address: '',
        neighborhood: '',
        city: '',
        state: '',
        bedrooms: '',
        bathrooms: '',
        parkingSpaces: '',
        area: '',
        isPublic: false,
        selectedGroups: [],
        images: [],
        notifyGroups: true,
      });

    } catch (err) {
      setError('Erro ao cadastrar apartamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditApartment = (apartment: Apartment) => {
    setEditingApartment(apartment);
    setFormData({
      title: apartment.title,
      description: apartment.description,
      price: apartment.price.toString(),
      condominiumFee: apartment.condominiumFee.toString(),
      iptu: apartment.iptu.toString(),
      address: apartment.address,
      neighborhood: apartment.neighborhood,
      city: apartment.city,
      state: apartment.state,
      bedrooms: apartment.bedrooms.toString(),
      bathrooms: apartment.bathrooms.toString(),
      parkingSpaces: apartment.parkingSpaces.toString(),
      area: apartment.area.toString(),
      isPublic: apartment.isPublic,
      selectedGroups: apartment.groups.map(g => g.id),
      images: apartment.images,
      notifyGroups: true,
    });
    setActiveTab(0);
  };

  const handleUpdateApartment = async () => {
    if (!editingApartment) return;

    setLoading(true);
    try {
      const updates = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        condominiumFee: parseFloat(formData.condominiumFee) || 0,
        iptu: parseFloat(formData.iptu) || 0,
        address: formData.address,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        parkingSpaces: parseInt(formData.parkingSpaces),
        area: parseFloat(formData.area),
        isPublic: formData.isPublic,
        groups: userGroups.filter(group => formData.selectedGroups.includes(group.id)),
        images: formData.images,
      };

      await updateApartment(editingApartment.id, updates);
      setEditingApartment(null);
      setSuccess('Apartamento atualizado com sucesso!');
      
      // Limpar formulário
      setFormData({
        title: '',
        description: '',
        price: '',
        condominiumFee: '',
        iptu: '',
        address: '',
        neighborhood: '',
        city: '',
        state: '',
        bedrooms: '',
        bathrooms: '',
        parkingSpaces: '',
        area: '',
        isPublic: false,
        selectedGroups: [],
        images: [],
        notifyGroups: true,
      });

    } catch (err) {
      setError('Erro ao atualizar apartamento');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApartment = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este apartamento?')) {
      try {
        await deleteApartment(id);
        setSuccess('Apartamento deletado com sucesso!');
      } catch (err) {
        setError('Erro ao deletar apartamento');
      }
    }
  };



  const handleCancel = () => {
    navigate('/');
  };

  const handleImportFromUrl = async () => {
    if (!importUrl.trim()) {
      setError('Digite uma URL válida');
      return;
    }

    if (!scrapingService.isValidQuintoAndarUrl(importUrl) && !scrapingService.isValidOlxUrl(importUrl)) {
      setError('URL deve ser do QuintoAndar ou OLX');
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      const scrapedData = await scrapingService.scrapeApartmentListing(importUrl);
      
      // Preencher formulário com dados extraídos
      setFormData({
        title: scrapedData.title,
        description: scrapedData.description,
        price: scrapedData.price.toString(),
        condominiumFee: scrapedData.condominiumFee.toString(),
        iptu: scrapedData.iptu.toString(),
        address: scrapedData.address,
        neighborhood: scrapedData.neighborhood,
        city: scrapedData.city,
        state: scrapedData.state,
        bedrooms: scrapedData.bedrooms.toString(),
        bathrooms: scrapedData.bathrooms.toString(),
        parkingSpaces: scrapedData.parkingSpaces.toString(),
        area: scrapedData.area.toString(),
        isPublic: false,
        selectedGroups: [],
        images: scrapedData.images,
        notifyGroups: true,
      });

      // Armazenar URL de origem temporariamente
      sessionStorage.setItem('importSourceUrl', importUrl);

      setImportUrl('');
      setSuccess('Dados importados com sucesso! Revise as informações antes de salvar.');
      setActiveTab(0); // Ir para aba de cadastro
    } catch (err: any) {
      setError(err.message || 'Erro ao importar dados do imóvel');
    } finally {
      setIsImporting(false);
    }
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: theme.palette.secondary.main, mb: 2 }}>
            {editingApartment ? 'Editar Imóvel' : 'Gerenciar Imóveis'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {editingApartment 
              ? 'Edite as informações do imóvel selecionado.'
              : 'Cadastre novos imóveis e gerencie os existentes.'
            }
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

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="apartment management tabs" variant="fullWidth">
            <Tab label="Cadastrar/Editar" />
            <Tab label="Importar via Link" />
            <Tab label="Meus Imóveis" />
          </Tabs>
        </Box>

        {/* Tab 1: Cadastrar/Editar */}
        <TabPanel value={activeTab} index={0}>
          <form onSubmit={editingApartment ? (e) => { e.preventDefault(); handleUpdateApartment(); } : handleSubmit}>
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

              <Grid item xs={12} sm={4}>
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

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Condomínio (R$)"
                  value={formData.condominiumFee}
                  onChange={(e) => handleInputChange('condominiumFee', e.target.value)}
                  type="number"
                  placeholder="500"
                  InputProps={{
                    startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>R$</Typography>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="IPTU (R$)"
                  value={formData.iptu}
                  onChange={(e) => handleInputChange('iptu', e.target.value)}
                  type="number"
                  placeholder="1200"
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
                      disabled={user.userType === 'buyer'}
                    />
                  }
                  label="Imóvel Público (visível para todos os usuários)"
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  {user.userType === 'realtor' 
                    ? 'Corretores podem cadastrar imóveis públicos que aparecerão para todos os usuários.'
                    : 'Compradores podem cadastrar apenas imóveis privados para grupos específicos.'
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
                          const group = userGroups.find(g => g.id === value);
                          return <Chip key={value} label={group?.name || value} size="small" />;
                        })}
                      </Box>
                    )}
                  >
                    {userGroups.map((group) => (
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
                <ImageUpload
                  images={formData.images}
                  onImagesChange={handleImagesChange}
                  maxImages={10}
                  apartmentId={editingApartment?.id}
                  isEditing={true}
                />
              </Grid>

              {formData.selectedGroups.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.notifyGroups}
                          onChange={(e) => handleInputChange('notifyGroups', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Notificar membros dos grupos selecionados por email"
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      Os membros dos grupos selecionados receberão um email informando sobre o novo imóvel.
                    </Typography>
                  </Box>
                </Grid>
              )}

              {/* Botões de Ação */}
              <Grid item xs={12}>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  {editingApartment && (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditingApartment(null);
                        setFormData({
                          title: '',
                          description: '',
                          price: '',
                          condominiumFee: '',
                          iptu: '',
                          address: '',
                          neighborhood: '',
                          city: '',
                          state: '',
                          bedrooms: '',
                          bathrooms: '',
                          parkingSpaces: '',
                          area: '',
                          isPublic: false,
                          selectedGroups: [],
                          images: [],
                          notifyGroups: true,
                        });
                      }}
                      size="large"
                    >
                      Cancelar Edição
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    size="large"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    size="large"
                    disabled={loading}
                  >
                    {loading ? 'Salvando...' : editingApartment ? 'Atualizar Imóvel' : 'Salvar Imóvel'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        {/* Tab 2: Importar via Link */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: theme.palette.secondary.main, textAlign: 'center' }}>
              Importar Imóvel via Link
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Cole o link de um imóvel do QuintoAndar ou OLX para importar automaticamente as informações.
            </Alert>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="URL do Imóvel (QuintoAndar)"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="https://www.quintoandar.com.br/imovel/... ou https://sp.olx.com.br/imoveis/..."
                helperText="Suporta links do QuintoAndar e OLX"
              />
              
              <Button
                variant="contained"
                startIcon={isImporting ? <CircularProgress size={20} /> : <LinkIcon />}
                onClick={handleImportFromUrl}
                disabled={isImporting || !importUrl.trim()}
                size="large"
                sx={{ alignSelf: 'center', minWidth: 200 }}
              >
                {isImporting ? 'Importando...' : 'Importar Dados'}
              </Button>
            </Box>

            <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Como funciona:
              </Typography>
              <Typography variant="body2" component="div">
                <ol style={{ paddingLeft: 20, margin: 0 }}>
                  <li>Copie o link do imóvel no site do QuintoAndar</li>
                  <li>Cole o link no campo acima</li>
                  <li>Clique em "Importar Dados"</li>
                  <li>Revise as informações na aba "Cadastrar/Editar"</li>
                  <li>Ajuste os dados se necessário e salve o imóvel</li>
                </ol>
              </Typography>
            </Box>
          </Box>
        </TabPanel>

        {/* Tab 3: Meus Imóveis */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            {userApartments.map((apartment) => (
              <Grid item xs={12} sm={6} md={4} key={apartment.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {apartment.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {apartment.description.substring(0, 100)}...
                    </Typography>
                    <Typography variant="h6" color="primary" gutterBottom>
                      R$ {apartment.price.toLocaleString()}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip 
                        size="small" 
                        label={`${apartment.bedrooms} quartos`} 
                        variant="outlined" 
                      />
                      <Chip 
                        size="small" 
                        label={`${apartment.bathrooms} banheiros`} 
                        variant="outlined" 
                      />
                      <Chip 
                        size="small" 
                        label={`${apartment.area}m²`} 
                        variant="outlined" 
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {apartment.address}, {apartment.neighborhood}, {apartment.city}-{apartment.state}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        size="small" 
                        label={apartment.isPublic ? 'Público' : 'Privado'} 
                        color={apartment.isPublic ? 'success' : 'default'} 
                        variant="outlined" 
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditApartment(apartment)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteApartment(apartment.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>


      </Paper>


    </Container>
  );
};

export default AddApartment;
