"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ProgressContextType, ProgressMode, LessonProgress, GuestProgress, ChildProfile } from "./types";
import {
  getGuestProgress,
  initializeGuestProgress,
  completeLesson as guestCompleteLesson,
  isAccountConnected,
} from "./guestProgress";
import {
  getChildProfile,
  upsertLessonProgress,
  getLessonProgressForChild,
  subscribeToChildProgress,
} from "./supabaseProgress";

const ProgressContext = createContext<ProgressContextType | null>(null);

export function useProgress(): ProgressContextType {
  const context = useContext(ProgressContext);
  if (!context) {
    // Return safe defaults during SSR or before provider mounts
    return {
      mode: "guest",
      guestProgress: null,
      childProfile: null,
      lessonProgress: {},
      totals: { completedLessons: 0, totalStars: 0, currentStreak: 0 },
      loading: false,
      syncing: false,
      migrationStatus: "idle",
      completeLesson: async () => {},
      getLessonProgress: () => null,
      isLessonCompleted: () => false,
      getLessonStars: () => 0,
      getProgressByCategory: () => [],
      resetProgress: () => {},
      migrateGuestProgress: async () => false,
      refreshProgress: async () => {},
    };
  }
  return context;
}

interface ProgressProviderProps {
  children: ReactNode;
}

