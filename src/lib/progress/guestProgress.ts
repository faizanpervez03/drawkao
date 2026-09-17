import type { GuestProgress, LessonProgress } from "./types";

const STORAGE_KEY = "drawkao_guest_progress";
const ACCOUNT_KEY = "drawkao_account_connected";
const GUEST_ID_KEY = "drawkao_guest_id";
const CURRENT_VERSION = 1;

// ============================================
// GUEST ID GENERATION
// ============================================

function generateGuestId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "guest_";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getOrCreateGuestId(): string {
  if (typeof window === "undefined") return "";
  
  let guestId = localStorage.getItem(GUEST_ID_KEY);
  if (!guestId) {
    guestId = generateGuestId();
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }
  return guestId;
}

// ============================================
// SAFE LOCALSTORAGE ACCESS
// ============================================

function isClient(): boolean {
  return typeof window !== "undefined";
}

// ============================================
// GUEST PROGRESS OPERATIONS
// ============================================

export function getGuestProgress(): GuestProgress | null {
  if (!isClient()) return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as GuestProgress;
      if (parsed.version === CURRENT_VERSION) {
        return parsed;
      }
      // Version mismatch - migrate if needed
      return migrateOldVersion(parsed);
    }
  } catch {
    // Corrupted data - start fresh
  }

  return null;
}

export function initializeGuestProgress(): GuestProgress {
  const guestId = getOrCreateGuestId();
  const now = new Date().toISOString();

  const progress: GuestProgress = {
    version: CURRENT_VERSION,
    guestId,
    child: {},
    progress: [],
    totals: {
      completedLessons: 0,
      totalStars: 0,
      currentStreak: 0,
    },
    createdAt: now,
    updatedAt: now,
  };

  if (isClient()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  return progress;
}

export function saveGuestProgress(progress: GuestProgress): void {
  if (!isClient()) return;

  progress.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function updateLessonProgress(
  lessonId: string,
  categoryId: string,
  completed: boolean,
  stars: number = 0,
  score?: number
): GuestProgress {
  let progress = getGuestProgress();
  if (!progress) {
    progress = initializeGuestProgress();
  }

  const existingIndex = progress.progress.findIndex((p) => p.lessonId === lessonId);
  const now = new Date().toISOString();

  const lessonData: LessonProgress = {
    lessonId,
    categoryId,
    completed,
    stars: Math.max(0, stars),
    score: score !== undefined ? Math.max(0, Math.min(100, score)) : undefined,
    attempts: 1,
    lastPlayedAt: now,
  };

  if (existingIndex >= 0) {
    // Merge: keep best values
    const existing = progress.progress[existingIndex];
    lessonData.attempts = existing.attempts + 1;
    lessonData.completed = existing.completed || completed;
    lessonData.stars = Math.max(existing.stars, stars);
    if (score !== undefined) {
      lessonData.score = Math.max(existing.score || 0, score);
    }
    lessonData.lastPlayedAt = now;
    progress.progress[existingIndex] = lessonData;
  } else {
    progress.progress.push(lessonData);
  }

  // Recalculate totals
  progress.totals.completedLessons = progress.progress.filter((p) => p.completed).length;
  progress.totals.totalStars = progress.progress.reduce((sum, p) => sum + p.stars, 0);

  saveGuestProgress(progress);
  return progress;
}

export function completeLesson(
  lessonId: string,
  categoryId: string,
  stars: number = 3,
  score: number = 100
): GuestProgress {
  return updateLessonProgress(lessonId, categoryId, true, stars, score);
}

export function getLessonProgress(lessonId: string): LessonProgress | null {
  const progress = getGuestProgress();
  if (!progress) return null;

  return progress.progress.find((p) => p.lessonId === lessonId) || null;
}

export function getAllProgress(): LessonProgress[] {
  const progress = getGuestProgress();
  if (!progress) return [];

  return progress.progress;
}

export function isLessonCompleted(lessonId: string): boolean {
  const lesson = getLessonProgress(lessonId);
  return lesson?.completed || false;
}

export function getLessonStars(lessonId: string): number {
  const lesson = getLessonProgress(lessonId);
  return lesson?.stars || 0;
}

export function getProgressByCategory(categoryId: string): LessonProgress[] {
  const progress = getGuestProgress();
  if (!progress) return [];

  return progress.progress.filter((p) => p.categoryId === categoryId);
}

export function getCompletedCount(categoryId: string): number {
  return getProgressByCategory(categoryId).filter((p) => p.completed).length;
}

export function getTotalStars(): number {
  const progress = getGuestProgress();
  return progress?.totals.totalStars || 0;
}

export function hasGuestProgress(): boolean {
  const progress = getGuestProgress();
  return progress !== null && progress.progress.length > 0;
}

export function clearGuestProgress(): void {
  if (!isClient()) return;
  localStorage.removeItem(STORAGE_KEY);
}

export function isAccountConnected(): boolean {
  if (!isClient()) return false;
  return localStorage.getItem(ACCOUNT_KEY) === "true";
}

export function markAccountConnected(): void {
  if (!isClient()) return;
  localStorage.setItem(ACCOUNT_KEY, "true");
}

// ============================================
// VERSION MIGRATION
// ============================================

function migrateOldVersion(old: GuestProgress): GuestProgress {
  // Simple migration - just update version and keep data
  return {
    ...old,
    version: CURRENT_VERSION,
    updatedAt: new Date().toISOString(),
  };
}
