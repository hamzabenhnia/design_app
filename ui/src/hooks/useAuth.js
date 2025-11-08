// src/hooks/useAuth.js
import { useAppSelector, useAppDispatch } from './index';
import { useEffect } from 'react';
import { loginUser, registerUser, updateUserProfile, logout } from '../redux/actions/authActions';

const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  // Récupérer l'utilisateur depuis localStorage au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      // Vous devrez créer une action setUser ou utiliser loginSuccess
      // dispatch(setUser(JSON.parse(savedUser)));
    }
  }, [dispatch]);

  const login = (credentials) => dispatch(loginUser(credentials));
  const register = (userData) => dispatch(registerUser(userData));
  const updateProfile = (userData) => dispatch(updateUserProfile(userData));
  const logoutUser = () => dispatch(logout());

  return { 
    user, 
    isAuthenticated, 
    loading, 
    error,
    login,
    register,
    updateProfile,
    logout: logoutUser
  };
};

export default useAuth;