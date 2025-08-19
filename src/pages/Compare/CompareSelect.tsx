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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import ApartmentCard from '../../components/ApartmentCard/ApartmentCard';
import Filters from '../../components/Filters/Filters';
import { Apartment, FilterOptions, Group } from '../../types';
import { apartmentService } from '../../services/apartmentService';
import { groupService } from '../../services/groupService';
import { useAuth } from '../../hooks/useAuth';

const CompareSelect: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const { selectedIndex, currentSelection } = location.state || { selectedIndex: 0, currentSelection: [] };
  
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<string | null>(null);
  const selectedApartmentData = apartments.find((apt) => apt.id === selectedApartment);

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
    loadData();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [filters, apartments]);

  const loadData = async () => {
    try {
      setLoading(true);
      const apartmentsData = await apartmentService.getApartments(user?.id);
      setApartments(apartmentsData);
      
      // Carregar grupos apenas se o usuário estiver logado
      if (user?.id) {
        const allGroups = await groupService.getGroups();
        const userGroups = allGroups.filter(group => 
          group.members.some(member => member.userId === user.id)
        );
        setGroups(userGroups);
      } else {
        setGroups([]);
      }
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

    // Filtro por vagas de garagem
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
        apt.groups && apt.groups.some(group => filters.groups.includes(group.id))
      );
    }

    // Filtro por visibilidade
    if (filters.visibility.length > 0) {
      filtered = filtered.filter(apt => {
        if (filters.visibility.includes('public') && apt.isPublic) return true;
        if (filters.visibility.includes('private') && !apt.isPublic) return true;
        return false;
      });
    }

    // Ordenação
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

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
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          default:
            return 0;
        }

        if (filters.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    setFilteredApartments(filtered);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
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
  };

  const handleApartmentSelect = (apartmentId: string) => {
    console.log('Apartment selected:', apartmentId);
    setSelectedApartment(apartmentId);
  };

  const handleConfirmSelection = () => {
    if (selectedApartment) {
      const newSelection = [...(currentSelection || [])];
      newSelection[selectedIndex] = selectedApartment;
      
      navigate('/compare', { 
        state: { selectedApartments: newSelection } 
      });
    }
  };

  const handleBack = () => {
    navigate('/compare', { 
      state: { selectedApartments: currentSelection } 
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>
        
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: theme.palette.secondary.main,
            mb: 1,
          }}
        >
          Selecionar Imóvel {selectedIndex + 1}
        </Typography>
        
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Escolha um imóvel para adicionar à comparação
        </Typography>

        {!selectedApartment && (
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            borderRadius: 2, 
            background: theme.palette.grey[50],
            border: `1px solid ${theme.palette.grey[300]}`,
            textAlign: 'center',
          }}>
            <Typography variant="body1" color="text.secondary">
              💡 Clique em um imóvel abaixo para selecioná-lo para comparação
            </Typography>
          </Box>
        )}

        {selectedApartment && (
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            borderRadius: 2, 
            background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
            border: `1px solid ${theme.palette.primary.main}30`,
            display: 'flex',
            alignItems: 'stretch',
            gap: 2,
          }}>
            {selectedApartmentData && (
              <Box sx={{ width: { xs: '100%', sm: 360 }, maxWidth: 380, flexShrink: 0 }}>
                <ApartmentCard 
                  apartment={selectedApartmentData}
                  disableNavigation
                />
              </Box>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1, minWidth: 0 }}>
              <Chip
                label="Imóvel selecionado"
                color="primary"
                icon={<CheckIcon />}
                sx={{ 
                  alignSelf: 'flex-start',
                  fontWeight: 600,
                  background: theme.palette.primary.main,
                  color: 'white',
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Confira o imóvel selecionado e clique em "Confirmar Seleção" para adicioná-lo à comparação.
              </Typography>
              <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleConfirmSelection}
                  sx={{ 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    color: 'white',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  ✅ Confirmar Seleção
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Filtros */}
      <Filters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        groups={groups}
        onClearFilters={handleClearFilters}
        isLoggedIn={!!user}
      />

      {/* Cards */}
      <Box>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                {filteredApartments.length} imóve{filteredApartments.length !== 1 ? 'is' : 'l'} encontrado{filteredApartments.length !== 1 ? 's' : ''}
              </Typography>
            </Box>

            {filteredApartments.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Nenhum imóvel encontrado
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Tente ajustar os filtros ou adicionar novos imóveis.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {filteredApartments.map((apartment) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={apartment.id}>
                    <Box
                      sx={{
                        position: 'relative',
                        cursor: 'pointer',
                        borderRadius: 2,
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          transition: 'transform 0.2s ease',
                        },
                      }}
                      onClick={() => handleApartmentSelect(apartment.id)}
                    >
                      {/* Overlay de seleção */}
                      {selectedApartment === apartment.id && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}05 100%)`,
                            border: `3px solid ${theme.palette.primary.main}`,
                            borderRadius: 2,
                            zIndex: 2,
                            pointerEvents: 'none',
                            boxShadow: `0 4px 20px ${theme.palette.primary.main}50`,
                          }}
                        />
                      )}
                      
                      {/* Card do apartamento */}
                      <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <ApartmentCard 
                          apartment={apartment} 
                          disableNavigation 
                          onCardClick={() => handleApartmentSelect(apartment.id)}
                        />
                      </Box>
                      
                      {/* Chip de seleção */}
                      {selectedApartment === apartment.id && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            zIndex: 3,
                          }}
                        >
                          <Chip
                            label="Selecionado"
                            color="primary"
                            icon={<CheckIcon />}
                            sx={{ 
                              fontWeight: 600,
                              background: theme.palette.primary.main,
                              color: 'white',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default CompareSelect;
