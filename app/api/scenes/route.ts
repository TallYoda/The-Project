import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { sceneKeys, scenesByPainting, type SceneKey, type SceneState } from "@/data/scenes";

export const runtime = "nodejs";

type SaveScenePayload = {
  paintingId: string;
  sceneKey: SceneKey;
  scene: SceneState;
};

const serializeScenesFile = (value: Record<string, Partial<Record<SceneKey, SceneState>>>) => `export type SceneKey = "scene1" | "scene2" | "scene3" | "scene4" | "scene5" | "scene6";

export type SceneState = {
  camera: {
    x: number;
    y: number;
    z: number;
    scale: number;
    xOffset?: number;
    yOffset?: number;
  };
  effects: {
    brightness: number;
    contrast: number;
    saturation: number;
    vignette: number;
    blur: number;
    colorShift: number;
  };
  animation: {
    breathingIntensity: number;
    breathingSpeed: number;
    driftX: number;
    driftY: number;
    driftSpeed: number;
    pulse: number;
  };
  transition: {
    duration: number;
    ease: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  };
  automation: {
    autoColorShift: boolean;
    autoColorShiftSpeed: number;
  };
};

export const sceneKeys: SceneKey[] = ["scene1", "scene2", "scene3", "scene4", "scene5", "scene6"];

export const scenesByPainting: Record<string, Partial<Record<SceneKey, SceneState>>> = ${JSON.stringify(value, null, 2)};
`;

export async function POST(request: Request) {
  const payload = (await request.json()) as SaveScenePayload;
  if (!payload?.paintingId || !payload?.sceneKey || !payload?.scene) {
    return NextResponse.json({ ok: false, message: "Invalid payload." }, { status: 400 });
  }
  if (!sceneKeys.includes(payload.sceneKey)) {
    return NextResponse.json({ ok: false, message: "Unknown scene key." }, { status: 400 });
  }

  const existing = JSON.parse(JSON.stringify(scenesByPainting)) as Record<
    string,
    Partial<Record<SceneKey, SceneState>>
  >;
  if (!existing[payload.paintingId]) {
    existing[payload.paintingId] = {};
  }
  existing[payload.paintingId][payload.sceneKey] = payload.scene;

  const filePath = path.join(process.cwd(), "data", "scenes.ts");
  await fs.writeFile(filePath, serializeScenesFile(existing), "utf8");

  return NextResponse.json({ ok: true });
}
