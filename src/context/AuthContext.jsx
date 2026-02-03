import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const data = await api.auth.login(email, password);
      // data: { accessToken, refreshToken, role }
      
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      localStorage.setItem('user_role', data.role);
      
      try {
        const profile = await api.auth.getProfile();
        setUser({
           ...profile,
           role: data.role
        }); 
      } catch (e) {
        console.error("Failed to fetch profile on login", e);
        const userData = {
          email: email, 
          role: data.role
        };
        setUser(userData);
      }
      
      setIsAuthenticated(true);
      return { success: true, role: data.role };
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
    navigate('/login');
  };

  // Check for existing session
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('access_token');
      
      if (accessToken) {
        try {
          const profile = await api.auth.getProfile();
          setUser({
             ...profile,
             role: profile.role // Ensure role is top level if needed, though DTO has it
          }); 
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to fetch profile", error);
          // If fetch fails (even after refresh retry), maybe clear session?
          // But api.js might have already cleared it if refresh failed.
          if (!localStorage.getItem('access_token')) {
             logout();
          }
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
