"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  SpeakerHigh,
  Pencil,
  Star,
  Check,
} from "@phosphor-icons/react";
import type { Item } from "@/types/database";
import { fetchItem, fetchItemsByCategory } from "@/lib/data-client";
import { speakWord, speakPhonetic } from "@/lib/audio";
import { useProgress } from "@/lib/progress/ProgressProvider";

const categoryMeta: Record<string, { emoji: string; title: string; image?: string }> = {
  fruits: { emoji: "🍎", title: "Fruits", image: "/images/apple.webp" },
  animals: { emoji: "🐱", title: "Animals", image: "/images/cat.jpg" },
  shapes: { emoji: "⬡", title: "Shapes", image: "/images/shapes.jpg" },
  numbers: { emoji: "⭐", title: "Numbers", image: "/images/star.jpg" },
  vehicles: { emoji: "🚗", title: "Vehicles", image: "/images/car.jpg" },
  nature: { emoji: "🌸", title: "Nature", image: "/images/nature.jpg" },
};

export default function GenericItemPage() {
  const params = useParams();
  const category = params.category as string;
  const slug = params.slug as string;
  const { isLessonCompleted, getLessonStars } = useProgress();
  const [item, setItem] = useState<Item | null>(null);
  const [prevItem, setPrevItem] = useState<Item | null>(null);
  const [nextItem, setNextItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  const meta = categoryMeta[category] || { emoji: "📚", title: category };

  useEffect(() => {
    setLoading(true);
    fetchItem(category, slug).then((data) => {
      setItem(data);
      if (data) {
        fetchItemsByCategory(category).then((items) => {
          const idx = items.findIndex((i) => i.slug === slug);
          setPrevItem(idx > 0 ? items[idx - 1] : null);
          setNextItem(idx < items.length - 1 ? items[idx + 1] : null);
        });
      }
      setLoading(false);
    });
  }, [category, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-6xl">🔍</p>
          <h1 className="text-2xl font-bold text-foreground">Item not found</h1>
          <Link href={`/learn/${category}`} className="text-primary font-semibold hover:underline">
            Back to {meta.title}
          </Link>
        </div>
      </div>
    );
  }

  const completed = isLessonCompleted(item.id);
  const stars = getLessonStars(item.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              href={`/learn/${category}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" weight="bold" />
              {meta.title}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-semibold">{item.word}</span>
          </div>
          {completed && (
            <div className="flex items-center gap-1 text-accent">
              <Star className="h-4 w-4" weight="fill" />
              <span className="text-sm font-bold">{stars}</span>
            </div>
          )}
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border-2 border-border rounded-3xl overflow-hidden mb-8"
        >
          {/* Emoji Display */}
          <div
            className="flex items-center justify-center py-16 sm:py-20"
            style={{ backgroundColor: item.bg_color || "#f5f5f5" }}
          >
            <motion.span
              className="text-[120px] sm:text-[160px]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {item.emoji}
            </motion.span>
          </div>

          {/* Info */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">{item.word}</h1>
                {item.pronunciation && (
                  <p className="text-lg text-muted-foreground mt-1">{item.pronunciation}</p>
                )}
              </div>
              {completed && (
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-6 w-6 text-primary" weight="bold" />
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => speakWord(item.word)}
                className="flex-1 flex items-center justify-center gap-2 bg-primary/10 text-primary font-bold py-3 rounded-xl hover:bg-primary/20 transition-colors"
              >
                <SpeakerHigh className="h-5 w-5" weight="fill" />
                Listen
              </button>
              {item.pronunciation && (
                <button
                  onClick={() => speakPhonetic(item.pronunciation!)}
                  className="flex-1 flex items-center justify-center gap-2 bg-secondary text-foreground font-bold py-3 rounded-xl hover:bg-secondary/80 transition-colors"
                >
                  <SpeakerHigh className="h-5 w-5" />
                  Phonetic
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Draw Button */}
        <Link
          href={`/learn/${category}/${slug}/draw`}
          className="flex items-center justify-center gap-3 w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-[0_4px_16px_rgba(46,125,50,0.3)] hover:shadow-[0_6px_24px_rgba(46,125,50,0.4)] hover:bg-primary/90 transition-all mb-8"
        >
          <Pencil className="h-5 w-5" weight="bold" />
          Let&apos;s Draw {item.word}
        </Link>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {prevItem ? (
            <Link
              href={`/learn/${category}/${prevItem.slug}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" weight="bold" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Previous</p>
                <p className="text-sm font-bold">{prevItem.word}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextItem ? (
            <Link
              href={`/learn/${category}/${nextItem.slug}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Next</p>
                <p className="text-sm font-bold">{nextItem.word}</p>
              </div>
              <ArrowRight className="h-5 w-5" weight="bold" />
            </Link>
          ) : (
            <Link
              href={`/learn/${category}`}
              className="flex items-center gap-2 text-primary font-bold"
            >
              Back to {meta.title}
              <ArrowRight className="h-5 w-5" weight="bold" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
