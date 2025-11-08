
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useAppDispatch, useDesigns, useAuth } from "../hooks";
import { fetchDesigns, deleteDesign, setCurrentDesign } from "../redux/actions/designActions";

export default function MyCollection() {
  const dispatch = useAppDispatch();
  const { designs, loading, error } = useDesigns();
  const { user } = useAuth();
  const [localDesigns, setLocalDesigns] = useState([]);

  useEffect(() => {
    if (user) {
      dispatch(fetchDesigns());
    }
  }, [dispatch, user]);

  // Utilisez designs avec une valeur par défaut
  const displayDesigns = designs || [];

  const handleDelete = (designId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce design ?")) {
      dispatch(deleteDesign(designId));
    }
  };

  const handleSelectDesign = (design) => {
    dispatch(setCurrentDesign(design));
    // Rediriger vers l'éditeur si nécessaire
  };

  if (loading) return <div>Chargement de vos designs...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <NavBar />
      <div className="my-collection">
        <h1>Ma Collection</h1>
        
        {displayDesigns.length === 0 ? (
          <div className="empty-state">
            <p>Aucun design trouvé</p>
            <p>Créez votre premier design de maillot de football !</p>
          </div>
        ) : (
          <div className="designs-grid">
            {displayDesigns.map((design) => (
              <div key={design.id} className="design-card">
                <div className="design-image">
                  {/* Image du design */}
                  <div 
                    className="design-preview"
                    style={{ 
                      backgroundColor: design.colors?.[0] || '#ffffff',
                      border: `2px solid ${design.colors?.[1] || '#000000'}`
                    }}
                  ></div>
                </div>
                <div className="design-info">
                  <h3>{design.name || "Design sans nom"}</h3>
                  <p>Type: {design.kitType || "Non spécifié"}</p>
                  <p>Créé le: {new Date(design.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="design-actions">
                  <button 
                    onClick={() => handleSelectDesign(design)}
                    className="btn-primary"
                  >
                    Modifier
                  </button>
                  <button 
                    onClick={() => handleDelete(design.id)}
                    className="btn-danger"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}