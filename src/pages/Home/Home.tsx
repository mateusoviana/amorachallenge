import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import ApartmentCard from '../../components/ApartmentCard/ApartmentCard';
import Filters from '../../components/Filters/Filters';

import { Apartment, FilterOptions, Group } from '../../types';
import { apartmentService } from '../../services/apartmentService';
import { groupService } from '../../services/groupService';


const Home: React.FC = () => {
  const theme = useTheme();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, apartments]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [apartmentsData, groupsData] = await Promise.all([
        apartmentService.getApartments(),
        groupService.getGroups()
      ]);
      setApartments(apartmentsData);
      setGroups(groupsData);
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
        apt.groups.some(group => filters.groups.includes(group.id))
      );
    }

    // Filtro por visibilidade
    if (filters.visibility.length > 0) {
      filtered = filtered.filter(apt => {
        if (filters.visibility.includes('public') && filters.visibility.includes('private')) {
          return true; // Mostra todos se ambos estiverem selecionados
        } else if (filters.visibility.includes('public')) {
          return apt.isPublic;
        } else if (filters.visibility.includes('private')) {
          return !apt.isPublic;
        }
        return true;
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
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>

      <Box 
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
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            color: theme.palette.secondary.main,
            textAlign: 'center',
            mb: 2,
            position: 'relative',
            zIndex: 1,
          }}
        >
          Encontre seu Imóvel Ideal
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ 
            textAlign: 'center', 
            maxWidth: 600, 
            mx: 'auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Explore milhares de apartamentos e casas disponíveis para compra. 
          Compare opções e encontre o lugar perfeito para você.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Filtros - Lado Esquerdo */}
        <Grid item xs={12} md={3}>
          <Filters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            groups={groups}
            onClearFilters={handleClearFilters}
          />
        </Grid>

        {/* Cards - Lado Direito */}
        <Grid item xs={12} md={9}>
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
                  {filteredApartments.length} imóvel{filteredApartments.length !== 1 ? 'es' : ''} encontrado{filteredApartments.length !== 1 ? 's' : ''}
                </Typography>
              </Box>

              {filteredApartments.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Nenhum imóvel encontrado
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Tente ajustar os filtros ou adicionar novos imóveis.
                  </Typography>
                </Paper>
              ) : (
                                 <Grid container spacing={2}>
                   {filteredApartments.map((apartment) => (
                     <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={apartment.id}>
                       <ApartmentCard apartment={apartment} />
                     </Grid>
                   ))}
                 </Grid>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
