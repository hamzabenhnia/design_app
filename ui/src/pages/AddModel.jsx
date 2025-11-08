import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addModel } from "../redux/actions/modelActions";
export default function AddModel() {
  const [form, setForm] = useState({ name: "", description: "", file: null });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.file) {
      alert("Nom et fichier requis !");
      return;
    }

    const newModel = {
      id: Date.now(),
      name: form.name,
      description: form.description,
      fileUrl: URL.createObjectURL(form.file),
    };

     dispatch(addModel(newModel));
    navigate("/collection");
  };

  return (
    <div className="p-10 max-w-lg mx-auto bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Ajouter un nouveau modèle</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600 mb-1">Nom</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={form.name}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Description</label>
          <textarea
            name="description"
            onChange={handleChange}
            value={form.description}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Fichier (.glb)</label>
          <input type="file" name="file" accept=".glb" onChange={handleChange} required />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
