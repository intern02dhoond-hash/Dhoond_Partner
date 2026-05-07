/**
 * Auth Context
 * Provides authentication state and methods to the entire app via React Context
 */

import React, { createContext, useState, useEffect } from 'react';
import TokenService from '../services/token.service';

// Create the context
export const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

/**
 * AuthProvider wraps the app and provides auth state
 */
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app start
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await TokenService.getToken();
        const storedUser = await TokenService.getUserData();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error loading auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  /**
   * Login — save token and user data
   * @param {string} authToken - Firebase ID token
   * @param {Object} userData - Partner data from backend
   */
  const login = async (authToken, userData) => {
    await TokenService.saveToken(authToken);
    await TokenService.saveUserData(userData);
    setToken(authToken);
    setUser(userData);
  };

  /**
   * Logout — clear all stored data
   */
  const logout = async () => {
    await TokenService.clearAll();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
