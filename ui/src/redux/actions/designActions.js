// src/redux/actions/designActions.js
import { DESIGN_ACTION_TYPES } from '../constants/actionTypes';

export const createDesignRequest = () => ({
  type: DESIGN_ACTION_TYPES.CREATE_DESIGN_REQUEST
});

export const createDesignSuccess = (design) => ({
  type: DESIGN_ACTION_TYPES.CREATE_DESIGN_SUCCESS,
  payload: design
});

export const createDesignFailure = (error) => ({
  type: DESIGN_ACTION_TYPES.CREATE_DESIGN_FAILURE,
  payload: error
});

export const fetchDesignsRequest = () => ({
  type: DESIGN_ACTION_TYPES.FETCH_DESIGNS_REQUEST
});

export const fetchDesignsSuccess = (designs) => ({
  type: DESIGN_ACTION_TYPES.FETCH_DESIGNS_SUCCESS,
  payload: designs
});

export const fetchDesignsFailure = (error) => ({
  type: DESIGN_ACTION_TYPES.FETCH_DESIGNS_FAILURE,
  payload: error
});

export const deleteDesign = (id) => ({
  type: DESIGN_ACTION_TYPES.DELETE_DESIGN,
  payload: id
});

export const setCurrentDesign = (design) => ({
  type: DESIGN_ACTION_TYPES.SET_CURRENT_DESIGN,
  payload: design
});

export const updateTemporaryDesign = (designData) => ({
  type: 'UPDATE_TEMPORARY_DESIGN',
  payload: designData
});

// Async Actions
export const createDesign = (designData) => {
  return (dispatch) => {
    dispatch(createDesignRequest());
    setTimeout(() => {
      const newDesign = {
        ...designData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      dispatch(createDesignSuccess(newDesign));
    }, 500);
  };
};

export const fetchDesigns = () => {
  return (dispatch) => {
    dispatch(fetchDesignsRequest());
    setTimeout(() => {
      const designs = JSON.parse(localStorage.getItem('myKits')) || [];
      dispatch(fetchDesignsSuccess(designs));
    }, 500);
  };
};

export const fetchUserDesigns = () => {
  return (dispatch) => {
    dispatch(fetchDesignsRequest());
    setTimeout(() => {
      const designs = JSON.parse(localStorage.getItem('myKits')) || [];
      dispatch(fetchDesignsSuccess(designs));
    }, 500);
  };
};