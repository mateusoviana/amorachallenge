-- Execute estes comandos no SQL Editor do Supabase

-- 1. Criar o bucket apartment-images (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('apartment-images', 'apartment-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Políticas para o bucket (sem autenticação)
CREATE POLICY "Qualquer um pode fazer upload de imagens" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'apartment-images'
);

CREATE POLICY "Imagens são públicas para visualização" ON storage.objects
FOR SELECT USING (
  bucket_id = 'apartment-images'
);

CREATE POLICY "Qualquer um pode atualizar imagens" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'apartment-images'
);

CREATE POLICY "Qualquer um pode deletar imagens" ON storage.objects
FOR DELETE USING (
  bucket_id = 'apartment-images'
);