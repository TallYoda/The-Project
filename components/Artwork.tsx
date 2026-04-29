"use client";

import { useMemo, useRef, useState } from "react";
import { Group, Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useGameState } from "@/store/useGameState";

type ArtworkProps = {
  id: string;
  imageSrc: string;
  position: [number, number, number];
  rotation: [number, number, number];
};

export function Artwork({ id, imageSrc, position, rotation }: ArtworkProps) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const texture = useTexture(imageSrc);
  const maxAnisotropy = useThree((state) => state.gl.capabilities.getMaxAnisotropy());
  const [isHovered, setIsHovered] = useState(false);

  const currentPainting = useGameState((state) => state.currentPainting);
  const currentEffect = useGameState((state) => state.currentEffect);
  const isLightboxOpen = useGameState((state) => state.isLightboxOpen);
  const lightboxDisplay = useGameState((state) => state.lightboxDisplay);
  const openLightbox = useGameState((state) => state.openLightbox);

  const isSelected = currentPainting === id;
  const textureImage = texture.image as { width?: number; height?: number } | undefined;
  const imageWidth = textureImage?.width ?? 1;
  const imageHeight = textureImage?.height ?? 1;
  const imageAspect = imageWidth / imageHeight;
  const baseHeight = 3.2;
  const planeWidth = baseHeight * imageAspect;
  const planeHeight = baseHeight;

  const configuredTexture = useMemo(() => {
    const nextTexture = texture.clone();
    nextTexture.anisotropy = Math.max(1, Math.min(8, maxAnisotropy));
    nextTexture.needsUpdate = true;
    return nextTexture;
  }, [maxAnisotropy, texture]);

  useFrame(() => {
    if (!meshRef.current || !groupRef.current) return;
    const revealLerp =
      isSelected &&
      isLightboxOpen &&
      currentPainting === "storytime" &&
      currentEffect === "scene1"
        ? 0.04
        : 0.1;

    const targetScale =
      isSelected && isLightboxOpen
        ? lightboxDisplay.scale
        : isHovered && !isLightboxOpen
          ? 1.06
          : 1;
    meshRef.current.scale.x += (targetScale - meshRef.current.scale.x) * revealLerp;
    meshRef.current.scale.y += (targetScale - meshRef.current.scale.y) * revealLerp;
    meshRef.current.scale.z += (targetScale - meshRef.current.scale.z) * revealLerp;

    const targetPosition =
      isSelected && isLightboxOpen
        ? [
            lightboxDisplay.x + lightboxDisplay.xOffset,
            lightboxDisplay.y + lightboxDisplay.yOffset,
            lightboxDisplay.z,
          ]
        : isLightboxOpen
          ? [position[0], position[1], position[2] - 8]
          : isHovered
            ? [position[0], position[1] + 0.18, position[2] + 0.14]
            : position;
    groupRef.current.position.x += (targetPosition[0] - groupRef.current.position.x) * revealLerp;
    groupRef.current.position.y += (targetPosition[1] - groupRef.current.position.y) * revealLerp;
    groupRef.current.position.z += (targetPosition[2] - groupRef.current.position.z) * revealLerp;

    const targetRotation = isSelected && isLightboxOpen ? [0, 0, 0] : rotation;
    groupRef.current.rotation.x += (targetRotation[0] - groupRef.current.rotation.x) * revealLerp;
    groupRef.current.rotation.y += (targetRotation[1] - groupRef.current.rotation.y) * revealLerp;
    groupRef.current.rotation.z += (targetRotation[2] - groupRef.current.rotation.z) * revealLerp;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        onPointerOver={(event) => {
          event.stopPropagation();
          if (!isLightboxOpen) setIsHovered(true);
        }}
        onPointerOut={() => setIsHovered(false)}
        onClick={(event) => {
          event.stopPropagation();
          openLightbox(id);
        }}
      >
        <planeGeometry args={[planeWidth, planeHeight]} />
        <meshStandardMaterial
          map={configuredTexture}
          toneMapped={false}
          transparent
          opacity={isLightboxOpen ? (isSelected ? 1 : 0.02) : 0.9}
          emissive="#000000"
          emissiveIntensity={0}
          roughness={0.75}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}
