import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  useTheme,
  CircularProgress,
  Alert,
  Chip,
  Paper,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import ApartmentCard from '../../components/ApartmentCard/ApartmentCard';
import Filters from '../../components/Filters/Filters';
import { Apartment, FilterOptions, Group } from '../../types';
import { apartmentService } from '../../services/apartmentService';
import { groupService } from '../../services/groupService';
import { useAuth } from '../../hooks/useAuth';
import { EmailService } from '../../services/emailService';

const GroupApartmentSelect: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const { groupId, groupName, currentSelection = [] } = location.state || {};
  
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([]);
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApartments, setSelectedApartments] = useState<string[]>(currentSelection);
  const [notifyMembers, setNotifyMembers] = useState(true);
  const [addingApartments, setAddingApartments] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 2000000],
    bedrooms: [],
    bathrooms: [],
    parkingSpaces: [],
    areaRange: [0, 500],
    city: [],
    neighborhood: [],
    groups: [],
    visibility: [],
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  useEffect(() => {
    if (!groupId) {
      navigate('/groups');
      return;
    }
    loadData();
  }, [groupId, user]);

  useEffect(() => {
    applyFilters();
  }, [filters, apartments]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados do grupo
      const allGroups = await groupService.getGroups();
      const groupData = allGroups.find(g => g.id === groupId);
      if (!groupData) {
        setError('Grupo não encontrado');
        return;
      }
      setGroup(groupData);
      
      // Carregar apartamentos disponíveis (imóveis do usuário e dos seus grupos)
      const apartmentsData = await apartmentService.getApartments(user?.id);
      
      // Carregar apartamentos já existentes no grupo para filtrar
      const existingGroupApartments = await groupService.getApartmentsByGroup(groupId);
      const existingApartmentIds = existingGroupApartments.map(apt => apt.id);
      
      // Filtrar apartamentos que não estão no grupo
      const availableApartments = apartmentsData.filter(apt => !existingApartmentIds.includes(apt.id));
      
      setApartments(availableApartments);
      
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...apartments];

    // Filtro por preço
    filtered = filtered.filter(
      apt => apt.price >= filters.priceRange[0] && apt.price <= filters.priceRange[1]
    );

    // Filtro por área
    filtered = filtered.filter(
      apt => apt.area >= filters.areaRange[0] && apt.area <= filters.areaRange[1]
    );

    // Filtro por quartos
    if (filters.bedrooms.length > 0) {
      filtered = filtered.filter(apt => filters.bedrooms.includes(apt.bedrooms));
    }

    // Filtro por banheiros
    if (filters.bathrooms.length > 0) {
      filtered = filtered.filter(apt => filters.bathrooms.includes(apt.bathrooms));
    }

    // Filtro por vagas
    if (filters.parkingSpaces.length > 0) {
      filtered = filtered.filter(apt => filters.parkingSpaces.includes(apt.parkingSpaces));
    }

    // Filtro por cidade
    if (filters.city.length > 0) {
      filtered = filtered.filter(apt => filters.city.includes(apt.city));
    }

    // Filtro por bairro
    if (filters.neighborhood.length > 0) {
      filtered = filtered.filter(apt => filters.neighborhood.includes(apt.neighborhood));
    }

    // Filtro por grupos
    if (filters.groups.length > 0) {
      filtered = filtered.filter(apt => 
        apt.groups.some(group => filters.groups.includes(group.id))
      );
    }

    // Filtro por visibilidade
    if (filters.visibility.length > 0) {
      filtered = filtered.filter(apt => filters.visibility.includes(apt.isPublic ? 'public' : 'private'));
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'area':
          aValue = a.area;
          bValue = b.area;
          break;
        case 'condominiumFee':
          aValue = a.condominiumFee;
          bValue = b.condominiumFee;
          break;
        case 'createdAt':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredApartments(filtered);
  };

  const handleToggleApartmentSelection = (apartmentId: string) => {
    setSelectedApartments(prev =>
      prev.includes(apartmentId)
        ? prev.filter(id => id !== apartmentId)
        : [...prev, apartmentId]
    );
  };

  const handleAddApartments = async () => {
    console.log('Iniciando adição de apartamentos:', { groupId, selectedApartments, userId: user?.id, group });
    
    if (!groupId || selectedApartments.length === 0 || !user?.id || !group) {
      console.log('Validação falhou:', { groupId, selectedApartmentsLength: selectedApartments.length, userId: user?.id, hasGroup: !!group });
      setError('Dados inválidos para adicionar imóveis');
      return;
    }

    setAddingApartments(true);
    setError(null); // Limpar erros anteriores
    
    try {
      console.log('Adicionando apartamentos ao grupo:', selectedApartments);
      
      // Adicionar apartamentos ao grupo
      for (const apartmentId of selectedApartments) {
        console.log('Adicionando apartamento:', apartmentId, 'ao grupo:', groupId);
        try {
          await groupService.addApartmentToGroup(apartmentId, groupId);
          console.log('Apartamento adicionado com sucesso:', apartmentId);
        } catch (apartmentError) {
          console.error('Erro ao adicionar apartamento específico:', apartmentId, apartmentError);
          throw new Error(`Falha ao adicionar apartamento ${apartmentId}: ${apartmentError instanceof Error ? apartmentError.message : 'Erro desconhecido'}`);
        }
      }

      console.log('Todos os apartamentos adicionados com sucesso');

      // Notificar membros se solicitado
      if (notifyMembers) {
        await sendEmailNotifications(selectedApartments);
      }

      // Navegar de volta para o grupo com mensagem de sucesso
      navigate(`/group/${groupId}`, { 
        state: { 
          success: `${selectedApartments.length} imóve${selectedApartments.length !== 1 ? 'is' : 'l'} adicionado${selectedApartments.length !== 1 ? 's' : ''} ao grupo com sucesso!` 
        } 
      });
    } catch (err) {
      console.error('Erro detalhado ao adicionar imóveis:', err);
      console.error('Tipo do erro:', typeof err);
      console.error('Estrutura do erro:', err);
      
      let errorMessage = 'Erro desconhecido';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        // Tentar extrair mensagem de erro de objetos
        if ('message' in err) {
          errorMessage = String(err.message);
        } else if ('error' in err) {
          errorMessage = String(err.error);
        } else {
          errorMessage = JSON.stringify(err);
        }
      }
      
      setError(`Erro ao adicionar imóveis ao grupo: ${errorMessage}`);
    } finally {
      setAddingApartments(false);
    }
  };

  const handleBack = () => {
    navigate(`/group/${groupId}`);
  };

  // Função para enviar notificações por email aos membros do grupo
  const sendEmailNotifications = async (apartmentIds: string[]) => {
    if (!group || !notifyMembers) return;

    try {
      console.log('Enviando notificações por email aos membros do grupo...');
      
      // Buscar membros do grupo
      const groupMembers = await groupService.getGroupMembers(groupId);
      
      // Buscar detalhes dos apartamentos adicionados
      const addedApartments = apartments.filter(apt => apartmentIds.includes(apt.id));
      
      if (groupMembers.length === 0) {
        console.log('Nenhum membro encontrado no grupo para notificar');
        return;
      }

      if (addedApartments.length === 0) {
        console.log('Nenhum apartamento encontrado para notificar');
        return;
      }

      // Preparar conteúdo do email
      const subject = `Novos imóveis adicionados ao grupo "${group.name}"`;
      
      const apartmentsList = addedApartments.map(apt => 
        `• ${apt.title} - ${apt.neighborhood}, ${apt.city} - R$ ${apt.price.toLocaleString('pt-BR')}`
      ).join('\n');

      const body = `
Olá!

Novos imóveis foram adicionados ao grupo "${group.name}":

${apartmentsList}

Para visualizar os imóveis, acesse a plataforma aMORA.

Atenciosamente,
Equipe aMORA
      `.trim();

      // Enviar email para cada membro (exceto o usuário atual)
      const emailPromises = groupMembers
        .filter(member => member.userId !== user?.id) // Não enviar para o usuário atual
        .map(async (member) => {
          try {
            const success = await EmailService.sendEmail(
              member.user.email,
              subject,
              body
            );
            
            if (success) {
              console.log(`✅ Email enviado com sucesso para: ${member.user.email}`);
            } else {
              console.log(`❌ Falha ao enviar email para: ${member.user.email}`);
            }
            
            return { email: member.user.email, success };
          } catch (error) {
            console.error(`❌ Erro ao enviar email para ${member.user.email}:`, error);
            return { email: member.user.email, success: false, error };
          }
        });

      const results = await Promise.all(emailPromises);
      const successfulEmails = results.filter(r => r.success).length;
      const failedEmails = results.filter(r => !r.success).length;

      console.log(`📧 Notificações enviadas: ${successfulEmails} sucessos, ${failedEmails} falhas`);

      if (failedEmails > 0) {
        console.warn('Alguns emails falharam ao ser enviados');
      }

    } catch (error) {
      console.error('❌ Erro ao enviar notificações por email:', error);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Voltar ao Grupo
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
          variant="outlined"
        >
          Voltar ao Grupo
        </Button>
        
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            color: theme.palette.secondary.main,
            mb: 2,
          }}
        >
          Selecionar Imóveis para {groupName || 'Grupo'}
        </Typography>
        
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Escolha os imóveis que deseja adicionar ao grupo. Você pode usar os filtros para encontrar imóveis específicos.
        </Typography>

        {/* Status da seleção */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.light', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckIcon />
              <Typography variant="h6">
                {selectedApartments.length} imóve{selectedApartments.length !== 1 ? 'is' : 'l'} selecionado{selectedApartments.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
            
            {selectedApartments.length > 0 && (
              <Button
                variant="contained"
                onClick={handleAddApartments}
                disabled={addingApartments}
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100'
                  }
                }}
              >
                {addingApartments ? 'Adicionando...' : `Adicionar ao Grupo`}
              </Button>
            )}
          </Box>
          
          {/* Opção de notificação */}
          {selectedApartments.length > 0 && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  type="checkbox"
                  id="notifyMembers"
                  checked={notifyMembers}
                  onChange={(e) => setNotifyMembers(e.target.checked)}
                  style={{ 
                    width: '16px', 
                    height: '16px',
                    accentColor: theme.palette.secondary.main
                  }}
                />
                <label 
                  htmlFor="notifyMembers"
                  style={{ 
                    color: 'white', 
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Notificar membros do grupo sobre os novos imóveis
                </label>
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', display: 'block', mt: 0.5 }}>
                Os membros receberão uma notificação sobre os imóveis adicionados ao grupo.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

             {/* Filtros */}
       <Filters
         filters={filters}
         onFiltersChange={setFilters}
         groups={[]}
         onClearFilters={() => {
           setFilters({
             priceRange: [0, 2000000],
             bedrooms: [],
             bathrooms: [],
             parkingSpaces: [],
             areaRange: [0, 500],
             city: [],
             neighborhood: [],
             groups: [],
             visibility: [],
             sortBy: 'createdAt',
             sortOrder: 'desc',
           });
         }}
         isLoggedIn={!!user}
       />

              {/* Lista de Imóveis */}
       <Box>
         {filteredApartments.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <HomeIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nenhum imóvel encontrado
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tente ajustar os filtros ou cadastre novos imóveis.
                             </Typography>
             </Paper>
           ) : (
             <>
               <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Typography variant="h6" color="text.secondary">
                   {filteredApartments.length} imóve{filteredApartments.length !== 1 ? 'is' : 'l'} encontrado{filteredApartments.length !== 1 ? 's' : ''}
                 </Typography>
               </Box>
             <Grid container spacing={2}>
               {filteredApartments.map((apartment) => (
                 <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={apartment.id}>
                   <Box sx={{ position: 'relative' }}>
                     <ApartmentCard
                       apartment={apartment}
                       disableNavigation={true}
                       onCardClick={() => handleToggleApartmentSelection(apartment.id)}
                                               customStyles={{
                          cursor: 'pointer',
                          border: selectedApartments.includes(apartment.id) 
                            ? `4px solid ${theme.palette.secondary.dark}` 
                            : '4px solid transparent',
                          transition: 'all 0.2s ease-in-out',
                          transform: selectedApartments.includes(apartment.id) ? 'scale(1.02)' : 'scale(1)',
                          boxShadow: selectedApartments.includes(apartment.id) 
                            ? `0 8px 25px ${theme.palette.secondary.dark}40` 
                            : '0 4px 12px rgba(0, 0, 0, 0.1)',
                          '&:hover': {
                            transform: selectedApartments.includes(apartment.id) 
                              ? 'scale(1.03)' 
                              : 'translateY(-4px)',
                            boxShadow: selectedApartments.includes(apartment.id)
                              ? `0 12px 35px ${theme.palette.secondary.dark}50`
                              : '0 8px 25px rgba(0, 0, 0, 0.15)',
                          }
                        }}
                     />
                     
                     {/* Indicador de seleção */}
                     {selectedApartments.includes(apartment.id) && (
                                               <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: theme.palette.secondary.dark,
                            color: 'white',
                            borderRadius: '50%',
                            width: 36,
                            height: 36,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1,
                            boxShadow: `0 4px 12px ${theme.palette.secondary.dark}60`,
                          }}
                        >
                         <CheckIcon />
                       </Box>
                     )}
                   </Box>
                 </Grid>
               ))}
             </Grid>
             </>
           )}
         </Box>
    </Container>
  );
};

export default GroupApartmentSelect;
