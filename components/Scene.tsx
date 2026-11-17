"use client";

import { Suspense, useCallback, useEffect, useState, WheelEvent } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraController } from "@/components/CameraController";
import { Artwork } from "@/components/Artwork";
import { ChapterTransitionController } from "@/components/ChapterTransitionCard";
import { DialoguePanel } from "@/components/DialoguePanel";
import { LoadingScreen } from "@/components/LoadingScreen";
import { SceneComposer } from "@/components/SceneComposer";
import type { SceneState } from "@/data/scenes";
import { useGameState } from "@/store/useGameState";
import { artworks } from "@/data/artworks";
import { introContent } from "@/data/intro";

type ExperiencePhase = "cover" | "loading" | "playing";

export function Scene() {
  const isLightboxOpen = useGameState((state) => state.isLightboxOpen);
  const isDialogueActive = useGameState((state) => state.isDialogueActive);
  const scrollZ = useGameState((state) => state.scrollZ);
  const setScrollZ = useGameState((state) => state.setScrollZ);
  const closeLightbox = useGameState((state) => state.closeLightbox);
  const openLightbox = useGameState((state) => state.openLightbox);
  const startDialogue = useGameState((state) => state.startDialogue);
  const hideCredits = useGameState((state) => state.hideCredits);
  const isCreditsVisible = useGameState((state) => state.isCreditsVisible);
  const currentPainting = useGameState((state) => state.currentPainting);
  const chapterTransition = useGameState((state) => state.chapterTransition);
  const [phase, setPhase] = useState<ExperiencePhase>("cover");
  const [composerEffects, setComposerEffects] = useState<SceneState["effects"]>({
    brightness: 1,
    contrast: 1,
    saturation: 1,
    vignette: 0.55,
    blur: 0,
    colorShift: 0,
  });

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (isDialogueActive || isLightboxOpen || phase !== "playing") return;
    setScrollZ(scrollZ + event.deltaY * 0.01);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isLightboxOpen && phase === "playing") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeLightbox, isLightboxOpen, phase]);

  const handleEnterAdventure = () => {
    hideCredits();
    setPhase("loading");
  };

  const handleLoadingComplete = useCallback(() => {
    openLightbox(introContent.entryPaintingId);
    startDialogue();
    setPhase("playing");
  }, [openLightbox, startDialogue]);

  const currentPaintingTitle =
    artworks.find((artwork) => artwork.id === currentPainting)?.title ?? "Story time";
  const showWorld = phase === "loading" || phase === "playing";

  return (
    <div className="scene-shell" onWheel={handleWheel}>
      {isLightboxOpen && phase === "playing" ? <div className="lightbox-overlay" /> : null}

      {showWorld ? (
        <Canvas
          className="scene-canvas"
          style={{
            filter: `brightness(${composerEffects.brightness}) contrast(${composerEffects.contrast}) saturate(${composerEffects.saturation}) blur(${composerEffects.blur}px) hue-rotate(${composerEffects.colorShift}deg)`,
            opacity: phase === "loading" ? 0 : 1,
          }}
          camera={{ position: [0, 0, 11], fov: 50 }}
        >
          <fog attach="fog" args={["#08060d", 4, 26]} />
          <ambientLight intensity={0.45} />
          <directionalLight position={[2, 3, 5]} intensity={1.35} />
          <pointLight position={[-5, 2, 3]} intensity={0.65} color="#6366f1" />
          <pointLight position={[4, -1, 6]} intensity={0.5} color="#ec4899" />

          <Suspense fallback={null}>
            {artworks.map((artwork) => (
              <Artwork
                key={artwork.id}
                id={artwork.id}
                imageSrc={artwork.imageSrc}
                position={artwork.position}
                rotation={artwork.rotation}
              />
            ))}
            {chapterTransition ? (
              <ChapterTransitionController
                effects={composerEffects}
                onEffectsChange={setComposerEffects}
              />
            ) : null}
          </Suspense>
          <CameraController />
        </Canvas>
      ) : null}

      <div
        className={`scene-vignette ${isDialogueActive ? "active" : ""}`}
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(1, 1, 8, ${0.08 + composerEffects.vignette * 0.2}), rgba(1, 1, 8, ${0.3 + composerEffects.vignette * 0.55}))`,
        }}
      />

      {isLightboxOpen && phase === "playing" ? (
        <div className="lightbox-ui">
          {!chapterTransition ? (
            <button className="lightbox-exit" onClick={closeLightbox} aria-label="Exit artwork view">
              Exit
            </button>
          ) : null}
          {!isDialogueActive && !chapterTransition ? (
            <button className="storytime-start" onClick={startDialogue}>
              {currentPainting === introContent.entryPaintingId
                ? introContent.entryPaintingPrompt
                : currentPaintingTitle}
            </button>
          ) : null}
          <SceneComposer
            key={currentPainting ?? "no-painting"}
            visible={isLightboxOpen && !chapterTransition}
            paintingId={currentPainting}
            onEffectsChange={setComposerEffects}
            showUi={false}
          />
        </div>
      ) : null}

      {phase === "cover" ? (
        <section className="cover-screen">
          <div className="cover-screen-head">
            <p className="cover-screen-kicker">{introContent.preludeLabel}</p>
            <p className="cover-screen-kicker right">{introContent.helperLabel}</p>
          </div>
          <div className="cover-screen-body">
            <p className="cover-screen-credit">{introContent.headline}</p>
            <p className="cover-screen-credit">{introContent.byline}</p>
            <div className="cover-screen-quote-block">
              <p className="cover-screen-quote">&quot;{introContent.quoteLines[0]}&quot;</p>
              <p className="cover-screen-quote">&quot;{introContent.quoteLines[1]}&quot;</p>
              <p className="cover-screen-quote-source">- {introContent.quoteSource}</p>
            </div>
            <button className="cover-screen-enter" onClick={handleEnterAdventure}>
              {introContent.enterLabel}
            </button>
          </div>
        </section>
      ) : null}

      {phase === "loading" ? <LoadingScreen onComplete={handleLoadingComplete} /> : null}

      {isCreditsVisible ? (
        <section className="cover-screen credits-screen">
          <div className="cover-screen-head">
            <p className="cover-screen-kicker">[/] End Sequence</p>
            <p className="cover-screen-kicker right">Thank You For Playing</p>
          </div>
          <div className="cover-screen-body">
            <p className="cover-screen-credit">Thank you for experiencing this story.</p>
            <p className="cover-screen-credit">Created by Mikiyas Sintayehu and Jote Tolesa.</p>
            <button className="cover-screen-enter" onClick={handleEnterAdventure}>
              Restart
            </button>
          </div>
        </section>
      ) : null}

      {phase === "playing" ? <DialoguePanel /> : null}
    </div>
  );
}
