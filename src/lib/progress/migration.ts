import { createClient } from "@/lib/supabase/client";
import type { GuestProgress, ChildProfile, LessonProgressRow } from "./types";
import {
  getChildProfile,
  createChildProfile,
  upsertMultipleLessonProgress,
} from "./supabaseProgress";
import { markAccountConnected } from "./guestProgress";

const supabase = createClient();

// ============================================
// MERGE LOGIC
// ============================================

interface MergedProgress {
  lessonId: string;
  completed: boolean;
  stars: number;
  score?: number;
}

function mergeProgress(
  localProgress: GuestProgress,
  cloudProgress: LessonProgressRow[],
  lessonIdMap: Map<string, string> // local lessonId -> supabase lesson UUID
): MergedProgress[] {
  const merged: MergedProgress[] = [];
  const cloudMap = new Map(cloudProgress.map((p) => [p.lesson_id, p]));

  for (const localLesson of localProgress.progress) {
    const supabaseLessonId = lessonIdMap.get(localLesson.lessonId);
    if (!supabaseLessonId) continue;

    const cloudLesson = cloudMap.get(supabaseLessonId);

    if (cloudLesson) {
      // Merge: keep best values
      merged.push({
        lessonId: supabaseLessonId,
        completed: localLesson.completed || cloudLesson.completed,
        stars: Math.max(localLesson.stars, cloudLesson.stars),
        score:
          localLesson.score !== undefined
            ? Math.max(localLesson.score, cloudLesson.score || 0)
            : cloudLesson.score || undefined,
      });
    } else {
      // Only local progress exists
      merged.push({
        lessonId: supabaseLessonId,
        completed: localLesson.completed,
        stars: localLesson.stars,
        score: localLesson.score,
      });
    }
  }

  return merged;
}

// ============================================
// LESSON ID MAPPING
// ============================================

async function getLessonIdMap(): Promise<Map<string, string>> {
  const { data: lessons, error } = await supabase
    .from("items")
    .select("id, slug");

  if (error || !lessons) {
    console.error("Error fetching lessons for mapping:", error);
    return new Map();
  }

  // Map local lesson IDs (slugs) to supabase UUIDs
  const map = new Map<string, string>();
  for (const lesson of lessons) {
    map.set(lesson.slug, lesson.id);
  }

  return map;
}

// ============================================
// MAIN MIGRATION FUNCTION
// ============================================

export interface MigrationResult {
  success: boolean;
  childProfile: ChildProfile | null;
  lessonsMigrated: number;
  starsMigrated: number;
  error?: string;
}

export async function migrateGuestToAccount(
  guestProgress: GuestProgress,
  parentId: string
): Promise<MigrationResult> {
  try {
    // Step 1: Check if child profile already exists
    let childProfile = await getChildProfile(parentId);

    // Step 2: Create child profile if needed
    if (!childProfile) {
      childProfile = await createChildProfile(
        parentId,
        guestProgress.child.displayName || "My Child",
        guestProgress.child.avatar
      );

      if (!childProfile) {
        return {
          success: false,
          childProfile: null,
          lessonsMigrated: 0,
          starsMigrated: 0,
          error: "Failed to create child profile",
        };
      }
    }

    // Step 3: Get lesson ID mapping
    const lessonIdMap = await getLessonIdMap();

    // Step 4: Get existing cloud progress for merge
    const { data: existingProgress } = await supabase
      .from("lesson_progress")
      .select("*")
      .eq("child_id", childProfile.id);

    // Step 5: Merge progress
    const mergedProgress = mergeProgress(
      guestProgress,
      existingProgress || [],
      lessonIdMap
    );

    // Step 6: Upsert to Supabase
    if (mergedProgress.length > 0) {
      const success = await upsertMultipleLessonProgress(
        childProfile.id,
        mergedProgress
      );

      if (!success) {
        return {
          success: false,
          childProfile,
          lessonsMigrated: 0,
          starsMigrated: 0,
          error: "Failed to upsert lesson progress",
        };
      }
    }

    // Step 7: Mark account as connected
    markAccountConnected();

    // Step 8: Clear guest progress (safely, after successful migration)
    // Keep it for now as backup - will be cleared later
    // localStorage.removeItem("drawkao_guest_progress");

    return {
      success: true,
      childProfile,
      lessonsMigrated: mergedProgress.length,
      starsMigrated: guestProgress.totals.totalStars,
    };
  } catch (error) {
    console.error("Migration error:", error);
    return {
      success: false,
      childProfile: null,
      lessonsMigrated: 0,
      starsMigrated: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================
// CHECK MIGRATION STATUS
// ============================================

export async function getMigrationStatus(parentId: string) {
  const childProfile = await getChildProfile(parentId);

  if (!childProfile) {
    return {
      migrated: false,
      childProfile: null,
    };
  }

  return {
    migrated: true,
    childProfile,
  };
}
