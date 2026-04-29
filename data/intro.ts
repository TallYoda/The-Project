export type IntroContent = {
  preludeLabel: string;
  helperLabel: string;
  headline: string;
  byline: string;
  quoteLines: [string, string];
  quoteSource: string;
  enterLabel: string;
  entryPaintingId: string;
  entryPaintingPrompt: string;
};

export const introContent: IntroContent = {
  preludeLabel: "[/> Prelude",
  helperLabel: "///This Experience is currently Optimized only for Desktop",
  headline: "An immersive Text/Painting based Adventure",
  byline: "by Mikiyas Sintayehu and Jote Tolesa.",
  quoteLines: [
    "You are an extremely sensitive instrument. The world is passing through you, and you're trying to make sense of it. That is your nature.",
    "There is a vast ocean of things you don't understand. And yet you persist. You record. You interpret. You give shape to what would otherwise remain unseen.",
  ],
  quoteSource: "Taken from the Dialogue in Disco Elysium",
  enterLabel: "Enter",
  entryPaintingId: "storytime",
  entryPaintingPrompt: "Story time",
};
