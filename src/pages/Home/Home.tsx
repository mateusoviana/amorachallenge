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
  Fade,
} from '@mui/material';
import ApartmentCard from '../../components/ApartmentCard/ApartmentCard';
import Filters from '../../components/Filters/Filters';

import { Apartment, FilterOptions, Group } from '../../types';
import { apartmentService } from '../../services/apartmentService';
import { groupService } from '../../services/groupService';
import { useAuth } from '../../hooks/useAuth';


const Home: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slides content
  const slides = [
    {
      title: "Seu espaço, sua escolha: organize e conquiste o imóvel ideal",
      subtitle: "Transforme a busca pelo imóvel em uma experiência colaborativa. Corretores podem cadastrar e compartilhar ofertas em grupos, enquanto compradores adicionam opções privadas encontradas fora da plataforma."
    },
    {
      title: "Comentários e reações para uma decisão colaborativa",
      subtitle: "Com comentários e reações, todos os envolvidos participam ativamente da decisão. E para tornar o sonho da casa própria ainda mais acessível, a aMora oferece a possibilidade de morar no seu apartamento ideal sem preocupações com o valor de entrada."
    },
    {
      title: "💘 aMora Match",
      subtitle: "Com o aMora Match, a experiência da busca pelo imóvel ideal é gamificada, permitindo que você encontre novas oportunidades de forma dinâmica e intuitiva."
    },
    {
      title: "⚖️ aMora Compara",
      subtitle: "Com o aMora compara você coloca lado a lado ofertas e compara todos os detalhes dos imóveis, gerando relatórios em pdf para organização própria ou de seu corretor."
    }
  ];

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

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000); // Change slide every 8 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

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

    // Aplicar ordenação
    if (filters.sortBy && filters.sortOrder) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (filters.sortBy) {
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'condominiumFee':
            aValue = a.condominiumFee;
            bValue = b.condominiumFee;
            break;
          case 'area':
            aValue = a.area;
            bValue = b.area;
            break;
          case 'createdAt':
            aValue = a.createdAt;
            bValue = b.createdAt;
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>

             {/* Hero Section with Modern Slides */}
       <Box 
         sx={{ 
           mb: 6,
           position: 'relative',
           overflow: 'hidden',
           borderRadius: 4,
           background: `linear-gradient(135deg, 
             ${theme.palette.primary.main}08 0%, 
             ${theme.palette.secondary.main}05 50%, 
             ${theme.palette.primary.main}03 100%)`,
           border: `1px solid ${theme.palette.divider}`,
           boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
         }}
       >
         {/* Background Pattern */}
         <Box sx={{
           position: 'absolute',
           top: 0,
           left: 0,
           right: 0,
           bottom: 0,
           opacity: 0.3,
           background: `radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}10 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}10 0%, transparent 50%)`,
           pointerEvents: 'none',
         }} />

                             {/* Slides Container */}
          <Box sx={{ 
            position: 'relative', 
            minHeight: 280,
            p: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {slides.map((slide, index) => (
              <Fade key={index} in={currentSlide === index} timeout={600}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                    opacity: currentSlide === index ? 1 : 0,
                    transition: 'opacity 0.6s ease-in-out',
                  }}
                >
                  {/* Slide Content */}
                  <Box sx={{ 
                    textAlign: 'center',
                    maxWidth: 1000,
                    width: '100%',
                    py: 2,
                  }}>
                    {/* Title */}
                    <Typography
                      variant="h2"
                      component="h1"
                      sx={{
                        fontWeight: 800,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textAlign: 'center',
                        mb: 3,
                        fontSize: { xs: '1.6rem', sm: '2rem', md: '2.5rem' },
                        lineHeight: 1.3,
                        letterSpacing: '-0.02em',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                      }}
                    >
                      {slide.title}
                    </Typography>
                    
                    {/* Subtitle */}
                    <Typography
                      variant="h5"
                      color="text.secondary"
                      sx={{
                        textAlign: 'center',
                        maxWidth: 800,
                        mx: 'auto',
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                        lineHeight: 1.6,
                        fontWeight: 400,
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                      }}
                    >
                      {slide.subtitle}
                    </Typography>
                  </Box>
                </Box>
              </Fade>
            ))}
          </Box>

         {/* Modern Slide Indicators */}
         <Box sx={{ 
           display: 'flex', 
           justifyContent: 'center', 
           pb: 3,
           gap: 2,
         }}>
           {slides.map((_, index) => (
             <Box
               key={index}
               sx={{
                 width: currentSlide === index ? 40 : 8,
                 height: 8,
                 borderRadius: 4,
                 backgroundColor: currentSlide === index 
                   ? theme.palette.primary.main 
                   : theme.palette.grey[300],
                 cursor: 'pointer',
                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                 '&:hover': {
                   backgroundColor: currentSlide === index 
                     ? theme.palette.primary.dark 
                     : theme.palette.grey[400],
                   transform: 'scale(1.2)',
                 },
                 boxShadow: currentSlide === index 
                   ? `0 4px 12px ${theme.palette.primary.main}40`
                   : 'none',
               }}
               onClick={() => setCurrentSlide(index)}
             />
           ))}
         </Box>
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
        </Box>
    </Container>
  );
};

export default Home;
