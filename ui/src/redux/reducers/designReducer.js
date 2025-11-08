// src/redux/reducers/designReducer.js
import { DESIGN_ACTION_TYPES } from '../constants/actionTypes';

const initialState = {
  designs: [],
  currentDesign: null,
  loading: false,
  error: null
};

const designReducer = (state = initialState, action) => {
  switch (action.type) {
    case DESIGN_ACTION_TYPES.CREATE_DESIGN_REQUEST:
    case DESIGN_ACTION_TYPES.FETCH_DESIGNS_REQUEST:
      return { ...state, loading: true, error: null };

    case DESIGN_ACTION_TYPES.CREATE_DESIGN_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        designs: [...state.designs, action.payload],
        error: null 
      };

    case DESIGN_ACTION_TYPES.FETCH_DESIGNS_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        designs: action.payload,
        error: null 
      };

    case DESIGN_ACTION_TYPES.CREATE_DESIGN_FAILURE:
    case DESIGN_ACTION_TYPES.FETCH_DESIGNS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case DESIGN_ACTION_TYPES.SAVE_DESIGN:
      return {
        ...state,
        designs: [...state.designs, action.payload]
      };

    case DESIGN_ACTION_TYPES.UPDATE_DESIGN:
      return {
        ...state,
        designs: state.designs.map(design => 
          design.id === action.payload.id ? action.payload : design
        )
      };

    case DESIGN_ACTION_TYPES.DELETE_DESIGN:
      return {
        ...state,
        designs: state.designs.filter(design => design.id !== action.payload)
      };

    case DESIGN_ACTION_TYPES.SET_CURRENT_DESIGN:
      return {
        ...state,
        currentDesign: action.payload
      };
      case 'UPDATE_TEMPORARY_DESIGN':
  return {
    ...state,
    currentDesign: action.payload
  };

    default:
      return state;
  }
};

export default designReducer;