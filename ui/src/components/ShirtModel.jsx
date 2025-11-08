import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Decal, Text } from "@react-three/drei";
import * as THREE from "three";

export default function ShirtModel({ color, logo, text, textureType, isRotating }) {
  const group = useRef();
  const { scene, materials } = useGLTF("/models/shirt.glb");
  const [modelSize, setModelSize] = useState(1);
  const [logoTexture, setLogoTexture] = useState(null);
  const [patternTexture, setPatternTexture] = useState(null);
  const shirtMeshRef = useRef(); // Référence pour le mesh spécifique

  // Créer une texture pour le motif
  const createPatternTexture = () => {
    const canvas = document.createElement('canvas');
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);
    
    switch(textureType) {
      case 'stripes':
        ctx.fillStyle = '#000000';
        ctx.globalAlpha = 0.4;
        for(let i = 0; i < size; i += 40) {
          ctx.fillRect(i, 0, 20, size);
        }
        ctx.globalAlpha = 1.0;
        break;
        
      case 'gradient':
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        const baseColor = new THREE.Color(color);
        const lighterColor = baseColor.clone().multiplyScalar(0.7);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, lighterColor.getStyle());
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        break;
        
      case 'dots':
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.4;
        for(let x = 0; x < size; x += 30) {
          for(let y = 0; y < size; y += 30) {
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1.0;
        break;
        
      case 'checker':
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.2;
        const squareSize = 25;
        for(let x = 0; x < size; x += squareSize * 2) {
          for(let y = 0; y < size; y += squareSize * 2) {
            ctx.fillRect(x, y, squareSize, squareSize);
            ctx.fillRect(x + squareSize, y + squareSize, squareSize, squareSize);
          }
        }
        ctx.globalAlpha = 1.0;
        break;
        
      default:
        break;
    }
    
    return canvas;
  };

  // Mettre à jour la texture du motif
  useEffect(() => {
    if (textureType !== 'none') {
      const patternCanvas = createPatternTexture();
      const texture = new THREE.CanvasTexture(patternCanvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
      setPatternTexture(texture);
    } else {
      setPatternTexture(null);
    }
  }, [textureType, color]);

  // Calculer la taille et centrer le modèle + trouver le mesh
  useEffect(() => {
    if (scene) {
      const bbox = new THREE.Box3().setFromObject(scene);
      const size = new THREE.Vector3();
      bbox.getSize(size);
      
      const maxDimension = Math.max(size.x, size.y, size.z);
      const targetScale = 3 / maxDimension;
      
      setModelSize(targetScale);
      
      const center = bbox.getCenter(new THREE.Vector3());
      scene.position.x = -center.x * targetScale;
      scene.position.y = -center.y * targetScale;
      scene.position.z = -center.z * targetScale;

      // Trouver le premier mesh pour les decals
      scene.traverse((child) => {
        if (child.isMesh && !shirtMeshRef.current) {
          shirtMeshRef.current = child;
          console.log("✅ Mesh du maillot trouvé:", child);
        }
      });
    }
  }, [scene]);

  // Charger la texture du logo
  useEffect(() => {
    if (logo) {
      const loader = new THREE.TextureLoader();
      loader.load(logo, (texture) => {
        setLogoTexture(texture);
      });
    } else {
      setLogoTexture(null);
    }
  }, [logo]);

  // Animation de rotation
  useFrame(() => {
    if (group.current && isRotating) group.current.rotation.y += 0.005;
  });

  // Appliquer couleur et texture aux matériaux
  useEffect(() => {
    if (materials) {
      Object.values(materials).forEach((material) => {
        if (material.isMeshStandardMaterial || material.isMeshPhysicalMaterial) {
          if (material.color) {
            material.color.set(color);
          }
          
          if (patternTexture && textureType !== 'none') {
            material.map = patternTexture;
            material.needsUpdate = true;
          } else {
            material.map = null;
            material.needsUpdate = true;
          }
          
          material.roughness = 0.7;
          material.metalness = 0.1;
        }
      });
    }
  }, [materials, color, patternTexture, textureType]);

  if (!scene) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  return (
    <group ref={group}>
      {/* Maillot avec échelle dynamique */}
      <primitive 
        object={scene} 
        scale={modelSize}
        position={[0, -1, 0]}
      />

      {/* Logo et texte - Solution alternative sans Decal */}
      {logoTexture && (
        <mesh position={[0, 0.8, 0.6]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.4, 0.4]} />
          <meshBasicMaterial 
            map={logoTexture} 
            transparent
            opacity={0.9}
          />
        </mesh>
      )}

      {text && (
        <Text
          position={[-0.8, 0.3, 0.6]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/helvetiker_regular.typeface.json"
        >
          {text}
          <meshBasicMaterial />
        </Text>
      )}
    </group>
  );
}