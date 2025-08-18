import React from 'react';
import {
  Box,
  Card,
  CardMedia,
  IconButton,
  Typography,
  Chip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { ImageService } from '../../services/imageService';

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
  isValid: boolean;
  error?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  file,
  onRemove,
  isValid,
  error,
}) => {
  const previewUrl = URL.createObjectURL(file);

  return (
    <Card sx={{ position: 'relative', overflow: 'visible' }}>
      <CardMedia
        component="img"
        height="120"
        image={previewUrl}
        alt={file.name}
        sx={{ objectFit: 'cover' }}
      />
      
      {/* Status indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
        }}
      >
        {isValid ? (
          <CheckCircleIcon color="success" />
        ) : (
          <ErrorIcon color="error" />
        )}
      </Box>

      {/* Remove button */}
      <IconButton
        size="small"
        color="error"
        onClick={onRemove}
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          backgroundColor: 'rgba(255,255,255,0.9)',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,1)',
          },
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>

      {/* File info */}
      <Box sx={{ p: 1 }}>
        <Typography variant="caption" noWrap>
          {file.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
          <Chip
            label={ImageService.formatFileSize(file.size)}
            size="small"
            variant="outlined"
          />
          <Chip
            label={file.type.split('/')[1].toUpperCase()}
            size="small"
            variant="outlined"
            color={isValid ? 'primary' : 'error'}
          />
        </Box>
        
        {error && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
            {error}
          </Typography>
        )}
      </Box>
    </Card>
  );
};
