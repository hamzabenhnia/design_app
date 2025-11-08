// src/redux/reducers/modelReducer.js
import { MODEL_ACTION_TYPES } from '../constants/actionTypes';

const initialState = {
  models: [],
  loading: false,
  error: null
};

const modelReducer = (state = initialState, action) => {
  switch (action.type) {
    case MODEL_ACTION_TYPES.ADD_MODEL_REQUEST:
    case MODEL_ACTION_TYPES.FETCH_MODELS_REQUEST:
      return { ...state, loading: true, error: null };

    case MODEL_ACTION_TYPES.ADD_MODEL_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        models: [...state.models, action.payload],
        error: null 
      };

    case MODEL_ACTION_TYPES.FETCH_MODELS_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        models: action.payload,
        error: null 
      };

    case MODEL_ACTION_TYPES.ADD_MODEL_FAILURE:
    case MODEL_ACTION_TYPES.FETCH_MODELS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case MODEL_ACTION_TYPES.DELETE_MODEL:
      const updatedModels = state.models.filter(model => model.id !== action.payload);
      localStorage.setItem('models', JSON.stringify(updatedModels));
      return {
        ...state,
        models: updatedModels
      };
      case 'SET_CURRENT_MODEL':
  return {
    ...state,
    currentModel: action.payload
  };

    default:
      return state;
  }
};

export default modelReducer;