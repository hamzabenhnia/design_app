// src/pages/LogIn.jsx
import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { useAppDispatch, useAuth } from "../hooks";
import { loginUser } from "../redux/actions/authActions";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Rediriger vers la page d'accueil ou autre
      console.log("Login successful!");
    }
  }, [isAuthenticated]);

  return (
    <div>
      
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Connexion</h2>
          {error && <div className="error-message">{error}</div>}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}