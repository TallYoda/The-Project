"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { dialogues } from "@/data/dialogues";
import { sceneKeys, scenesByPainting, type SceneKey, type SceneState } from "@/data/scenes";
import { useGameState } from "@/store/useGameState";

const defaultSceneState: SceneState = {
  camera: { x: -0.01, y: 0, z: 2.25, scale: 0.76, xOffset: 0, yOffset: 0 },
  effects: { brightness: 1, contrast: 1, saturation: 1, vignette: 0.55, blur: 0, colorShift: 0 },
  animation: { breathingIntensity: 0, breathingSpeed: 1.2, driftX: 0, driftY: 0, driftSpeed: 0.4, pulse: 0 },
  transition: { duration: 900, ease: "ease-in-out" },
  automation: { autoColorShift: false, autoColorShiftSpeed: 30 },
};

const cloneScene = (scene: SceneState): SceneState => JSON.parse(JSON.stringify(scene));
const normalizeScene = (value: unknown): SceneState => {
  if (!value || typeof value !== "object") return cloneScene(defaultSceneState);
  const incoming = value as Partial<SceneState> & { automation?: Partial<SceneState["automation"]> };
  return {
    camera: { ...defaultSceneState.camera, ...incoming.camera },
    effects: { ...defaultSceneState.effects, ...incoming.effects },
    animation: { ...defaultSceneState.animation, ...incoming.animation },
    transition: { ...defaultSceneState.transition, ...incoming.transition },
    automation: { ...defaultSceneState.automation, ...incoming.automation },
  };
};

const interpolate = (from: number, to: number, t: number) => from + (to - from) * t;
const ease = (kind: SceneState["transition"]["ease"], t: number) => {
  if (kind === "linear") return t;
  if (kind === "ease-in") return t * t;
  if (kind === "ease-out") return 1 - (1 - t) * (1 - t);
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
};
const mixScene = (from: SceneState, to: SceneState, t: number): SceneState => ({
  camera: {
    x: interpolate(from.camera.x, to.camera.x, t),
    y: interpolate(from.camera.y, to.camera.y, t),
    z: interpolate(from.camera.z, to.camera.z, t),
    scale: interpolate(from.camera.scale, to.camera.scale, t),
    xOffset: interpolate(from.camera.xOffset ?? 0, to.camera.xOffset ?? 0, t),
    yOffset: interpolate(from.camera.yOffset ?? 0, to.camera.yOffset ?? 0, t),
  },
  effects: {
    brightness: interpolate(from.effects.brightness, to.effects.brightness, t),
    contrast: interpolate(from.effects.contrast, to.effects.contrast, t),
    saturation: interpolate(from.effects.saturation, to.effects.saturation, t),
    vignette: interpolate(from.effects.vignette, to.effects.vignette, t),
    blur: interpolate(from.effects.blur, to.effects.blur, t),
    colorShift: interpolate(from.effects.colorShift, to.effects.colorShift, t),
  },
  animation: {
    breathingIntensity: interpolate(from.animation.breathingIntensity, to.animation.breathingIntensity, t),
    breathingSpeed: interpolate(from.animation.breathingSpeed, to.animation.breathingSpeed, t),
    driftX: interpolate(from.animation.driftX, to.animation.driftX, t),
    driftY: interpolate(from.animation.driftY, to.animation.driftY, t),
    driftSpeed: interpolate(from.animation.driftSpeed, to.animation.driftSpeed, t),
    pulse: interpolate(from.animation.pulse, to.animation.pulse, t),
  },
  transition: t < 0.5 ? from.transition : to.transition,
  automation: t < 0.5 ? from.automation : to.automation,
});

const buildInitialScenes = (): Record<string, Record<SceneKey, SceneState>> =>
  Object.fromEntries(
    Object.keys(scenesByPainting).map((paintingId) => [
      paintingId,
      Object.fromEntries(
        sceneKeys.map((sceneKey) => [sceneKey, normalizeScene(scenesByPainting[paintingId]?.[sceneKey])]),
      ) as Record<SceneKey, SceneState>,
    ]),
  );

