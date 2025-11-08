// src/hooks/useModels.js
import { useAppSelector, useAppDispatch } from './index';
import { useEffect } from 'react';
import { fetchModels, addModel, deleteModel } from '../../redux/actions/modelActions';

const useModels = () => {
  const dispatch = useAppDispatch();
  const { models, loading, error } = useAppSelector((state) => state.models);

  useEffect(() => {
    dispatch(fetchModels());
  }, [dispatch]);

  const addNewModel = (modelData) => dispatch(addModel(modelData));
  const removeModel = (id) => dispatch(deleteModel(id));

  return { 
    models, 
    loading, 
    error,
    fetchModels: () => dispatch(fetchModels()),
    addModel: addNewModel,
    deleteModel: removeModel
  };
};

export default useModels;