import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useGroups } from '../../hooks/useGroups';
import { Group } from '../../types';

interface CreateGroupData {
  name: string;
  description: string;
  isPublic: string;
}

const Groups: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userGroups, createGroup, loading, error: groupError } = useGroups();

  const [error, setError] = useState<string | null>(null);

  // Estados para diálogos
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createGroupData, setCreateGroupData] = useState<CreateGroupData>({
    name: '',
    description: '',
    isPublic: 'false',
  });

  const handleCreateGroup = async () => {
    if (!createGroupData.name.trim()) {
      setError('Nome do grupo é obrigatório');
      return;
    }

    try {
      await createGroup({
        name: createGroupData.name,
        description: createGroupData.description,
        isPublic: createGroupData.isPublic === 'true',
      });
      
      setCreateGroupData({ name: '', description: '', isPublic: 'false' });
      setCreateDialogOpen(false);
      setError(null);
    } catch (err) {
      setError('Erro ao criar grupo');
    }
  };

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

      {(error || groupError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || groupError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Grupos que o usuário participa */}
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ mb: 2, color: theme.palette.secondary.main }}>
            Seus Grupos
          </Typography>
          <Grid container spacing={3}>
            {userGroups.map((group) => (
              <Grid item xs={12} md={6} lg={4} key={group.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                  onClick={() => navigate(`/group/${group.id}`)}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <GroupIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                      <Typography variant="h6" component="h3">
                        {group.name}
                      </Typography>

                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {group.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {group.members.length} membro{group.members.length !== 1 ? 's' : ''}
                    </Typography>
                  </CardContent>
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

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreateGroup} variant="contained" disabled={loading}>
            Criar Grupo
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Groups;