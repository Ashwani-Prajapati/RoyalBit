import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../services/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load current session user
  useEffect(() => {
    const current = storage.getCurrentUser();
    setUser(current);
    setLoading(false);
  }, []);

  const refreshUser = () => {
    if (!user) return;
    const refreshed = storage.getUserById(user.id);
    setUser(refreshed);
    return refreshed;
  };

  const login = async (identifier, password) => {
    const loggedIn = storage.loginUser(identifier, password);
    setUser(loggedIn);
    return loggedIn;
  };

  const signup = async (userData) => {
    const newUser = storage.registerUser(userData);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    storage.logout();
    setUser(null);
  };

  const switchUser = (userId) => {
    const target = storage.getUserById(userId);
    if (target) {
      storage.setCurrentUser(target.id);
      setUser(target);
    }
  };

  const resetPassword = async (email, newPassword) => {
    return storage.resetPassword(email, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        switchUser,
        refreshUser,
        resetPassword,
        allUsers: storage.getUsers(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

