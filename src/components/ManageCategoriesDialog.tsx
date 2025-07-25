
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCategories, useCreateCategory, useDeleteCategory } from '@/hooks/useCategories';
import { Edit, Trash2, Plus } from 'lucide-react';
import EditCategoryDialog from './EditCategoryDialog';
import { Database } from '@/types/database';

type Category = Database['public']['Tables']['categories']['Row'];

interface ManageCategoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ManageCategoriesDialog = ({ open, onOpenChange }: ManageCategoriesDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const { data: categories } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    createCategory.mutate({
      name,
      description,
      slug,
      cover_image: coverImage || null,
    } as any, {
      onSuccess: () => {
        setName('');
        setDescription('');
        setCoverImage('');
      },
    });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowEditDialog(true);
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      deleteCategory.mutate(categoryId);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Categorias</DialogTitle>
            <DialogDescription>
              Adicione, edite ou remova categorias de produtos
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form para criar nova categoria */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Nova Categoria
                </CardTitle>
                <CardDescription>
                  Adicione uma nova categoria de produtos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome da Categoria</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Anéis"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descrição da categoria..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="coverImage">URL da Imagem de Capa</Label>
                    <Input
                      id="coverImage"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://exemplo.com/imagem.jpg"
                      type="url"
                    />
                  </div>

                  <Button type="submit" disabled={createCategory.isPending} className="w-full">
                    {createCategory.isPending ? 'Criando...' : 'Criar Categoria'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Lista de categorias existentes */}
            <Card>
              <CardHeader>
                <CardTitle>Categorias Existentes</CardTitle>
                <CardDescription>
                  {categories?.length || 0} categorias cadastradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {categories?.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{category.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {category.slug}
                          </Badge>
                        </div>
                        {category.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {category.description}
                          </p>
                        )}
                        {(category as any).cover_image && (
                          <div className="mt-2">
                            <img
                              src={(category as any).cover_image}
                              alt={category.name}
                              className="w-16 h-16 object-cover rounded border"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(category.id)}
                          disabled={deleteCategory.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {!categories?.length && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhuma categoria encontrada.</p>
                      <p className="text-sm">Crie sua primeira categoria!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <EditCategoryDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        category={editingCategory}
      />
    </>
  );
};

export default ManageCategoriesDialog;
