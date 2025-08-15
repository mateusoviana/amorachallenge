import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  toggleUserType: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular verificação de token salvo
    const savedUser = localStorage.getItem('amora_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('amora_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Buscar usuário no Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error || !data) {
        return false;
      }
      
      const user: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        password: '',
        userType: data.user_type,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
      
      setUser(user);
      localStorage.setItem('amora_user', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('amora_user');
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          name: userData.name,
          email: userData.email,
          user_type: userData.userType,
        })
        .select()
        .single();
      
      if (error || !data) {
        return false;
      }
      
      const newUser: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        password: '',
        userType: data.user_type,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
      
      setUser(newUser);
      localStorage.setItem('amora_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleUserType = async () => {
    if (user) {
      const newUserType = user.userType === 'buyer' ? 'realtor' : 'buyer';
      
      const { error } = await supabase
        .from('users')
        .update({ user_type: newUserType })
        .eq('id', user.id);
      
      if (!error) {
        const updatedUser: User = {
          ...user,
          userType: newUserType,
          updatedAt: new Date(),
        };
        setUser(updatedUser);
        localStorage.setItem('amora_user', JSON.stringify(updatedUser));
      }
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    toggleUserType,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};