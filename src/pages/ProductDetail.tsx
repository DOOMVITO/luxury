
import { useParams, Link } from 'react-router-dom';
import { useProduct, useProductsByCategory } from '@/hooks/useProducts';
import { formatPrice, generateWhatsAppLink } from '@/utils/whatsapp';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { ShoppingCart, ArrowLeft, Star } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { data: product, isLoading: productLoading } = useProduct(id || '');
  const { data: relatedProducts, isLoading: relatedLoading } = useProductsByCategory(
    product?.categories?.slug || ''
  );

  if (productLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-96 mb-8" />
          <Skeleton className="h-6 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-8">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-playfair font-bold mb-4">Produto não encontrado</h1>
          <Link to="/">
            <Button>Voltar ao Início</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter related products to exclude current product
  const filteredRelatedProducts = relatedProducts?.filter(p => p.id !== product.id).slice(0, 3) || [];

  const handleWhatsAppClick = () => {
    const price = product.price || 0;
    const whatsappLink = generateWhatsAppLink(product.name, price);
    window.open(whatsappLink, '_blank');
  };

  // Get the first image or use a placeholder
  const productImage = product.product_images?.[0]?.image_url || '/placeholder.svg';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Início</Link>
          <span>/</span>
          {product.categories && (
            <>
              <Link to={`/categoria/${product.categories.slug}`} className="hover:text-primary">
                {product.categories.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para produtos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={productImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              {product.categories && (
                <Badge variant="outline" className="w-fit">
                  {product.categories.name}
                </Badge>
              )}
              
              <h1 className="text-4xl font-playfair font-bold text-foreground">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(12 avaliações)</span>
              </div>
              
              {product.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            <div className="space-y-6">
              <div className="text-4xl font-bold text-primary">
                {product.price ? formatPrice(product.price) : 'Consultar preço'}
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleWhatsAppClick}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Comprar no WhatsApp
                </Button>
                
                <p className="text-sm text-muted-foreground text-center">
                  Envio rápido e seguro • Garantia de qualidade • Atendimento personalizado
                </p>
              </div>
            </div>

            {/* Product Features */}
            <div className="space-y-4 pt-8 border-t border-border">
              <h3 className="text-lg font-semibold">Características</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Material: Ouro 18k certificado</li>
                <li>• Garantia: 2 anos contra defeitos de fabricação</li>
                <li>• Certificado de autenticidade incluso</li>
                <li>• Embalagem premium para presente</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {!relatedLoading && filteredRelatedProducts.length > 0 && (
          <section className="py-12 border-t border-border">
            <h2 className="text-3xl font-playfair font-bold text-center mb-12">
              Produtos Relacionados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredRelatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
