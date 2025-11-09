
import { AUTH_ACTION_TYPES } from '../constants/actionTypes';

// Load User from localStorage
export const loadUser = () => (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      dispatch({
        type: AUTH_ACTION_TYPES.LOAD_USER,
        payload: user
      });
    }
  } catch (error) {
    console.error('Failed to load user from localStorage:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Login Actions
export const loginRequest = () => ({
  type: AUTH_ACTION_TYPES.LOGIN_REQUEST
});

export const loginSuccess = (user) => ({
  type: AUTH_ACTION_TYPES.LOGIN_SUCCESS,
  payload: user
});

export const loginFailure = (error) => ({
  type: AUTH_ACTION_TYPES.LOGIN_FAILURE,
  payload: error
});

// Register Actions  
export const registerRequest = () => ({
  type: AUTH_ACTION_TYPES.REGISTER_REQUEST
});

export const registerSuccess = (user) => ({
  type: AUTH_ACTION_TYPES.REGISTER_SUCCESS,
  payload: user
});

export const registerFailure = (error) => ({
  type: AUTH_ACTION_TYPES.REGISTER_FAILURE,
  payload: error
});

// Update Profile
export const updateProfileRequest = () => ({
  type: AUTH_ACTION_TYPES.UPDATE_PROFILE_REQUEST
});

export const updateProfileSuccess = (user) => ({
  type: AUTH_ACTION_TYPES.UPDATE_PROFILE_SUCCESS,
  payload: user
});

export const updateProfileFailure = (error) => ({
  type: AUTH_ACTION_TYPES.UPDATE_PROFILE_FAILURE,
  payload: error
});

// Logout
export const logout = () => {
  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  return {
    type: AUTH_ACTION_TYPES.LOGOUT
  };
};

// Clear Error
export const clearError = () => ({
  type: 'CLEAR_ERROR'
});

// Async Actions with Backend API
export const loginUser = (credentials) => {
  return async (dispatch) => {
    try {
      dispatch(loginRequest());

      // Import API service
      const api = (await import('../../services/api')).default;

      // Call backend API
      const response = await api.post('/auth/login', credentials);

      const { token, user } = response.data;

      // Save token and user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Dispatch success
      dispatch(loginSuccess(user));

      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur de connexion';
      dispatch(loginFailure(message));
      return { success: false, error: message };
    }
  };
};

export const registerUser = (userData) => {
  return async (dispatch) => {
    try {
      dispatch(registerRequest());

      // Import API service
      const api = (await import('../../services/api')).default;

      // Call backend API
      const response = await api.post('/auth/register', userData);

      const { token, user } = response.data;

      // Save token and user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Dispatch success
      dispatch(registerSuccess(user));

      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de l\'inscription';
      dispatch(registerFailure(message));
      return { success: false, error: message };
    }
  };
};

export const updateUserProfile = (userData) => {
  return async (dispatch) => {
    try {
      dispatch(updateProfileRequest());

      // Import API service
      const api = (await import('../../services/api')).default;

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('firstName', userData.firstName);
      formData.append('lastName', userData.lastName);
      formData.append('work', userData.work || '');
      
      // Add photo file if present
      if (userData.photoFile) {
        formData.append('photo', userData.photoFile);
      }

      // Call backend API - let axios set Content-Type automatically for FormData
      const response = await api.put('/auth/profile', formData);

      const { user } = response.data;

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(user));

      // Dispatch success
      dispatch(updateProfileSuccess(user));

      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour';
      dispatch(updateProfileFailure(message));
      return { success: false, error: message };
    }
  };
};