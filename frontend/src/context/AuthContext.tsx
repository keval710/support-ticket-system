import React, { createContext, useContext, useState } from 'react';
import type { AuthContextType, GoogleUser } from '../types';
import loginApiInterceptor from '../services/axiosInstance/login.instance';
import authApiInterceptor from '../services/axiosInstance/auth.instance';
import { toast } from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GoogleUser | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = async (userData: GoogleUser) => {
    try {
      setLoading(true);
      const res = await loginApiInterceptor.post('/api/auth/google', {
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        registrationType: 'google',
        isEmailVerified: userData.email_verified,
        providerId: userData.sub
      });
      localStorage.setItem('user', JSON.stringify({
        ...res.data,
        name: userData.name,
      }));
      setUser(userData);
    } catch (error) {
      toast.error('Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const user = localStorage.getItem('user');
      if (!user) return;
      const userId = JSON.parse(user).userId;
      await authApiInterceptor.post('/api/auth/logout', {
        userId
      });
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      toast.error('Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login: loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};