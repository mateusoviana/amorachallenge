import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
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
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  SwapHoriz as SwapHorizIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useGroups } from '../../hooks/useGroups';
import { useUserApartments } from '../../hooks/useUserApartments';
import { Group, Apartment } from '../../types';



const Profile: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Estados para edição de perfil
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    userType: user?.userType || 'buyer',
  });

  // Hooks para dados reais
  const { userGroups, createGroup, deleteGroup } = useGroups();
  const { userApartments } = useUserApartments();
  const [newGroupDialog, setNewGroupDialog] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
    isPublic: false,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        userType: user.userType,
      });
    }
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleProfileEdit = () => {
    setEditingProfile(true);
  };

  const handleProfileSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simular atualização de perfil
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Perfil atualizado com sucesso!');
      setEditingProfile(false);
      
      // Aqui você atualizaria o usuário no contexto
      console.log('Perfil atualizado:', profileData);
      
    } catch (err) {
      setError('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileCancel = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      userType: user?.userType || 'buyer',
    });
    setEditingProfile(false);
  };



  const handleCreateGroup = async () => {
    if (!newGroupData.name.trim()) {
      setError('Nome do grupo é obrigatório');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createGroup({
        name: newGroupData.name,
        description: newGroupData.description,
        isPublic: newGroupData.isPublic,
      });
      
      setNewGroupDialog(false);
      setNewGroupData({ name: '', description: '', isPublic: false });
      setSuccess('Grupo criado com sucesso!');
      
    } catch (err) {
      setError('Erro ao criar grupo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este grupo?')) {
      try {
        await deleteGroup(groupId);
        setSuccess('Grupo excluído com sucesso!');
      } catch (err) {
        setError('Erro ao excluir grupo.');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Você precisa estar logado para acessar o perfil.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header do Perfil */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: theme.palette.primary.main,
              fontSize: '2rem',
              mr: 3,
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
              {user.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              {user.email}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={user.userType === 'realtor' ? 'Corretor' : 'Comprador'}
                color={user.userType === 'realtor' ? 'primary' : 'secondary'}
                sx={{ fontWeight: 600 }}
              />

            </Box>
          </Box>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{ ml: 2 }}
          >
            Sair
          </Button>
        </Box>
      </Paper>

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

      {/* Tabs de Navegação */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '1rem',
              fontWeight: 600,
            },
          }}
        >
          <Tab
            label="Perfil"
            icon={<PersonIcon />}
            iconPosition="start"
          />
          <Tab
            label="Grupos"
            icon={<GroupIcon />}
            iconPosition="start"
          />
          <Tab
            label="Meus Imóveis"
            icon={<HomeIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Conteúdo das Tabs */}
      {activeTab === 0 && (
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
              Informações do Perfil
            </Typography>
            {!editingProfile && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleProfileEdit}
              >
                Editar
              </Button>
            )}
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                disabled={!editingProfile}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                disabled={!editingProfile}
                required
                type="email"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={!editingProfile}>
                <InputLabel>Tipo de Usuário</InputLabel>
                <Select
                  value={profileData.userType}
                  onChange={(e) => setProfileData(prev => ({ ...prev, userType: e.target.value as 'buyer' | 'realtor' }))}
                  label="Tipo de Usuário"
                >
                  <MenuItem value="buyer">Comprador</MenuItem>
                  <MenuItem value="realtor">Corretor</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {editingProfile && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleProfileCancel}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    onClick={handleProfileSave}
                    disabled={loading}
                  >
                    {loading ? 'Salvando...' : 'Salvar'}
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
              Meus Grupos
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setNewGroupDialog(true)}
            >
              Criar Grupo
            </Button>
          </Box>

          <Grid container spacing={3}>
            {userGroups.map((group) => (
              <Grid item xs={12} md={6} lg={4} key={group.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                        {group.name}
                      </Typography>
                      <Chip
                        label={group.isPublic ? 'Público' : 'Privado'}
                        size="small"
                        color={group.isPublic ? 'primary' : 'secondary'}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {group.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Criado em {group.createdAt.toLocaleDateString('pt-BR')}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/group/${group.id}`)}>
                      Ver Detalhes
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteGroup(group.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.secondary.main, mb: 3 }}>
            Meus Imóveis
          </Typography>

          <Grid container spacing={3}>
            {userApartments.map((apartment) => (
              <Grid item xs={12} md={6} lg={4} key={apartment.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                        {apartment.title}
                      </Typography>
                      <Chip
                        label={apartment.isPublic ? 'Público' : 'Privado'}
                        size="small"
                        color={apartment.isPublic ? 'primary' : 'secondary'}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {apartment.address}, {apartment.neighborhood}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(apartment.price)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/apartment/${apartment.id}`)}>
                      Ver Detalhes
                    </Button>
                    <Button size="small" variant="outlined">
                      Editar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Dialog para criar novo grupo */}
      <Dialog open={newGroupDialog} onClose={() => setNewGroupDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Criar Novo Grupo</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome do Grupo"
                value={newGroupData.name}
                onChange={(e) => setNewGroupData(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Ex: Projeto Casa Nova"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={newGroupData.description}
                onChange={(e) => setNewGroupData(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={3}
                placeholder="Descreva o propósito do grupo..."
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Grupo</InputLabel>
                <Select
                  value={newGroupData.isPublic ? 'public' : 'private'}
                  onChange={(e) => setNewGroupData(prev => ({ ...prev, isPublic: e.target.value === 'public' }))}
                  label="Tipo de Grupo"
                >
                  <MenuItem value="private">Privado</MenuItem>
                  <MenuItem value="public">Público</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewGroupDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleCreateGroup}
            variant="contained"
            disabled={loading || !newGroupData.name.trim()}
          >
            {loading ? 'Criando...' : 'Criar Grupo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
