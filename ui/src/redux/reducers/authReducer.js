// src/redux/reducers/authReducer.js
import { AUTH_ACTION_TYPES } from '../constants/actionTypes';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // Login
    case AUTH_ACTION_TYPES.LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case AUTH_ACTION_TYPES.LOGIN_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        user: action.payload, 
        isAuthenticated: true,
        error: null 
      };
    case AUTH_ACTION_TYPES.LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Register
    case AUTH_ACTION_TYPES.REGISTER_REQUEST:
      return { ...state, loading: true, error: null };
    case AUTH_ACTION_TYPES.REGISTER_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        user: action.payload, 
        isAuthenticated: true,
        error: null 
      };
    case AUTH_ACTION_TYPES.REGISTER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Update Profile
    case AUTH_ACTION_TYPES.UPDATE_PROFILE_REQUEST:
      return { ...state, loading: true, error: null };
    case AUTH_ACTION_TYPES.UPDATE_PROFILE_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        user: action.payload,
        error: null 
      };
    case AUTH_ACTION_TYPES.UPDATE_PROFILE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Logout
    case AUTH_ACTION_TYPES.LOGOUT:
      return {
        ...initialState
      };
      case 'CLEAR_ERROR':
  return { ...state, error: null };

    default:
      return state;
  }
};

export default authReducer;