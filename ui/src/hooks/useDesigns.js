// src/hooks/useDesigns.js
import { useAppSelector, useAppDispatch } from './index';
import { useEffect } from 'react';
import { 
  fetchDesigns, 
  createDesign, 
  deleteDesign, 
  setCurrentDesign,
  updateDesign 
} from '../../redux/actions/designActions';
import { useAuth } from './useAuth'; // Import direct, pas depuis index

const useDesigns = () => {
  const dispatch = useAppDispatch();
  const { designs, currentDesign, loading, error } = useAppSelector((state) => state.designs);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      dispatch(fetchDesigns());
    }
  }, [dispatch, user]);

  const createNewDesign = (designData) => dispatch(createDesign(designData));
  const removeDesign = (id) => dispatch(deleteDesign(id));
  const selectDesign = (design) => dispatch(setCurrentDesign(design));
  const updateExistingDesign = (design) => dispatch(updateDesign(design));

  return { 
    designs, 
    currentDesign, 
    loading, 
    error,
    fetchDesigns: () => dispatch(fetchDesigns()),
    createDesign: createNewDesign,
    deleteDesign: removeDesign,
    setCurrentDesign: selectDesign,
    updateDesign: updateExistingDesign
  };
};

export default useDesigns;