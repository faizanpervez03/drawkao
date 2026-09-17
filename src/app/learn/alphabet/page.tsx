"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Star,
  Trophy,
  ArrowRight,
  Lock,
  Pencil,
  SpeakerHigh,
  Sparkle,
} from "@phosphor-icons/react";
import type { Item } from "@/types/database";
import { fetchItemsByCategory } from "@/lib/data-client";
import { useProgress } from "@/lib/progress/ProgressProvider";
import { speak } from "@/lib/audio";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function AlphabetPage() {
  const { isLessonCompleted, getLessonStars, totals } = useProgress();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItemsByCategory("alphabet").then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const completedCount = items.filter((item) => isLessonCompleted(item.id)).length;
  const totalCount = items.length;
  const stars = totals.totalStars;

  // Find the next letter to draw (first incomplete)
  const nextItem = items.find((item) => !isLessonCompleted(item.id));

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Top nav */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" weight="bold" />
            Learn
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-semibold">Alphabet</span>
        </div>

        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground text-xs font-medium px-3 py-1.5 rounded-full">
              <span>📖</span>
              Activity Book • Level 1
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Learn the Alphabet
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose a letter to start drawing.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => speak("Choose a letter to start drawing.")}
              className="inline-flex items-center gap-2 bg-accent text-white hover:bg-accent/90 font-bold px-5 py-3 rounded-full shadow-[0_4px_14px_rgba(245,166,35,0.3)] transition-all"
            >
              <SpeakerHigh className="h-5 w-5" weight="fill" />
              Hear Word
            </button>
            <div className="inline-flex items-center gap-2 bg-muted text-foreground font-semibold px-4 py-3 rounded-full">
              <Check className="h-4 w-4 text-primary" weight="bold" />
              {completedCount} of {totalCount} Drawn
            </div>
          </div>
        </div>

        {/* Letter grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 26 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-2xl border-2 border-border bg-card animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((item, i) => {
              const isCompleted = isLessonCompleted(item.id);
              const isNext = nextItem?.id === item.id;
              const itemNumber = String(i + 1).padStart(2, "0");

              return (
                <motion.div
                  key={item.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                >
                  <Link
                    href={`/learn/alphabet/${item.slug}`}
                    className={`group relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-200 hover:shadow-md ${
                      isCompleted
                        ? "border-primary/30 bg-primary/5"
                        : isNext
                        ? "border-primary shadow-[0_0_0_1px_rgba(46,125,50,0.2)]"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    {/* Number badge */}
                    <div className="absolute top-2 left-2 h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {itemNumber}
                      </span>
                    </div>

                    {/* Star icon */}
                    <div className="absolute top-2 right-2">
                      {isCompleted ? (
                        <Star className="h-5 w-5 text-accent" weight="fill" />
                      ) : (
                        <Star className="h-5 w-5 text-border" weight="bold" />
                      )}
                    </div>

                    {/* Next badge */}
                    {isNext && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Next
                      </div>
                    )}

                    {/* Letter */}
                    <span
                      className={`text-4xl sm:text-5xl font-extrabold leading-none mt-4 mb-2 ${
                        isCompleted ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Emoji */}
                    <span className="text-3xl sm:text-4xl mb-2">{item.emoji}</span>

                    {/* Word */}
                    <span className="text-sm font-semibold text-foreground mb-2">
                      {item.word}
                    </span>

                    {/* Status */}
                    {isCompleted ? (
                      <div className="flex items-center gap-1 text-primary">
                        <Check className="h-4 w-4" weight="bold" />
                        <span className="text-xs font-semibold">Done</span>
                      </div>
                    ) : isNext ? (
                      <div className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-full text-xs font-bold">
                        <Pencil className="h-3 w-3" weight="duotone" />
                        Draw
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Lock className="h-3 w-3" weight="bold" />
                        <span className="text-xs font-medium">Ready</span>
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Daily Mystery Stroke */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 bg-card border-2 border-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkle className="h-7 w-7 text-primary" weight="duotone" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">Daily Mystery Stroke</h3>
              <p className="text-sm text-muted-foreground">
                Practice three lines to earn your daily golden stamp!
              </p>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 py-3 rounded-full shadow-[0_4px_14px_rgba(46,125,50,0.3)] transition-all shrink-0">
            <span>🎯</span>
            Quick Play
          </button>
        </motion.div>
      </div>
    </div>
  );
}
