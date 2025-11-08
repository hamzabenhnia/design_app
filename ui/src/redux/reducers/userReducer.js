// src/redux/reducers/userReducer.js
import { USER_ACTION_TYPES } from '../constants/actionTypes';

const initialState = {
  users: [],
  loading: false,
  error: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_ACTION_TYPES.FETCH_USERS_REQUEST:
      return { ...state, loading: true, error: null };

    case USER_ACTION_TYPES.FETCH_USERS_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        users: action.payload,
        error: null 
      };

    case USER_ACTION_TYPES.FETCH_USERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case USER_ACTION_TYPES.UPDATE_USER:
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        )
      };

    case USER_ACTION_TYPES.DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };

    default:
      return state;
  }
};

export default userReducer;