
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const { toast } = useToast();

  const isAdmin = profile?.is_admin || false;

  useEffect(() => {
    console.log('Auth: Initializing auth state...');
    
    let mounted = true;

    // Listen for auth changes first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth: State change event:', event, session?.user?.email || 'No user');
      
      if (!mounted) return;
      
      setUser(session?.user ?? null);
      
      if (session?.user && event !== 'SIGNED_OUT') {
        // Use setTimeout to avoid blocking the auth state change
        setTimeout(() => {
          if (mounted) {
            fetchProfile(session.user.id);
          }
        }, 0);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth: Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }
        
        console.log('Auth: Initial session:', session?.user?.email || 'No user');
        
        if (mounted) {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            fetchProfile(session.user.id);
          } else {
            setProfile(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Auth: Error initializing:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    if (profileLoading) return; // Prevent multiple simultaneous requests
    
    try {
      console.log('Auth: Fetching profile for user:', userId);
      setProfileLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Auth: Error fetching profile:', error);
        
        // Only try to create profile if it doesn't exist
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userId,
                email: user?.email || '',
                full_name: user?.user_metadata?.full_name || user?.email || '',
                is_admin: false
              }
            ])
            .select()
            .single();
            
          if (createError) {
            console.error('Auth: Error creating profile:', createError);
            setProfile(null);
          } else {
            console.log('Auth: Profile created:', newProfile);
            setProfile(newProfile);
          }
        } else {
          setProfile(null);
        }
      } else {
        console.log('Auth: Profile fetched:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Auth: Error in fetchProfile:', error);
      setProfile(null);
    } finally {
      console.log('Auth: Setting loading to false');
      setProfileLoading(false);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Auth: Attempting to sign in with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Auth: Sign in error:', error);
        throw error;
      }
      
      console.log('Auth: Sign in successful:', data.user?.email);

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta.",
      });
    } catch (error: any) {
      console.error('Auth: Sign in failed:', error);
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      console.log('Auth: Attempting to sign up with:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('Auth: Sign up error:', error);
        throw error;
      }
      
      console.log('Auth: Sign up successful:', data.user?.email);

      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar a conta.",
      });
    } catch (error: any) {
      console.error('Auth: Sign up failed:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Auth: Signing out...');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      console.log('Auth: Sign out successful');
      
      toast({
        title: "Logout realizado com sucesso!",
        description: "Até a próxima.",
      });
    } catch (error: any) {
      console.error('Auth: Sign out failed:', error);
      toast({
        title: "Erro no logout",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    profile,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
