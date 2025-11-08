import React, { useState } from "react";

export default function ModelsManager() {
  const [models, setModels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", file: null });

  // 🔹 Gère les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  // 🔹 Gère l'ajout du modèle
  const handleAddModel = (e) => {
    e.preventDefault();

    if (!form.name || !form.file) {
      alert("Veuillez remplir le nom et ajouter un fichier .glb !");
      return;
    }

    const newModel = {
      id: Date.now(),
      name: form.name,
      description: form.description,
      file: URL.createObjectURL(form.file), // lien temporaire local
    };

    setModels([...models, newModel]);
    setForm({ name: "", description: "", file: null });
    setShowForm(false);
  };

  // 🔹 Supprimer un modèle
  const handleDelete = (id) => {
    setModels(models.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">🧩 Gestion des modèles 3D</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          {showForm ? "Fermer" : "➕ Ajouter"}
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <form
          onSubmit={handleAddModel}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 max-w-md mx-auto mb-10"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ajouter un nouveau modèle</h2>

          <label className="block mb-3">
            <span className="text-gray-600">Nom du modèle</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:ring focus:ring-indigo-300"
              required
            />
          </label>

          <label className="block mb-3">
            <span className="text-gray-600">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            />
          </label>

          <label className="block mb-5">
            <span className="text-gray-600">Fichier .glb</span>
            <input
              type="file"
              name="file"
              accept=".glb"
              onChange={handleChange}
              required
              className="mt-2"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Ajouter
          </button>
        </form>
      )}

      {/* Liste des modèles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {models.length === 0 && (
          <p className="text-gray-500 text-center col-span-full">
            Aucun modèle ajouté pour le moment.
          </p>
        )}

        {models.map((m) => (
          <div
            key={m.id}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition flex flex-col"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">{m.name}</h3>
            <p className="text-gray-500 mb-4">{m.description}</p>

            <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg h-48 overflow-hidden mb-4">
              <p className="text-gray-400 text-sm italic">
                Aperçu non disponible (fichier .glb)
              </p>
            </div>

            <button
              onClick={() => handleDelete(m.id)}
              className="bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
