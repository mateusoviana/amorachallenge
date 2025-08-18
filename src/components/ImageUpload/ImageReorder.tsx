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
} from '@mui/material';
import {
  DragIndicator as DragIndicatorIcon,
  Close as CloseIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

interface ImageReorderProps {
  open: boolean;
  onClose: () => void;
  images: string[];
  onReorder: (newOrder: string[]) => void;
}

export const ImageReorder: React.FC<ImageReorderProps> = ({
  open,
  onClose,
  images,
  onReorder,
}) => {
  const [reorderedImages, setReorderedImages] = useState<string[]>(images);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = () => {
    onReorder(reorderedImages);
    onClose();
  };

  const handleCancel = () => {
    setReorderedImages(images);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Reordenar Imagens</Typography>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Arraste as imagens para reordená-las. A primeira imagem será a imagem principal.
        </Typography>
        
        <Grid container spacing={2}>
          {reorderedImages.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                  '&:hover': {
                    transform: draggedIndex === index ? 'scale(0.95)' : 'scale(1.02)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="150"
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
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {index + 1}
                </Box>

                {/* Ícone de arrastar */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DragIndicatorIcon sx={{ fontSize: 16 }} />
                </Box>

                {/* Indicador de imagem principal */}
                {index === 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}
                  >
                    Principal
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
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
