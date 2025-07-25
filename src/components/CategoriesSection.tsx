
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategories';
import { Skeleton } from '@/components/ui/skeleton';
import { Database } from '@/types/database';

type Category = Database['public']['Tables']['categories']['Row'] & {
  cover_image?: string | null;
};

const CategoriesSection = () => {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground">
              Nossas Categorias
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore nossa coleção organizada por categoria. Cada seção oferece 
              peças únicas criadas com paixão e dedicação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground">
              Nossas Categorias
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore nossa coleção organizada por categoria. Cada seção oferece 
              peças únicas criadas com paixão e dedicação.
            </p>
          </div>

          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhuma categoria encontrada.
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              As categorias serão exibidas aqui quando adicionadas pelo administrador.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground">
            Nossas Categorias
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore nossa coleção organizada por categoria. Cada seção oferece 
            peças únicas criadas com paixão e dedicação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories?.map((category: Category) => (
            <Link
              key={category.id}
              to={`/categoria/${category.slug}`}
              className="group"
            >
              <div className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300 hover-scale">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={category.cover_image || '/placeholder.svg'}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6 text-center space-y-3">
                  <h3 className="text-xl font-playfair font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {category.description}
                  </p>
                  <Button variant="outline" className="mt-4">
                    Explorar
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
