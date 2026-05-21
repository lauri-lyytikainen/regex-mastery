export const FLAG_LIST = ["g", "i", "m"] as const;
export type Flag = (typeof FLAG_LIST)[number];

export const FLAG_DESCRIPTIONS: Record<Flag, string> = {
  g: "Global — find all matches instead of stopping after the first.",
  i: "Case-insensitive — match letters regardless of case.",
  m: "Multiline — ^ and $ match start/end of lines, not just the whole string.",
};
