import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  useTheme,
  Alert,
  CircularProgress,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { groupService } from '../../services/groupService';
import { Group, GroupMember, Apartment } from '../../types';
import ApartmentCard from '../../components/ApartmentCard/ApartmentCard';

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
      id={`group-tabpanel-${index}`}
      aria-labelledby={`group-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

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
  const [activeTab, setActiveTab] = useState(0);
  
  const [addMemberDialog, setAddMemberDialog] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [addMemberLoading, setAddMemberLoading] = useState(false);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/groups')}
          sx={{ mb: 2 }}
        >
          Voltar para Grupos
        </Button>
        
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: theme.palette.secondary.main, mb: 1 }}>
                {group?.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {group?.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label={group?.isPublic ? 'Público' : 'Privado'}
                  color={group?.isPublic ? 'primary' : 'secondary'}
                />
                <Chip
                  label={`${members.length} membro${members.length !== 1 ? 's' : ''}`}
                  variant="outlined"
                />
                <Chip
                  label={`${apartments.length} imóve${apartments.length !== 1 ? 'is' : 'l'}`}
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
        </Paper>
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

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab label="Membros" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="Imóveis" icon={<HomeIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      <TabPanel value={activeTab} index={0}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, color: theme.palette.secondary.main }}>
            Membros do Grupo
          </Typography>
          
          <List>
            {members.map((member) => (
              <ListItem key={member.id} divider>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    {member.user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={member.user.name}
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {member.user.email}
                      </Typography>
                      <Chip
                        size="small"
                        label={member.role === 'admin' ? 'Admin' : 'Membro'}
                        color={member.role === 'admin' ? 'primary' : 'default'}
                        icon={member.role === 'admin' ? <AdminIcon /> : <PersonIcon />}
                      />
                    </Box>
                  }
                />
                {isAdmin() && member.userId !== user?.id && (
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleRemoveMember(member.userId)}
                    >
                      <PersonRemoveIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
        </Paper>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, color: theme.palette.secondary.main }}>
            Imóveis do Grupo
          </Typography>
          
          {apartments.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Nenhum imóvel cadastrado neste grupo ainda.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {apartments.map((apartment) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={apartment.id}>
                  <ApartmentCard apartment={apartment} />
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </TabPanel>
    </Container>
  );
};

export default GroupDetail;