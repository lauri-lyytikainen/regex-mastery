const STORAGE_KEY = "reqex-progress";

export function getCompletedLevels(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();
    return new Set(JSON.parse(stored) as number[]);
  } catch {
    return new Set();
  }
}

export function markLevelCompleted(levelId: number): void {
  if (typeof window === "undefined") return;
  const completed = getCompletedLevels();
  completed.add(levelId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
}

export function clearProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
