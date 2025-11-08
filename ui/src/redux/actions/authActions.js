
import { AUTH_ACTION_TYPES } from '../constants/actionTypes';

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
export const logout = () => ({
  type: AUTH_ACTION_TYPES.LOGOUT
});

// Clear Error
export const clearError = () => ({
  type: 'CLEAR_ERROR'
});

// Async Actions
export const loginUser = (credentials) => {
  return (dispatch) => {
    dispatch(loginRequest());
    setTimeout(() => {
      const user = {
        ...credentials,
        id: Date.now(),
        firstName: 'Test',
        lastName: 'User',
        isAuthenticated: true
      };
      localStorage.setItem('user', JSON.stringify(user));
      dispatch(loginSuccess(user));
    }, 1000);
  };
};

export const registerUser = (userData) => {
  return (dispatch) => {
    dispatch(registerRequest());
    setTimeout(() => {
      const user = {
        ...userData,
        id: Date.now(),
        isAuthenticated: true
      };
      localStorage.setItem('user', JSON.stringify(user));
      dispatch(registerSuccess(user));
    }, 1000);
  };
};
export const updateUserProfile = (userData) => {
  return (dispatch) => {
    dispatch(updateProfileRequest());
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify(userData));
      dispatch(updateProfileSuccess(userData));
    }, 500);
  };
};