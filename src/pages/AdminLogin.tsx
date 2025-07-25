
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ThemeToggle from '@/components/ThemeToggle';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const { signIn, user, isAdmin, loading } = useAuth();

  // Handle redirect after authentication
  useEffect(() => {
    console.log('AdminLogin: Auth state check:', { 
      user: !!user, 
      isAdmin, 
      loading, 
      redirecting 
    });
    
    // Wait for auth to finish loading
    if (loading || redirecting) {
      return;
    }

    // If user is authenticated, redirect appropriately
    if (user) {
      setRedirecting(true);
      
      // Small delay to ensure profile is loaded
      const timer = setTimeout(() => {
        if (isAdmin) {
          console.log('AdminLogin: Redirecting admin to dashboard');
          navigate('/admin/dashboard', { replace: true });
        } else {
          console.log('AdminLogin: Redirecting user to home');
          navigate('/', { replace: true });
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [user, isAdmin, loading, navigate, redirecting]);

  // Show loading while checking authentication or redirecting
  if (loading || (user && redirecting)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin gold-text mx-auto" />
          <p className="mt-2 text-muted-foreground">
            {loading ? 'Verificando autenticação...' : 'Redirecionando...'}
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('AdminLogin: Attempting login with:', email);
      await signIn(email, password);
      console.log('AdminLogin: Login successful');
    } catch (error) {
      console.error('AdminLogin: Login error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/80"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold-start/5 to-gold-end/10"></div>
      
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md relative z-10 glass-effect border-border/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <ShoppingBag className="h-8 w-8 text-primary" />
                <div className="absolute inset-0 h-8 w-8 bg-gold-gradient opacity-20 rounded blur-sm"></div>
              </div>
              <span className="text-2xl font-playfair font-bold gold-text">CONTATUS JOIAS</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Área Restrita</CardTitle>
          <CardDescription>
            Faça login para acessar o sistema
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="border-border/50 focus:border-gold-start/50 transition-colors"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="border-border/50 focus:border-gold-start/50 transition-colors"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-gold-start/10"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full gold-gradient hover:opacity-90 transition-opacity text-black font-semibold" 
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-gold-start hover:text-gold-end transition-colors font-medium">
                Criar conta
              </Link>
            </p>
            <div className="mt-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                ← Voltar ao site
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
