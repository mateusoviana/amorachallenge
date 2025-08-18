import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Typography,
  Alert,
  Paper,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Image as ImageIcon,
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { ImageService, UploadProgress } from '../../services/imageService';
import { ImageManager } from './ImageManager';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  apartmentId?: string;
  isEditing?: boolean;
}

interface FileUploadProgress {
  [key: string]: UploadProgress;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  apartmentId,
  isEditing = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showManagerDialog, setShowManagerDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleFiles = useCallback(async (files: FileList) => {
    const imageFiles = Array.from(files);

    if (imageFiles.length === 0) {
      setError('Nenhum arquivo selecionado');
      return;
    }

    // Validar arquivos
    const invalidFiles: string[] = [];
    imageFiles.forEach(file => {
      const validation = ImageService.validateFile(file);
      if (!validation.isValid) {
        invalidFiles.push(`${file.name}: ${validation.error}`);
      }
    });

    if (invalidFiles.length > 0) {
      setError(`Arquivos inválidos:\n${invalidFiles.join('\n')}`);
      return;
    }

    if (images.length + imageFiles.length > maxImages) {
      setError(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = imageFiles.map(async (file) => {
        const fileId = `${file.name}-${Date.now()}`;
        
        // Inicializar progresso
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: { loaded: 0, total: file.size, percentage: 0 }
        }));

        try {
          const url = await ImageService.uploadImage(file, {
            apartmentId,
            onProgress: (progress) => {
              setUploadProgress(prev => ({
                ...prev,
                [fileId]: progress
              }));
            }
          });

          return url;
        } catch (err) {
          // Remover progresso em caso de erro
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
          throw err;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...uploadedUrls]);
    } catch (err: any) {
      console.error('Erro detalhado no upload:', err);
      setError(`Erro no upload: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  }, [images, maxImages, apartmentId, onImagesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    await handleFiles(files);
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index];
    try {
      await ImageService.deleteImage(imageUrl);
      onImagesChange(images.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Erro ao remover imagem:', err);
      // Remover da lista mesmo se falhar no servidor
      onImagesChange(images.filter((_, i) => i !== index));
    }
  };

  const handleAddImageUrl = () => {
    const imageUrl = prompt('Digite a URL da imagem:');
    if (imageUrl && images.length < maxImages) {
      // Validar URL
      try {
        new URL(imageUrl);
        onImagesChange([...images, imageUrl]);
      } catch {
        setError('URL inválida');
      }
    }
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setShowImageDialog(true);
  };

  const handleManageImages = (newOrder: string[]) => {
    onImagesChange(newOrder);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return 'error';
    if (percentage < 70) return 'warning';
    return 'success';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ImageIcon color="primary" />
        Galeria de Imagens ({images.length}/{maxImages})
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Área de Drag & Drop */}
      <Paper
        ref={dropZoneRef}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'grey.300',
          backgroundColor: dragActive ? 'primary.50' : 'grey.50',
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          mb: 3,
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'primary.50',
          },
        }}
        onClick={openFileDialog}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {dragActive ? 'Solte as imagens aqui' : 'Arraste e solte imagens aqui'}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          ou clique para selecionar arquivos
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Suporta: JPG, PNG, GIF, WEBP (máx. 5MB cada)
        </Typography>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleAddImageUrl();
            }}
            disabled={images.length >= maxImages}
          >
            Adicionar URL
          </Button>
        </Box>
      </Paper>

      {/* Input de arquivo oculto */}
      <input
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        multiple
        type="file"
        onChange={handleFileUpload}
        disabled={uploading || images.length >= maxImages}
      />

      {/* Progresso de Upload */}
      {Object.keys(uploadProgress).length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Enviando imagens...
          </Typography>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <Box key={fileId} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption">{fileId.split('-')[0]}</Typography>
                <Typography variant="caption">
                  {ImageService.formatFileSize(progress.loaded)} / {ImageService.formatFileSize(progress.total)} ({progress.percentage}%)
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progress.percentage}
                color={getProgressColor(progress.percentage) as any}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Grid de Imagens */}
      {images.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Imagens ({images.length})
            </Typography>
            {isEditing && (
              <Chip 
                icon={<SettingsIcon />} 
                label="Gerenciar" 
                variant="outlined" 
                size="small"
                sx={{ cursor: 'pointer' }}
                onClick={() => setShowManagerDialog(true)}
              />
            )}
          </Box>
          
          <Grid container spacing={2}>
            {images.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card 
                  sx={{ 
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      '& .image-actions': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={image}
                    alt={`Imagem ${index + 1}`}
                    sx={{ objectFit: 'cover' }}
                    onClick={() => handleImageClick(image)}
                  />
                  
                  {/* Overlay com ações */}
                  <Box
                    className="image-actions"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageClick(image);
                        }}
                        sx={{ backgroundColor: 'white' }}
                      >
                        <ZoomInIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                        sx={{ backgroundColor: 'white' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

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
        </Box>
      )}

      {/* Dialog para visualização da imagem */}
      <Dialog
        open={showImageDialog}
        onClose={() => setShowImageDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>Visualizar Imagem</Typography>
            <IconButton onClick={() => setShowImageDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedImage && (
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={selectedImage}
                alt="Imagem selecionada"
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImageDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para gerenciamento de imagens */}
      <ImageManager
        open={showManagerDialog}
        onClose={() => setShowManagerDialog(false)}
        images={images}
        onSave={handleManageImages}
      />
    </Box>
  );
};
