
import { useParams, Link } from 'react-router-dom';
import { useProductsByCategory } from '@/hooks/useProducts';
import { useCategory } from '@/hooks/useCategories';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const CategoryPage = () => {
  const { category } = useParams();
  
  const { data: categoryInfo, isLoading: categoryLoading } = useCategory(category || '');
  const { data: products, isLoading: productsLoading } = useProductsByCategory(category || '');

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-16 w-full max-w-2xl mx-auto mb-16" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Início</Link>
          <span>/</span>
          <span className="text-foreground">{categoryInfo?.name || category}</span>
        </div>

        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao início
        </Link>

        {/* Category Header */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-5xl font-playfair font-bold text-foreground">
            {categoryInfo?.name || category}
          </h1>
          {categoryInfo?.description && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {categoryInfo.description}
            </p>
          )}
          <div className="text-sm text-muted-foreground">
            {products?.length || 0} produto(s) encontrado(s)
          </div>
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="animate-fade-in">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
              Nenhum produto encontrado
            </h2>
            <p className="text-muted-foreground">
              Esta categoria ainda não possui produtos cadastrados.
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
