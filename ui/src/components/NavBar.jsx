import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu, Home, Shirt, LayoutGrid, Users } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function NavBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useSelector(state => state.auth);

  const mainLinks = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Design", path: "/design", icon: <Shirt size={18} /> },
    { name: "Collection", path: "/collection", icon: <LayoutGrid size={18} /> },
    { name: "Utilisateurs", path: "/users", icon: <Users size={18} /> },
  ];

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold hover:text-blue-400 transition flex items-center gap-2">
        ⚽ MyShop
      </Link>
      
      {/* Navigation principale - Desktop */}
      <div className="hidden md:flex items-center space-x-6">
        {mainLinks.map((link) => (
          <Link 
            key={link.path} 
            to={link.path} 
            className="hover:text-blue-400 transition flex items-center gap-1"
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </div>

      {/* Bouton menu utilisateur - Desktop */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 hover:text-blue-400 transition"
          >
            <img
              src={user.photo || "https://via.placeholder.com/32"}
              alt="Profil"
              className="w-8 h-8 rounded-full"
            />
            <span>{user.firstName}</span>
          </button>
        ) : (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 hover:text-blue-400 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              <Users size={16} />
            </div>
            <span>Connexion</span>
          </button>
        )}
      </div>

      {/* Bouton menu mobile */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden text-white hover:text-blue-400 transition"
      >
        <Menu size={26} />
      </button>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </nav>
  );
}