import React from "react";
import { User, Plus, LogIn, LogOut, X, Home, Shirt, LayoutGrid, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/authActions";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  

  const handleLogout = () => {
     dispatch(logout());
    onClose();
    navigate("/");
  };


  // Liens pour le sidebar (uniquement utilisateur)
  const userLinks = [
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
    { name: "Ajouter Modèle", path: "/add", icon: <Plus size={20} /> },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 transform
        transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-indigo-600">👤 Mon Compte</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={22} />
            </button>
          </div>

          {/* Section Utilisateur */}
          <div className="mb-6">
            {user ? (
              <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={user.photo || "https://via.placeholder.com/40"}
                    alt="Profil"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-lg mb-4">
                <p className="text-sm text-gray-600">Non connecté</p>
              </div>
            )}

            <nav className="space-y-2">
              {/* Liens utilisateur */}
              {user ? (
                <>
                  {userLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition text-sm font-medium ${
                        location.pathname === link.path
                          ? "bg-indigo-600 text-white"
                          : "text-gray-700 hover:bg-indigo-50"
                      }`}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  ))}
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg transition text-sm font-medium text-rose-600 hover:bg-rose-50 w-full text-left"
                  >
                    <LogOut size={20} />
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg transition text-sm font-medium text-green-600 hover:bg-green-50"
                >
                  <LogIn size={20} />
                  Connexion
                </Link>
              )}
            </nav>
          </div>

          <div className="mt-auto text-center text-xs text-gray-400 pt-4 border-t">
            <p>© 2025 MyShop</p>
          </div>
        </div>
      </div>
    </>
  );
}