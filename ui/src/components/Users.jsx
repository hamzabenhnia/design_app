import React from "react";
import { Pencil, Trash2, UserRound } from "lucide-react";

export default function UserCard({ name, email, role, avatar, onEdit, onDelete }) {
  return (
    <div className="bg-white w-[380px] rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 overflow-hidden">
      {/* En-tête avec image */}
      <div className="flex items-center gap-4 p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-16 h-16 rounded-full border-2 border-white object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <UserRound size={32} />
          </div>
        )}

        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-sm opacity-80">{role}</p>
        </div>
      </div>

      {/* Corps */}
      <div className="p-6">
        <p className="text-gray-600 mb-5">{email}</p>

        <div className="flex justify-between">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2.5 rounded-lg text-sm hover:bg-amber-600 transition"
          >
            <Pencil size={18} /> Modifier
          </button>

          <button
            onClick={onDelete}
            className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-lg text-sm hover:bg-rose-700 transition"
          >
            <Trash2 size={18} /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}