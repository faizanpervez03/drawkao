"use client";

import { useState, useEffect } from "react";
import { BookOpen, Star, Flame } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

interface ProgressData {
  lessonsCompleted: number;
  starsEarned: number;
  streak: number;
}

export function ProgressPreview() {
  const [progress, setProgress] = useState<ProgressData>({
    lessonsCompleted: 0,
    starsEarned: 0,
    streak: 0,
  });
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    async function fetchProgress() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setHasUser(false);
        return;
      }

      setHasUser(true);

      const { data: userProgress } = await supabase
        .from("user_progress")
        .select("stars, completed, completed_at")
        .eq("user_id", user.id);

      if (!userProgress) return;

      const completed = userProgress.filter((p) => p.completed);
      const totalStars = completed.reduce((sum, p) => sum + (p.stars || 0), 0);

      const sortedDates = completed
        .filter((p) => p.completed_at)
        .map((p) => new Date(p.completed_at!).toDateString())
        .filter((d, i, arr) => arr.indexOf(d) === i)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      let streak = 0;
      const today = new Date();
      for (let i = 0; i < sortedDates.length; i++) {
        const expected = new Date(today);
        expected.setDate(expected.getDate() - i);
        if (sortedDates[i] === expected.toDateString()) {
          streak++;
        } else {
          break;
        }
      }

      setProgress({
        lessonsCompleted: completed.length,
        starsEarned: totalStars,
        streak,
      });
    }

    fetchProgress();
  }, []);

  const stats = [
    {
      icon: BookOpen,
      value: progress.lessonsCompleted,
      label: "Lessons completed",
      color: "#2e7d32",
    },
    {
      icon: Star,
      value: progress.starsEarned,
      label: "Stars earned",
      color: "#f5a623",
    },
    {
      icon: Flame,
      value: progress.streak,
      label: "Day streak",
      color: "#e57373",
    },
  ];

  return (
    <section id="progress" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-card border-2 border-border rounded-[2rem] p-8 sm:p-12 max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Keep Drawing!
            </h2>
            <p className="text-muted-foreground text-lg">
              {hasUser
                ? "Your child is making great progress. Every drawing builds skills and confidence."
                : "Sign in to track your child's progress. Every drawing builds skills and confidence."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-2">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="space-y-3">
                  <div
                    className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <Icon className="h-6 w-6" weight="duotone" style={{ color: stat.color }} />
                  </div>
                  <p className="text-3xl font-extrabold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          {hasUser ? (
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Keep it up!
            </div>
          ) : (
            <a
              href="/parent/auth"
              className="inline-flex items-center gap-2 bg-accent/10 text-accent text-xs font-semibold px-4 py-2 rounded-full hover:bg-accent/20 transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Sign in to track progress
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
