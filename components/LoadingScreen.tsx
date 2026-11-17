"use client";

import { useEffect, useMemo, useState } from "react";
import { useProgress } from "@react-three/drei";
import { artworks } from "@/data/artworks";

type LoadPhase = "pending" | "active" | "done";

type LoadItem = {
  id: string;
  label: string;
  detail: string;
  phase: LoadPhase;
};

type LoadingScreenProps = {
  onComplete: () => void;
};

const systemSteps = [
  { id: "camera", label: "Calibrating camera path", detail: "scroll / lightbox rails" },
  { id: "scenes", label: "Composing scene states", detail: "scene1 → scene6" },
  { id: "dialogue", label: "Warming dialogue tree", detail: "story nodes + choices" },
  { id: "viewport", label: "Opening first frame", detail: "storytime entry" },
] as const;

function filenameFromSrc(src: string) {
  return src.split("/").pop() ?? src;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { active, item, loaded, total } = useProgress();
  const [completedSrcs, setCompletedSrcs] = useState<Set<string>>(() => new Set());
  const [activeSrc, setActiveSrc] = useState("");
  const [systemIndex, setSystemIndex] = useState(0);
  const [texturesSettled, setTexturesSettled] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const knownTextures = useMemo(
    () =>
      artworks.map((artwork) => ({
        id: artwork.id,
        label: `Painting · ${artwork.title}`,
        detail: filenameFromSrc(artwork.imageSrc),
        src: artwork.imageSrc,
      })),
    [],
  );

  useEffect(() => {
    let cancelled = false;

    const loadImage = (src: string) =>
      new Promise<void>((resolve) => {
        const image = new window.Image();
        image.decoding = "async";
        const finish = () => resolve();
        image.onload = finish;
        image.onerror = finish;
        image.src = src;
      });

    const run = async () => {
      for (const texture of knownTextures) {
        if (cancelled) return;
        setActiveSrc(texture.src);
        const started = performance.now();
        await loadImage(texture.src);
        // Keep each step readable even when assets are already cached.
        const elapsed = performance.now() - started;
        if (elapsed < 320) {
          await new Promise((resolve) => window.setTimeout(resolve, 320 - elapsed));
        }
        if (cancelled) return;
        setCompletedSrcs((current) => {
          const next = new Set(current);
          next.add(texture.src);
          return next;
        });
      }

      if (cancelled) return;
      setActiveSrc("");
      setTexturesSettled(true);
    };

    void run();

    const failsafe = window.setTimeout(() => {
      if (cancelled) return;
      setCompletedSrcs(new Set(knownTextures.map((texture) => texture.src)));
      setActiveSrc("");
      setTexturesSettled(true);
    }, 12000);

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
    };
  }, [knownTextures]);

  useEffect(() => {
    if (!texturesSettled) return;

    let cancelled = false;

    const runSystems = async () => {
      for (let index = 0; index < systemSteps.length; index += 1) {
        if (cancelled) return;
        await new Promise((resolve) => window.setTimeout(resolve, 280));
        if (cancelled) return;
        setSystemIndex(index + 1);
      }

      if (cancelled) return;
      setFinishing(true);
      await new Promise((resolve) => window.setTimeout(resolve, 420));
      if (!cancelled) onComplete();
    };

    void runSystems();

    return () => {
      cancelled = true;
    };
  }, [onComplete, texturesSettled]);

  const textureItems: LoadItem[] = knownTextures.map((texture) => {
    let phase: LoadPhase = "pending";
    if (completedSrcs.has(texture.src) || texturesSettled) {
      phase = "done";
    } else if (
      activeSrc === texture.src ||
      item === texture.src ||
      (active && item.includes(texture.id))
    ) {
      phase = "active";
    }

    return {
      id: texture.id,
      label: texture.label,
      detail: texture.detail,
      phase,
    };
  });

  const systemItems: LoadItem[] = systemSteps.map((step, index) => {
    let phase: LoadPhase = "pending";
    if (!texturesSettled) {
      phase = "pending";
    } else if (systemIndex > index) {
      phase = "done";
    } else if (systemIndex === index) {
      phase = "active";
    }
    return { ...step, phase };
  });

  const displayItems = [...textureItems, ...systemItems];
  const completedCount = displayItems.filter((entry) => entry.phase === "done").length;
  const percent = Math.min(
    100,
    Math.round((completedCount / Math.max(displayItems.length, 1)) * 100),
  );

  const currentLabel =
    displayItems.find((entry) => entry.phase === "active")?.label ??
    (finishing ? "Ready" : "Waiting for assets");

  return (
    <section className="loading-screen" aria-live="polite" aria-busy={!finishing}>
      <div className="loading-screen-head">
        <p className="cover-screen-kicker">{"[/> Boot Sequence"}</p>
        <p className="cover-screen-kicker right">{percent.toString().padStart(3, "0")}%</p>
      </div>

      <div className="loading-screen-body">
        <p className="loading-screen-status">
          <span className="loading-screen-status-prefix">Loading</span> {currentLabel}
        </p>

        <div
          className="loading-progress"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="loading-progress-bar" style={{ width: `${percent}%` }} />
        </div>

        <ul className="loading-list">
          {displayItems.map((entry) => (
            <li key={entry.id} className={`loading-list-item is-${entry.phase}`}>
              <span className="loading-list-mark" aria-hidden>
                {entry.phase === "done" ? "[OK]" : entry.phase === "active" ? "[>>]" : "[  ]"}
              </span>
              <span className="loading-list-copy">
                <span className="loading-list-label">{entry.label}</span>
                <span className="loading-list-detail">{entry.detail}</span>
              </span>
            </li>
          ))}
        </ul>

        <p className="loading-screen-footnote">
          {texturesSettled
            ? finishing
              ? "Handing control to the gallery..."
              : "Textures cached. Spinning up narrative systems."
            : total > 0
              ? `Decoded ${loaded}/${total} texture files`
              : "Connecting to the exhibition renderer..."}
        </p>
      </div>
    </section>
  );
}
