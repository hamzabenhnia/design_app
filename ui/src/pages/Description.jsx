import React from 'react';
import NavBar from '../components/NavBar';
import { useAuth } from '../hooks';

export default function Description() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavBar />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              🎨 Football Kit Designer
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Créez vos maillots de football personnalisés en 3D avec notre outil de design avancé
            </p>
            
            {!isAuthenticated && (
              <div className="flex justify-center gap-4">
                <a
                  href="/register"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
                >
                  Commencer Maintenant
                </a>
                <a
                  href="/login"
                  className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Se Connecter
                </a>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">Design 3D Temps Réel</h3>
              <p className="text-gray-600">
                Visualisez vos créations en 3D avec rotation et zoom en temps réel
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-3">Personnalisation Avancée</h3>
              <p className="text-gray-600">
                Couleurs, logos, textes, motifs - Personnalisez chaque détail
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="text-4xl mb-4">💾</div>
              <h3 className="text-xl font-bold mb-3">Sauvegarde Cloud</h3>
              <p className="text-gray-600">
                Tous vos designs sauvegardés en sécurité dans le cloud
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Comment ça marche ?</h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                  1
                </div>
                <h4 className="font-semibold mb-2">Créez votre compte</h4>
                <p className="text-sm text-gray-600">Inscription simple et rapide</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                  2
                </div>
                <h4 className="font-semibold mb-2">Choisissez un modèle</h4>
                <p className="text-sm text-gray-600">Parmi nos modèles 3D disponibles</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                  3
                </div>
                <h4 className="font-semibold mb-2">Personnalisez</h4>
                <p className="text-sm text-gray-600">Couleurs, logos, textes, motifs</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                  4
                </div>
                <h4 className="font-semibold mb-2">Sauvegardez</h4>
                <p className="text-sm text-gray-600">Dans votre collection personnelle</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="text-center">
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-gray-600">Designs Créés</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">150+</div>
                <div className="text-gray-600">Utilisateurs Actifs</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">99%</div>
                <div className="text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}