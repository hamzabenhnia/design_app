
import ProductList from "./ProductListe";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchModels } from "../redux/actions/modelActions";

export default function Home() {
    const dispatch = useDispatch();
  const { models, loading } = useSelector(state => state.models);

  useEffect(() => {
    dispatch(fetchModels());
  }, [dispatch]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p>Chargement...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Nos Produits
        </h1>

        {models.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun modèle ajouté encore.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {models.slice(-3).map((model) => (
              <ProductList key={model.id} model={model} onDelete={() => {}} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}