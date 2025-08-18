import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ImageList,
  ImageListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Alert,
  CircularProgress,
} from '@mui/material';
import FinancingCalculator from '../../components/FinancingCalculator';
import {
  LocationOn as LocationIcon,
  Bed as BedIcon,
  Bathtub as BathIcon,
  DirectionsCar as CarIcon,
  SquareFoot as AreaIcon,
  Public as PublicIcon,
  Lock as PrivateIcon,
  Add as AddIcon,
  Group as GroupIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { Apartment, Group } from '../../types';
import { apartmentService } from '../../services/apartmentService';
import { groupService } from '../../services/groupService';

const ApartmentDetail: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [addToGroupDialog, setAddToGroupDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [apartmentData, groupsData] = await Promise.all([
        apartmentService.getApartmentById(id!),
        groupService.getGroups()
      ]);
      
      if (apartmentData) {
        setApartment(apartmentData);
        setGroups(groupsData);
      } else {
        setError('Apartamento não encontrado');
      }
    } catch (err) {
      setError('Erro ao carregar apartamento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  const handleAddToGroup = () => {
    if (selectedGroup && apartment) {
      // Aqui você implementaria a lógica para adicionar o apartamento ao grupo
      console.log(`Adicionando apartamento ${apartment.id} ao grupo ${selectedGroup}`);
      setAddToGroupDialog(false);
      setSelectedGroup('');
    }
  };

  const handleContactOwner = () => {
    if (apartment?.owner) {
      // Aqui você implementaria a lógica para contatar o proprietário
      console.log(`Contatando ${apartment.owner.name}`);
    }
  };

  const handleShareWhatsApp = () => {
    if (!apartment) return;
    const currentUrl = window.location.href;
    const message = `Olha que imóvel interessante que encontrei na aMORA! ${apartment.title} por ${formatPrice(apartment.price)}. Confira: ${currentUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error || !apartment) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Apartamento não encontrado'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Botão Voltar */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Voltar
      </Button>

      <Grid container spacing={4}>
        {/* Coluna Esquerda - Imagens e Informações Principais */}
        <Grid item xs={12} lg={8}>
          {/* Galeria de Imagens */}
          <Paper sx={{ mb: 3, overflow: 'hidden' }}>
            <ImageList cols={2} rowHeight={300} gap={8}>
              {apartment.images.map((image, index) => (
                <ImageListItem 
                  key={index}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image}
                    alt={`${apartment.title} - Imagem ${index + 1}`}
                    loading="lazy"
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Paper>

          {/* Informações do Imóvel */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
                {apartment.title}
              </Typography>
              <Chip
                icon={apartment.isPublic ? <PublicIcon /> : <PrivateIcon />}
                label={apartment.isPublic ? 'Público' : 'Privado'}
                color={apartment.isPublic ? 'primary' : 'secondary'}
                sx={{ fontWeight: 600 }}
              />
            </Box>

            <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 3 }}>
              {formatPrice(apartment.price)}
            </Typography>

            {/* Calculadora de Financiamento */}
            <Box sx={{ mb: 3 }}>
              <FinancingCalculator apartmentPrice={apartment.price} />
            </Box>

            {/* Informações de Condomínio e IPTU */}
            {(apartment.condominiumFee > 0 || apartment.iptu > 0) && (
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                {apartment.condominiumFee > 0 && (
                  <Typography variant="body1" color="text.secondary">
                    Condomínio: {formatPrice(apartment.condominiumFee)}/mês
                  </Typography>
                )}
                {apartment.iptu > 0 && (
                  <Typography variant="body1" color="text.secondary">
                    IPTU: {formatPrice(apartment.iptu)}/ano
                  </Typography>
                )}
              </Box>
            )}

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
              {apartment.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Características */}
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <BedIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    {apartment.bedrooms}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {apartment.bedrooms === 1 ? 'Quarto' : 'Quartos'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <BathIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    {apartment.bathrooms}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {apartment.bathrooms === 1 ? 'Banheiro' : 'Banheiros'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CarIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    {apartment.parkingSpaces}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {apartment.parkingSpaces === 1 ? 'Vaga' : 'Vagas'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <AreaIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    {apartment.area}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    m²
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Localização */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationIcon color="primary" />
              Localização
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {apartment.address}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {apartment.neighborhood}, {apartment.city} - {apartment.state}
            </Typography>
          </Paper>
        </Grid>

        {/* Coluna Direita - Ações e Informações do Proprietário */}
        <Grid item xs={12} lg={4}>
          {/* Card de Ações */}
          <Paper sx={{ p: 3, mb: 3, position: 'sticky', top: 24 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Ações
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Botão de Editar para o proprietário */}
              {user && apartment.ownerId === user.id && (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => navigate('/add-apartment', { state: { editApartment: apartment } })}
                  fullWidth
                  size="large"
                  color="secondary"
                >
                  Editar Apartamento
                </Button>
              )}

              {user && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddToGroupDialog(true)}
                  fullWidth
                  size="large"
                >
                  Adicionar ao Grupo
                </Button>
              )}

              <Button
                variant="outlined"
                startIcon={<GroupIcon />}
                onClick={() => navigate('/')}
                fullWidth
                size="large"
              >
                Ver Mais Imóveis
              </Button>

              <Button
                variant="outlined"
                startIcon={<PhoneIcon />}
                onClick={handleContactOwner}
                fullWidth
                size="large"
                color="secondary"
              >
                Contatar Proprietário
              </Button>

              <Button
                variant="outlined"
                startIcon={<WhatsAppIcon />}
                onClick={handleShareWhatsApp}
                fullWidth
                size="large"
                sx={{ color: '#25D366', borderColor: '#25D366', '&:hover': { borderColor: '#25D366', backgroundColor: 'rgba(37, 211, 102, 0.04)' } }}
              >
                Compartilhar no WhatsApp
              </Button>
            </Box>
          </Paper>

          {/* Informações do Proprietário */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Proprietário
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  bgcolor: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  mr: 2,
                }}
              >
                {apartment.owner.name.charAt(0).toUpperCase()}
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {apartment.owner.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {apartment.owner.userType === 'realtor' ? 'Corretor' : 'Comprador'}
                </Typography>
              </Box>
            </Box>

            <List dense>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={apartment.owner.email} />
              </ListItem>
            </List>
          </Paper>

          {/* Informações Adicionais */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Informações Adicionais
            </Typography>
            
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Data de Cadastro"
                  secondary={apartment.createdAt.toLocaleDateString('pt-BR')}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Última Atualização"
                  secondary={apartment.updatedAt.toLocaleDateString('pt-BR')}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog para adicionar ao grupo */}
      <Dialog open={addToGroupDialog} onClose={() => setAddToGroupDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar ao Grupo</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Selecione o Grupo</InputLabel>
            <Select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              label="Selecione o Grupo"
            >
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddToGroupDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddToGroup} variant="contained" disabled={!selectedGroup}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para visualizar imagem */}
      <Dialog open={!!selectedImage} onClose={handleCloseImage} maxWidth="lg" fullWidth>
        <DialogContent sx={{ p: 0 }}>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Visualização"
              style={{ width: '100%', height: 'auto' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImage}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ApartmentDetail;
