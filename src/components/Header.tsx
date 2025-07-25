
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, isAdmin, signOut, loading } = useAuth();
  const { data: categories = [] } = useCategories();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="bg-background border-b border-border/50 sticky top-0 z-50 glass-effect">
      {/* Borda dourada superior */}
      <div className="h-1 gold-gradient"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="/lovable-uploads/b165b102-dd18-4ec5-9a48-aaf0f105fe61.png" 
                alt="CONTATUS JOIAS" 
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 gold-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="relative text-foreground hover:text-primary transition-all duration-300 font-medium group"
            >
              <span className="relative z-10">Início</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 gold-gradient group-hover:w-full transition-all duration-300"></div>
              <div className="absolute inset-0 scale-0 group-hover:scale-100 transition-transform duration-200 bg-primary/5 rounded-md -z-10"></div>
            </Link>
            
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categoria/${category.slug}`}
                className="relative text-foreground hover:text-primary transition-all duration-300 font-medium group"
              >
                <span className="relative z-10">{category.name}</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 gold-gradient group-hover:w-full transition-all duration-300"></div>
                <div className="absolute inset-0 scale-0 group-hover:scale-100 transition-transform duration-200 bg-primary/5 rounded-md -z-10"></div>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <Link to="/admin/dashboard">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2 border-border/50 hover:border-primary/50 hover:gold-shadow transition-all duration-300">
                      <Settings className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2 border-border/50 hover:border-primary/50 hover:gold-shadow transition-all duration-300">
                      <User className="h-4 w-4" />
                      <span className="max-w-24 truncate">{profile?.full_name || user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{profile?.full_name || 'Usuário'}</span>
                        <span className="text-xs text-muted-foreground truncate w-full">{user.email}</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="flex items-center space-x-2 border-border/50 hover:border-primary/50 hover:gold-shadow transition-all duration-300">
                  <User className="h-4 w-4" />
                  <span>Entrar</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="absolute inset-0 scale-0 group-hover:scale-100 transition-transform duration-200 bg-primary/10 rounded-md"></div>
            {isMenuOpen ? (
              <X className="h-6 w-6 relative z-10 transition-transform duration-200" />
            ) : (
              <Menu className="h-6 w-6 relative z-10 transition-transform duration-200" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in border-t border-border/30">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2 px-2 rounded-md hover:bg-primary/5"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categoria/${category.slug}`}
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2 px-2 rounded-md hover:bg-primary/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              
              <div className="border-t border-border/30 pt-4">
                {user ? (
                  <div className="space-y-2">
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200 font-medium py-2 px-2 rounded-md hover:bg-primary/5"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-destructive hover:text-destructive transition-colors duration-200 font-medium py-2 px-2 rounded-md hover:bg-destructive/5 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sair</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200 font-medium py-2 px-2 rounded-md hover:bg-primary/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Entrar</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
