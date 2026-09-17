export interface Category {
  id: string;
  name: string;
  description: string;
  letters: string;
  emoji: string;
  color: string;
  sort_order: number;
  is_recommended: boolean;
  created_at: string;
}

export interface DrawingStep {
  step: number;
  label: string;
}

export interface Item {
  id: string;
  category_id: string;
  slug: string;
  label: string;
  word: string;
  emoji: string;
  pronunciation: string | null;
  audio_url: string | null;
  color: string;
  bg_color: string;
  sort_order: number;
  drawing_steps: DrawingStep[];
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  item_id: string;
  completed: boolean;
  stars: number;
  completed_at: string | null;
  created_at: string;
}
