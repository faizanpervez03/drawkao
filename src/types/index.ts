export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  lessonCount: number;
  color: string;
}

export interface Lesson {
  id: string;
  letter: string;
  word: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface ProgressData {
  lessonsCompleted: number;
  starsEarned: number;
  dayStreak: number;
}
