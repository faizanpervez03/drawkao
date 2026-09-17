-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CHILD PROFILES POLICIES
-- ============================================

-- Parents can read their own child profiles
CREATE POLICY "Parents can read own child profiles"
  ON child_profiles FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = parent_id
  );

-- Parents can insert child profiles for themselves
CREATE POLICY "Parents can insert own child profiles"
  ON child_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) = parent_id
  );

-- Parents can update their own child profiles
CREATE POLICY "Parents can update own child profiles"
  ON child_profiles FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) = parent_id
  )
  WITH CHECK (
    (select auth.uid()) = parent_id
  );

-- Parents can delete their own child profiles
CREATE POLICY "Parents can delete own child profiles"
  ON child_profiles FOR DELETE
  TO authenticated
  USING (
    (select auth.uid()) = parent_id
  );

-- ============================================
-- LESSONS POLICIES (public read)
-- ============================================

-- Everyone can read lessons
CREATE POLICY "Lessons are publicly readable"
  ON lessons FOR SELECT
  USING (true);

-- ============================================
-- LESSON PROGRESS POLICIES
-- ============================================

-- Parents can read progress for their own children
CREATE POLICY "Parents can read own child progress"
  ON lesson_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles
      WHERE child_profiles.id = lesson_progress.child_id
      AND child_profiles.parent_id = (select auth.uid())
    )
  );

-- Parents can insert progress for their own children
CREATE POLICY "Parents can insert own child progress"
  ON lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM child_profiles
      WHERE child_profiles.id = lesson_progress.child_id
      AND child_profiles.parent_id = (select auth.uid())
    )
  );

-- Parents can update progress for their own children
CREATE POLICY "Parents can update own child progress"
  ON lesson_progress FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles
      WHERE child_profiles.id = lesson_progress.child_id
      AND child_profiles.parent_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM child_profiles
      WHERE child_profiles.id = lesson_progress.child_id
      AND child_profiles.parent_id = (select auth.uid())
    )
  );

-- Parents can delete progress for their own children
CREATE POLICY "Parents can delete own child progress"
  ON lesson_progress FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles
      WHERE child_profiles.id = lesson_progress.child_id
      AND child_profiles.parent_id = (select auth.uid())
    )
  );

-- ============================================
-- GRANT ACCESS TO ANON/AUTHENTICATED
-- ============================================

-- Lessons are publicly readable
GRANT SELECT ON lessons TO anon;
GRANT SELECT ON lessons TO authenticated;

-- Child profiles need auth
GRANT SELECT, INSERT, UPDATE, DELETE ON child_profiles TO authenticated;

-- Lesson progress needs auth
GRANT SELECT, INSERT, UPDATE, DELETE ON lesson_progress TO authenticated;
