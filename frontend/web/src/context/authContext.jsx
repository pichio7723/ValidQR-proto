import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión al iniciar
    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          // Validar token obteniendo el usuario
          const response = await api.get('/usuarios/me');
          setUser(response.data);
        } catch (error) {
          // Token inválido o expirado
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}