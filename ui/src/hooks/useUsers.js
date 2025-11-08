// src/hooks/useUsers.js
import { useAppSelector, useAppDispatch } from './index';
import { useEffect } from 'react';
import { fetchUsers, updateUser, deleteUser } from '../../redux/actions/userActions';

const useUsers = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const updateExistingUser = (user) => dispatch(updateUser(user));
  const removeUser = (id) => dispatch(deleteUser(id));

  return { 
    users, 
    loading, 
    error,
    fetchUsers: () => dispatch(fetchUsers()),
    updateUser: updateExistingUser,
    deleteUser: removeUser
  };
};

export default useUsers;