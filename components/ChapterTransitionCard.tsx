"use client";

import { useMemo, useRef } from "react";
import { FrontSide, Group, Mesh } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { artworks } from "@/data/artworks";
import { useGameState } from "@/store/useGameState";
import type { SceneState } from "@/data/scenes";

const RESET_POSE = {
  scale: 1.05,
  x: 0,
  y: 0,
  z: -0.15,
  xOffset: 0,
  yOffset: 0,
};

const NEUTRAL_EFFECTS: SceneState["effects"] = {
  brightness: 1,
  contrast: 1,
  saturation: 1,
  vignette: 0.45,
  blur: 0,
  colorShift: 0,
};

const RESET_DURATION_MS = 2400;
const FLIP_DURATION_MS = 1700;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function mix(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

type Effects = SceneState["effects"];
type Display = {
  scale: number;
  x: number;
  y: number;
  z: number;
  xOffset: number;
  yOffset: number;
};

type ChapterTransitionCardProps = {
  effects: Effects;
  onEffectsChange: (effects: Effects) => void;
};

export function ChapterTransitionController({ effects, onEffectsChange }: ChapterTransitionCardProps) {
  const transition = useGameState((state) => state.chapterTransition);
  const lightboxDisplay = useGameState((state) => state.lightboxDisplay);
  const setLightboxDisplayValues = useGameState((state) => state.setLightboxDisplayValues);
  const setChapterTransitionPhase = useGameState((state) => state.setChapterTransitionPhase);
  const completeChapterTransition = useGameState((state) => state.completeChapterTransition);

  const fromArtwork = artworks.find((artwork) => artwork.id === transition?.fromId);
  const toArtwork = artworks.find((artwork) => artwork.id === transition?.toId);

  const startDisplayRef = useRef<Display | null>(null);
  const startEffectsRef = useRef<Effects | null>(null);
  const resetStartRef = useRef<number | null>(null);
  const flipArmedRef = useRef(false);
  const transitionKey = transition ? `${transition.fromId}->${transition.toId}` : null;
  const activeKeyRef = useRef<string | null>(null);

  useFrame(() => {
    if (!transition || transition.phase !== "reset") return;

    // Fresh transition: lock the current dramatized pose/effects as the reverse start.
    if (activeKeyRef.current !== transitionKey) {
      activeKeyRef.current = transitionKey;
      startDisplayRef.current = { ...lightboxDisplay };
      startEffectsRef.current = { ...effects };
      resetStartRef.current = performance.now();
      flipArmedRef.current = false;
      return;
    }

    if (!startDisplayRef.current || !startEffectsRef.current || resetStartRef.current === null) return;

    const raw = Math.min(1, (performance.now() - resetStartRef.current) / RESET_DURATION_MS);
    const t = easeInOut(raw);
    const fromDisplay = startDisplayRef.current;
    const fromEffects = startEffectsRef.current;

    const nextDisplay: Display = {
      scale: mix(fromDisplay.scale, RESET_POSE.scale, t),
      x: mix(fromDisplay.x, RESET_POSE.x, t),
      y: mix(fromDisplay.y, RESET_POSE.y, t),
      z: mix(fromDisplay.z, RESET_POSE.z, t),
      xOffset: mix(fromDisplay.xOffset, RESET_POSE.xOffset, t),
      yOffset: mix(fromDisplay.yOffset, RESET_POSE.yOffset, t),
    };

    const nextEffects: Effects = {
      brightness: mix(fromEffects.brightness, NEUTRAL_EFFECTS.brightness, t),
      contrast: mix(fromEffects.contrast, NEUTRAL_EFFECTS.contrast, t),
      saturation: mix(fromEffects.saturation, NEUTRAL_EFFECTS.saturation, t),
      vignette: mix(fromEffects.vignette, NEUTRAL_EFFECTS.vignette, t),
      blur: mix(fromEffects.blur, NEUTRAL_EFFECTS.blur, t),
      colorShift: mix(fromEffects.colorShift, NEUTRAL_EFFECTS.colorShift, t),
    };

    setLightboxDisplayValues(nextDisplay);
    onEffectsChange(nextEffects);

    if (raw >= 1 && !flipArmedRef.current) {
      flipArmedRef.current = true;
      setChapterTransitionPhase("flip");
    }
  });

  if (!transition || !fromArtwork || !toArtwork) return null;

  return (
    <>
      {/* Preload the next chapter texture during reset so the flip does not hitch. */}
      <TexturePreloader src={toArtwork.imageSrc} />
      {transition.phase === "flip" ? (
        <ChapterFlipCard
          key={`${transition.fromId}->${transition.toId}`}
          fromSrc={fromArtwork.imageSrc}
          toSrc={toArtwork.imageSrc}
          onEffectsChange={onEffectsChange}
          onComplete={completeChapterTransition}
        />
      ) : null}
    </>
  );
}

function TexturePreloader({ src }: { src: string }) {
  useTexture(src);
  return null;
}

type FlipCardProps = {
  fromSrc: string;
  toSrc: string;
  onEffectsChange: (effects: Effects) => void;
  onComplete: () => void;
};

function ChapterFlipCard({ fromSrc, toSrc, onEffectsChange, onComplete }: FlipCardProps) {
  const groupRef = useRef<Group>(null);
  const frontRef = useRef<Mesh>(null);
  const backRef = useRef<Mesh>(null);
  const flipStartRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const lightboxDisplay = useGameState((state) => state.lightboxDisplay);
  const maxAnisotropy = useThree((state) => state.gl.capabilities.getMaxAnisotropy());
  const [fromTexture, toTexture] = useTexture([fromSrc, toSrc]);

  const frontMap = useMemo(() => {
    const next = fromTexture.clone();
    next.anisotropy = Math.max(1, Math.min(8, maxAnisotropy));
    next.needsUpdate = true;
    return next;
  }, [fromTexture, maxAnisotropy]);

  const backMap = useMemo(() => {
    const next = toTexture.clone();
    next.anisotropy = Math.max(1, Math.min(8, maxAnisotropy));
    next.needsUpdate = true;
    return next;
  }, [maxAnisotropy, toTexture]);

  const frontImage = fromTexture.image as { width?: number; height?: number } | undefined;
  const backImage = toTexture.image as { width?: number; height?: number } | undefined;
  const frontAspect = (frontImage?.width ?? 1) / (frontImage?.height ?? 1);
  const backAspect = (backImage?.width ?? 1) / (backImage?.height ?? 1);
  const baseHeight = 3.2;

  useFrame(() => {
    if (!groupRef.current || completedRef.current) return;
    if (flipStartRef.current === null) flipStartRef.current = performance.now();

    const elapsed = performance.now() - flipStartRef.current;
    const raw = Math.min(1, elapsed / FLIP_DURATION_MS);
    const eased = easeInOut(raw);

    groupRef.current.position.set(
      lightboxDisplay.x + lightboxDisplay.xOffset,
      lightboxDisplay.y + lightboxDisplay.yOffset,
      lightboxDisplay.z,
    );
    groupRef.current.rotation.y = eased * Math.PI;
    groupRef.current.rotation.x = Math.sin(eased * Math.PI) * 0.045;
    groupRef.current.rotation.z = 0;

    const scale = lightboxDisplay.scale;
    if (frontRef.current) frontRef.current.scale.setScalar(scale);
    if (backRef.current) backRef.current.scale.setScalar(scale);
    onEffectsChange(NEUTRAL_EFFECTS);

    if (raw >= 1) {
      completedRef.current = true;
      onComplete();
    }
  });

  return (
    <group
      ref={groupRef}
      position={[
        lightboxDisplay.x + lightboxDisplay.xOffset,
        lightboxDisplay.y + lightboxDisplay.yOffset,
        lightboxDisplay.z,
      ]}
    >
      <mesh ref={frontRef} scale={lightboxDisplay.scale}>
        <planeGeometry args={[baseHeight * frontAspect, baseHeight]} />
        <meshStandardMaterial
          map={frontMap}
          toneMapped={false}
          roughness={0.75}
          metalness={0.1}
          side={FrontSide}
        />
      </mesh>
      <mesh ref={backRef} rotation={[0, Math.PI, 0]} scale={lightboxDisplay.scale}>
        <planeGeometry args={[baseHeight * backAspect, baseHeight]} />
        <meshStandardMaterial
          map={backMap}
          toneMapped={false}
          roughness={0.75}
          metalness={0.1}
          side={FrontSide}
        />
      </mesh>
    </group>
  );
}

// Keep old export name working for Scene imports during rename.
export function ChapterTransitionCard(props: ChapterTransitionCardProps) {
  return <ChapterTransitionController {...props} />;
}