type SceneComposerProps = {
  visible: boolean;
  paintingId: string | null;
  onEffectsChange: (effects: SceneState["effects"]) => void;
  showUi?: boolean;
};

export function SceneComposer({ visible, paintingId, onEffectsChange, showUi = true }: SceneComposerProps) {
  const setLightboxDisplayValues = useGameState((s) => s.setLightboxDisplayValues);
  const currentEffect = useGameState((s) => s.currentEffect);
  const chapterTransition = useGameState((s) => s.chapterTransition);
  const openLightbox = useGameState((s) => s.openLightbox);
  const startDialogue = useGameState((s) => s.startDialogue);
  const setCurrentEffect = useGameState((s) => s.setCurrentEffect);

  const [allScenes, setAllScenes] = useState<Record<string, Record<SceneKey, SceneState>>>(buildInitialScenes);
  const [selectedPainting, setSelectedPainting] = useState<string>(paintingId ?? Object.keys(scenesByPainting)[0]);
  const [selectedScene, setSelectedScene] = useState<SceneKey>("scene1");
  const [previewTransition, setPreviewTransition] = useState(true);
  const [autoColorShiftValue, setAutoColorShiftValue] = useState(defaultSceneState.effects.colorShift);
  const [message, setMessage] = useState("");

  const fromSceneRef = useRef<SceneState>(cloneScene(defaultSceneState));
  const composedSceneRef = useRef<SceneState>(cloneScene(defaultSceneState));
  const transitionStartRef = useRef<number | null>(null);
  const previousSceneRef = useRef<SceneKey>("scene1");
  const rafRef = useRef<number | null>(null);
  const smoothedDisplayRef = useRef({
    x: defaultSceneState.camera.x,
    y: defaultSceneState.camera.y,
    z: defaultSceneState.camera.z,
    scale: defaultSceneState.camera.scale,
    xOffset: defaultSceneState.camera.xOffset ?? 0,
    yOffset: defaultSceneState.camera.yOffset ?? 0,
  });
  const previousFrameTimeRef = useRef<number | null>(null);

  const paintingOptions = useMemo(() => Object.keys(allScenes), [allScenes]);
  const effectivePainting = paintingId ?? selectedPainting;
  const effectiveScene =
    currentEffect && sceneKeys.includes(currentEffect as SceneKey) ? (currentEffect as SceneKey) : selectedScene;
  const sceneForPreview = allScenes[effectivePainting]?.[effectiveScene] ?? cloneScene(defaultSceneState);

  const linkedDialogue = useMemo(() => {
    const tree = dialogues[effectivePainting];
    if (!tree) return [];
    return Object.entries(tree)
      .filter(([nodeId, node]) => (effectiveScene === "scene1" && nodeId === "start") || node.choices.some((c) => c.effect === effectiveScene))
      .map(([nodeId, node]) => ({
        nodeId,
        text: node.text,
        choices: node.choices.filter((choice) => choice.effect === effectiveScene),
      }));
  }, [effectivePainting, effectiveScene]);

  useEffect(() => {
    if (!visible || chapterTransition) return;
    if (previewTransition && previousSceneRef.current !== effectiveScene) {
      fromSceneRef.current = cloneScene(composedSceneRef.current);
      transitionStartRef.current = performance.now();
    }
    previousSceneRef.current = effectiveScene;
  }, [chapterTransition, effectiveScene, previewTransition, visible]);

  useEffect(() => {
    if (!visible || chapterTransition) return;
    const loop = (time: number) => {
      const target = allScenes[effectivePainting]?.[effectiveScene] ?? cloneScene(defaultSceneState);
      let composed = target;
      if (previewTransition && transitionStartRef.current !== null) {
        const duration = Math.max(1, target.transition.duration);
        const raw = Math.min(1, (time - transitionStartRef.current) / duration);
        composed = mixScene(fromSceneRef.current, target, ease(target.transition.ease, raw));
        if (raw >= 1) transitionStartRef.current = null;
      }

      const t = time / 1000;
      const breathing = Math.sin(t * composed.animation.breathingSpeed) * composed.animation.breathingIntensity;
      const driftX = Math.sin(t * composed.animation.driftSpeed) * composed.animation.driftX;
      const driftY = Math.cos(t * composed.animation.driftSpeed * 0.87) * composed.animation.driftY;
      const pulse = Math.sin(t * composed.animation.breathingSpeed * 1.4) * composed.animation.pulse;

      if (target.automation.autoColorShift) {
        const min = -180;
        const max = 180;
        const span = max - min;
        const animated =
          ((((target.effects.colorShift + t * target.automation.autoColorShiftSpeed - min) % span) + span) % span) +
          min;
        composed = { ...composed, effects: { ...composed.effects, colorShift: animated } };
        setAutoColorShiftValue(Math.round(animated));
      } else {
        setAutoColorShiftValue(target.effects.colorShift);
      }

      composedSceneRef.current = cloneScene(composed);

      const targetDisplay = {
        x: composed.camera.x + driftX + breathing * 0.4,
        y: composed.camera.y + driftY + breathing * 0.5,
        z: composed.camera.z,
        scale: composed.camera.scale + pulse,
        xOffset: composed.camera.xOffset ?? 0,
        yOffset: composed.camera.yOffset ?? 0,
      };
      const dtMs = previousFrameTimeRef.current === null ? 16 : Math.max(1, time - previousFrameTimeRef.current);
      previousFrameTimeRef.current = time;
      const frameFactor = Math.min(1, dtMs / 16.67);
      const smoothFactor = Math.min(0.35, 0.14 * frameFactor);

      smoothedDisplayRef.current = {
        x: smoothedDisplayRef.current.x + (targetDisplay.x - smoothedDisplayRef.current.x) * smoothFactor,
        y: smoothedDisplayRef.current.y + (targetDisplay.y - smoothedDisplayRef.current.y) * smoothFactor,
        z: smoothedDisplayRef.current.z + (targetDisplay.z - smoothedDisplayRef.current.z) * smoothFactor,
        scale:
          smoothedDisplayRef.current.scale +
          (targetDisplay.scale - smoothedDisplayRef.current.scale) * Math.min(0.22, smoothFactor * 1.2),
        xOffset:
          smoothedDisplayRef.current.xOffset +
          (targetDisplay.xOffset - smoothedDisplayRef.current.xOffset) * smoothFactor,
        yOffset:
          smoothedDisplayRef.current.yOffset +
          (targetDisplay.yOffset - smoothedDisplayRef.current.yOffset) * smoothFactor,
      };

      setLightboxDisplayValues(smoothedDisplayRef.current);
      onEffectsChange(composed.effects);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [allScenes, chapterTransition, effectivePainting, effectiveScene, onEffectsChange, previewTransition, setLightboxDisplayValues, visible]);

  const updateScene = <S extends keyof SceneState, K extends keyof SceneState[S]>(section: S, key: K, value: SceneState[S][K]) => {
    setAllScenes((prev) => ({
      ...prev,
      [effectivePainting]: {
        ...prev[effectivePainting],
        [effectiveScene]: {
          ...prev[effectivePainting][effectiveScene],
          [section]: { ...prev[effectivePainting][effectiveScene][section], [key]: value },
        },
      },
    }));
  };

  const switchPainting = (nextPainting: string) => {
    setSelectedPainting(nextPainting);
    openLightbox(nextPainting);
    startDialogue();
    setCurrentEffect(effectiveScene);
    setMessage(`Previewing ${nextPainting}.${effectiveScene}`);
  };

  const switchScene = (nextScene: SceneKey) => {
    setSelectedScene(nextScene);
    setCurrentEffect(nextScene);
  };

  const lockInScene = async () => {
    try {
      const response = await fetch("/api/scenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paintingId: effectivePainting,
          sceneKey: effectiveScene,
          scene: allScenes[effectivePainting][effectiveScene],
        }),
      });
      setMessage(response.ok ? `Locked ${effectivePainting}.${effectiveScene} in scenes.ts` : "Failed to write to scenes.ts.");
    } catch {
      setMessage("Unable to lock values. Check server logs.");
    }
  };

  if (!visible) return null;
  if (!showUi) return null;

  return (
    <aside className="scene-composer">
      <div className="scene-composer-head">
        <p className="scene-composer-title">Scene Composer</p>
      </div>

      <section className="scene-composer-group">
        <p className="lightbox-debug-title">Target</p>
        <label className="lightbox-debug-row">
          <span>painting</span>
          <select className="lightbox-debug-select" value={effectivePainting} onChange={(e) => switchPainting(e.target.value)}>
            {paintingOptions.map((painting) => (
              <option key={painting} value={painting}>
                {painting}
              </option>
            ))}
          </select>
        </label>
        <label className="lightbox-debug-row">
          <span>scene</span>
          <select className="lightbox-debug-select" value={effectiveScene} onChange={(e) => switchScene(e.target.value as SceneKey)}>
            {sceneKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="scene-composer-group">
        <p className="lightbox-debug-title">Dialogue tied to this scene</p>
        <div className="scene-link-list">
          {linkedDialogue.length === 0 ? (
            <p className="scene-link-empty">No dialogue choice currently points to this scene.</p>
          ) : (
            linkedDialogue.map((item) => (
              <article key={item.nodeId} className="scene-link-card">
                <p className="scene-link-id">{item.nodeId}</p>
                <p className="scene-link-text">{item.text}</p>
                {item.choices.map((choice) => (
                  <p key={`${item.nodeId}-${choice.text}`} className="scene-link-choice">
                    {choice.text}
                  </p>
                ))}
              </article>
            ))
          )}
        </div>
      </section>

      <section className="scene-composer-group">
        <p className="lightbox-debug-title">Camera</p>
        <Slider label="x" value={sceneForPreview.camera.x} min={-1} max={1} step={0.01} onChange={(v) => updateScene("camera", "x", v)} />
        <Slider label="y" value={sceneForPreview.camera.y} min={-1} max={1} step={0.01} onChange={(v) => updateScene("camera", "y", v)} />
        <Slider
          label="x_offset"
          value={sceneForPreview.camera.xOffset ?? 0}
          min={-1.5}
          max={1.5}
          step={0.01}
          onChange={(v) => updateScene("camera", "xOffset", v)}
        />
        <Slider
          label="y_offset"
          value={sceneForPreview.camera.yOffset ?? 0}
          min={-1.5}
          max={1.5}
          step={0.01}
          onChange={(v) => updateScene("camera", "yOffset", v)}
        />
        <Slider label="z (zoom)" value={sceneForPreview.camera.z} min={-2} max={5.9} step={0.01} onChange={(v) => updateScene("camera", "z", v)} />
        <Slider label="scale" value={sceneForPreview.camera.scale} min={0.5} max={2} step={0.01} onChange={(v) => updateScene("camera", "scale", v)} />
      </section>

      <section className="scene-composer-group">
        <p className="lightbox-debug-title">Effects</p>
        <Slider label="brightness" value={sceneForPreview.effects.brightness} min={0} max={2} step={0.01} onChange={(v) => updateScene("effects", "brightness", v)} />
        <Slider label="contrast" value={sceneForPreview.effects.contrast} min={0} max={2} step={0.01} onChange={(v) => updateScene("effects", "contrast", v)} />
        <Slider label="saturation" value={sceneForPreview.effects.saturation} min={0} max={2} step={0.01} onChange={(v) => updateScene("effects", "saturation", v)} />
        <Slider label="vignette" value={sceneForPreview.effects.vignette} min={0} max={1} step={0.01} onChange={(v) => updateScene("effects", "vignette", v)} />
        <Slider label="blur" value={sceneForPreview.effects.blur} min={0} max={10} step={0.01} onChange={(v) => updateScene("effects", "blur", v)} />
        <Slider label="colorShift" value={sceneForPreview.automation.autoColorShift ? autoColorShiftValue : sceneForPreview.effects.colorShift} min={-180} max={180} step={1} onChange={(v) => updateScene("effects", "colorShift", v)} disabled={sceneForPreview.automation.autoColorShift} />
        <label className="lightbox-debug-row">
          <span>autoColorShift</span>
          <input type="checkbox" checked={sceneForPreview.automation.autoColorShift} onChange={(e) => updateScene("automation", "autoColorShift", e.target.checked)} />
        </label>
        <Slider label="colorShiftSpeed" value={sceneForPreview.automation.autoColorShiftSpeed} min={0} max={360} step={1} onChange={(v) => updateScene("automation", "autoColorShiftSpeed", v)} />
      </section>

      <section className="scene-composer-group">
        <p className="lightbox-debug-title">Animation</p>
        <Slider label="breathingIntensity" value={sceneForPreview.animation.breathingIntensity} min={0} max={0.05} step={0.001} onChange={(v) => updateScene("animation", "breathingIntensity", v)} />
        <Slider label="breathingSpeed" value={sceneForPreview.animation.breathingSpeed} min={0} max={5} step={0.01} onChange={(v) => updateScene("animation", "breathingSpeed", v)} />
        <Slider label="driftX" value={sceneForPreview.animation.driftX} min={-0.05} max={0.05} step={0.001} onChange={(v) => updateScene("animation", "driftX", v)} />
        <Slider label="driftY" value={sceneForPreview.animation.driftY} min={-0.05} max={0.05} step={0.001} onChange={(v) => updateScene("animation", "driftY", v)} />
        <Slider label="driftSpeed" value={sceneForPreview.animation.driftSpeed} min={0} max={2} step={0.01} onChange={(v) => updateScene("animation", "driftSpeed", v)} />
        <Slider label="pulse" value={sceneForPreview.animation.pulse} min={0} max={0.05} step={0.001} onChange={(v) => updateScene("animation", "pulse", v)} />
      </section>

      <section className="scene-composer-group">
        <p className="lightbox-debug-title">Transition</p>
        <Slider label="duration" value={sceneForPreview.transition.duration} min={0} max={20000} step={10} onChange={(v) => updateScene("transition", "duration", v)} />
        <label className="lightbox-debug-row">
          <span>ease</span>
          <select className="lightbox-debug-select" value={sceneForPreview.transition.ease} onChange={(e) => updateScene("transition", "ease", e.target.value as SceneState["transition"]["ease"])}>
            <option value="linear">linear</option>
            <option value="ease-in">ease-in</option>
            <option value="ease-out">ease-out</option>
            <option value="ease-in-out">ease-in-out</option>
          </select>
        </label>
        <button className="lightbox-debug-reset" onClick={() => setPreviewTransition((v) => !v)}>
          {previewTransition ? "Preview Transition: On" : "Preview Transition: Off"}
        </button>
      </section>

      <section className="scene-composer-group">
        <button className="lightbox-debug-reset" onClick={lockInScene}>
          Lock in new values for this scene
        </button>
        {message ? <p className="lightbox-debug-confirm">{message}</p> : null}
      </section>
    </aside>
  );
}

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

function Slider({ label, value, min, max, step, onChange, disabled = false }: SliderProps) {
  return (
    <label className="lightbox-debug-row">
      <span>
        {label} {value.toFixed(2)}
      </span>
      <input type="range" min={min} max={max} step={step} value={value} disabled={disabled} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}
