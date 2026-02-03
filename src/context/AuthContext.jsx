import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email, password) => {
    try {
      const data = await api.auth.login(email, password);
      // data: { accessToken, refreshToken, role }
      
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      localStorage.setItem('user_role', data.role);
      
      const userData = {
        email: email, 
        role: data.role
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Credențiale invalide' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
  };

  // Check for existing session
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    
    if (accessToken && role) {
      setUser({ role }); 
      setIsAuthenticated(true);
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
