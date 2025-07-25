
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { formatPrice } from '@/utils/whatsapp';
import { useAuth } from '@/hooks/useAuth';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import ThemeToggle from '@/components/ThemeToggle';
import { 
  ShoppingBag, 
  Package, 
  Tag, 
  TrendingUp, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Upload
} from 'lucide-react';
import BulkUploadDialog from '@/components/BulkUploadDialog';
import AddProductForm from '@/components/AddProductForm';
import ManageCategoriesDialog from '@/components/ManageCategoriesDialog';
import EditProductDialog from '@/components/EditProductDialog';

const AdminDashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const deleteProduct = useDeleteProduct();
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showManageCategories, setShowManageCategories] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleLogout = async () => {
    await signOut();
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setShowEditProduct(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    deleteProduct.mutate(productId);
  };

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const featuredProducts = products.filter(p => p.featured).length;
  const totalValue = products.reduce((sum, product) => sum + (product.price || 0), 0);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass-effect">
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Acesso negado. Apenas administradores podem acessar esta página.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-background/95 pointer-events-none"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-transparent via-gold-start/3 to-gold-end/5 pointer-events-none"></div>
      
      {/* Header */}
      <header className="relative z-10 glass-effect border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <ShoppingBag className="h-8 w-8 text-primary" />
                <div className="absolute inset-0 h-8 w-8 bg-gold-gradient opacity-20 rounded blur-sm"></div>
              </div>
              <span className="text-2xl font-playfair font-bold gold-text">CONTATUS JOIAS</span>
              <Badge variant="outline" className="border-gold-start/50 text-gold-start">Admin</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Olá, {user?.email}
              </span>
              <ThemeToggle />
              <Link to="/">
                <Button variant="outline" size="sm" className="border-border/50 hover:border-gold-start/50">
                  Ver Site
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-border/50 hover:border-destructive/50">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome */}
          <div>
            <h1 className="text-4xl font-playfair font-bold text-foreground mb-2">
              Painel <span className="gold-text">Administrativo</span>
            </h1>
            <p className="text-muted-foreground">
              Gerencie produtos, categorias e acompanhe o desempenho da loja.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-effect border-border/50 hover:border-gold-start/30 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground group-hover:text-gold-start transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold gold-text">{totalProducts}</div>
                <p className="text-xs text-muted-foreground">produtos cadastrados</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50 hover:border-gold-start/30 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categorias</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground group-hover:text-gold-start transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold gold-text">{totalCategories}</div>
                <p className="text-xs text-muted-foreground">categorias ativas</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50 hover:border-gold-start/30 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos em Destaque</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-gold-start transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold gold-text">{featuredProducts}</div>
                <p className="text-xs text-muted-foreground">produtos destacados</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50 hover:border-gold-start/30 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-gold-start transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold gold-text">{formatPrice(totalValue)}</div>
                <p className="text-xs text-muted-foreground">valor do estoque</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Gerencie rapidamente produtos e categorias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  className="h-20 flex flex-col space-y-2 gold-gradient hover:opacity-90 text-black font-semibold"
                  onClick={() => setShowAddProduct(true)}
                >
                  <Plus className="h-6 w-6" />
                  <span>Adicionar Produto</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col space-y-2 border-border/50 hover:border-gold-start/50 hover:bg-gold-start/10"
                  onClick={() => setShowBulkUpload(true)}
                >
                  <Upload className="h-6 w-6" />
                  <span>Upload em Massa</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col space-y-2 border-border/50 hover:border-gold-start/50 hover:bg-gold-start/10"
                  onClick={() => setShowManageCategories(true)}
                >
                  <Tag className="h-6 w-6" />
                  <span>Gerenciar Categorias</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Products */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle>Produtos Recentes</CardTitle>
              <CardDescription>
                Últimos produtos adicionados ao catálogo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border border-border/30 rounded-lg glass-effect hover:border-gold-start/30 transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.product_images[0]?.image_url || '/placeholder.svg'}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover border border-border/30"
                      />
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs border-border/50">
                            {product.categories?.name || 'Sem categoria'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {product.price ? formatPrice(product.price) : 'Consultar preço'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-border/50 hover:border-gold-start/50"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="border-border/50 hover:border-destructive/50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Produto</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o produto "{product.name}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BulkUploadDialog 
        open={showBulkUpload}
        onOpenChange={setShowBulkUpload}
      />

      <AddProductForm
        open={showAddProduct}
        onOpenChange={setShowAddProduct}
      />

      <ManageCategoriesDialog
        open={showManageCategories}
        onOpenChange={setShowManageCategories}
      />

      <EditProductDialog
        open={showEditProduct}
        onOpenChange={setShowEditProduct}
        product={selectedProduct}
      />
    </div>
  );
};

export default AdminDashboard;
