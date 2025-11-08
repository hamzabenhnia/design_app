
import { USER_ACTION_TYPES } from '../constants/actionTypes';

export const fetchUsersRequest = () => ({
  type: USER_ACTION_TYPES.FETCH_USERS_REQUEST
});

export const fetchUsersSuccess = (users) => ({
  type: USER_ACTION_TYPES.FETCH_USERS_SUCCESS,
  payload: users
});

export const fetchUsersFailure = (error) => ({
  type: USER_ACTION_TYPES.FETCH_USERS_FAILURE,
  payload: error
});

export const updateUser = (user) => ({
  type: USER_ACTION_TYPES.UPDATE_USER,
  payload: user
});

export const deleteUser = (id) => ({
  type: USER_ACTION_TYPES.DELETE_USER,
  payload: id
});

// Async Action
export const fetchUsers = () => {
  return (dispatch) => {
    dispatch(fetchUsersRequest());
    setTimeout(() => {
      const users = [
        {
          id: 1,
          name: "Hamza Hnia",
          email: "hamza.hnia@example.com",
          role: "Admin",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        {
          id: 2,
          name: "Sarah Benali", 
          email: "sarah.benali@example.com",
          role: "Designer",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        }
      ];
      dispatch(fetchUsersSuccess(users));
    }, 1000);
  };
};