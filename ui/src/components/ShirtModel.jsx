import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Decal, Text } from "@react-three/drei";
import * as THREE from "three";

export default function ShirtModel({ 
  color, 
  color2 = "#ffffff", // Secondary color for patterns
  logo, 
  logoPosition = { x: 0, y: 0.8, z: 0.6 },
  logoScale = 0.4,
  text, 
  textPosition = { x: 0, y: -0.3, z: -0.6 },
  textScale = 0.15,
  number,
  numberPosition = { x: 0, y: 0.3, z: -0.6 },
  numberScale = 0.4,
  textureType,
  patternStyle = "solid", // Pattern style ID
  isRotating 
}) {
  const group = useRef();
  const { scene, materials } = useGLTF("/models/shirt.glb");
  const [modelSize, setModelSize] = useState(1);
  const [logoTexture, setLogoTexture] = useState(null);
  const [patternTexture, setPatternTexture] = useState(null);
  const shirtMeshRef = useRef(); // Référence pour le mesh spécifique

  // Mettre à jour la texture du motif
  useEffect(() => {
    const createAndSetTexture = () => {
      const canvas = document.createElement('canvas');
      const size = 512;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      // Base color fill
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, size, size);
      
      switch(patternStyle) {
        case 'horizontal-stripes':
          const stripeHeight = size / 8;
          ctx.fillStyle = color2;
          for(let i = 0; i < size; i += stripeHeight * 2) {
            ctx.fillRect(0, i, size, stripeHeight);
          }
          break;
          
        case 'vertical-stripes':
          const stripeWidth = size / 8;
          ctx.fillStyle = color2;
          for(let i = 0; i < size; i += stripeWidth * 2) {
            ctx.fillRect(i, 0, stripeWidth, size);
          }
          break;
          
        case 'diagonal-stripes':
          ctx.fillStyle = color2;
          const angle = 45 * Math.PI / 180;
          const stripeSpacing = 40;
          for(let i = -size; i < size * 2; i += stripeSpacing * 2) {
            ctx.save();
            ctx.translate(size / 2, size / 2);
            ctx.rotate(angle);
            ctx.fillRect(i - size / 2, -size, stripeSpacing, size * 2);
            ctx.restore();
          }
          break;
          
        case 'gradient':
          const gradient = ctx.createLinearGradient(0, 0, 0, size);
          gradient.addColorStop(0, color);
          gradient.addColorStop(1, color2);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, size, size);
          break;
          
        case 'half-split':
          ctx.fillStyle = color2;
          ctx.fillRect(size / 2, 0, size / 2, size);
          break;
          
        case 'dots':
          ctx.fillStyle = color2;
          const dotRadius = 8;
          const dotSpacing = 30;
          for(let x = dotSpacing / 2; x < size; x += dotSpacing) {
            for(let y = dotSpacing / 2; y < size; y += dotSpacing) {
              ctx.beginPath();
              ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          break;
          
        case 'checker':
          ctx.fillStyle = color2;
          const squareSize = 40;
          for(let x = 0; x < size; x += squareSize * 2) {
            for(let y = 0; y < size; y += squareSize * 2) {
              ctx.fillRect(x, y, squareSize, squareSize);
              ctx.fillRect(x + squareSize, y + squareSize, squareSize, squareSize);
            }
          }
          break;
          
        case 'solid':
        default:
          // Already filled with base color
          break;
      }
      
      return canvas;
    };

    if (patternStyle !== 'solid') {
      const patternCanvas = createAndSetTexture();
      const texture = new THREE.CanvasTexture(patternCanvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
      texture.needsUpdate = true;
      setPatternTexture(texture);
    } else {
      setPatternTexture(null);
    }
  }, [color, color2, patternStyle]);

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

      {/* Logo with dynamic positioning */}
      {logoTexture && (
        <mesh 
          position={[logoPosition.x, logoPosition.y, logoPosition.z]} 
          rotation={logoPosition.z < 0 ? [0, Math.PI, 0] : [0, 0, 0]}
        >
          <planeGeometry args={[logoScale, logoScale]} />
          <meshBasicMaterial 
            map={logoTexture} 
            transparent
            opacity={0.95}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Player Name on Back */}
      {text && (
        <Text
          position={[textPosition.x, textPosition.y, textPosition.z]}
          rotation={textPosition.z < 0 ? [0, Math.PI, 0] : [0, 0, 0]}
          fontSize={textScale}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={textScale * 0.05}
          outlineColor="#000000"
        >
          {text.toUpperCase()}
        </Text>
      )}

      {/* Player Number on Back */}
      {number && (
        <Text
          position={[numberPosition.x, numberPosition.y, numberPosition.z]}
          rotation={numberPosition.z < 0 ? [0, Math.PI, 0] : [0, 0, 0]}
          fontSize={numberScale}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={numberScale * 0.05}
          outlineColor="#000000"
          font="/fonts/Roboto_Regular.json"
        >
          {number}
        </Text>
      )}
    </group>
  );
}