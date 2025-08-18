import { supabase } from '../lib/supabase';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  apartmentId?: string;
}

export class ImageService {
  private static readonly BUCKET_NAME = 'apartment-images';
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  static validateFile(file: File): { isValid: boolean; error?: string } {
    // Verificar tipo de arquivo
    if (!this.ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      return {
        isValid: false,
        error: `Tipo de arquivo não suportado. Tipos permitidos: ${this.ALLOWED_TYPES.join(', ')}`
      };
    }

    // Verificar tamanho do arquivo
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `Arquivo muito grande. Tamanho máximo: ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`
      };
    }

    // Verificar se é realmente uma imagem
    if (!file.type.startsWith('image/')) {
      return {
        isValid: false,
        error: 'Arquivo deve ser uma imagem válida'
      };
    }

    return { isValid: true };
  }

  static async uploadImage(file: File, options: UploadOptions = {}): Promise<string> {
    try {
      console.log('Iniciando upload:', { 
        fileName: file.name, 
        fileSize: file.size, 
        fileType: file.type 
      });
      
      // Validar arquivo
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = `${options.apartmentId || 'temp'}_${timestamp}_${randomId}.${fileExt}`;
      
      console.log('Nome do arquivo gerado:', fileName);
      
      // Simular progresso de upload (já que Supabase não fornece progresso nativo)
      if (options.onProgress) {
        const simulateProgress = () => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 90) {
              clearInterval(interval);
              progress = 90;
            }
            options.onProgress!({
              loaded: (progress / 100) * file.size,
              total: file.size,
              percentage: Math.round(progress)
            });
          }, 100);
          return interval;
        };
        
        simulateProgress();
      }
      
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      console.log('Resposta do upload:', { data, error });

      if (error) {
        console.error('Erro detalhado do Supabase:', error);
        throw new Error(`Erro no upload: ${error.message}`);
      }

      // Notificar progresso final
      if (options.onProgress) {
        options.onProgress({
          loaded: file.size,
          total: file.size,
          percentage: 100
        });
      }

      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fileName);

      console.log('URL pública gerada:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  }

  static async uploadMultipleImages(
    files: File[], 
    options: UploadOptions = {}
  ): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, options));
    return Promise.all(uploadPromises);
  }

  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      const fileName = imageUrl.split('/').pop();
      if (!fileName) {
        console.warn('Não foi possível extrair o nome do arquivo da URL:', imageUrl);
        return;
      }

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([fileName]);

      if (error) {
        console.error('Erro ao deletar imagem:', error);
        throw new Error(`Erro ao deletar imagem: ${error.message}`);
      }

      console.log('Imagem deletada com sucesso:', fileName);
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      throw error;
    }
  }

  static async deleteMultipleImages(imageUrls: string[]): Promise<void> {
    const deletePromises = imageUrls.map(url => this.deleteImage(url));
    await Promise.all(deletePromises);
  }

  static getImageInfo(imageUrl: string): { fileName: string; fileSize?: number } {
    const fileName = imageUrl.split('/').pop() || '';
    return { fileName };
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}