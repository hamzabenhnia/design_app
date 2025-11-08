import { useSelector, useDispatch } from 'react-redux';

// Hook pour l'authentification
export const useAuth = () => {
  return useSelector(state => state.auth);
};

// Hook pour les designs
export const useDesigns = () => {
  return useSelector(state => state.designs);
};

// Hook pour les modèles
export const useModels = () => {
  return useSelector(state => state.models);
};

// Hook pour les utilisateurs
export const useUsers = () => {
  return useSelector(state => state.users);
};

// Hook pour le dispatch
export const useAppDispatch = () => useDispatch();