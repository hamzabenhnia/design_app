import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../redux/actions/authActions";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", work: "",
    password: "", confirmPassword: "", photo: ""
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      alert("⚠️ Les mots de passe ne correspondent pas !");
      return;
    }

    // Prepare data for backend
    const userData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      work: form.work
    };

    const result = await dispatch(registerUser(userData));
    
    if (result.success) {
      // Redirect to home page after successful registration
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Créer un compte</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

        {/* Photo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={form.photo || "https://via.placeholder.com/100"}
            alt="Profil"
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 mb-2"
          />
          <label className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition text-sm">
            Importer une photo
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Champs */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Ton nom"
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Prénom</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Ton prénom"
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Ton email"
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Travail</label>
          <input
            type="text"
            name="work"
            value={form.work}
            onChange={handleChange}
            placeholder="Ton travail"
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Mot de passe</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Ton mot de passe"
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Confirmer mot de passe</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirme ton mot de passe"
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition font-medium"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Inscription en cours...
            </span>
          ) : (
            "S'inscrire"
          )}
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Déjà un compte ?{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Se connecter
          </Link>
        </p>
      </form>
      </div>
    </div>
  );
}