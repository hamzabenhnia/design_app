import React, { useState, useRef, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import { saveAs } from "file-saver";
import * as htmlToImage from "html-to-image";
import { 
  Undo2, Redo2, Download, Save, Share2, Layers, Ruler, 
  Image as ImageIcon, Type, Palette, Grid, Sparkles, X 
} from "lucide-react";
import ShirtModel from "./ShirtModel";
import { useAppDispatch, useAuth, useDesigns, useModels } from "../hooks";
import { createDesign } from "../redux/actions/designActions";

// Size guide data
const SIZE_GUIDE = {
  XS: { chest: "81-86cm", length: "66cm", shoulders: "42cm" },
  S: { chest: "86-91cm", length: "69cm", shoulders: "44cm" },
  M: { chest: "91-97cm", length: "72cm", shoulders: "46cm" },
  L: { chest: "97-102cm", length: "74cm", shoulders: "49cm" },
  XL: { chest: "102-107cm", length: "76cm", shoulders: "52cm" },
  XXL: { chest: "107-112cm", length: "78cm", shoulders: "54cm" }
};

// Template categories
const TEMPLATES = {
  "Premier League": [
    { id: 1, name: "Classic Stripes", color: "#0055a4", textureType: "stripes" },
    { id: 2, name: "Red Devils", color: "#ef4135", textureType: "gradient" },
    { id: 3, name: "Sky Blues", color: "#6CABDD", textureType: "none" }
  ],
  "La Liga": [
    { id: 4, name: "Blaugrana", color: "#A50044", textureType: "stripes" },
    { id: 5, name: "Royal White", color: "#ffffff", textureType: "none" },
    { id: 6, name: "Rojiblancos", color: "#CB3524", textureType: "stripes" }
  ],
  "Serie A": [
    { id: 7, name: "Nerazzurri", color: "#0068A8", textureType: "stripes" },
    { id: 8, name: "Rossoneri", color: "#FB090B", textureType: "stripes" },
    { id: 9, name: "Bianconeri", color: "#000000", textureType: "stripes" }
  ]
};

// Football team logos for suggestions
const TEAM_LOGOS = [
  { id: 1, name: "Manchester United", url: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg" },
  { id: 2, name: "Real Madrid", url: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg" },
  { id: 3, name: "Barcelona", url: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg" },
  { id: 4, name: "Bayern Munich", url: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg" },
  { id: 5, name: "Liverpool", url: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg" },
  { id: 6, name: "Chelsea", url: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg" },
  { id: 7, name: "PSG", url: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg" },
  { id: 8, name: "Juventus", url: "https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_logo.svg" },
  { id: 9, name: "AC Milan", url: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg" },
  { id: 10, name: "Inter Milan", url: "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg" },
  { id: 11, name: "Arsenal", url: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" },
  { id: 12, name: "Manchester City", url: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg" }
];

// Pattern style suggestions
const PATTERN_STYLES = [
  {
    id: "solid",
    name: "Solid",
    preview: (color1) => (
      <div className="w-full h-full" style={{ backgroundColor: color1 }} />
    ),
    colors: 1,
    patternType: "none"
  },
  {
    id: "horizontal-stripes",
    name: "Horizontal Stripes",
    preview: (color1, color2) => (
      <div className="w-full h-full flex flex-col">
        <div className="flex-1" style={{ backgroundColor: color1 }} />
        <div className="flex-1" style={{ backgroundColor: color2 }} />
        <div className="flex-1" style={{ backgroundColor: color1 }} />
        <div className="flex-1" style={{ backgroundColor: color2 }} />
      </div>
    ),
    colors: 2,
    patternType: "stripes",
    orientation: "horizontal"
  },
  {
    id: "vertical-stripes",
    name: "Vertical Stripes",
    preview: (color1, color2) => (
      <div className="w-full h-full flex">
        <div className="flex-1" style={{ backgroundColor: color1 }} />
        <div className="flex-1" style={{ backgroundColor: color2 }} />
        <div className="flex-1" style={{ backgroundColor: color1 }} />
        <div className="flex-1" style={{ backgroundColor: color2 }} />
      </div>
    ),
    colors: 2,
    patternType: "stripes",
    orientation: "vertical"
  },
  {
    id: "gradient",
    name: "Gradient",
    preview: (color1, color2) => (
      <div 
        className="w-full h-full" 
        style={{ 
          background: `linear-gradient(to bottom, ${color1}, ${color2})` 
        }} 
      />
    ),
    colors: 2,
    patternType: "gradient"
  },
  {
    id: "diagonal-stripes",
    name: "Diagonal Stripes",
    preview: (color1, color2) => (
      <div 
        className="w-full h-full" 
        style={{ 
          background: `repeating-linear-gradient(45deg, ${color1}, ${color1} 10px, ${color2} 10px, ${color2} 20px)` 
        }} 
      />
    ),
    colors: 2,
    patternType: "stripes",
    orientation: "diagonal"
  },
  {
    id: "half-split",
    name: "Half Split",
    preview: (color1, color2) => (
      <div className="w-full h-full flex">
        <div className="flex-1" style={{ backgroundColor: color1 }} />
        <div className="flex-1" style={{ backgroundColor: color2 }} />
      </div>
    ),
    colors: 2,
    patternType: "split",
    orientation: "vertical"
  },
  {
    id: "dots",
    name: "Dots Pattern",
    preview: (color1, color2) => (
      <div 
        className="w-full h-full" 
        style={{ 
          backgroundColor: color1,
          backgroundImage: `radial-gradient(circle, ${color2} 20%, transparent 20%)`,
          backgroundSize: '15px 15px'
        }} 
      />
    ),
    colors: 2,
    patternType: "dots"
  },
  {
    id: "checker",
    name: "Checker",
    preview: (color1, color2) => (
      <div 
        className="w-full h-full" 
        style={{ 
          backgroundColor: color1,
          backgroundImage: `
            linear-gradient(45deg, ${color2} 25%, transparent 25%),
            linear-gradient(-45deg, ${color2} 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, ${color2} 75%),
            linear-gradient(-45deg, transparent 75%, ${color2} 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }} 
      />
    ),
    colors: 2,
    patternType: "checker"
  }
];

// Design layer management
class DesignHistory {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
    this.maxHistory = 50;
  }

  push(state) {
    // Remove any future states if we're not at the end
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    this.history.push(JSON.parse(JSON.stringify(state)));
    
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }
  }

  undo() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history[this.currentIndex];
    }
    return null;
  }

  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }
    return null;
  }

  canUndo() {
    return this.currentIndex > 0;
  }

  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  clear() {
    this.history = [];
    this.currentIndex = -1;
  }
}

export default function EnhancedKitDesigner() {
  // State management
  const [selectedSize, setSelectedSize] = useState("M");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showLayers, setShowLayers] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Premier League");
  
  // Design state
  const [designState, setDesignState] = useState({
    color: "#0055a4",
    color2: "#ffffff", // Secondary color for patterns
    patternStyle: "solid", // Current pattern style
    logo: null,
    logoFile: null,
    logoPosition: { x: 0, y: 0.8, z: 0.6 }, // Front center position
    logoScale: 0.4,
    text: "",
    textPosition: { x: 0, y: -0.3, z: -0.6 }, // Back position
    textScale: 0.15,
    number: "",
    numberPosition: { x: 0, y: 0.3, z: -0.6 }, // Back upper position
    numberScale: 0.4,
    textureType: "none",
    layers: []
  });

  const [isRotating, setIsRotating] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [shareLink, setShareLink] = useState(null);
  const [showTeamLogos, setShowTeamLogos] = useState(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  
  // History for undo/redo
  const [history] = useState(() => new DesignHistory());
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const canvasRef = useRef();
  const containerRef = useRef();

  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuth();
  const { isLoading: isSaving, currentDesign } = useDesigns();
  const { currentModel } = useModels();

  // Save to history on state change
  useEffect(() => {
    if (designState.color || designState.text) {
      history.push(designState);
      setCanUndo(history.canUndo());
      setCanRedo(history.canRedo());
    }
  }, [designState, history]);

  // Update design state helper
  const updateDesign = (updates) => {
    setDesignState(prev => ({ ...prev, ...updates }));
  };

  // Undo/Redo handlers
  const handleUndo = () => {
    const previousState = history.undo();
    if (previousState) {
      setDesignState(previousState);
      setCanUndo(history.canUndo());
      setCanRedo(history.canRedo());
    }
  };

  const handleRedo = () => {
    const nextState = history.redo();
    if (nextState) {
      setDesignState(nextState);
      setCanUndo(history.canUndo());
      setCanRedo(history.canRedo());
    }
  };

  // Template application
  const applyTemplate = (template) => {
    updateDesign({
      color: template.color,
      textureType: template.textureType
    });
    setShowTemplates(false);
  };

  // Logo upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    updateDesign({ logo: localUrl, logoFile: file });
    
    // Add to layers
    const newLayer = {
      id: Date.now(),
      type: 'logo',
      visible: true,
      name: file.name
    };
    updateDesign({ layers: [...designState.layers, newLayer] });
  };

  // Select team logo
  const handleTeamLogoSelect = (teamLogo) => {
    updateDesign({ logo: teamLogo.url });
    
    // Add to layers
    const newLayer = {
      id: Date.now(),
      type: 'logo',
      visible: true,
      name: teamLogo.name
    };
    updateDesign({ layers: [...designState.layers, newLayer] });
    setShowTeamLogos(false);
  };

  // Move logo position
  const handleLogoPositionChange = (axis, value) => {
    updateDesign({
      logoPosition: {
        ...designState.logoPosition,
        [axis]: parseFloat(value)
      }
    });
  };

  // Move text position
  const handleTextPositionChange = (axis, value) => {
    updateDesign({
      textPosition: {
        ...designState.textPosition,
        [axis]: parseFloat(value)
      }
    });
  };

  // Move number position
  const handleNumberPositionChange = (axis, value) => {
    updateDesign({
      numberPosition: {
        ...designState.numberPosition,
        [axis]: parseFloat(value)
      }
    });
  };

  // Toggle logo to front/back
  const toggleLogoSide = () => {
    const isFront = designState.logoPosition.z > 0;
    updateDesign({
      logoPosition: {
        ...designState.logoPosition,
        z: isFront ? -0.6 : 0.6
      }
    });
  };

  // Toggle text to front/back
  const toggleTextSide = () => {
    const isFront = designState.textPosition.z > 0;
    updateDesign({
      textPosition: {
        ...designState.textPosition,
        z: isFront ? -0.6 : 0.6
      }
    });
  };

  // Toggle number to front/back
  const toggleNumberSide = () => {
    const isFront = designState.numberPosition.z > 0;
    updateDesign({
      numberPosition: {
        ...designState.numberPosition,
        z: isFront ? -0.6 : 0.6
      }
    });
  };

  // Layer management
  const toggleLayerVisibility = (layerId) => {
    updateDesign({
      layers: designState.layers.map(layer => 
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    });
  };

  const removeLayer = (layerId) => {
    updateDesign({
      layers: designState.layers.filter(layer => layer.id !== layerId)
    });
  };

  // Export functions
  const exportAsPNG = async (resolution = 1) => {
    if (!containerRef.current) return;
    try {
      const blob = await htmlToImage.toBlob(containerRef.current, {
        quality: 1.0,
        pixelRatio: resolution * 2,
      });
      saveAs(blob, `football-kit-${selectedSize}-${Date.now()}.png`);
    } catch (error) {
      console.error("Export error:", error);
      alert("Erreur lors de l'export");
    }
  };

  const exportAsSVG = async () => {
    // SVG export would need additional implementation
    alert("Export SVG - Feature coming soon!");
  };

  // Save design
  const handleSaveDesign = async () => {
    if (!user || !currentModel) {
      alert("Veuillez vous connecter et sélectionner un modèle");
      return;
    }

    const designData = {
      model3D: currentModel._id,
      name: designState.text || `Design ${new Date().toLocaleDateString()}`,
      color: designState.color,
      text: designState.text,
      textureType: designState.textureType,
      settings: {
        size: selectedSize,
        fontSize: 24,
        textColor: '#FFFFFF',
        number: designState.number,
        layers: designState.layers
      }
    };

    if (designState.logo && !designState.logo.startsWith('blob:')) {
      designData.logo = { url: designState.logo };
    }

    try {
      await dispatch(createDesign(designData)).unwrap();
      alert("✅ Design sauvegardé!");
    } catch (error) {
      alert("❌ Erreur: " + error.message);
    }
  };

  // Share design
  const handleShare = () => {
    const designData = btoa(JSON.stringify(designState));
    const link = `${window.location.origin}/design?shared=${designData}`;
    navigator.clipboard.writeText(link);
    setShareLink(link);
    setTimeout(() => setShareLink(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            ⚽ Football Kit Designer Pro
          </h1>
          <p className="text-white/90">Create your perfect football kit with advanced tools</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Sidebar - Tools */}
          <div className="lg:col-span-3 space-y-4">
            {/* Size Selection */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Ruler size={18} />
                  Size
                </h3>
                <button
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Size Guide
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(SIZE_GUIDE).map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 rounded-lg font-medium transition ${
                      selectedSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {showSizeGuide && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="font-semibold mb-1">{selectedSize} Measurements:</p>
                  <p>Chest: {SIZE_GUIDE[selectedSize].chest}</p>
                  <p>Length: {SIZE_GUIDE[selectedSize].length}</p>
                  <p>Shoulders: {SIZE_GUIDE[selectedSize].shoulders}</p>
                </div>
              )}
            </div>

            {/* Templates */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="w-full flex items-center justify-between font-semibold mb-3"
              >
                <span className="flex items-center gap-2">
                  <Grid size={18} />
                  Templates
                </span>
                <Sparkles size={16} className="text-yellow-500" />
              </button>

              {showTemplates && (
                <div className="space-y-3">
                  {Object.keys(TEMPLATES).map(category => (
                    <div key={category}>
                      <button
                        onClick={() => setActiveCategory(category)}
                        className={`w-full text-left px-2 py-1 rounded text-sm font-medium ${
                          activeCategory === category ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-50'
                        }`}
                      >
                        {category}
                      </button>
                      
                      {activeCategory === category && (
                        <div className="mt-2 space-y-1 pl-2">
                          {TEMPLATES[category].map(template => (
                            <button
                              key={template.id}
                              onClick={() => applyTemplate(template)}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
                            >
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: template.color }}
                              />
                              {template.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Layers */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <button
                onClick={() => setShowLayers(!showLayers)}
                className="w-full flex items-center justify-between font-semibold mb-3"
              >
                <span className="flex items-center gap-2">
                  <Layers size={18} />
                  Layers ({designState.layers.length})
                </span>
              </button>

              {showLayers && (
                <div className="space-y-2">
                  {designState.layers.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No layers yet</p>
                  ) : (
                    designState.layers.map(layer => (
                      <div
                        key={layer.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={layer.visible}
                            onChange={() => toggleLayerVisibility(layer.id)}
                            className="rounded"
                          />
                          <span className="text-sm truncate max-w-[120px]">{layer.name}</span>
                        </div>
                        <button
                          onClick={() => removeLayer(layer.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Center - 3D Preview */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Toolbar */}
              <div className="bg-gray-50 border-b px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleUndo}
                    disabled={!canUndo}
                    className="p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Undo (Ctrl+Z)"
                  >
                    <Undo2 size={18} />
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={!canRedo}
                    className="p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Redo (Ctrl+Y)"
                  >
                    <Redo2 size={18} />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-2" />
                  <button
                    onClick={() => setIsRotating(!isRotating)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      isRotating ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {isRotating ? '⏸ Stop' : '▶ Rotate'}
                  </button>
                </div>

                <div className="text-sm font-medium text-gray-600">
                  Size: {selectedSize}
                </div>
              </div>

              {/* Canvas */}
              <div ref={containerRef} className="w-full h-[500px] bg-gradient-to-b from-gray-50 to-gray-100">
                <Canvas
                  ref={canvasRef}
                  camera={{ position: [0, 0, 4], fov: 50 }}
                  gl={{ preserveDrawingBuffer: true }}
                >
                  <ambientLight intensity={0.8} />
                  <directionalLight position={[5, 5, 5]} intensity={1} />
                  <directionalLight position={[-5, 5, -5]} intensity={0.5} />

                  <Suspense fallback={
                    <Html center>
                      <div className="text-blue-600 font-semibold">Loading kit...</div>
                    </Html>
                  }>
                    <ShirtModel
                      color={designState.color}
                      color2={designState.color2}
                      logo={designState.logo}
                      logoPosition={designState.logoPosition}
                      logoScale={designState.logoScale}
                      text={designState.text}
                      textPosition={designState.textPosition}
                      textScale={designState.textScale}
                      number={designState.number}
                      numberPosition={designState.numberPosition}
                      numberScale={designState.numberScale}
                      textureType={designState.textureType}
                      patternStyle={designState.patternStyle}
                      isRotating={isRotating}
                    />
                  </Suspense>

                  <OrbitControls enableZoom enablePan />
                  <Environment preset="city" />
                </Canvas>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Design Controls */}
          <div className="lg:col-span-3 space-y-4">
            {/* Color Picker */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Palette size={18} />
                Base Color
              </h3>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {["#0055a4", "#ef4135", "#008000", "#000000", "#ffcc00", "#ffffff", "#6CABDD", "#A50044"].map(c => (
                  <button
                    key={c}
                    onClick={() => updateDesign({ color: c })}
                    className={`w-full aspect-square rounded-lg border-2 transition ${
                      designState.color === c ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={designState.color}
                onChange={(e) => updateDesign({ color: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
              
              {/* Secondary Color - only show if pattern needs 2 colors */}
              {PATTERN_STYLES.find(p => p.id === designState.patternStyle)?.colors > 1 && (
                <div className="mt-4 pt-4 border-t">
                  <label className="block text-sm font-medium mb-3">Secondary Color</label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {["#0055a4", "#ef4135", "#008000", "#000000", "#ffcc00", "#ffffff", "#6CABDD", "#A50044"].map(c => (
                      <button
                        key={c}
                        onClick={() => updateDesign({ color2: c })}
                        className={`w-full aspect-square rounded-lg border-2 transition ${
                          designState.color2 === c ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={designState.color2}
                    onChange={(e) => updateDesign({ color2: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Pattern Style Selector */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Grid size={18} />
                Pattern Style
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {PATTERN_STYLES.map(pattern => {
                  const selectedPattern = PATTERN_STYLES.find(p => p.id === designState.patternStyle);
                  const isSelected = designState.patternStyle === pattern.id;
                  
                  return (
                    <button
                      key={pattern.id}
                      onClick={() => {
                        updateDesign({ 
                          patternStyle: pattern.id,
                          textureType: pattern.patternType 
                        });
                      }}
                      className={`relative aspect-square rounded-lg border-2 overflow-hidden transition ${
                        isSelected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      <div className="w-full h-full">
                        {pattern.preview(designState.color, designState.color2)}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs py-1 px-2 text-center">
                        {pattern.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logo Upload */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <ImageIcon size={18} />
                Logo
              </h3>
              
              {/* File Upload */}
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition group">
                  {designState.logo ? (
                    <div className="relative">
                      <img 
                        src={designState.logo} 
                        alt="Logo" 
                        className="w-20 h-20 mx-auto object-contain transition group-hover:opacity-70" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <span className="text-sm font-medium text-blue-600">Click to change</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 group-hover:text-blue-500 transition">
                      <ImageIcon size={32} className="mx-auto mb-2" />
                      <p className="text-sm">Click to upload logo</p>
                    </div>
                  )}
                </div>
              </label>

              {/* Team Logo Suggestions */}
              <button
                onClick={() => setShowTeamLogos(!showTeamLogos)}
                className="w-full mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1"
              >
                <Sparkles size={14} />
                {showTeamLogos ? 'Hide' : 'Show'} Team Logos
              </button>

              {showTeamLogos && (
                <div className="mt-3 max-h-64 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                  <div className="grid grid-cols-3 gap-2">
                    {TEAM_LOGOS.map(team => (
                      <button
                        key={team.id}
                        onClick={() => handleTeamLogoSelect(team)}
                        className="p-2 border rounded-lg hover:bg-white hover:border-blue-500 transition flex flex-col items-center gap-1"
                        title={team.name}
                      >
                        <img 
                          src={team.url} 
                          alt={team.name}
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <span className="text-xs text-gray-600 truncate w-full text-center">
                          {team.name.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Logo Position Controls */}
              {designState.logo && (
                <div className="mt-4 space-y-2 pt-3 border-t">
                  <p className="text-xs font-medium text-gray-600 mb-2">Logo Position</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={toggleLogoSide}
                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-200 transition"
                    >
                      {designState.logoPosition.z > 0 ? 'Move to Back' : 'Move to Front'}
                    </button>
                    
                    <button
                      onClick={() => updateDesign({ 
                        logoPosition: { x: 0, y: 0.8, z: 0.6 },
                        logoScale: 0.4 
                      })}
                      className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 transition"
                    >
                      Reset Position
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-600">Horizontal (X)</label>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.1"
                      value={designState.logoPosition.x}
                      onChange={(e) => handleLogoPositionChange('x', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-600">Vertical (Y)</label>
                    <input
                      type="range"
                      min="-1"
                      max="2"
                      step="0.1"
                      value={designState.logoPosition.y}
                      onChange={(e) => handleLogoPositionChange('y', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-600">Size</label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={designState.logoScale}
                      onChange={(e) => updateDesign({ logoScale: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Text */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Type size={18} />
                Text & Number
              </h3>
              
              {/* Player Name Input */}
              <div className="mb-3">
                <label className="text-xs text-gray-600 mb-1 block">Player Name</label>
                <input
                  type="text"
                  value={designState.text}
                  onChange={(e) => updateDesign({ text: e.target.value })}
                  placeholder="Player name..."
                  className="w-full border p-2 rounded-lg"
                  maxLength={15}
                />
              </div>

              {/* Text Position Controls */}
              {designState.text && (
                <div className="mb-4 space-y-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 mb-2">Name Position</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      onClick={toggleTextSide}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1.5 rounded hover:bg-blue-200 transition"
                    >
                      {designState.textPosition.z > 0 ? 'Move to Back' : 'Move to Front'}
                    </button>
                    
                    <button
                      onClick={() => updateDesign({ 
                        textPosition: { x: 0, y: -0.3, z: -0.6 },
                        textScale: 0.15 
                      })}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1.5 rounded hover:bg-gray-200 transition"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-600">Horizontal (X)</label>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.1"
                      value={designState.textPosition.x}
                      onChange={(e) => handleTextPositionChange('x', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-600">Vertical (Y)</label>
                    <input
                      type="range"
                      min="-1"
                      max="2"
                      step="0.1"
                      value={designState.textPosition.y}
                      onChange={(e) => handleTextPositionChange('y', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-600">Size</label>
                    <input
                      type="range"
                      min="0.05"
                      max="0.5"
                      step="0.01"
                      value={designState.textScale}
                      onChange={(e) => updateDesign({ textScale: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Player Number Input */}
              <div className="mb-3">
                <label className="text-xs text-gray-600 mb-1 block">Jersey Number</label>
                <input
                  type="text"
                  value={designState.number}
                  onChange={(e) => updateDesign({ number: e.target.value })}
                  placeholder="Number..."
                  className="w-full border p-2 rounded-lg"
                  maxLength={2}
                />
              </div>

              {/* Number Position Controls */}
              {designState.number && (
                <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 mb-2">Number Position</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      onClick={toggleNumberSide}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1.5 rounded hover:bg-blue-200 transition"
                    >
                      {designState.numberPosition.z > 0 ? 'Move to Back' : 'Move to Front'}
                    </button>
                    
                    <button
                      onClick={() => updateDesign({ 
                        numberPosition: { x: 0, y: 0.3, z: -0.6 },
                        numberScale: 0.4 
                      })}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1.5 rounded hover:bg-gray-200 transition"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-600">Horizontal (X)</label>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.1"
                      value={designState.numberPosition.x}
                      onChange={(e) => handleNumberPositionChange('x', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-600">Vertical (Y)</label>
                    <input
                      type="range"
                      min="-1"
                      max="2"
                      step="0.1"
                      value={designState.numberPosition.y}
                      onChange={(e) => handleNumberPositionChange('y', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-600">Size</label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={designState.numberScale}
                      onChange={(e) => updateDesign({ numberScale: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Pattern */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <h3 className="font-semibold mb-3">Pattern</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "none", label: "Solid" },
                  { value: "stripes", label: "Stripes" },
                  { value: "gradient", label: "Gradient" },
                  { value: "dots", label: "Dots" }
                ].map(p => (
                  <button
                    key={p.value}
                    onClick={() => updateDesign({ textureType: p.value })}
                    className={`py-2 rounded-lg text-sm font-medium transition ${
                      designState.textureType === p.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl p-4 shadow-lg space-y-2">
              <button
                onClick={handleSaveDesign}
                disabled={isSaving || !user}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {isSaving ? 'Saving...' : 'Save Design'}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => exportAsPNG(2)}
                  className="bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-1"
                >
                  <Download size={16} />
                  PNG HD
                </button>
                <button
                  onClick={exportAsSVG}
                  className="bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center justify-center gap-1"
                >
                  <Download size={16} />
                  SVG
                </button>
              </div>

              <button
                onClick={handleShare}
                className="w-full bg-pink-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-pink-700 flex items-center justify-center gap-2"
              >
                <Share2 size={16} />
                Share Design
              </button>

              {shareLink && (
                <div className="text-xs text-green-600 text-center p-2 bg-green-50 rounded">
                  ✓ Link copied to clipboard!
                </div>
              )}

              {!user && (
                <p className="text-xs text-orange-600 text-center">
                  Login to save your designs
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