export function ProgressProvider({ children }: ProgressProviderProps) {
  const [mode, setMode] = useState<ProgressMode>("guest");
  const [guestProgress, setGuestProgress] = useState<GuestProgress | null>(null);
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>({});
  const [totals, setTotals] = useState({
    completedLessons: 0,
    totalStars: 0,
    currentStreak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<"idle" | "migrating" | "completed" | "failed">("idle");
  const [mounted, setMounted] = useState(false);

  const supabase = createClient();

  // Mark as mounted after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // ============================================
  // INITIALIZE PROGRESS (only after mount)
  // ============================================

  const loadGuestProgress = useCallback(() => {
    let progress = getGuestProgress();
    if (!progress) {
      progress = initializeGuestProgress();
    }
    setGuestProgress(progress);

    // Convert to lessonProgress map
    const progressMap: Record<string, LessonProgress> = {};
    for (const lesson of progress.progress) {
      progressMap[lesson.lessonId] = lesson;
    }
    setLessonProgress(progressMap);
    setTotals(progress.totals);
  }, []);

  const loadAuthenticatedProgress = useCallback(async (childId: string) => {
    const progressRows = await getLessonProgressForChild(childId);
    const progressMap: Record<string, LessonProgress> = {};
    let completedCount = 0;
    let totalStars = 0;

    for (const row of progressRows) {
      progressMap[row.lesson_id] = {
        lessonId: row.lesson_id,
        categoryId: "",
        completed: row.completed,
        stars: row.stars,
        score: row.score || undefined,
        attempts: row.attempts,
        lastPlayedAt: row.last_played_at,
      };
      if (row.completed) completedCount++;
      totalStars += row.stars;
    }

    setLessonProgress(progressMap);
    setTotals({
      completedLessons: completedCount,
      totalStars,
      currentStreak: 0,
    });
  }, []);

  // ============================================
  // CHECK AUTH STATUS ON MOUNT
  // ============================================

  useEffect(() => {
    if (!mounted) return;

    async function init() {
      setLoading(true);

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();

      if (user && isAccountConnected()) {
        // Load from Supabase
        setMode("authenticated");
        const profile = await getChildProfile(user.id);
        setChildProfile(profile);

        if (profile) {
          await loadAuthenticatedProgress(profile.id);
        }
      } else {
        // Load from localStorage
        setMode("guest");
        loadGuestProgress();
      }

      setLoading(false);
    }

    init();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setMode("authenticated");
          const profile = await getChildProfile(session.user.id);
          setChildProfile(profile);

          if (profile) {
            await loadAuthenticatedProgress(profile.id);
          }
        } else if (event === "SIGNED_OUT") {
          setMode("guest");
          setChildProfile(null);
          loadGuestProgress();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [mounted, supabase, loadGuestProgress, loadAuthenticatedProgress]);

  // ============================================
  // REALTIME SUBSCRIPTION
  // ============================================

  useEffect(() => {
    if (mode === "authenticated" && childProfile) {
      const unsubscribe = subscribeToChildProgress(childProfile.id, () => {
        loadAuthenticatedProgress(childProfile.id);
      });

      return unsubscribe;
    }
  }, [mode, childProfile, loadAuthenticatedProgress]);

  // ============================================
  // COMPLETE LESSON
  // ============================================

  const completeLesson = useCallback(
    async (lessonId: string, categoryId: string, stars: number = 3, score: number = 100) => {
      if (mode === "guest") {
        // Save to localStorage
        const updated = guestCompleteLesson(lessonId, categoryId, stars, score);
        setGuestProgress(updated);

        // Update local state
        setLessonProgress((prev) => ({
          ...prev,
          [lessonId]: {
            lessonId,
            categoryId,
            completed: true,
            stars,
            score,
            attempts: 1,
            lastPlayedAt: new Date().toISOString(),
          },
        }));
        setTotals(updated.totals);
      } else if (mode === "authenticated" && childProfile) {
        // Save to Supabase
        setSyncing(true);
        const result = await upsertLessonProgress(
          childProfile.id,
          lessonId,
          true,
          stars,
          score
        );
        setSyncing(false);

        if (result) {
          // Update local state
          setLessonProgress((prev) => ({
            ...prev,
            [lessonId]: {
              lessonId,
              categoryId,
              completed: true,
              stars,
              score,
              attempts: result.attempts,
              lastPlayedAt: result.last_played_at,
            },
          }));

          // Recalculate totals
          setTotals((prev) => ({
            ...prev,
            completedLessons: prev.completedLessons + 1,
            totalStars: prev.totalStars + stars,
          }));
        }
      }
    },
    [mode, childProfile]
  );

  // ============================================
  // GETTERS
  // ============================================

  const getLessonProgressFunc = useCallback(
    (lessonId: string): LessonProgress | null => {
      return lessonProgress[lessonId] || null;
    },
    [lessonProgress]
  );

  const isLessonCompletedFunc = useCallback(
    (lessonId: string): boolean => {
      return lessonProgress[lessonId]?.completed || false;
    },
    [lessonProgress]
  );

  const getLessonStarsFunc = useCallback(
    (lessonId: string): number => {
      return lessonProgress[lessonId]?.stars || 0;
    },
    [lessonProgress]
  );

  const getProgressByCategoryFunc = useCallback(
    (categoryId: string): LessonProgress[] => {
      return Object.values(lessonProgress).filter(
        (p) => p.categoryId === categoryId
      );
    },
    [lessonProgress]
  );

  // ============================================
  // RESET PROGRESS
  // ============================================

  const resetProgress = useCallback(() => {
    if (mode === "guest") {
      localStorage.removeItem("drawkao_guest_progress");
      loadGuestProgress();
    }
  }, [mode, loadGuestProgress]);

  // ============================================
  // REFRESH PROGRESS
  // ============================================

  const refreshProgress = useCallback(async () => {
    if (mode === "guest") {
      loadGuestProgress();
    } else if (childProfile) {
      await loadAuthenticatedProgress(childProfile.id);
    }
  }, [mode, childProfile, loadGuestProgress, loadAuthenticatedProgress]);

  // ============================================
  // MIGRATION
  // ============================================

  const migrateGuestProgress = useCallback(async (): Promise<boolean> => {
    if (mode !== "authenticated" || !childProfile) {
      return false;
    }

    const localProgress = getGuestProgress();
    if (!localProgress || localProgress.progress.length === 0) {
      return true;
    }

    setMigrationStatus("migrating");

    try {
      const { migrateGuestToAccount } = await import("./migration");
      const result = await migrateGuestToAccount(localProgress, childProfile.parent_id);

      if (result.success) {
        setMigrationStatus("completed");
        await loadAuthenticatedProgress(childProfile.id);
        return true;
      } else {
        setMigrationStatus("failed");
        return false;
      }
    } catch (error) {
      console.error("Migration error:", error);
      setMigrationStatus("failed");
      return false;
    }
  }, [mode, childProfile, loadAuthenticatedProgress]);

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value: ProgressContextType = {
    mode,
    guestProgress,
    childProfile,
    lessonProgress,
    totals,
    loading: loading || !mounted,
    syncing,
    migrationStatus,
    completeLesson,
    getLessonProgress: getLessonProgressFunc,
    isLessonCompleted: isLessonCompletedFunc,
    getLessonStars: getLessonStarsFunc,
    getProgressByCategory: getProgressByCategoryFunc,
    resetProgress,
    migrateGuestProgress,
    refreshProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}
