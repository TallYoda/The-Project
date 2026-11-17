"use client";

import { useEffect, useMemo, useState } from "react";
import { dialogues, type DialogueChoice } from "@/data/dialogues";
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
  const nodeKey = `${currentPainting ?? ""}:${currentDialogueNode ?? ""}`;
  const effectKey = (currentEffect ?? "scene1") as SceneKey;
  const transitionMs = useMemo(() => {
    if (!currentPainting) return 900;
    const duration = scenesByPainting[currentPainting]?.[effectKey]?.transition.duration;
    const slowed = Math.round((duration ?? 900) * 1.8);
    return Math.min(9000, Math.max(1600, slowed));
  }, [currentPainting, effectKey]);

  if (!isDialogueActive || !currentPainting || !currentDialogueNode || !node) return null;

  return (
    <aside className="dialogue-panel">
      <p className="dialogue-kicker">
        [{currentPainting}.{currentDialogueNode}] render {effectKey}
      </p>
      <DialogueRevealView
        key={nodeKey}
        text={node.text}
        transitionMs={transitionMs}
        choices={node.choices}
        onSelectChoice={selectChoice}
        onEndDialogue={endDialogue}
      />
    </aside>
  );
}

type DialogueRevealViewProps = {
  text: string;
  transitionMs: number;
  choices: DialogueChoice[];
  onSelectChoice: (choice: DialogueChoice) => void;
  onEndDialogue: () => void;
};

function DialogueRevealView({
  text,
  transitionMs,
  choices,
  onSelectChoice,
  onEndDialogue,
}: DialogueRevealViewProps) {
  const [visibleText, setVisibleText] = useState("");
  const [isRevealComplete, setIsRevealComplete] = useState(false);

  useEffect(() => {
    if (isRevealComplete) {
      const timer = window.setTimeout(() => setVisibleText(text), 0);
      return () => window.clearTimeout(timer);
    }

    let frame = 0;
    let cancelled = false;
    const start = performance.now();

    const tick = (now: number) => {
      if (cancelled) return;
      const progress = Math.min(1, (now - start) / transitionMs);
      const chars = Math.max(1, Math.floor(text.length * progress));
      setVisibleText(text.slice(0, chars));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      setVisibleText(text);
      setIsRevealComplete(true);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [isRevealComplete, text, transitionMs]);

  return (
    <>
      <p className="dialogue-text">{visibleText}</p>
      <div className="dialogue-choices">
        {isRevealComplete && choices.length > 0 ? (
          choices.map((choice) => (
            <button
              key={`${choice.text}-${choice.next ?? "end"}`}
              className="dialogue-choice"
              onClick={() => onSelectChoice(choice)}
            >
              {choice.text}
            </button>
          ))
        ) : isRevealComplete ? (
          <button className="dialogue-choice" onClick={onEndDialogue}>
            Let the silence return
          </button>
        ) : (
          <button className="dialogue-choice" onClick={() => setIsRevealComplete(true)}>
            ...
          </button>
        )}
      </div>
    </>
  );
}
