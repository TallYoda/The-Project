"use client";

import { Html } from "@react-three/drei";
import { useState } from "react";

type TalkToMePromptProps = {
  visible: boolean;
  onTalk: () => void;
};

export function TalkToMePrompt({ visible, onTalk }: TalkToMePromptProps) {
  const [hovered, setHovered] = useState(false);

  if (!visible) return null;

  return (
    <Html transform distanceFactor={1.3} position={[0, -1.2, 0.1]} center>
      <button
        className={`talk-prompt ${hovered ? "is-hovered" : ""}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onTalk}
      >
        <span className="talk-line left" />
        <span className="talk-line right" />
        <span className="talk-label">Talk to me</span>
      </button>
    </Html>
  );
}
