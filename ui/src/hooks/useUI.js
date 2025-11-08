// src/hooks/useUI.js
import { useAppSelector, useAppDispatch } from './index';

// Créer des actions UI simples si nécessaire
const UI_ACTION_TYPES = {
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_SIDEBAR_OPEN: 'SET_SIDEBAR_OPEN',
  SET_LOADING: 'SET_LOADING'
};

// Actions UI simples
export const toggleSidebar = () => ({ type: UI_ACTION_TYPES.TOGGLE_SIDEBAR });
export const setSidebarOpen = (isOpen) => ({ 
  type: UI_ACTION_TYPES.SET_SIDEBAR_OPEN, 
  payload: isOpen 
});
export const setUILoading = (loading) => ({ 
  type: UI_ACTION_TYPES.SET_LOADING, 
  payload: loading 
});

// Reducer UI (à ajouter dans rootReducer)
export const uiReducer = (state = { sidebarOpen: false, loading: false }, action) => {
  switch (action.type) {
    case UI_ACTION_TYPES.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case UI_ACTION_TYPES.SET_SIDEBAR_OPEN:
      return { ...state, sidebarOpen: action.payload };
    case UI_ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const useUI = () => {
  const dispatch = useAppDispatch();
  const { sidebarOpen, loading } = useAppSelector((state) => state.ui || {});

  return { 
    sidebarOpen: sidebarOpen || false,
    loading: loading || false,
    toggleSidebar: () => dispatch(toggleSidebar()),
    setSidebarOpen: (isOpen) => dispatch(setSidebarOpen(isOpen)),
    setLoading: (loading) => dispatch(setUILoading(loading))
  };
};

export default useUI;