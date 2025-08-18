import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Card,
  CardMedia,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Photo as PhotoIcon,
} from '@mui/icons-material';
import { ImageManager } from '../../components/ImageUpload/ImageManager';
import { apartmentService } from '../../services/apartmentService';
import { Apartment } from '../../types';

interface ImageEditorProps {
  apartment: Apartment;
  onUpdate: (apartment: Apartment) => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  apartment,
  onUpdate,
}) => {
  const [showManager, setShowManager] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveImages = async (newImages: string[]) => {
    setSaving(true);
    setError(null);

    try {
      const updatedApartment = await apartmentService.updateApartment(apartment.id, {
        ...apartment,
        images: newImages,
      });

      if (updatedApartment) {
        onUpdate(updatedApartment);
      }
    } catch (err: any) {
      setError(`Erro ao salvar imagens: ${err.message}`);
      console.error('Erro ao atualizar imagens:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhotoIcon color="primary" />
          Galeria de Imagens ({apartment.images.length})
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => setShowManager(true)}
          disabled={apartment.images.length === 0}
        >
          Editar Imagens
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {apartment.images.length === 0 ? (
        <Alert severity="info">
          Este apartamento ainda não possui imagens. Adicione imagens para melhorar a apresentação.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {apartment.images.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={image}
                  alt={`${apartment.title} - Imagem ${index + 1}`}
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
      )}

      {/* Dialog de gerenciamento de imagens */}
      <ImageManager
        open={showManager}
        onClose={() => setShowManager(false)}
        images={apartment.images}
        onSave={handleSaveImages}
      />

      {/* Dialog de confirmação de salvamento */}
      <Dialog open={saving} maxWidth="sm" fullWidth>
        <DialogTitle>Salvando Alterações</DialogTitle>
        <DialogContent>
          <Typography>
            Salvando as alterações nas imagens. Por favor, aguarde...
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
