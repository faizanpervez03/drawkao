"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  SpeakerHigh,
} from "@phosphor-icons/react";
import type { Category, Item } from "@/types/database";
import { fetchCategories, fetchItemsByCategory } from "@/lib/data-client";
import { speak } from "@/lib/audio";
import { useProgress } from "@/lib/progress/ProgressProvider";

const categoryMeta: Record<string, { emoji: string; title: string; image?: string }> = {
  fruits: { emoji: "🍎", title: "Fruits", image: "/images/apple.webp" },
  animals: { emoji: "🐱", title: "Animals", image: "/images/cat.jpg" },
  shapes: { emoji: "⬡", title: "Shapes", image: "/images/shapes.jpg" },
  numbers: { emoji: "⭐", title: "Numbers", image: "/images/star.jpg" },
  vehicles: { emoji: "🚗", title: "Vehicles", image: "/images/car.jpg" },
  nature: { emoji: "🌸", title: "Nature", image: "/images/nature.jpg" },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function GenericCategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const { isLessonCompleted, getLessonStars } = useProgress();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const meta = categoryMeta[category] || { emoji: "📚", title: category };

  useEffect(() => {
    fetchItemsByCategory(category).then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, [category]);

  const completedCount = items.filter((item) => isLessonCompleted(item.id)).length;
  const totalCount = items.length;
  const totalStars = items.reduce((sum, item) => sum + getLessonStars(item.id), 0);
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Top nav */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" weight="bold" />
            Learn
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-semibold">{meta.title}</span>
        </div>

        {/* Level & Progress */}
        <div className="bg-card border-2 border-border rounded-3xl overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                {meta.image ? (
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-secondary/50 p-1">
                    <Image
                      src={meta.image}
                      alt={meta.title}
                      width={40}
                      height={40}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">
                    {meta.emoji}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">{meta.title}</h1>
                  <p className="text-sm text-muted-foreground">Level 1 • {totalCount} lessons</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => speak(`Let's learn ${meta.title}!`)}
                  className="flex items-center gap-2 bg-primary/10 text-primary font-bold px-4 py-2 rounded-full hover:bg-primary/20 transition-colors"
                >
                  <SpeakerHigh className="h-4 w-4" weight="fill" />
                  Listen
                </button>
                <div className="flex items-center gap-2 bg-accent/10 text-accent font-bold px-4 py-2 rounded-full">
                  <Star className="h-4 w-4" weight="fill" />
                  <span>{totalStars} Stars</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Progress</span>
                <span className="text-foreground font-bold">{completedCount}/{totalCount}</span>
              </div>
              <div className="h-3 bg-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Items grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl border-2 border-border bg-card animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">📭</p>
            <h2 className="text-xl font-bold text-foreground mb-2">No lessons yet</h2>
            <p className="text-muted-foreground">Lessons for {meta.title} are coming soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item, i) => {
              const completed = isLessonCompleted(item.id);
              const stars = getLessonStars(item.id);

              return (
                <motion.div
                  key={item.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                >
                  <Link
                    href={`/learn/${category}/${item.slug}`}
                    className="group relative flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-border hover:border-primary/30 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 p-4"
                    style={{ backgroundColor: item.bg_color || "#f5f5f5" }}
                  >
                    {/* Completed badge */}
                    {completed && (
                      <div className="absolute top-2 right-2">
                        <Star className="h-5 w-5 text-accent" weight="fill" />
                      </div>
                    )}

                    <span className="text-5xl sm:text-6xl mb-2 group-hover:scale-110 transition-transform">
                      {item.emoji}
                    </span>
                    <span
                      className="text-lg sm:text-xl font-bold leading-none"
                      style={{ color: item.color || "#333" }}
                    >
                      {item.word}
                    </span>
                    {item.pronunciation && (
                      <span className="text-[10px] sm:text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.pronunciation}
                      </span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
