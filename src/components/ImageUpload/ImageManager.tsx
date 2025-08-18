import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import {
  DragIndicator as DragIndicatorIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Photo as PhotoIcon,
} from '@mui/icons-material';

interface ImageManagerProps {
  open: boolean;
  onClose: () => void;
  images: string[];
  onSave: (images: string[]) => void;
}

export const ImageManager: React.FC<ImageManagerProps> = ({
  open,
  onClose,
  images,
  onSave,
}) => {
  const [reorderedImages, setReorderedImages] = useState<string[]>(images);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newImages = [...reorderedImages];
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    
    setReorderedImages(newImages);
    
    // Ajustar o índice da imagem principal se necessário
    if (draggedIndex === mainImageIndex) {
      setMainImageIndex(dropIndex);
    } else if (draggedIndex < mainImageIndex && dropIndex >= mainImageIndex) {
      setMainImageIndex(mainImageIndex - 1);
    } else if (draggedIndex > mainImageIndex && dropIndex <= mainImageIndex) {
      setMainImageIndex(mainImageIndex + 1);
    }
    
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSetMainImage = (index: number) => {
    setMainImageIndex(index);
  };

  const handleSave = () => {
    // Reordenar as imagens colocando a imagem principal primeiro
    const finalImages = [...reorderedImages];
    if (mainImageIndex !== 0) {
      const [mainImage] = finalImages.splice(mainImageIndex, 1);
      finalImages.unshift(mainImage);
    }
    onSave(finalImages);
    onClose();
  };

  const handleCancel = () => {
    setReorderedImages(images);
    setMainImageIndex(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhotoIcon color="primary" />
            <Typography variant="h6">Gerenciar Imagens</Typography>
          </Box>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Como funciona:</strong>
          </Typography>
          <Typography variant="body2" component="div">
            • Arraste as imagens para reordená-las
            <br />
            • Clique na estrela para definir a imagem principal (aparecerá no card do imóvel)
            <br />
            • A primeira imagem será sempre a imagem principal
          </Typography>
        </Alert>

        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          {reorderedImages.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                sx={{
                  position: 'relative',
                  cursor: 'grab',
                  opacity: draggedIndex === index ? 0.5 : 1,
                  transform: draggedIndex === index ? 'scale(0.95)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                  border: mainImageIndex === index ? '2px solid' : '1px solid',
                  borderColor: mainImageIndex === index ? 'primary.main' : 'divider',
                  '&:hover': {
                    transform: draggedIndex === index ? 'scale(0.95)' : 'scale(1.02)',
                    boxShadow: mainImageIndex === index ? 3 : 2,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={image}
                  alt={`Imagem ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
                
                {/* Número da imagem */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {index + 1}
                </Box>

                {/* Botão de imagem principal */}
                <IconButton
                  onClick={() => handleSetMainImage(index)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,1)',
                    },
                  }}
                >
                  {mainImageIndex === index ? (
                    <StarIcon color="primary" />
                  ) : (
                    <StarBorderIcon />
                  )}
                </IconButton>

                {/* Ícone de arrastar */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DragIndicatorIcon sx={{ fontSize: 16 }} />
                </Box>

                {/* Indicador de imagem principal */}
                {mainImageIndex === index && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <StarIcon sx={{ fontSize: 14 }} />
                    Principal
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Preview do card */}
        {reorderedImages.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Preview do Card do Imóvel
            </Typography>
            <Card sx={{ maxWidth: 300, border: '2px dashed', borderColor: 'primary.main' }}>
              <CardMedia
                component="img"
                height="140"
                image={reorderedImages[mainImageIndex]}
                alt="Imagem principal"
                sx={{ objectFit: 'cover' }}
              />
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Esta será a imagem que aparecerá no card do imóvel
                </Typography>
                <Chip 
                  label="Imagem Principal" 
                  size="small" 
                  color="primary" 
                  icon={<StarIcon />}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Card>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleCancel}>Cancelar</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          startIcon={<SaveIcon />}
        >
          Salvar Ordem
        </Button>
      </DialogActions>
    </Dialog>
  );
};
