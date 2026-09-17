// ============================================
// GUEST PROGRESS TYPES (localStorage)
// ============================================

export interface LessonProgress {
  lessonId: string;
  categoryId: string;
  completed: boolean;
  stars: number;
  score?: number;
  attempts: number;
  lastPlayedAt: string;
}

export interface GuestProgress {
  version: number;
  guestId: string;
  child: {
    displayName?: string;
    avatar?: string;
  };
  progress: LessonProgress[];
  totals: {
    completedLessons: number;
    totalStars: number;
    currentStreak: number;
  };
  createdAt: string;
  updatedAt: string;
}

// ============================================
// SUPABASE DATABASE TYPES
// ============================================

export interface ChildProfile {
  id: string;
  parent_id: string;
  display_name: string;
  avatar: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  image_url: string | null;
  audio_url: string | null;
  difficulty: number;
  sort_order: number;
  created_at: string;
}

export interface LessonProgressRow {
  id: string;
  child_id: string;
  lesson_id: string;
  completed: boolean;
  stars: number;
  score: number | null;
  attempts: number;
  last_played_at: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// PROGRESS CONTEXT TYPES
// ============================================

export type ProgressMode = "guest" | "authenticated";

export interface ProgressState {
  mode: ProgressMode;
  guestProgress: GuestProgress | null;
  childProfile: ChildProfile | null;
  lessonProgress: Record<string, LessonProgress>;
  totals: {
    completedLessons: number;
    totalStars: number;
    currentStreak: number;
  };
  loading: boolean;
  syncing: boolean;
  migrationStatus: "idle" | "migrating" | "completed" | "failed";
}

export interface ProgressContextType extends ProgressState {
  completeLesson: (lessonId: string, categoryId: string, stars?: number, score?: number) => Promise<void>;
  getLessonProgress: (lessonId: string) => LessonProgress | null;
  isLessonCompleted: (lessonId: string) => boolean;
  getLessonStars: (lessonId: string) => number;
  getProgressByCategory: (categoryId: string) => LessonProgress[];
  resetProgress: () => void;
  migrateGuestProgress: () => Promise<boolean>;
  refreshProgress: () => Promise<void>;
}
