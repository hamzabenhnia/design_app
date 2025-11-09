
import ProductList from "./ProductListe";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchModels } from "../redux/actions/modelActions";
import { Link } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const { models, loading, error } = useSelector(state => state.models);

  useEffect(() => {
    dispatch(fetchModels());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des modèles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            ⚽ Football Kit Designer
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Créez et personnalisez vos maillots de football en 3D
          </p>
          <Link 
            to="/design" 
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Commencer à designer
          </Link>
        </div>

        {/* Models Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Modèles Disponibles
          </h2>

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4">
              <p className="font-medium">Note:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {models.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500 text-lg mb-4">Aucun modèle 3D disponible pour le moment.</p>
              <p className="text-gray-400 text-sm mb-6">
                Les modèles 3D apparaîtront ici une fois ajoutés.
              </p>
              <Link 
                to="/add" 
                className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Ajouter un modèle
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.slice(-3).map((model) => (
                <ProductList key={model._id || model.id} model={model} onDelete={() => {}} />
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Design 3D</h3>
            <p className="text-gray-600">Personnalisez vos maillots en temps réel avec notre éditeur 3D</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow">
            <div className="text-4xl mb-3">💾</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Sauvegarde</h3>
            <p className="text-gray-600">Enregistrez vos créations et accédez-y à tout moment</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow">
            <div className="text-4xl mb-3">📤</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Export</h3>
            <p className="text-gray-600">Exportez vos designs en haute qualité</p>
          </div>
        </div>
      </div>
    </div>
  );
}