"use client";

import { useEffect, useMemo, useState } from "react";
import { dialogues } from "@/data/dialogues";
import { scenesByPainting, type SceneKey } from "@/data/scenes";
import { useGameState } from "@/store/useGameState";

export function DialoguePanel() {
  const currentPainting = useGameState((state) => state.currentPainting);
  const currentDialogueNode = useGameState((state) => state.currentDialogueNode);
  const isDialogueActive = useGameState((state) => state.isDialogueActive);
  const currentEffect = useGameState((state) => state.currentEffect);
  const selectChoice = useGameState((state) => state.selectChoice);
  const endDialogue = useGameState((state) => state.endDialogue);
  const tree = currentPainting ? dialogues[currentPainting] : null;
  const node = currentDialogueNode && tree ? tree[currentDialogueNode] : null;
  const effectKey = (currentEffect ?? "scene1") as SceneKey;
  const transitionMs = useMemo(() => {
    if (!currentPainting) return 900;
    const duration = scenesByPainting[currentPainting]?.[effectKey]?.transition.duration;
    const slowed = Math.round((duration ?? 900) * 1.8);
    return Math.min(9000, Math.max(1600, slowed));
  }, [currentPainting, effectKey]);
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    if (!node) return;
    let frame = 0;
    const start = performance.now();
    const text = node.text;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / transitionMs);
      const chars = Math.max(1, Math.floor(text.length * progress));
      setVisibleText(text.slice(0, chars));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [node, transitionMs]);

  if (!isDialogueActive || !currentPainting || !currentDialogueNode || !node) return null;
  const isRevealComplete = visibleText.length >= node.text.length;

  return (
    <aside className="dialogue-panel">
      <p className="dialogue-kicker">
        [{currentPainting}.{currentDialogueNode}] render {effectKey}
      </p>
      <p className="dialogue-text">{visibleText}</p>
      <div className="dialogue-choices">
        {isRevealComplete && node.choices.length > 0 ? (
          node.choices.map((choice) => (
            <button
              key={`${choice.text}-${choice.next ?? "end"}`}
              className="dialogue-choice"
              onClick={() => selectChoice(choice)}
            >
              {choice.text}
            </button>
          ))
        ) : isRevealComplete ? (
          <button className="dialogue-choice" onClick={endDialogue}>
            Let the silence return
          </button>
        ) : (
          <button className="dialogue-choice" disabled>
            ...
          </button>
        )}
      </div>
    </aside>
  );
}
