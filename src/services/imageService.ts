import { supabase } from '../lib/supabase';

export class ImageService {
  private static readonly BUCKET_NAME = 'apartment-images';

  static async uploadImage(file: File, apartmentId?: string): Promise<string> {
    try {
      console.log('Iniciando upload:', { fileName: file.name, fileSize: file.size, fileType: file.type });
      
      // Validar arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Arquivo deve ser uma imagem');
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('Arquivo muito grande (máximo 5MB)');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${apartmentId || Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      console.log('Nome do arquivo gerado:', fileName);
      
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, file);

      console.log('Resposta do upload:', { data, error });

      if (error) {
        console.error('Erro detalhado do Supabase:', error);
        throw new Error(`Erro no upload: ${error.message}`);
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

  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      const fileName = imageUrl.split('/').pop();
      if (!fileName) return;

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([fileName]);

      if (error) {
        console.error('Erro ao deletar imagem:', error);
      }
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
    }
  }
}