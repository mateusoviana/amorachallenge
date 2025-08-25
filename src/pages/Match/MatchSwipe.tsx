import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Fab,
  useTheme,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  Paper,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Close as CloseIcon,
  Settings as SettingsIcon,
  LocationOn as LocationIcon,
  Hotel as HotelIcon,
  Bathtub as BathtubIcon,
  SquareFoot as AreaIcon,
  AttachMoney as PriceIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Apartment } from '../../types';
import { apartmentService } from '../../services/apartmentService';
import { groupService } from '../../services/groupService';
import AuthModal from '../../components/AuthModal/AuthModal';

const MatchSwipe: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<any>(null);
  const [showPreferencesDialog, setShowPreferencesDialog] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);


  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    if (preferences) {
      loadApartments();
    }
  }, [preferences]);

  const loadPreferences = () => {
    const savedPreferences = localStorage.getItem('matchPreferences');
    const setupCompleted = localStorage.getItem('matchSetupCompleted');
    
    if (savedPreferences && setupCompleted === 'true') {
      setPreferences(JSON.parse(savedPreferences));
    } else {
      navigate('/match/setup');
    }
  };

  const loadApartments = async () => {
    try {
      setLoading(true);
      const allApartments = await apartmentService.getApartments();
      
      // Buscar grupos de curtidos e descartados para filtrar
      let likedApartments: string[] = [];
      let dislikedApartments: string[] = [];
      
             if (user) {
         try {
           const groups = await groupService.getGroups();
           const likedGroup = groups.find(g => g.name.toLowerCase() === 'curtidos');
           const dislikedGroup = groups.find(g => g.name.toLowerCase() === 'descartados');
           
           if (likedGroup) {
             const likedApartmentsData = await groupService.getApartmentsByGroup(likedGroup.id);
             likedApartments = likedApartmentsData.map((apt: Apartment) => apt.id);
           }
           
           if (dislikedGroup) {
             const dislikedApartmentsData = await groupService.getApartmentsByGroup(dislikedGroup.id);
             dislikedApartments = dislikedApartmentsData.map((apt: Apartment) => apt.id);
           }
         } catch (error) {
           console.error('Erro ao carregar grupos:', error);
         }
       }
      
      // Filtrar apartamentos baseado nas preferências e status de curtir/descartar
      const filteredApartments = allApartments.filter(apartment => {
        // Não mostrar apartamentos já curtidos ou descartados
        if (likedApartments.includes(apartment.id) || dislikedApartments.includes(apartment.id)) {
          return false;
        }
        
        if (!preferences) return true;
        
        // Filtro por preço
        if (apartment.price < preferences.priceRange[0] || apartment.price > preferences.priceRange[1]) {
          return false;
        }
        
        // Filtro por área
        if (apartment.area < preferences.areaRange[0] || apartment.area > preferences.areaRange[1]) {
          return false;
        }
        
        // Filtro por quartos
        if (preferences.bedrooms.length > 0 && !preferences.bedrooms.includes(apartment.bedrooms)) {
          return false;
        }
        
        // Filtro por banheiros
        if (preferences.bathrooms.length > 0 && !preferences.bathrooms.includes(apartment.bathrooms)) {
          return false;
        }
        
        // Filtro por cidade
        if (preferences.cities.length > 0 && !preferences.cities.includes(apartment.city)) {
          return false;
        }
        
        // Filtro por bairro
        if (preferences.neighborhoods.length > 0 && !preferences.neighborhoods.includes(apartment.neighborhood)) {
          return false;
        }
        
        return true;
      });
      
      setApartments(filteredApartments);
    } catch (error) {
      console.error('Erro ao carregar apartamentos:', error);
    } finally {
      setLoading(false);
    }
  };

     const handleLike = async () => {
     if (currentIndex >= apartments.length) return;
     
     if (!user) {
       setAuthModalOpen(true);
       return;
     }
     
     const apartment = apartments[currentIndex];
     await addToGroup(apartment, 'curtidos');
     // Definir direção e executar animação
     console.log('Curtindo - direção: right');
     setSwipeDirection('right');
     setTimeout(() => nextCard('right'), 100);
   };

   const handleDislike = async () => {
     if (currentIndex >= apartments.length) return;
     
     if (!user) {
       setAuthModalOpen(true);
       return;
     }
     
     const apartment = apartments[currentIndex];
     await addToGroup(apartment, 'descartados');
     // Definir direção e executar animação
     console.log('Descartando - direção: left');
     setSwipeDirection('left');
     setTimeout(() => nextCard('left'), 100);
   };

    const addToGroup = async (apartment: Apartment, groupName: string) => {
    if (!user) return;
    
    try {
      // Buscar ou criar o grupo
      let group = await groupService.getGroups().then(groups => 
        groups.find(g => g.name.toLowerCase() === groupName.toLowerCase())
      );
      
      if (!group) {
        // Criar o grupo se não existir
        group = await groupService.createGroup({
          name: groupName,
          description: `Imóveis ${groupName === 'curtidos' ? 'que você curtiu' : 'que você descartou'} no aMORA Match`,
          adminId: user.id,
        });
      }
      
             // Verificar se o apartamento já está no grupo
       const groupApartments = await groupService.getApartmentsByGroup(group.id);
       const apartmentExists = groupApartments.some((apt: Apartment) => apt.id === apartment.id);
       
       if (!apartmentExists) {
         // Adicionar apartamento ao grupo
         await groupService.addApartmentToGroup(apartment.id, group.id);
         console.log(`Apartamento ${apartment.title} adicionado ao grupo ${groupName}`);
       }
    } catch (error) {
      console.error('Erro ao adicionar ao grupo:', error);
    }
  };

  const nextCard = (direction?: 'left' | 'right') => {
    // Animar o card saindo da tela
    const cardElement = document.querySelector('.swipe-card') as HTMLElement;
    if (cardElement) {
      const swipeDirectionValue = direction || swipeDirection;
      const translateX = swipeDirectionValue === 'right' ? 500 : -500;
      console.log(`nextCard - direção: ${swipeDirectionValue}, translateX: ${translateX}`);
      cardElement.style.transform = `translateX(${translateX}px) rotate(${translateX * 0.1}deg)`;
      cardElement.style.opacity = '0';
    }
    
    // Aguardar a animação terminar antes de mudar o card
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
      setSwipeOffset(0);
      
      // Resetar o card para a próxima animação
      if (cardElement) {
        cardElement.style.transform = '';
        cardElement.style.opacity = '';
      }
    }, 300);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const offsetX = e.clientX - centerX;
    
    setSwipeOffset(offsetX);
    
    if (offsetX > 100) {
      setSwipeDirection('right');
    } else if (offsetX < -100) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection(null);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (swipeDirection === 'right') {
      handleLike();
    } else if (swipeDirection === 'left') {
      handleDislike();
    } else {
      setSwipeOffset(0);
      setSwipeDirection(null);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const offsetX = touch.clientX - centerX;
    
    setSwipeOffset(offsetX);
    
    if (offsetX > 100) {
      setSwipeDirection('right');
    } else if (offsetX < -100) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection(null);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (swipeDirection === 'right') {
      handleLike();
    } else if (swipeDirection === 'left') {
      handleDislike();
    } else {
      setSwipeOffset(0);
      setSwipeDirection(null);
    }
  };

  const currentApartment = apartments[currentIndex];

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Carregando imóveis...</Typography>
      </Container>
    );
  }

  if (currentIndex >= apartments.length) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Não há mais imóveis!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Você viu todos os imóveis disponíveis. Tente ajustar suas preferências.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setShowPreferencesDialog(true)}
          startIcon={<SettingsIcon />}
        >
          Ajustar Preferências
        </Button>
      </Container>
    );
  }

           return (
      <Box sx={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        px: { xs: 1, sm: 3 },
        py: { xs: 0.5, sm: 2 }
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: { xs: 0.5, sm: 2 },
          flexShrink: 0,
          py: { xs: 0.5, sm: 1 }
        }}>
          <IconButton onClick={() => navigate('/')} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.5rem' } }}>
            aMORA Match
          </Typography>
          <IconButton onClick={() => setShowPreferencesDialog(true)} size="small">
            <SettingsIcon />
          </IconButton>
        </Box>

        {/* Card Principal */}
        <Box sx={{ 
          position: 'relative', 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          mb: { xs: 1, sm: 3 }
        }}>
                   <Card
             className="swipe-card"
             sx={{
               width: '100%',
               height: { xs: 'calc(100vh - 200px)', sm: 'auto' },
               maxWidth: { xs: '100%', sm: 400 },
               mx: 'auto',
               cursor: 'grab',
               transform: `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.1}deg)`,
               transition: isDragging ? 'none' : 'all 0.3s ease',
               border: swipeDirection === 'right' ? '3px solid #4caf50' : 
                      swipeDirection === 'left' ? '3px solid #f44336' : 'none',
               boxShadow: swipeDirection ? '0 10px 30px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
               opacity: 1,
               display: 'flex',
               flexDirection: 'column',
               '&:active': {
                 cursor: 'grabbing',
               },
             }}
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onMouseUp={handleMouseUp}
             onMouseLeave={handleMouseUp}
             onTouchStart={handleTouchStart}
             onTouchMove={handleTouchMove}
             onTouchEnd={handleTouchEnd}
           >
                        <CardMedia
               component="img"
               height="300"
               image={currentApartment.images && currentApartment.images.length > 0 
                 ? currentApartment.images[0] 
                 : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzE4OC45NTQgMTUwIDE4MCAxNDEuMDQ2IDE4MCAxMzBDMTgwIDExOC45NTQgMTg4Ljk1NCAxMTAgMjAwIDExMEMyMTEuMDQ2IDExMCAyMjAgMTE4Ljk1NCAyMjAgMTMwQzIyMCAxNDEuMDQ2IDIxMS4wNDYgMTUwIDIwMCAxNTBaIiBmaWxsPSIjQ0NDIi8+CjxwYXRoIGQ9Ik0xODAgMTgwQzE4MCAxNjguOTU0IDE4OC45NTQgMTYwIDIwMCAxNjBDMjExLjA0NiAxNjAgMjIwIDE2OC45NTQgMjIwIDE4MFYyMjBDMjIwIDIzMS4wNDYgMjExLjA0NiAyNDAgMjAwIDI0MEMxODguOTU0IDI0MCAxODAgMjMxLjA0NiAxODAgMjIwVjE4MFoiIGZpbGw9IiNDQ0MiLz4KPC9zdmc+'
               }
               alt={currentApartment.title}
               sx={{ 
                 objectFit: 'cover',
                 height: { xs: '45%', sm: 300 },
                 flexShrink: 0
               }}
             />
            <CardContent sx={{ 
              p: { xs: 1.5, sm: 3 },
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <Box>
                               <Typography variant="h5" gutterBottom sx={{ 
                 fontWeight: 600,
                 fontSize: { xs: '1.2rem', sm: '1.5rem' },
                 mb: { xs: 0.5, sm: 1 }
               }}>
                 {currentApartment.title}
               </Typography>
               
               <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 0.5, sm: 2 } }}>
                 <LocationIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: { xs: '1.1rem', sm: '1.5rem' } }} />
                 <Typography variant="body1" sx={{ fontSize: { xs: '1rem', sm: '1rem' } }}>
                   {currentApartment.neighborhood}, {currentApartment.city}
                 </Typography>
               </Box>

                               <Grid container spacing={{ xs: 0.5, sm: 2 }} sx={{ mb: { xs: 0.5, sm: 2 } }}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PriceIcon sx={{ mr: 0.5, color: theme.palette.success.main, fontSize: { xs: '1.1rem', sm: '1.5rem' } }} />
                      <Typography variant="h6" color="success.main" sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                      }}>
                        R$ {(currentApartment.price / 1000).toFixed(0)}k
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AreaIcon sx={{ mr: 0.5, color: theme.palette.info.main, fontSize: { xs: '1.1rem', sm: '1.5rem' } }} />
                      <Typography variant="body1" sx={{ fontSize: { xs: '1rem', sm: '1rem' } }}>
                        {currentApartment.area}m²
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <HotelIcon sx={{ mr: 0.5, color: theme.palette.warning.main, fontSize: { xs: '1.1rem', sm: '1.5rem' } }} />
                      <Typography variant="body1" sx={{ fontSize: { xs: '1rem', sm: '1rem' } }}>
                        {currentApartment.bedrooms} quarto{currentApartment.bedrooms !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BathtubIcon sx={{ mr: 0.5, color: theme.palette.warning.main, fontSize: { xs: '1.1rem', sm: '1.5rem' } }} />
                      <Typography variant="body1" sx={{ fontSize: { xs: '1rem', sm: '1rem' } }}>
                        {currentApartment.bathrooms} banheiro{currentApartment.bathrooms !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mt: 'auto' }}>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  fontSize: { xs: '0.85rem', sm: '0.875rem' },
                  display: { xs: 'block', sm: 'block' },
                  mb: { xs: 1, sm: 2 }
                }}>
                  {currentApartment.description}
                </Typography>

                                 {/* Botão Mais Informações */}
                 <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                   <Button
                     variant="outlined"
                     startIcon={<InfoIcon />}
                     onClick={(e) => {
                       e.stopPropagation();
                       navigate(`/apartment/${currentApartment.id}`, {
                         state: { from: 'match' }
                       });
                     }}
                     sx={{
                       fontSize: { xs: '0.9rem', sm: '1rem' },
                       py: { xs: 0.5, sm: 1 },
                       px: { xs: 1.5, sm: 2 },
                       borderRadius: 2,
                       borderColor: theme.palette.primary.main,
                       color: theme.palette.primary.main,
                       '&:hover': {
                         backgroundColor: theme.palette.primary.main,
                         color: 'white',
                       },
                     }}
                   >
                     Ver Detalhes
                   </Button>
                 </Box>
              </Box>
            </CardContent>
          </Card>

         {/* Indicadores de Swipe */}
         {swipeDirection === 'right' && (
           <Box
             sx={{
               position: 'absolute',
               top: '50%',
               left: '20px',
               transform: 'translateY(-50%) rotate(-30deg)',
               zIndex: 10,
             }}
           >
             <Chip
               label="CURTIU"
               color="success"
               sx={{ 
                 fontSize: { xs: '1rem', sm: '1.2rem' }, 
                 fontWeight: 600, 
                 p: { xs: 1, sm: 2 } 
               }}
             />
           </Box>
         )}

         {swipeDirection === 'left' && (
           <Box
             sx={{
               position: 'absolute',
               top: '50%',
               right: '20px',
               transform: 'translateY(-50%) rotate(30deg)',
               zIndex: 10,
             }}
           >
             <Chip
               label="DESCARTAR"
               color="error"
               sx={{ 
                 fontSize: { xs: '1rem', sm: '1.2rem' }, 
                 fontWeight: 600, 
                 p: { xs: 1, sm: 2 } 
               }}
             />
           </Box>
         )}
       </Box>

                             {/* Botões de Ação */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: { xs: 1.5, sm: 3 },
          mb: { xs: 0.5, sm: 2 },
          flexShrink: 0
        }}>
          <Fab
            color="error"
            size="large"
            onClick={handleDislike}
            sx={{ 
              width: { xs: 55, sm: 70 }, 
              height: { xs: 55, sm: 70 },
              boxShadow: '0 4px 20px rgba(244, 67, 54, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 6px 25px rgba(244, 67, 54, 0.4)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: 22, sm: 30 } }} />
          </Fab>

          <Fab
            color="success"
            size="large"
            onClick={handleLike}
            sx={{ 
              width: { xs: 55, sm: 70 }, 
              height: { xs: 55, sm: 70 },
              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 6px 25px rgba(76, 175, 80, 0.4)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          >
            <FavoriteIcon sx={{ fontSize: { xs: 22, sm: 30 } }} />
          </Fab>
        </Box>

        {/* Contador */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: { xs: 0.5, sm: 2 },
          flexShrink: 0
        }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
            {currentIndex + 1} de {apartments.length} imóveis
          </Typography>
        </Box>

                           

              {/* Dialog de Preferências */}
        <Dialog
          open={showPreferencesDialog}
          onClose={() => setShowPreferencesDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Configurar Preferências</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Deseja ajustar suas preferências? Isso irá recarregar os imóveis disponíveis.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPreferencesDialog(false)}>
              Cancelar
            </Button>
                       <Button 
               onClick={() => {
                 setShowPreferencesDialog(false);
                 navigate('/match/setup');
               }}
               variant="contained"
             >
               Configurar
             </Button>
             <Button 
               onClick={() => {
                 setShowPreferencesDialog(false);
                 loadApartments(); // Recarregar com as mesmas preferências
               }}
               variant="outlined"
             >
               Recarregar
             </Button>
          </DialogActions>
        </Dialog>

        {/* Modal de Autenticação */}
        <AuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          message="Para curtir ou descartar imóveis no aMORA Match, você precisa estar logado."
        />
     </Box>
   );
 };
 
 export default MatchSwipe;
