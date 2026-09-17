import { createClient } from "@/lib/supabase/client";
import type { ChildProfile, LessonProgressRow } from "./types";

const supabase = createClient();

// ============================================
// CHILD PROFILE OPERATIONS
// ============================================

export async function getChildProfile(parentId: string): Promise<ChildProfile | null> {
  const { data, error } = await supabase
    .from("child_profiles")
    .select("*")
    .eq("parent_id", parentId)
    .single();

  if (error) {
    console.error("Error fetching child profile:", error);
    return null;
  }

  return data;
}

export async function createChildProfile(
  parentId: string,
  displayName: string,
  avatar?: string
): Promise<ChildProfile | null> {
  const { data, error } = await supabase
    .from("child_profiles")
    .insert({
      parent_id: parentId,
      display_name: displayName,
      avatar: avatar || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating child profile:", error);
    return null;
  }

  return data;
}

export async function updateChildProfile(
  childId: string,
  updates: Partial<Pick<ChildProfile, "display_name" | "avatar">>
): Promise<ChildProfile | null> {
  const { data, error } = await supabase
    .from("child_profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", childId)
    .select()
    .single();

  if (error) {
    console.error("Error updating child profile:", error);
    return null;
  }

  return data;
}

// ============================================
// LESSON PROGRESS OPERATIONS
// ============================================

export async function getLessonProgressForChild(
  childId: string
): Promise<LessonProgressRow[]> {
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("child_id", childId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching lesson progress:", error);
    return [];
  }

  return data || [];
}

export async function getSingleLessonProgress(
  childId: string,
  lessonId: string
): Promise<LessonProgressRow | null> {
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("child_id", childId)
    .eq("lesson_id", lessonId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching lesson progress:", error);
    return null;
  }

  return data;
}

export async function upsertLessonProgress(
  childId: string,
  lessonId: string,
  completed: boolean,
  stars: number,
  score?: number
): Promise<LessonProgressRow | null> {
  const now = new Date().toISOString();

  // First try to get existing progress
  const existing = await getSingleLessonProgress(childId, lessonId);

  if (existing) {
    // Merge: keep best values
    const mergedCompleted = existing.completed || completed;
    const mergedStars = Math.max(existing.stars, stars);
    const mergedScore = score !== undefined
      ? Math.max(existing.score || 0, score)
      : existing.score;
    const mergedAttempts = existing.attempts + 1;

    const { data, error } = await supabase
      .from("lesson_progress")
      .update({
        completed: mergedCompleted,
        stars: mergedStars,
        score: mergedScore,
        attempts: mergedAttempts,
        last_played_at: now,
        updated_at: now,
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating lesson progress:", error);
      return null;
    }

    return data;
  } else {
    // Insert new progress
    const { data, error } = await supabase
      .from("lesson_progress")
      .insert({
        child_id: childId,
        lesson_id: lessonId,
        completed,
        stars: Math.max(0, stars),
        score: score !== undefined ? Math.max(0, Math.min(100, score)) : null,
        attempts: 1,
        last_played_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting lesson progress:", error);
      return null;
    }

    return data;
  }
}

export async function upsertMultipleLessonProgress(
  childId: string,
  progressRows: Array<{
    lessonId: string;
    completed: boolean;
    stars: number;
    score?: number;
  }>
): Promise<boolean> {
  const now = new Date().toISOString();

  const rows = progressRows.map((row) => ({
    child_id: childId,
    lesson_id: row.lessonId,
    completed: row.completed,
    stars: Math.max(0, row.stars),
    score: row.score !== undefined ? Math.max(0, Math.min(100, row.score)) : null,
    attempts: 1,
    last_played_at: now,
  }));

  const { error } = await supabase
    .from("lesson_progress")
    .upsert(rows, {
      onConflict: "child_id,lesson_id",
    });

  if (error) {
    console.error("Error upserting lesson progress:", error);
    return false;
  }

  return true;
}

// ============================================
// PROGRESS STATS
// ============================================

export async function getChildProgressStats(childId: string) {
  const progress = await getLessonProgressForChild(childId);

  const completedLessons = progress.filter((p) => p.completed).length;
  const totalStars = progress.reduce((sum, p) => sum + p.stars, 0);
  const totalAttempts = progress.reduce((sum, p) => sum + p.attempts, 0);

  return {
    completedLessons,
    totalStars,
    totalAttempts,
    totalLessons: progress.length,
  };
}

// ============================================
// REALTIME SUBSCRIPTION
// ============================================

export function subscribeToChildProgress(
  childId: string,
  onUpdate: () => void
) {
  const channel = supabase
    .channel(`child-progress-${childId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "lesson_progress",
        filter: `child_id=eq.${childId}`,
      },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
