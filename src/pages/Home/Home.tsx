import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Home as HomeIcon, Group as GroupIcon, Person as PersonIcon } from '@mui/icons-material';
import ApartmentCard from '../../components/ApartmentCard/ApartmentCard';
import Filters from '../../components/Filters/Filters';
import { Apartment, FilterOptions, Group } from '../../types';
import { useAuth } from '../../hooks/useAuth';

// Mock data para demonstração
const mockApartments: Apartment[] = [
  {
    id: '1',
    title: 'Apartamento Moderno no Centro',
    description: 'Excelente apartamento com acabamento de alto padrão, localizado no coração da cidade.',
    price: 450000,
    address: 'Rua das Flores, 123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 1,
    area: 75,
    isPublic: true,
    ownerId: '1',
    owner: {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      password: '',
      userType: 'realtor',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    groups: [],
    images: ['https://via.placeholder.com/400x200?text=Apartamento+1'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Casa com Jardim',
    description: 'Linda casa com jardim amplo, ideal para famílias que buscam conforto e espaço.',
    price: 850000,
    address: 'Av. das Palmeiras, 456',
    neighborhood: 'Jardins',
    city: 'São Paulo',
    state: 'SP',
    bedrooms: 3,
    bathrooms: 3,
    parkingSpaces: 2,
    area: 180,
    isPublic: true,
    ownerId: '2',
    owner: {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      password: '',
      userType: 'realtor',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    groups: [],
    images: ['https://via.placeholder.com/400x200?text=Casa+1'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Cobertura Duplex',
    description: 'Cobertura luxuosa com vista panorâmica da cidade, acabamento premium.',
    price: 1200000,
    address: 'Rua dos Ipês, 789',
    neighborhood: 'Itaim Bibi',
    city: 'São Paulo',
    state: 'SP',
    bedrooms: 4,
    bathrooms: 4,
    parkingSpaces: 3,
    area: 250,
    isPublic: false,
    ownerId: '3',
    owner: {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro@email.com',
      password: '',
      userType: 'buyer',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    groups: [],
    images: ['https://via.placeholder.com/400x200?text=Cobertura+1'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Grupo Público',
    description: 'Imóveis públicos disponíveis para todos os usuários',
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [],
    apartments: [],
  },
  {
    id: '2',
    name: 'Meus Favoritos',
    description: 'Imóveis de interesse pessoal',
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [],
    apartments: [],
  },
];

const Home: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [apartments, setApartments] = useState<Apartment[]>(mockApartments);
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>(mockApartments);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [loading, setLoading] = useState(false);
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
  });

  useEffect(() => {
    applyFilters();
  }, [filters, apartments]);

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

    setFilteredApartments(filtered);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    
    // Filtrar apartamentos baseado na aba selecionada
    if (newValue === 0) {
      // Todos os apartamentos
      setFilteredApartments(apartments);
    } else if (newValue === 1) {
      // Apenas apartamentos públicos
      setFilteredApartments(apartments.filter(apt => apt.isPublic));
    } else if (newValue === 2) {
      // Apenas apartamentos privados do usuário
      if (user) {
        setFilteredApartments(apartments.filter(apt => !apt.isPublic && apt.ownerId === user.id));
      }
    }
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
    });
  };

  const getTabLabel = (index: number) => {
    switch (index) {
      case 0:
        return 'Todos os Imóveis';
      case 1:
        return 'Imóveis Públicos';
      case 2:
        return 'Meus Imóveis';
      default:
        return '';
    }
  };

  const getTabIcon = (index: number) => {
    switch (index) {
      case 0:
        return <HomeIcon />;
      case 1:
        return <GroupIcon />;
      case 2:
        return <PersonIcon />;
      default:
        return <HomeIcon />;
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
          Encontre seu Imóvel Ideal
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ textAlign: 'center', maxWidth: 600, mx: 'auto' }}
        >
          Explore milhares de apartamentos e casas disponíveis para compra. 
          Compare opções e encontre o lugar perfeito para você.
        </Typography>
      </Box>

      <Filters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        groups={groups}
        onClearFilters={handleClearFilters}
      />

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
          {[0, 1, 2].map((index) => (
            <Tab
              key={index}
              label={getTabLabel(index)}
              icon={getTabIcon(index)}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

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
            <Grid container spacing={3}>
              {filteredApartments.map((apartment) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={apartment.id}>
                  <ApartmentCard apartment={apartment} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;
