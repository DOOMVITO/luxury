
import { useState } from 'react';
import { generateWhatsAppLink } from '@/utils/whatsapp';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import ProductDetailModal from './ProductDetailModal';

interface ProductCardProps {
  product: any;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const whatsappLink = generateWhatsAppLink(product.name, 0);
    window.open(whatsappLink, '_blank');
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <div 
        className="group bg-card rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 hover:shadow-lg gold-shadow transition-all duration-300 hover-scale cursor-pointer relative"
        onClick={handleCardClick}
      >
        {/* Efeito de brilho dourado no hover */}
        <div className="absolute inset-0 gold-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        
        <div className="aspect-square overflow-hidden bg-muted relative">
          <img
            src={product.product_images?.[0]?.image_url || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Overlay dourado no hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="p-6 space-y-4 relative z-10">
          <div className="space-y-2">
            <h3 className="font-playfair text-lg font-semibold text-foreground group-hover:gold-text transition-all duration-300">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-muted-foreground text-sm line-clamp-2">
                {product.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/50">
              {product.categories?.name || 'Sem categoria'}
            </span>
          </div>
          
          <Button 
            onClick={handleWhatsAppClick}
            className="w-full bg-green-600 hover:bg-green-700 text-white relative overflow-hidden group/btn"
            size="lg"
          >
            <span className="relative z-10 flex items-center justify-center">
              <MessageCircle className="mr-2 h-4 w-4" />
              Consultar no WhatsApp
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500"></div>
          </Button>
        </div>
      </div>

      <ProductDetailModal
        product={product}
        open={showModal}
        onOpenChange={setShowModal}
      />
    </>
  );
};

export default ProductCard;
