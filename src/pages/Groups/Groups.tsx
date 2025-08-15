import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  useTheme,
  Alert,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Group as GroupIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ExitToApp as LeaveIcon,
  PersonAdd as AddPersonIcon,
  PersonRemove as RemovePersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { Group, User, GroupMember } from '../../types';

// Mock data para demonstração
const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Casais em Busca',
    description: 'Grupo para casais que estão procurando imóveis juntos',
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [
      {
        id: '1',
        userId: '1',
        groupId: '1',
        role: 'admin',
        user: {
          id: '1',
          name: 'João Silva',
          email: 'joao@email.com',
          password: '',
          userType: 'buyer',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        group: {} as Group,
        createdAt: new Date(),
      },
      {
        id: '2',
        userId: '2',
        groupId: '1',
        role: 'member',
        user: {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@email.com',
          password: '',
          userType: 'buyer',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        group: {} as Group,
        createdAt: new Date(),
      },
    ],
    apartments: [],
  },
  {
    id: '2',
    name: 'Investidores SP',
    description: 'Grupo para investidores focados em São Paulo',
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [
      {
        id: '3',
        userId: '3',
        groupId: '2',
        role: 'admin',
        user: {
          id: '3',
          name: 'Pedro Costa',
          email: 'pedro@email.com',
          password: '',
          userType: 'realtor',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        group: {} as Group,
        createdAt: new Date(),
      },
    ],
    apartments: [],
  },
];

const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    password: '',
    userType: 'buyer',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    password: '',
    userType: 'buyer',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro@email.com',
    password: '',
    userType: 'realtor',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Ana Oliveira',
    email: 'ana@email.com',
    password: '',
    userType: 'buyer',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface CreateGroupData {
  name: string;
  description: string;
  isPublic: string;
}

const Groups: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [users] = useState<User[]>(mockUsers);
  const [error, setError] = useState<string | null>(null);

  // Estados para diálogos
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [createGroupData, setCreateGroupData] = useState<CreateGroupData>({
    name: '',
    description: '',
    isPublic: 'false',
  });

  // Filtrar grupos do usuário atual
  const userGroups = groups.filter(group =>
    group.members.some(member => member.userId === user?.id)
  );

  // Grupos onde o usuário é admin
  const adminGroups = userGroups.filter(group =>
    group.members.some(member => 
      member.userId === user?.id && member.role === 'admin'
    )
  );

  const handleCreateGroup = () => {
    if (!createGroupData.name.trim()) {
      setError('Nome do grupo é obrigatório');
      return;
    }

    const newGroup: Group = {
      id: Date.now().toString(),
      name: createGroupData.name,
      description: createGroupData.description,
      isPublic: createGroupData.isPublic === 'true',
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [
        {
          id: Date.now().toString(),
          userId: user!.id,
          groupId: Date.now().toString(),
          role: 'admin',
          user: user!,
          group: {} as Group,
          createdAt: new Date(),
        },
      ],
      apartments: [],
    };

    setGroups([...groups, newGroup]);
    setCreateGroupData({ name: '', description: '', isPublic: 'false' });
    setCreateDialogOpen(false);
    setError(null);
  };

  const handleEditGroup = () => {
    if (!selectedGroup || !createGroupData.name.trim()) {
      setError('Nome do grupo é obrigatório');
      return;
    }

    const updatedGroups = groups.map(group =>
      group.id === selectedGroup.id
        ? {
            ...group,
            name: createGroupData.name,
            description: createGroupData.description,
            isPublic: createGroupData.isPublic === 'true',
            updatedAt: new Date(),
          }
        : group
    );

    setGroups(updatedGroups);
    setEditDialogOpen(false);
    setSelectedGroup(null);
    setCreateGroupData({ name: '', description: '', isPublic: 'false' });
    setError(null);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este grupo?')) {
      setGroups(groups.filter(group => group.id !== groupId));
    }
  };

  const handleLeaveGroup = (groupId: string) => {
    if (window.confirm('Tem certeza que deseja sair deste grupo?')) {
      const updatedGroups = groups.map(group =>
        group.id === groupId
          ? {
              ...group,
              members: group.members.filter(member => member.userId !== user?.id),
            }
          : group
      );
      setGroups(updatedGroups);
    }
  };

  const handleToggleAdmin = (groupId: string, memberId: string) => {
    const updatedGroups = groups.map(group =>
      group.id === groupId
        ? {
            ...group,
            members: group.members.map(member =>
              member.id === memberId
                ? { ...member, role: member.role === 'admin' ? 'member' as const : 'admin' as const }
                : member
            ),
          }
        : group
    );
    setGroups(updatedGroups);
  };

  const handleRemoveMember = (groupId: string, memberId: string) => {
    if (window.confirm('Tem certeza que deseja remover este membro?')) {
      const updatedGroups = groups.map(group =>
        group.id === groupId
          ? {
              ...group,
              members: group.members.filter(member => member.id !== memberId),
            }
          : group
      );
      setGroups(updatedGroups);
    }
  };

  const handleAddMember = (groupId: string, userId: string) => {
    const userToAdd = users.find(u => u.id === userId);
    if (!userToAdd) return;

    const newMember: GroupMember = {
      id: Date.now().toString(),
      userId: userToAdd.id,
      groupId: groupId,
      role: 'member',
      user: userToAdd,
      group: {} as Group,
      createdAt: new Date(),
    };

    const updatedGroups = groups.map(group =>
      group.id === groupId
        ? {
            ...group,
            members: [...group.members, newMember],
          }
        : group
    );

    setGroups(updatedGroups);
    setAddMemberDialogOpen(false);
  };

  const openEditDialog = (group: Group) => {
    setSelectedGroup(group);
    setCreateGroupData({
      name: group.name,
      description: group.description,
      isPublic: group.isPublic ? 'true' : 'false',
    });
    setEditDialogOpen(true);
  };

  const openMembersDialog = (group: Group) => {
    setSelectedGroup(group);
    setMembersDialogOpen(true);
  };

  const openAddMemberDialog = (group: Group) => {
    setSelectedGroup(group);
    setAddMemberDialogOpen(true);
  };

  const isUserAdmin = (group: Group | null) => {
    if (!group || !group.members) return false;
    return group.members.some(member => 
      member.userId === user?.id && member.role === 'admin'
    );
  };

  const availableUsers = users.filter(user => 
    !selectedGroup?.members.some(member => member.userId === user.id)
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            color: theme.palette.secondary.main,
            textAlign: 'center',
            mb: 2,
          }}
        >
          Gerenciar Grupos
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ textAlign: 'center', maxWidth: 600, mx: 'auto' }}
        >
          Gerencie os grupos que você participa e administre membros e permissões.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Grupos que o usuário administra */}
        {adminGroups.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>
              Grupos que você administra
            </Typography>
            <Grid container spacing={3}>
              {adminGroups.map((group) => (
                <Grid item xs={12} md={6} lg={4} key={group.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <GroupIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                        <Typography variant="h6" component="h3">
                          {group.name}
                        </Typography>
                        <Chip
                          icon={group.isPublic ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          label={group.isPublic ? 'Público' : 'Privado'}
                          size="small"
                          sx={{ ml: 'auto' }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {group.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {group.members.length} membro{group.members.length !== 1 ? 's' : ''}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => openEditDialog(group)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        startIcon={<PersonIcon />}
                        onClick={() => openMembersDialog(group)}
                      >
                        Membros
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteGroup(group.id)}
                      >
                        Excluir
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

        {/* Grupos que o usuário participa */}
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ mb: 2, color: theme.palette.secondary.main }}>
            Grupos que você participa
          </Typography>
          <Grid container spacing={3}>
            {userGroups.map((group) => (
              <Grid item xs={12} md={6} lg={4} key={group.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <GroupIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                      <Typography variant="h6" component="h3">
                        {group.name}
                      </Typography>
                      {isUserAdmin(group) && (
                        <Chip
                          icon={<AdminIcon />}
                          label="Admin"
                          size="small"
                          color="primary"
                          sx={{ ml: 'auto' }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {group.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {group.members.length} membro{group.members.length !== 1 ? 's' : ''}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<PersonIcon />}
                      onClick={() => openMembersDialog(group)}
                    >
                      Ver Membros
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<LeaveIcon />}
                      onClick={() => handleLeaveGroup(group.id)}
                    >
                      Sair
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Botão flutuante para criar grupo */}
      <Tooltip title="Criar novo grupo">
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setCreateDialogOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Diálogo para criar grupo */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Criar Novo Grupo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Grupo"
            fullWidth
            variant="outlined"
            value={createGroupData.name}
            onChange={(e) => setCreateGroupData({ ...createGroupData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Descrição"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={createGroupData.description}
            onChange={(e) => setCreateGroupData({ ...createGroupData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Visibilidade</InputLabel>
            <Select
              value={createGroupData.isPublic}
              onChange={(e) => setCreateGroupData({ ...createGroupData, isPublic: e.target.value })}
              label="Visibilidade"
            >
              <MenuItem value="false">Privado</MenuItem>
              <MenuItem value="true">Público</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreateGroup} variant="contained">
            Criar Grupo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para editar grupo */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Grupo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Grupo"
            fullWidth
            variant="outlined"
            value={createGroupData.name}
            onChange={(e) => setCreateGroupData({ ...createGroupData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Descrição"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={createGroupData.description}
            onChange={(e) => setCreateGroupData({ ...createGroupData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Visibilidade</InputLabel>
            <Select
              value={createGroupData.isPublic}
              onChange={(e) => setCreateGroupData({ ...createGroupData, isPublic: e.target.value })}
              label="Visibilidade"
            >
              <MenuItem value="false">Privado</MenuItem>
              <MenuItem value="true">Público</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleEditGroup} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para gerenciar membros */}
      <Dialog open={membersDialogOpen} onClose={() => setMembersDialogOpen(false)} maxWidth="md" fullWidth>
                 <DialogTitle>
           Membros do Grupo: {selectedGroup?.name}
           {isUserAdmin(selectedGroup) && (
             <Button
               startIcon={<AddPersonIcon />}
               onClick={() => openAddMemberDialog(selectedGroup!)}
               sx={{ ml: 2 }}
             >
               Adicionar Membro
             </Button>
           )}
         </DialogTitle>
        <DialogContent>
          <List>
            {selectedGroup?.members.map((member, index) => (
              <React.Fragment key={member.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={member.user.name}
                    secondary={`${member.user.email} • ${member.user.userType === 'realtor' ? 'Corretor' : 'Comprador'}`}
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        icon={member.role === 'admin' ? <AdminIcon /> : <PersonIcon />}
                        label={member.role === 'admin' ? 'Admin' : 'Membro'}
                        size="small"
                        color={member.role === 'admin' ? 'primary' : 'default'}
                      />
                                             {isUserAdmin(selectedGroup) && member.userId !== user?.id && (
                         <>
                           <IconButton
                             size="small"
                             onClick={() => handleToggleAdmin(selectedGroup!.id, member.id)}
                             title={member.role === 'admin' ? 'Remover admin' : 'Tornar admin'}
                           >
                             <AdminIcon />
                           </IconButton>
                           <IconButton
                             size="small"
                             color="error"
                             onClick={() => handleRemoveMember(selectedGroup!.id, member.id)}
                             title="Remover membro"
                           >
                             <RemovePersonIcon />
                           </IconButton>
                         </>
                       )}
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < selectedGroup!.members.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMembersDialogOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para adicionar membro */}
      <Dialog open={addMemberDialogOpen} onClose={() => setAddMemberDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar Membro ao Grupo</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Selecionar Usuário</InputLabel>
            <Select
              value=""
              onChange={(e) => handleAddMember(selectedGroup!.id, e.target.value)}
              label="Selecionar Usuário"
            >
              {availableUsers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} ({user.email}) - {user.userType === 'realtor' ? 'Corretor' : 'Comprador'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMemberDialogOpen(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Groups;
