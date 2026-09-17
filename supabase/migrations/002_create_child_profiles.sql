-- ============================================
-- CHILD PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'My Child',
  avatar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_child_profiles_parent_id ON child_profiles(parent_id);

-- ============================================
-- LESSONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  image_url TEXT,
  audio_url TEXT,
  difficulty INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(category_id, slug)
);

-- Index for category lookups
CREATE INDEX IF NOT EXISTS idx_lessons_category_id ON lessons(category_id);

-- ============================================
-- LESSON PROGRESS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  stars INTEGER NOT NULL DEFAULT 0 CHECK (stars >= 0 AND stars <= 3),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_played_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(child_id, lesson_id)
);

-- Indexes for progress lookups
CREATE INDEX IF NOT EXISTS idx_lesson_progress_child_id ON lesson_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_child_lesson ON lesson_progress(child_id, lesson_id);
