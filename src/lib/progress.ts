const PROGRESS_KEY = "drawkao_progress";

export interface ProgressData {
  completed: string[]; // array of item IDs like ["a", "b", "apple", "cat"]
  stars: number;
  lastUpdated: string;
}

function getProgress(): ProgressData {
  if (typeof window === "undefined") {
    return { completed: [], stars: 0, lastUpdated: "" };
  }

  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }

  return { completed: [], stars: 0, lastUpdated: "" };
}

export function isItemCompleted(itemId: string): boolean {
  const progress = getProgress();
  return progress.completed.includes(itemId);
}

export function getCompletedCount(categoryId: string): number {
  const progress = getProgress();
  return progress.completed.filter((id) => id.startsWith(categoryId) || id.length === 1).length;
}

export function getStars(): number {
  const progress = getProgress();
  return progress.stars;
}

export function markAsCompleted(itemId: string, starsToAdd: number = 3): void {
  if (typeof window === "undefined") return;

  const progress = getProgress();

  if (!progress.completed.includes(itemId)) {
    progress.completed.push(itemId);
  }

  progress.stars += starsToAdd;
  progress.lastUpdated = new Date().toISOString();

  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROGRESS_KEY);
}

export function getCompletedItems(): string[] {
  const progress = getProgress();
  return progress.completed;
}
