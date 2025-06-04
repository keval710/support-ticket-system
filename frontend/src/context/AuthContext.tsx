import React, { createContext, useContext, useState } from 'react';
import AuthService from '../services/auth.api';

interface GoogleUser {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  hd: string;
  name: string;
  picture: string;
  sub: string; // This is usually the Google user ID
}


interface AuthContextType {
  user: GoogleUser | null;
  login: (userData: GoogleUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GoogleUser | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const loginWithGoogle = async (userData: GoogleUser) => {
    try {
      const res = await AuthService.post('/api/auth/google', {
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
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login: loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};