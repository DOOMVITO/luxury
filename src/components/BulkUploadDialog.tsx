
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_DESCRIPTION = `Peças no dourado. 
Folheadas a ouro 18 k
10 milésimos de banho
Pedras de zirconias

Garantia somente para revendedoras.

Para atacadistas.
Compras acima de 500,00 para abrir ficha na loja.
Garantia no banho e nas pedras que soltarem.
Garantia se estende em tempo de compra com a loja.
Dividimos no cartão em até 6x sem juros. 
Desconto de 10% a vista.
Trocamos as peças que não venderem.`;

const BulkUploadDialog = ({ open, onOpenChange }: BulkUploadDialogProps) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { data: categories } = useCategories();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFileToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Erro no upload: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleUpload = async () => {
    if (!selectedCategory || selectedFiles.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione uma categoria e pelo menos uma imagem",
        variant: "destructive",
      });
      return;
    }

    const selectedCat = categories?.find(cat => cat.id === selectedCategory);
    if (!selectedCat) {
      toast({
        title: "Erro",
        description: "Categoria não encontrada",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    try {
      console.log('Iniciando upload de', selectedFiles.length, 'arquivos...');
      
      const uploadPromises = selectedFiles.map(async (file, index) => {
        try {
          console.log(`Fazendo upload do arquivo ${index + 1}:`, file.name);
          
          // Upload da imagem para o Supabase Storage
          const imageUrl = await uploadFileToSupabase(file);
          console.log(`Upload concluído para ${file.name}, URL:`, imageUrl);

          // Criar produto
          const { data: product, error: productError } = await supabase
            .from('products')
            .insert({
              name: selectedCat.name, // Nome da categoria
              description: DEFAULT_DESCRIPTION,
              category_id: selectedCategory,
              price: null, // Para "Consultar preço"
              active: true,
              featured: false,
            })
            .select()
            .single();

          if (productError) {
            console.error('Erro ao criar produto:', productError);
            throw productError;
          }

          console.log('Produto criado:', product);

          // Criar imagem do produto
          const { error: imageError } = await supabase
            .from('product_images')
            .insert({
              product_id: product.id,
              image_url: imageUrl,
              display_order: 0,
            });

          if (imageError) {
            console.error('Erro ao criar imagem do produto:', imageError);
            throw imageError;
          }

          console.log(`Produto ${index + 1} criado com sucesso`);
          return product;
        } catch (error) {
          console.error(`Erro no produto ${index + 1}:`, error);
          throw error;
        }
      });

      const products = await Promise.all(uploadPromises);

      // Invalidar cache dos produtos
      queryClient.invalidateQueries({ queryKey: ['products'] });

      toast({
        title: "Sucesso!",
        description: `${products.length} produtos criados com sucesso na categoria "${selectedCat.name}"`,
      });

      // Reset form
      setSelectedCategory('');
      setSelectedFiles([]);
      onOpenChange(false);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Erro desconhecido durante o upload",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload em Massa de Produtos</DialogTitle>
          <DialogDescription>
            Faça upload de múltiplas imagens para criar produtos automaticamente. Os produtos terão o nome da categoria selecionada.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="images">Imagens dos Produtos</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="mt-4">
                  <Label htmlFor="images" className="cursor-pointer">
                    <span className="text-sm font-medium text-primary hover:text-primary/80">
                      Clique para selecionar imagens
                    </span>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, JPEG até 10MB cada
                  </p>
                </div>
              </div>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div>
              <Label>Imagens Selecionadas ({selectedFiles.length})</Label>
              <div className="grid grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-muted/50 p-4 rounded-lg">
            <Label className="text-sm font-medium">Descrição padrão dos produtos:</Label>
            <div className="mt-2 text-xs text-muted-foreground whitespace-pre-line">
              {DEFAULT_DESCRIPTION}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Criando Produtos...' : 'Criar Produtos'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadDialog;
