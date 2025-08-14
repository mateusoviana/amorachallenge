import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Bed as BedIcon,
  Bathtub as BathIcon,
  DirectionsCar as CarIcon,
  SquareFoot as AreaIcon,
  Public as PublicIcon,
  Lock as PrivateIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Apartment } from '../../types';

interface ApartmentCardProps {
  apartment: Apartment;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleCardClick = () => {
    navigate(`/apartment/${apartment.id}`);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        },
      }}
      onClick={handleCardClick}
    >
      <CardMedia
        component="img"
        height="200"
        image={apartment.images[0] || 'https://via.placeholder.com/400x200?text=Imóvel+aMORA'}
        alt={apartment.title}
        sx={{ objectFit: 'cover' }}
      />
      
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <Chip
          icon={apartment.isPublic ? <PublicIcon /> : <PrivateIcon />}
          label={apartment.isPublic ? 'Público' : 'Privado'}
          size="small"
          sx={{
            bgcolor: apartment.isPublic ? theme.palette.primary.main : theme.palette.secondary.main,
            color: 'white',
            fontWeight: 600,
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            color: theme.palette.secondary.main,
            mb: 1,
            lineHeight: 1.2,
          }}
          noWrap
        >
          {apartment.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <LocationIcon fontSize="small" />
          {apartment.neighborhood}, {apartment.city}
        </Typography>

        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 2,
          }}
        >
          {formatPrice(apartment.price)}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <BedIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {apartment.bedrooms}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <BathIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {apartment.bathrooms}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CarIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {apartment.parkingSpaces}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AreaIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {apartment.area}m²
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {apartment.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ApartmentCard;
