export type ArtworkConfig = {
  id: string;
  title: string;
  imageSrc: string;
  position: [number, number, number];
  rotation: [number, number, number];
};

export const artworks: ArtworkConfig[] = [
  {
    id: "cocaine",
    title: "Cocaine",
    imageSrc: "/artworks/cocaine.jpg",
    position: [-1.3, -0.55, -0.2],
    rotation: [0.01, 0.22, -0.08],
  },
  {
    id: "storytime",
    title: "Story Time",
    imageSrc: "/artworks/storytime.jpg",
    position: [0.25, 0.22, 0.35],
    rotation: [0.02, 0.14, -0.04],
  },
  {
    id: "egodeath",
    title: "Ego Death",
    imageSrc: "/artworks/egodeath.jpg",
    position: [1.6, 0.95, 1.05],
    rotation: [0.02, 0.08, -0.02],
  },
];
