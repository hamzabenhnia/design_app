import React from "react";
import FootballKitDesigner from "../components/FootballKitDesigner";

export default function DesignPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 p-6">
      {/* Header */}
      
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
          🏆 Personnalise ton Maillot
        </h1>
        <p className="text-white/80 mt-2">
          Crée ton propre maillot de foot avec ton nom, ton numéro et tes logos.
        </p>
      </header>

      {/* Zone Designer */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-6">
        <FootballKitDesigner />
      </div>
    </div>
  );
}


