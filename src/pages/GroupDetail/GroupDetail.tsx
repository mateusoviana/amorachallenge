import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  Alert,
  CircularProgress,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Checkbox,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Add as AddIcon,
  Home as HomeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { groupService } from '../../services/groupService';
import { apartmentService } from '../../services/apartmentService';
import { Group, GroupMember, Apartment } from '../../types';
import ApartmentCard from '../../components/ApartmentCard/ApartmentCard';

const GroupDetail: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAllMembers, setShowAllMembers] = useState(false);
  
  const [addMemberDialog, setAddMemberDialog] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  
  const [addApartmentDialog, setAddApartmentDialog] = useState(false);
  const [userApartments, setUserApartments] = useState<Apartment[]>([]);
  const [selectedApartments, setSelectedApartments] = useState<string[]>([]);
  const [addApartmentLoading, setAddApartmentLoading] = useState(false);
  
  const [editGroupDialog, setEditGroupDialog] = useState(false);
  const [editGroupData, setEditGroupData] = useState({ name: '', description: '' });
  const [editGroupLoading, setEditGroupLoading] = useState(false);

  useEffect(() => {
    if (groupId) {
      loadGroupData();
    }
  }, [groupId]);

  const loadGroupData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!groupId) {
        setError('ID do grupo não encontrado');
        return;
      }
      
      const allGroups = await groupService.getGroups();
      const foundGroup = allGroups.find(g => g.id === groupId);
      
      if (!foundGroup) {
        setError('Grupo não encontrado');
        return;
      }
      
      setGroup(foundGroup);
      
      const groupMembers = await groupService.getGroupMembers(groupId);
      setMembers(groupMembers);
      
      const groupApartments = await groupService.getApartmentsByGroup(groupId);
      setApartments(groupApartments);
      
    } catch (err) {
      setError('Erro ao carregar dados do grupo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserApartments = async () => {
    try {
      if (!user?.id || !groupId) return;
      const apartments = await apartmentService.getAvailableApartmentsForGroup(user.id, groupId);
      setUserApartments(apartments);
    } catch (err) {
      console.error('Erro ao carregar apartamentos do usuário:', err);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail.trim() || !groupId) return;
    
    try {
      setAddMemberLoading(true);
      setError(null);
      
      // Buscar usuário por email
      const foundUser = await groupService.getUserByEmail(newMemberEmail.trim());
      
      if (!foundUser) {
        setError('Usuário não encontrado com este email');
        return;
      }
      
      // Verificar se já é membro
      const isAlreadyMember = members.some(member => member.userId === foundUser.id);
      if (isAlreadyMember) {
        setError('Este usuário já é membro do grupo');
        return;
      }
      
      // Adicionar como membro
      await groupService.addMemberToGroup(groupId, foundUser.id, 'member');
      
      setSuccess(`${foundUser.name} foi adicionado ao grupo com sucesso!`);
      setAddMemberDialog(false);
      setNewMemberEmail('');
      await loadGroupData();
      
    } catch (err) {
      setError('Erro ao adicionar membro');
    } finally {
      setAddMemberLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!groupId || !window.confirm('Tem certeza que deseja remover este membro?')) return;
    
    try {
      await groupService.removeMemberFromGroup(groupId, userId);
      setSuccess('Membro removido com sucesso!');
      await loadGroupData();
    } catch (err) {
      setError('Erro ao remover membro');
    }
  };

  const handleOpenAddApartmentDialog = async () => {
    await loadUserApartments();
    setAddApartmentDialog(true);
  };

  const handleAddApartments = async () => {
    if (!groupId || selectedApartments.length === 0) return;
    
    try {
      setAddApartmentLoading(true);
      setError(null);
      
      // Adicionar cada apartamento selecionado ao grupo
      for (const apartmentId of selectedApartments) {
        await groupService.addApartmentToGroup(apartmentId, groupId);
      }
      
      setSuccess(`${selectedApartments.length} imóve${selectedApartments.length !== 1 ? 'is' : 'l'} adicionado${selectedApartments.length !== 1 ? 's' : ''} ao grupo com sucesso!`);
      setAddApartmentDialog(false);
      setSelectedApartments([]);
      await loadGroupData();
      
    } catch (err) {
      setError('Erro ao adicionar imóveis ao grupo');
    } finally {
      setAddApartmentLoading(false);
    }
  };

  const handleToggleApartmentSelection = (apartmentId: string) => {
    setSelectedApartments(prev => 
      prev.includes(apartmentId)
        ? prev.filter(id => id !== apartmentId)
        : [...prev, apartmentId]
    );
  };

  const handleRemoveApartmentFromGroup = async (apartmentId: string) => {
    if (!groupId || !window.confirm('Tem certeza que deseja remover este imóvel do grupo?')) return;
    
    try {
      await groupService.removeApartmentFromGroup(apartmentId, groupId);
      setSuccess('Imóvel removido do grupo com sucesso!');
      await loadGroupData();
    } catch (err) {
      setError('Erro ao remover imóvel do grupo');
    }
  };

  const handleEditGroup = async () => {
    if (!editGroupData.name.trim() || !groupId) return;
    
    try {
      setEditGroupLoading(true);
      setError(null);
      
      await groupService.updateGroup(groupId, {
        name: editGroupData.name,
        description: editGroupData.description,
      });
      
      setSuccess('Grupo atualizado com sucesso!');
      setEditGroupDialog(false);
      await loadGroupData();
      
    } catch (err) {
      setError('Erro ao atualizar grupo');
    } finally {
      setEditGroupLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!groupId || !window.confirm('Tem certeza que deseja excluir este grupo? Esta ação não pode ser desfeita.')) return;
    
    try {
      await groupService.deleteGroup(groupId);
      navigate('/groups');
    } catch (err) {
      setError('Erro ao excluir grupo');
    }
  };

  const handleOpenEditDialog = () => {
    if (group) {
      setEditGroupData({
        name: group.name,
        description: group.description,
      });
      setEditGroupDialog(true);
    }
  };

  const isAdmin = () => {
    return members.some(member => 
      member.userId === user?.id && member.role === 'admin'
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error && !group) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/groups')}
        >
          Voltar para Grupos
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header com botão voltar */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/groups')}
        >
          Voltar para Grupos
        </Button>
      </Box>

      {/* Header do Grupo com Membros */}
      <Paper 
        sx={{ 
          mb: 4,
          p: 4,
          borderRadius: 3,
          background: `linear-gradient(180deg, 
            ${theme.palette.primary.main}15 0%, 
            ${theme.palette.primary.main}08 30%, 
            ${theme.palette.primary.main}04 60%, 
            transparent 100%)`,
          border: `1px solid ${theme.palette.primary.main}20`,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 3,
            background: `linear-gradient(180deg, 
              ${theme.palette.secondary.main}10 0%, 
              ${theme.palette.secondary.main}05 40%, 
              transparent 100%)`,
            pointerEvents: 'none',
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Título e descrição */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 700, 
                  color: theme.palette.secondary.main,
                  textAlign: 'center'
                }}
              >
                {group?.name}
              </Typography>
              {isAdmin() && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Editar grupo">
                    <IconButton
                      color="primary"
                      onClick={handleOpenEditDialog}
                      sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir grupo">
                    <IconButton
                      color="error"
                      onClick={handleDeleteGroup}
                      sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mb: 3, 
                textAlign: 'center',
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              {group?.description}
            </Typography>
            
            {/* Chips informativos */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip
                label={group?.isPublic ? 'Público' : 'Privado'}
                color={group?.isPublic ? 'primary' : 'secondary'}
                sx={{ fontWeight: 600 }}
              />
              <Chip
                label={`${apartments.length} imóve${apartments.length !== 1 ? 'is' : 'l'}`}
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Seção de Membros */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ color: theme.palette.secondary.main, fontWeight: 600 }}>
                Membros ({members.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {isAdmin() && (
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={() => setAddMemberDialog(true)}
                  >
                    Adicionar
                  </Button>
                )}
                {members.length > 6 && (
                  <Button
                    size="small"
                    variant="outlined"
                    endIcon={showAllMembers ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    onClick={() => setShowAllMembers(!showAllMembers)}
                  >
                    {showAllMembers ? 'Ver menos' : 'Ver todos'}
                  </Button>
                )}
              </Box>
            </Box>

            {/* Lista de membros em grid compacto */}
            <Grid container spacing={2}>
              {(showAllMembers ? members : members.slice(0, 6)).map((member) => (
                <Grid item xs={12} sm={6} md={4} key={member.id}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease-in-out'
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: member.role === 'admin' ? theme.palette.primary.main : theme.palette.secondary.main,
                        width: 40,
                        height: 40
                      }}
                    >
                      {member.user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }} noWrap>
                        {member.user.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip
                          size="small"
                          label={member.role === 'admin' ? 'Admin' : 'Membro'}
                          color={member.role === 'admin' ? 'primary' : 'default'}
                          icon={member.role === 'admin' ? <AdminIcon /> : <PersonIcon />}
                        />
                      </Box>
                    </Box>
                    {isAdmin() && member.userId !== user?.id && (
                      <Tooltip title="Remover membro">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveMember(member.userId)}
                        >
                          <PersonRemoveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
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

      {/* Seção de Imóveis */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
          Imóveis do Grupo
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1" color="text.secondary">
            {apartments.length} imóve{apartments.length !== 1 ? 'is' : 'l'} encontrado{apartments.length !== 1 ? 's' : ''}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddApartmentDialog}
            size="small"
          >
            Adicionar Imóveis
          </Button>
        </Box>
      </Box>

      {apartments.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum imóvel cadastrado
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Este grupo ainda não possui imóveis cadastrados.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddApartmentDialog}
            >
              Adicionar Imóveis Existentes
            </Button>
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/add-apartment')}
            >
              Cadastrar Novo Imóvel
            </Button>
          </Box>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {apartments.map((apartment) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={apartment.id}>
              <ApartmentCard 
                apartment={apartment} 
                showGroupActions={true}
                onRemoveFromGroup={() => handleRemoveApartmentFromGroup(apartment.id)}
                canRemoveFromGroup={isAdmin() || apartment.ownerId === user?.id}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog para adicionar membro */}
      <Dialog open={addMemberDialog} onClose={() => setAddMemberDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar Membro ao Grupo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email do usuário"
            type="email"
            fullWidth
            variant="outlined"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            placeholder="usuario@email.com"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMemberDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleAddMember} 
            variant="contained" 
            disabled={addMemberLoading || !newMemberEmail.trim()}
          >
            {addMemberLoading ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para adicionar imóveis */}
      <Dialog 
        open={addApartmentDialog} 
        onClose={() => setAddApartmentDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HomeIcon />
            Adicionar Imóveis ao Grupo
          </Box>
        </DialogTitle>
        <DialogContent>
          {userApartments.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nenhum imóvel disponível
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Você não possui imóveis disponíveis para adicionar a este grupo.
              </Typography>
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={() => {
                  setAddApartmentDialog(false);
                  navigate('/add-apartment');
                }}
              >
                Cadastrar Novo Imóvel
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Selecione os imóveis que deseja adicionar ao grupo (inclui seus imóveis e imóveis dos seus grupos):
              </Typography>
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {userApartments.map((apartment) => (
                  <ListItem key={apartment.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        <HomeIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={apartment.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            R$ {apartment.price.toLocaleString()} • {apartment.area}m² • {apartment.bedrooms} quartos
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {apartment.neighborhood}, {apartment.city}-{apartment.state}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Checkbox
                        edge="end"
                        checked={selectedApartments.includes(apartment.id)}
                        onChange={() => handleToggleApartmentSelection(apartment.id)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setAddApartmentDialog(false);
            setSelectedApartments([]);
          }}>
            Cancelar
          </Button>
          {userApartments.length > 0 && (
            <Button 
              onClick={handleAddApartments} 
              variant="contained" 
              disabled={addApartmentLoading || selectedApartments.length === 0}
            >
              {addApartmentLoading 
                ? 'Adicionando...' 
                : `Adicionar ${selectedApartments.length} imóve${selectedApartments.length !== 1 ? 'is' : 'l'}`
              }
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Dialog para editar grupo */}
      <Dialog open={editGroupDialog} onClose={() => setEditGroupDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon />
            Editar Grupo
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Grupo"
            fullWidth
            variant="outlined"
            value={editGroupData.name}
            onChange={(e) => setEditGroupData({ ...editGroupData, name: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Descrição"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={editGroupData.description}
            onChange={(e) => setEditGroupData({ ...editGroupData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditGroupDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleEditGroup} 
            variant="contained" 
            disabled={editGroupLoading || !editGroupData.name.trim()}
          >
            {editGroupLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GroupDetail;