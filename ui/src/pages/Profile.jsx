import React, { useState, useEffect } from "react";
import { Pencil, Save, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile, logout } from "../redux/actions/authActions";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.auth);
  
  // Track changes locally
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    work: '',
  });
  
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        work: user.work || '',
      });
    }
  }, [user]);

  // Check if there are any changes
  useEffect(() => {
    if (user) {
      const hasFieldChanges = 
        formData.firstName !== (user.firstName || '') ||
        formData.lastName !== (user.lastName || '') ||
        formData.work !== (user.work || '');
      
      setHasChanges(hasFieldChanges || photoFile !== null);
    }
  }, [formData, photoFile, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setSaveSuccess(false);
    }
  };

  const handleSave = async () => {
    const result = await dispatch(updateUserProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      work: formData.work,
      photoFile: photoFile
    }));

    if (result.success) {
      setPhotoFile(null);
      setPhotoPreview(null);
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        work: user.work || '',
      });
      setPhotoFile(null);
      setPhotoPreview(null);
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

  const currentPhoto = photoPreview || user.photo?.url || user.photo || "https://via.placeholder.com/120";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        {/* En-tête Profil */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-center text-white relative">
          <div className="relative flex justify-center mb-4">
            <img
              src={currentPhoto}
              alt="Profil"
              className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
            />
            <label className="absolute bottom-0 right-[42%] bg-white text-indigo-600 p-2 rounded-full cursor-pointer shadow hover:bg-indigo-100 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={loading}
              />
              📷
            </label>
            {photoFile && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Nouvelle photo
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold">
            {formData.firstName} {formData.lastName}
          </h2>
          <p className="text-sm text-blue-100">{formData.work || "Aucune fonction définie"}</p>
          <p className="text-sm mt-1">{user.email}</p>
        </div>

        {/* Champs modifiables */}
        <div className="p-6 space-y-4">
          {/* Success Message */}
          {saveSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <span>✓</span>
              <span>Profil mis à jour avec succès!</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {[
            { label: "Prénom", name: "firstName" },
            { label: "Nom de famille", name: "lastName" },
            { label: "Travail / Fonction", name: "work" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-600 text-sm mb-1 font-medium">
                {field.label}
              </label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                disabled={loading}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                placeholder={`Entrez votre ${field.label.toLowerCase()}`}
              />
            </div>
          ))}

          <div>
            <label className="block text-gray-600 text-sm mb-1 font-medium">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié</p>
          </div>

          {/* Save/Cancel Buttons */}
          {hasChanges && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Enregistrer les modifications
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <X size={18} />
                Annuler
              </button>
            </div>
          )}

          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full mt-6 bg-rose-500 text-white py-2.5 rounded-lg hover:bg-rose-600 transition font-medium disabled:opacity-50"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}