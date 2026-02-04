import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData, clearUserData, fetchUserProfile } from '../store/slices/authSlice';
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
  const dispatch = useDispatch();
  const { user, status } = useSelector(state => state.auth);
  const navigate = useNavigate();

  // Derived state
  const isAuthenticated = !!user;
  // If we have a token but status is idle, we are initializing (fetching profile)
  const hasToken = !!localStorage.getItem('access_token');
  const loading = status === 'loading' || (status === 'idle' && hasToken);

  const login = async (email, password) => {
    try {
      const data = await api.auth.login(email, password);
      // data: { accessToken, refreshToken, role }
      
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      localStorage.setItem('user_role', data.role);
      
      try {
        await dispatch(fetchUserProfile()).unwrap();
      } catch (e) {
        console.error("Failed to fetch profile on login", e);
        const userData = {
          email: email, 
          role: data.role
        };
        dispatch(setUserData(userData));
      }
      
      return { success: true, role: data.role };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Credențiale invalide' };
    }
  };

  const logout = () => {
    dispatch(clearUserData());
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    navigate('/login');
  };

  // Check for existing session
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    
    if (accessToken && !user && status === 'idle') {
       dispatch(fetchUserProfile())
         .unwrap()
         .catch(error => {
            console.error("Failed to fetch profile", error);
            // If fetch fails (e.g. 401), execute logout
            // But verify if api interceptor handled it (it might have removed token)
            if (!localStorage.getItem('access_token')) {
               logout();
            }
         });
    }
  }, [dispatch, user, status]);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
