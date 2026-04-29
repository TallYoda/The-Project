"use client";

import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useGameState } from "@/store/useGameState";

const targetVector = new Vector3();

export function CameraController() {
  const scrollZ = useGameState((state) => state.scrollZ);
  const isLightboxOpen = useGameState((state) => state.isLightboxOpen);
  const lightboxDisplay = useGameState((state) => state.lightboxDisplay);
  const LIGHTBOX_CAMERA_Z = 6;

  useFrame(({ camera }) => {
    if (isLightboxOpen) {
      targetVector.set(lightboxDisplay.x, lightboxDisplay.y, LIGHTBOX_CAMERA_Z);
      camera.position.lerp(targetVector, 0.1);
    } else {
      targetVector.set(0, 0, scrollZ);
      camera.position.lerp(targetVector, 0.06);
    }

    camera.lookAt(0, 0, 0);
  });

  return null;
}
