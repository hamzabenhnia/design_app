import { combineReducers } from 'redux';
import authReducer from './authReducer';
import modelReducer from './modelReducer';
import designReducer from './designReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  models: modelReducer,
  designs: designReducer,
  users: userReducer
});

export default rootReducer;