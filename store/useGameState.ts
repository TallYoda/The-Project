"use client";

import { create } from "zustand";
import { dialogues, type DialogueChoice } from "@/data/dialogues";

export type ZoomType = "zoom1" | "zoom2" | "zoom3";

export type ZoomCalibrationValue = {
  x: number;
  y: number;
  xOffset: number;
  yOffset: number;
  z: number;
  scale: number;
};

type ZoomCalibration = Record<string, Record<ZoomType, ZoomCalibrationValue>>;

const DEFAULT_ZOOM_VALUE: ZoomCalibrationValue = {
  x: -0.01,
  y: 0,
  xOffset: 0.22,
  yOffset: 0.03,
  z: 2.25,
  scale: 0.76,
};

const initialZoomCalibration: ZoomCalibration = {};

const DEFAULT_LIGHTBOX_DISPLAY = {
  scale: 1.2,
  x: 0,
  y: 0,
  z: -0.3,
  xOffset: 0,
  yOffset: 0,
};

type GameState = {
  currentPainting: string | null;
  isLightboxOpen: boolean;
  isDialogueActive: boolean;
  isCreditsVisible: boolean;
  currentDialogueNode: string | null;
  currentEffect: string | null;
  scrollZ: number;
  lightboxDisplay: {
    scale: number;
    x: number;
    y: number;
    z: number;
    xOffset: number;
    yOffset: number;
  };
  zoomCalibration: ZoomCalibration;
  openLightbox: (paintingId: string) => void;
  closeLightbox: () => void;
  setLightboxDisplay: (
    key: "scale" | "x" | "y" | "z" | "xOffset" | "yOffset",
    value: number,
  ) => void;
  setLightboxDisplayValues: (value: {
    scale: number;
    x: number;
    y: number;
    z: number;
    xOffset: number;
    yOffset: number;
  }) => void;
  resetLightboxDisplay: () => void;
  setZoomCalibration: (
    paintingId: string,
    zoomType: ZoomType,
    value: ZoomCalibrationValue,
  ) => void;
  resetPaintingZoomCalibration: (paintingId: string) => void;
  setCurrentEffect: (effect: string | null) => void;
  startDialogue: () => void;
  selectChoice: (choice: DialogueChoice) => void;
  endDialogue: () => void;
  hideCredits: () => void;
  setScrollZ: (nextZ: number) => void;
};

export const useGameState = create<GameState>((set) => ({
  currentPainting: null,
  isLightboxOpen: false,
  isDialogueActive: false,
  isCreditsVisible: false,
  currentDialogueNode: null,
  currentEffect: null,
  scrollZ: 11,
  lightboxDisplay: DEFAULT_LIGHTBOX_DISPLAY,
  zoomCalibration: initialZoomCalibration,
  openLightbox: (paintingId) => {
    if (!dialogues[paintingId]) return;
    set({
      currentPainting: paintingId,
      isLightboxOpen: true,
      isDialogueActive: false,
      isCreditsVisible: false,
      currentDialogueNode: null,
      currentEffect: null,
      lightboxDisplay: DEFAULT_LIGHTBOX_DISPLAY,
    });
  },
  closeLightbox: () =>
    set({
      isLightboxOpen: false,
      isDialogueActive: false,
      isCreditsVisible: false,
      currentDialogueNode: null,
      currentEffect: null,
    }),
  setLightboxDisplay: (key, value) =>
    set((state) => ({
      lightboxDisplay: {
        ...state.lightboxDisplay,
        [key]: value,
      },
    })),
  setLightboxDisplayValues: (value) =>
    set({
      lightboxDisplay: value,
    }),
  resetLightboxDisplay: () =>
    set({
      lightboxDisplay: DEFAULT_LIGHTBOX_DISPLAY,
    }),
  setZoomCalibration: (paintingId, zoomType, value) =>
    set((state) => ({
      zoomCalibration: {
        ...state.zoomCalibration,
        [paintingId]: {
          ...(state.zoomCalibration[paintingId] ?? {
            zoom1: { ...DEFAULT_ZOOM_VALUE },
            zoom2: { ...DEFAULT_ZOOM_VALUE },
            zoom3: { ...DEFAULT_ZOOM_VALUE },
          }),
          [zoomType]: value,
        },
      },
    })),
  resetPaintingZoomCalibration: (paintingId) =>
    set((state) => {
      const defaults = initialZoomCalibration[paintingId];
      if (!defaults) return state;
      return {
        zoomCalibration: {
          ...state.zoomCalibration,
          [paintingId]: {
            zoom1: { ...defaults.zoom1 },
            zoom2: { ...defaults.zoom2 },
            zoom3: { ...defaults.zoom3 },
          },
        },
      };
    }),
  setCurrentEffect: (effect) =>
    set({
      currentEffect: effect,
    }),
  startDialogue: () =>
    set((state) => {
      if (!state.currentPainting || !dialogues[state.currentPainting]) return state;
      return {
        isDialogueActive: true,
        currentDialogueNode: "start",
        currentEffect: "scene1",
      };
    }),
  selectChoice: (choice) =>
    set((state) => {
      const effect = choice.effect ?? state.currentEffect;
      const nextRaw = choice.next?.trim() ?? null;
      const loadMatch = nextRaw?.match(/^load\s*:\s*([a-z0-9-_]+)$/i);

      if (loadMatch) {
        const nextPainting = loadMatch[1].toLowerCase();
        if (!dialogues[nextPainting]) {
          return {
            currentEffect: effect,
          };
        }
        return {
          currentPainting: nextPainting,
          isDialogueActive: true,
          currentDialogueNode: "start",
          currentEffect: "scene1",
          lightboxDisplay: DEFAULT_LIGHTBOX_DISPLAY,
        };
      }

      return {
        currentDialogueNode: nextRaw,
        currentEffect: effect,
        isDialogueActive: nextRaw !== null,
      };
    }),
  endDialogue: () =>
    set({
      isLightboxOpen: false,
      isDialogueActive: false,
      isCreditsVisible: true,
      currentDialogueNode: null,
      currentEffect: null,
    }),
  hideCredits: () =>
    set({
      isCreditsVisible: false,
    }),
  setScrollZ: (nextZ) =>
    set({
      scrollZ: Math.min(16, Math.max(3.8, nextZ)),
    }),
}));
