const STORAGE_KEY = "challenges-progress";

export function getCompletedChallenges(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();
    return new Set(JSON.parse(stored) as number[]);
  } catch {
    return new Set();
  }
}

export function markChallengeCompleted(id: number): void {
  if (typeof window === "undefined") return;
  const completed = getCompletedChallenges();
  completed.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
}

export function clearChallengeProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
