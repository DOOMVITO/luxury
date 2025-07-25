
-- Adicionar coluna cover_image à tabela categories
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS cover_image TEXT;

-- Atualizar categorias existentes com imagens placeholder
UPDATE public.categories
SET cover_image = '/placeholder.svg'
WHERE cover_image IS NULL;
