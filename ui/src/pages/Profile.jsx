import React, { useState, useEffect } from "react";
import { Pencil, Save } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile, logout } from "../redux/actions/authActions";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.auth);
  const [editing, setEditing] = useState({
    firstName: false,
    lastName: false,
    email: false,
    work: false,
  });

  const toggleEdit = (field) => {
    setEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedUser = { ...user, [name]: value };
    dispatch(updateUserProfile(updatedUser));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUser = { ...user, photo: reader.result };
        dispatch(updateUserProfile(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Utilisateur non connecté</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        {/* En-tête Profil */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-center text-white relative">
          <div className="relative flex justify-center mb-4">
            <img
              src={user.photo || "https://via.placeholder.com/120"}
              alt="Profil"
              className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
            />
            <label className="absolute bottom-0 right-[42%] bg-white text-indigo-600 p-2 rounded-full cursor-pointer shadow hover:bg-indigo-100 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              📷
            </label>
          </div>

          <h2 className="text-2xl font-bold">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-sm text-blue-100">{user.work || "Aucune fonction définie"}</p>
          <p className="text-sm mt-1">{user.email}</p>
        </div>

        {/* Champs modifiables */}
        <div className="p-6 space-y-4">
          {[
            { label: "Prénom", name: "firstName" },
            { label: "Nom de famille", name: "lastName" },
            { label: "Email", name: "email" },
            { label: "Travail / Fonction", name: "work" },
          ].map((field) => (
            <div key={field.name} className="relative">
              <label className="block text-gray-600 text-sm mb-1">
                {field.label}
              </label>
              <input
                type={field.name === "email" ? "email" : "text"}
                name={field.name}
                value={user[field.name] || ""}
                onChange={handleChange}
                disabled={!editing[field.name] || loading}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 transition ${
                  editing[field.name] ? "bg-white" : "bg-gray-100 text-gray-600"
                } ${loading ? 'opacity-50' : ''}`}
              />
              <button
                type="button"
                onClick={() => toggleEdit(field.name)}
                disabled={loading}
                className="absolute top-7 right-3 text-gray-500 hover:text-indigo-600 transition"
              >
                {editing[field.name] ? <Save size={18} /> : <Pencil size={18} />}
              </button>
            </div>
          ))}

          <p className="text-xs text-center text-gray-500 mt-6">
            ✏️ Cliquez sur le crayon pour modifier un champ.
          </p>

          <button
            onClick={handleLogout}
            className="w-full mt-6 bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}