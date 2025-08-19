import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  useTheme,
  Paper,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Compare as CompareIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Apartment } from '../../types';
import { apartmentService } from '../../services/apartmentService';
import ApartmentCard from '../../components/ApartmentCard/ApartmentCard';

const Compare: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedApartments, setSelectedApartments] = useState<string[]>(location.state?.selectedApartments || []);
  const [apartmentsData, setApartmentsData] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar dados dos apartamentos selecionados
  useEffect(() => {
    const loadSelectedApartments = async () => {
      if (selectedApartments.length > 0) {
        setLoading(true);
        try {
          const apartments = await Promise.all(
            selectedApartments
              .filter(id => id) // Remove IDs vazios
              .map(id => apartmentService.getApartmentById(id))
          );
          setApartmentsData(apartments.filter(apt => apt !== null) as Apartment[]);
        } catch (error) {
          console.error('Erro ao carregar apartamentos selecionados:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setApartmentsData([]);
      }
    };

    loadSelectedApartments();
  }, [selectedApartments]);

  const handleCardClick = (index: number) => {
    navigate('/compare/select', { 
      state: { 
        selectedIndex: index,
        currentSelection: selectedApartments 
      } 
    });
  };

  const handleCompare = () => {
    if (selectedApartments.length >= 2) {
      navigate('/compare/result', { 
        state: { selectedApartments } 
      });
    }
  };

  const renderGhostCard = (index: number) => {
    const isSelected = selectedApartments[index];
    const apartment = apartmentsData[index];
    
    return (
      <Card
        key={index}
        sx={{
          height: 'auto',
          minHeight: 300,
          cursor: 'pointer',
          border: isSelected ? `2px solid ${theme.palette.primary.main}` : '2px dashed #ccc',
          background: isSelected 
            ? `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.primary.main}05 100%)`
            : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            border: `2px solid ${theme.palette.primary.main}`,
          },
        }}
        onClick={() => handleCardClick(index)}
      >
        {isSelected && apartment ? (
          <Box sx={{ position: 'relative' }}>
            <ApartmentCard 
              apartment={apartment} 
              disableNavigation
            />
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 10,
              }}
            >
              <Chip
                label="Clique para alterar"
                size="small"
                sx={{
                  background: theme.palette.primary.main,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
            </Box>
          </Box>
        ) : (
          <CardContent sx={{ 
            height: 300, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            textAlign: 'center',
            p: 3,
          }}>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              bgcolor: '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}>
              <AddIcon sx={{ fontSize: 40, color: '#666' }} />
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
              Selecionar Imóvel
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Clique para escolher um imóvel para comparar
            </Typography>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2, alignSelf: 'flex-start' }}
        >
          Voltar
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
          🏠 Amora Compara
        </Typography>
        
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ 
            maxWidth: 600, 
            mx: 'auto',
            mb: 4,
          }}
        >
          Selecione de 2 a 3 imóveis para comparar características, preços e financiamento
        </Typography>
      </Box>

      {/* Cards de Seleção */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[0, 1, 2].map((index) => (
          <Grid item xs={12} md={4} key={index}>
            {renderGhostCard(index)}
          </Grid>
        ))}
      </Grid>

      {/* Botão de Comparar */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          disabled={selectedApartments.length < 2}
          onClick={handleCompare}
          startIcon={<CompareIcon />}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
            color: 'white',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.primary.dark} 100%)`,
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 25px rgba(0, 0, 0, 0.3)',
            },
            '&:disabled': {
              background: '#e0e0e0',
              color: '#999',
              transform: 'none',
              boxShadow: 'none',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Comparar Imóveis ({selectedApartments.length}/3)
        </Button>
        
        {selectedApartments.length < 2 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Selecione pelo menos 2 imóveis para comparar
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Compare;
