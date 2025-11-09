
import { MODEL_ACTION_TYPES } from '../constants/actionTypes';

export const fetchModelsRequest = () => ({
  type: MODEL_ACTION_TYPES.FETCH_MODELS_REQUEST
});

export const fetchModelsSuccess = (models) => ({
  type: MODEL_ACTION_TYPES.FETCH_MODELS_SUCCESS,
  payload: models
});

export const fetchModelsFailure = (error) => ({
  type: MODEL_ACTION_TYPES.FETCH_MODELS_FAILURE,
  payload: error
});

export const addModelRequest = () => ({
  type: MODEL_ACTION_TYPES.ADD_MODEL_REQUEST
});

export const addModelSuccess = (model) => ({
  type: MODEL_ACTION_TYPES.ADD_MODEL_SUCCESS,
  payload: model
});

export const addModelFailure = (error) => ({
  type: MODEL_ACTION_TYPES.ADD_MODEL_FAILURE,
  payload: error
});

export const deleteModel = (id) => ({
  type: MODEL_ACTION_TYPES.DELETE_MODEL,
  payload: id
});

// Async Actions with Backend API
export const fetchModels = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchModelsRequest());

      // Import API service
      const api = (await import('../../services/api')).default;

      // Call backend API
      const response = await api.get('/models');

      const models = response.data.models || response.data || [];
      
      dispatch(fetchModelsSuccess(models));

      return { success: true, models };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors du chargement des modèles';
      dispatch(fetchModelsFailure(message));
      
      // Return empty array on error so Home page doesn't stay stuck loading
      dispatch(fetchModelsSuccess([]));
      
      return { success: false, error: message };
    }
  };
};

export const addModel = (modelData) => {
  return async (dispatch) => {
    try {
      dispatch(addModelRequest());

      // Import API service
      const api = (await import('../../services/api')).default;

      // Call backend API
      const response = await api.post('/models', modelData);

      const newModel = response.data.model || response.data;

      dispatch(addModelSuccess(newModel));

      return { success: true, model: newModel };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de l\'ajout du modèle';
      dispatch(addModelFailure(message));
      return { success: false, error: message };
    }
  };
};