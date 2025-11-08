
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

// Async Actions
export const fetchModels = () => {
  return (dispatch) => {
    dispatch(fetchModelsRequest());
    setTimeout(() => {
      const models = [
        {
          id: 1,
          name: "Maillot Classique",
          description: "Modèle de maillot de football classique",
          fileUrl: "/models/shirt.glb"
        },
        {
          id: 2, 
          name: "Maillot Moderne",
          description: "Design contemporain pour équipe moderne",
          fileUrl: "/models/shirt2.glb"
        }
      ];
      dispatch(fetchModelsSuccess(models));
    }, 500);
  };
};

export const addModel = (modelData) => {
  return (dispatch) => {
    dispatch(addModelRequest());
    setTimeout(() => {
      const newModel = {
        ...modelData,
        id: Date.now()
      };
      dispatch(addModelSuccess(newModel));
    }, 500);
  };
};