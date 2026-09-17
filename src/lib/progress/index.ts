export { getGuestProgress, initializeGuestProgress, updateLessonProgress, completeLesson, getLessonProgress, getAllProgress, isLessonCompleted, getLessonStars, getProgressByCategory, getCompletedCount, getTotalStars, hasGuestProgress, clearGuestProgress, isAccountConnected, markAccountConnected } from "./guestProgress";
export { getChildProfile, createChildProfile, updateChildProfile, getLessonProgressForChild, getSingleLessonProgress, upsertLessonProgress, upsertMultipleLessonProgress, getChildProgressStats, subscribeToChildProgress } from "./supabaseProgress";
export { migrateGuestToAccount, getMigrationStatus } from "./migration";
export type { GuestProgress, LessonProgress, ChildProfile, Lesson, LessonProgressRow, ProgressMode, ProgressState, ProgressContextType } from "./types";
