import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  useTheme,
  IconButton,
  Tooltip,
  CardActions,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Bed as BedIcon,
  Bathtub as BathIcon,
  DirectionsCar as CarIcon,
  SquareFoot as AreaIcon,
  Public as PublicIcon,
  Lock as PrivateIcon,
  RemoveCircle as RemoveIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Apartment } from '../../types';
import ApartmentReactions from '../ApartmentReactions';
import { useReactions } from '../../hooks/useReactions';

interface ApartmentCardProps {
  apartment: Apartment;
  showGroupActions?: boolean;
  onRemoveFromGroup?: () => void;
  canRemoveFromGroup?: boolean;
  groupId?: string;
  showReactions?: boolean;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ 
  apartment, 
  showGroupActions = false, 
  onRemoveFromGroup, 
  canRemoveFromGroup = false,
  groupId,
  showReactions = false
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { reactions, handleReactionChange } = useReactions(
    apartment.id,
    groupId || ''
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleCardClick = () => {
    navigate(`/apartment/${apartment.id}`);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que o clique no botão acione o clique do card
    if (onRemoveFromGroup) {
      onRemoveFromGroup();
    }
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
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="140"
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
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            fontWeight: 600,
            color: theme.palette.secondary.main,
            mb: 0.5,
            lineHeight: 1.2,
          }}
          noWrap
        >
          {apartment.title}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <LocationIcon fontSize="small" />
          {apartment.neighborhood}, {apartment.city}
        </Typography>

        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 0.5,
          }}
        >
          {formatPrice(apartment.price)}
        </Typography>

        {(apartment.condominiumFee > 0 || apartment.iptu > 0) && (
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            {apartment.condominiumFee > 0 && (
              <Typography variant="caption" color="text.secondary">
                Cond: {formatPrice(apartment.condominiumFee)}
              </Typography>
            )}
            {apartment.iptu > 0 && (
              <Typography variant="caption" color="text.secondary">
                IPTU: {formatPrice(apartment.iptu)}
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <BedIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {apartment.bedrooms}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <BathIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {apartment.bathrooms}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CarIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {apartment.parkingSpaces}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AreaIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {apartment.area}m²
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {apartment.description}
        </Typography>

        {/* Reações */}
        {showReactions && groupId && (
          <Box 
            sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}
            onClick={(e) => e.stopPropagation()}
          >
            <ApartmentReactions
              apartmentId={apartment.id}
              groupId={groupId}
              reactions={reactions}
              onReactionChange={handleReactionChange}
            />
          </Box>
        )}
      </CardContent>
      
      {showGroupActions && canRemoveFromGroup && (
        <CardActions sx={{ pt: 0, pb: 1, px: 1.5 }}>
          <Tooltip title="Remover do grupo">
            <IconButton
              size="small"
              color="error"
              onClick={handleRemoveClick}
              sx={{ ml: 'auto' }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </CardActions>
      )}
    </Card>
  );
};

export default ApartmentCard;
