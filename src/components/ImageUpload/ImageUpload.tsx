import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { ImageService } from '../../services/imageService';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setError(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map(file => 
        ImageService.uploadImage(file)
      );
      
      const uploadedUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...uploadedUrls]);
    } catch (err: any) {
      console.error('Erro detalhado no upload:', err);
      setError(`Erro no upload: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index];
    try {
      await ImageService.deleteImage(imageUrl);
      onImagesChange(images.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Erro ao remover imagem:', err);
      onImagesChange(images.filter((_, i) => i !== index));
    }
  };

  const handleAddImageUrl = () => {
    const imageUrl = prompt('Digite a URL da imagem:');
    if (imageUrl && images.length < maxImages) {
      onImagesChange([...images, imageUrl]);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Imagens ({images.length}/{maxImages})
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="image-upload"
          multiple
          type="file"
          onChange={handleFileUpload}
          disabled={uploading || images.length >= maxImages}
        />
        <label htmlFor="image-upload">
          <Button
            variant="outlined"
            component="span"
            startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
            disabled={uploading || images.length >= maxImages}
            sx={{ mr: 1 }}
          >
            {uploading ? 'Enviando...' : 'Upload de Imagens'}
          </Button>
        </label>
        
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddImageUrl}
          disabled={images.length >= maxImages}
        >
          Adicionar URL
        </Button>
      </Box>

      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={image}
                alt={`Imagem ${index + 1}`}
                sx={{ objectFit: 'cover' }}
              />
              <Box sx={{ p: 1, textAlign: 'center' }}>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveImage(index)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};