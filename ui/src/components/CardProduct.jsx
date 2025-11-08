import React from "react"
import { Pencil, Trash2, Wand2 } from "lucide-react"

export default function CardProduct({ model, onDelete, onCustomize }) {
  return (
    
     <div className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden border border-gray-200">
      <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex justify-center items-center overflow-hidden">
        {model.fileUrl ? (
          <img src={model.fileUrl} alt={model.name} className="object-cover h-full w-full" />
        ) : (
          <div className="text-gray-400 text-center p-4">
            <div className="text-4xl mb-2">🧩</div>
            <p className="text-sm">Modèle 3D</p>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{model.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{model.description}</p>

        <div className="flex justify-between gap-2">
          <button
            onClick={() => onCustomize(model)}
            className="flex-1 flex items-center justify-center gap-1 bg-indigo-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Wand2 size={14} /> Personnaliser
          </button>

          <button
            onClick={() => onDelete(model.id)}
            className="flex items-center justify-center gap-1 bg-rose-500 text-white text-xs px-3 py-2 rounded-lg hover:bg-rose-600 transition"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
    
  );
}