
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { generateWhatsAppLink } from '@/utils/whatsapp';
import { MessageCircle } from 'lucide-react';

interface ProductDetailModalProps {
  product: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductDetailModal = ({ product, open, onOpenChange }: ProductDetailModalProps) => {
  if (!product) return null;

  const handleWhatsAppClick = () => {
    const whatsappLink = generateWhatsAppLink(product.name, 0);
    window.open(whatsappLink, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-playfair gold-text">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Imagem do Produto - lado esquerdo, menor */}
          <div className="aspect-square max-w-sm mx-auto overflow-hidden rounded-lg bg-muted">
            <img
              src={product.product_images?.[0]?.image_url || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Conteúdo - lado direito */}
          <div className="space-y-4">
            {/* Descrição */}
            {product.description && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Descrição</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {product.description}
                </p>
              </div>
            )}

            {/* Categoria */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Categoria:</span>
              <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                {product.categories?.name || 'Sem categoria'}
              </span>
            </div>

            {/* Botão WhatsApp */}
            <Button 
              onClick={handleWhatsAppClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Consultar no WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
