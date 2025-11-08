import React, { useEffect, useState } from "react";
import CardProduct from "../components/CardProduct";
import { useDispatch, useSelector } from "react-redux";
import { fetchModels, deleteModel } from "../redux/actions/modelActions";
const products = [
  { id: 1, name: "T-shirt", price: 25, image: "https://via.placeholder.com/150" },
  { id: 2, name: "Hoodie", price: 45, image: "https://via.placeholder.com/150" },
  { id: 3, name: "Cap", price: 15, image: "https://via.placeholder.com/150" },
];

export default function ProductList() {
  const dispatch = useDispatch();
  const { models, loading } = useSelector(state => state.models);

  useEffect(() => {
    dispatch(fetchModels());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteModel(id));
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Chargement des modèles...</p>
      </div>
    );
  
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🧩 Liste des modèles</h1>

      {models.length === 0 ? (
        <p className="text-gray-500">Aucun modèle pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {models.map((model) => (
            <CardProduct key={model.id} model={model} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
