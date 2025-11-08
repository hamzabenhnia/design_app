import React, { useState, useRef, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import { saveAs } from "file-saver";
import * as htmlToImage from "html-to-image";
import ShirtModel from "./ShirtModel";
import { useAppDispatch, useAuth, useDesigns, useModels } from "../hooks";
import { createDesign, updateTemporaryDesign } from "../redux/actions/designActions";

import { uploadService } from "../services/api";

export default function FootballKit3D() {
  const [isRotating, setIsRotating] = useState(true);
  const [color, setColor] = useState("#0055a4");
  const [logo, setLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [text, setText] = useState("");
  const [textureType, setTextureType] = useState("none");
  const [isUploading, setIsUploading] = useState(false);
  
  const canvasRef = useRef();
  const containerRef = useRef();

  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuth();
  const { isLoading: isSaving, currentDesign, items: designs } = useDesigns();
  const { currentModel, items: models } = useModels();

  // Mettre à jour le design temporaire
  useEffect(() => {
    dispatch(updateTemporaryDesign({
      color,
      logo,
      text,
      textureType
    }));
  }, [color, logo, text, textureType, dispatch]);

  // Upload logo vers Cloudinary
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview local immédiat
    const localUrl = URL.createObjectURL(file);
    setLogo(localUrl);
    setLogoFile(file);

    if (!isAuthenticated) return;

    // Upload vers Cloudinary
    setIsUploading(true);
    try {
      const result = await uploadService.uploadFile(file, 'football-kits/logos');
      setLogo(result.file.url); // Remplace par l'URL Cloudinary
    } catch (error) {
      console.error('Erreur upload logo:', error);
      alert('Erreur lors de l\'upload du logo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoFile(null);
  };

  const exportImage = async () => {
    if (!containerRef.current) return;
    try {
      const blob = await htmlToImage.toBlob(containerRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      });
      saveAs(blob, `maillot-${Date.now()}.png`);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  const toggleRotation = () => setIsRotating(!isRotating);

  const handleSaveDesign = async () => {
    if (!user || !currentModel) {
      alert("Veuillez vous connecter et sélectionner un modèle");
      return;
    }

    const designData = {
      model3D: currentModel._id,
      color,
      text,
      textureType,
      name: text || `Design ${new Date().toLocaleDateString()}`,
      settings: {
        fontSize: 24,
        textColor: '#FFFFFF',
        logoSize: 100,
        logoPosition: 'center'
      }
    };

    // Ajouter les données logo si présent
    if (logo && !logo.startsWith('blob:')) {
      designData.logo = {
        url: logo,
        // public_id sera géré par le backend
      };
    }

    try {
      await dispatch(createDesign(designData)).unwrap();
      alert("✅ Maillot sauvegardé dans votre collection !");
      
      // Reset du formulaire
      setColor("#0055a4");
      setLogo(null);
      setLogoFile(null);
      setText("");
      setTextureType("none");
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert("❌ Erreur lors de la sauvegarde: " + (error.message || 'Erreur inconnue'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">⚽ Concepteur Maillot 3D</h1>

      {/* Bouton Rotation */}
      <div className="mb-6 text-center">
        <button
          onClick={toggleRotation}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            isRotating
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-green-500 text-white hover:bg-green-600"
          } shadow-lg`}
        >
          {isRotating ? "⏸️ Arrêter la rotation" : "▶️ Animer la rotation"}
        </button>
      </div>

      {/* Canvas 3D */}
      <div
        ref={containerRef}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-lg mb-6 overflow-hidden"
      >
        <div className="w-full h-[500px]" ref={canvasRef}>
          <Canvas 
            camera={{ position: [0, 0, 4], fov: 50 }}
            gl={{ preserveDrawingBuffer: true }}
          >
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <directionalLight position={[-5, 5, -5]} intensity={0.5} />

            <Suspense fallback={
              <Html center>
                <div className="text-blue-500 font-semibold">
                  Chargement du maillot...
                </div>
              </Html>
            }>
              <ShirtModel
                color={color}
                logo={logo}
                text={text}
                textureType={textureType}
                isRotating={isRotating}
              />
            </Suspense>

            <OrbitControls enableZoom enablePan />
            <Environment preset="city" />
          </Canvas>
        </div>
      </div>

      {/* Contrôles */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg">
        {/* Modèle Actuel */}
        {currentModel && (
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-600">Modèle actuel:</p>
            <p className="font-semibold">{currentModel.name}</p>
          </div>
        )}

        {/* Couleurs */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-center">
            Couleur du maillot
          </label>
          <div className="flex justify-center gap-3 flex-wrap">
            {["#0055a4", "#ef4135", "#008000", "#000000", "#ffcc00", "#ffffff"].map(
              (c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-12 h-12 rounded-full border-2 transition-all ${
                    color === c
                      ? "border-blue-500 ring-2 ring-blue-300 scale-110"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: c }}
                />
              )
            )}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-12 rounded-full border-2 border-gray-300 cursor-pointer"
            />
          </div>
        </div>

        {/* Logo */}
        <div className="mb-6 text-center">
          <label className="block text-sm font-medium mb-2">
            Logo {isUploading && "(Upload...)"}
          </label>
          <div className="flex justify-center items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={isUploading}
              className="border p-2 rounded-lg text-sm disabled:opacity-50"
            />
            {logo && (
              <button
                onClick={handleRemoveLogo}
                disabled={isUploading}
                className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600 disabled:opacity-50"
              >
                Supprimer
              </button>
            )}
          </div>
          {logo && (
            <div className="mt-3">
              <img src={logo} alt="Logo preview" className="w-16 h-16 mx-auto object-contain" />
            </div>
          )}
        </div>

        {/* Texte */}
        <div className="mb-6 text-center">
          <label className="block text-sm font-medium mb-2">
            Texte personnalisé
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nom ou numéro..."
            className="border p-3 rounded-lg w-full max-w-md text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={20}
          />
        </div>

        {/* Motifs */}
        <div className="mb-6 text-center">
          <label className="block text-sm font-medium mb-3">Motif</label>
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { value: "none", label: "Uni" },
              { value: "stripes", label: "Rayures" },
              { value: "gradient", label: "Dégradé" },
              { value: "dots", label: "Points" },
              { value: "checker", label: "Damier" },
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => setTextureType(t.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  textureType === t.value
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={exportImage}
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all shadow-lg"
          >
            📸 Exporter
          </button>
          
          <button
            onClick={handleSaveDesign}
            disabled={isSaving || !user || !currentModel}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all shadow-lg disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSaving ? "💾 Sauvegarde..." : "💾 Sauvegarder"}
          </button>
        </div>

        {!user && (
          <p className="text-center text-orange-600 mt-3">
            Connectez-vous pour sauvegarder dans votre collection
          </p>
        )}
      </div>
    </div>
  );
}