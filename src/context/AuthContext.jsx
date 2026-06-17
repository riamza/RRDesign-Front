import React, { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserData,
  clearUserData,
  fetchUserProfile,
  invalidateUserCache,
} from "../store/slices/authSlice";
import { api } from "../services/api";
import { tokenStorage } from "../utils/tokenStorage";
import { logger } from "../services/logger";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Derived state
  const isAuthenticated = !!user;
  const hasSession = tokenStorage.hasSession();
  const loading = status === "loading" || (status === "idle" && hasSession);

  const login = async (email, password) => {
    try {
      const data = await api.auth.login(email, password);

      tokenStorage.setTokens(data.accessToken, data.refreshToken, data.role);

      try {
        dispatch(invalidateUserCache());
        await dispatch(fetchUserProfile()).unwrap();
      } catch (e) {
        console.error("Failed to fetch profile on login", e);
        dispatch(setUserData({ email, role: data.role }));
      }

      return { success: true, role: data.role };
    } catch (error) {
      console.error(error);
      const isApiErrorStr = error?.message && error.message.startsWith("error.");
      logger.log(`AuthContext`, `login`, error.message, false, error.stack);

      let errorKey = "error.invalid_credentials";
      if (!isApiErrorStr && error?.message && error.message.includes("500")) {
        errorKey = "error.server_error";
      }

      return {
        success: false,
        error: isApiErrorStr ? error.message : errorKey,
      };
    }
  };

  const logout = () => {
    dispatch(clearUserData());
    tokenStorage.clearAll();
    navigate("/login");
  };

  // Restore session on page load
  useEffect(() => {
    if (tokenStorage.hasSession() && !user && status === "idle") {
      dispatch(fetchUserProfile())
        .unwrap()
        .catch((error) => {
          console.error("Failed to restore session:", error);
          // Dacă tokenStorage a fost curătat de refreshTokenFlow (sesiune expirată)
          // sau dacă eroarea este explicită de sesiune expirată, logout
          if (!tokenStorage.hasSession() || error?.message === "Session expired") {
            tokenStorage.clearAll();
            dispatch(clearUserData());
            navigate("/login");
          }
          // Altfel (eroare de rețea etc.) nu forța logout — user rămâne offline temporar
        });
    }
  }, [dispatch, user, status]);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
