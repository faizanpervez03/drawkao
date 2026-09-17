"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Pencil,
  Trophy,
  SpeakerHigh,
  Eye,
  Sparkle,
  BookOpen,
  Target,
  ArrowRight,
  Play,
} from "@phosphor-icons/react";
import type { Item } from "@/types/database";
import { fetchItemsByCategory } from "@/lib/data-client";
import { useProgress } from "@/lib/progress/ProgressProvider";
import { speak } from "@/lib/audio";

const categoryImages: Record<string, string> = {
  alphabet: "/images/abc.avif",
  fruits: "/images/apple.webp",
  animals: "/images/cat.jpg",
  shapes: "/images/shapes.jpg",
  vehicles: "/images/car.jpg",
  nature: "/images/nature.jpg",
};

const categoryColors: Record<string, string> = {
  alphabet: "#2e7d32",
  fruits: "#e57373",
  animals: "#5c9ce6",
  shapes: "#f5a623",
  vehicles: "#e57373",
  nature: "#4caf50",
  numbers: "#9575cd",
};

const categoryMeta: Record<string, { emoji: string; title: string }> = {
  alphabet: { emoji: "🔤", title: "Alphabet" },
  fruits: { emoji: "🍎", title: "Fruits" },
  animals: { emoji: "🐱", title: "Animals" },
  shapes: { emoji: "⬡", title: "Shapes" },
  vehicles: { emoji: "🚗", title: "Vehicles" },
  nature: { emoji: "🌸", title: "Nature" },
  numbers: { emoji: "⭐", title: "Numbers" },
};

export default function MyProgressPage() {
  const { isLessonCompleted, getLessonStars, totals } = useProgress();
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "letters" | "objects">("all");

  useEffect(() => {
    async function loadAllItems() {
      const categories = ["alphabet", "fruits", "animals", "shapes", "vehicles", "numbers"];
      const itemsPromises = categories.map((cat) => fetchItemsByCategory(cat));
      const results = await Promise.all(itemsPromises);
      const flat = results.flat();
      setAllItems(flat);
      setLoading(false);
    }
    loadAllItems();
  }, []);

  const completedItems = allItems.filter((item) => isLessonCompleted(item.id));
  const incompleteItems = allItems.filter((item) => !isLessonCompleted(item.id));
  const alphabetItems = completedItems.filter((item) => item.category_id === "alphabet");
  const objectItems = completedItems.filter((item) => item.category_id !== "alphabet");

  // Find next item to continue (first incomplete, grouped by category)
  const continueItem = incompleteItems.length > 0 ? incompleteItems[0] : null;
  const continueCategory = continueItem
    ? categoryMeta[continueItem.category_id] || { emoji: "📚", title: continueItem.category_id }
    : null;

  const filteredItems = filter === "all"
    ? completedItems
    : filter === "letters"
    ? alphabetItems
    : objectItems;

  const alphabetCompleted = allItems.filter(
    (item) => item.category_id === "alphabet" && isLessonCompleted(item.id)
  ).length;
  const alphabetTotal = allItems.filter((item) => item.category_id === "alphabet").length;
  const progressPercent = alphabetTotal > 0 ? (alphabetCompleted / alphabetTotal) * 100 : 0;

  const getRank = () => {
    if (totals.totalStars >= 50) return "Master Artist";
    if (totals.totalStars >= 25) return "Star Explorer";
    if (totals.totalStars >= 10) return "Rising Star";
    return "Beginner";
  };

  const getRelativeTime = (item: Item) => {
    return "Recently";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full">
              <Sparkle className="h-3.5 w-3.5" weight="fill" />
              My Sticker Journal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              My Learning
            </h1>
            <p className="text-muted-foreground text-base max-w-md">
              Look at everything you have drawn and learned! You are becoming a master artist!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => speak("Great job! Keep learning and drawing!")}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-full transition-colors shadow-sm"
            >
              <SpeakerHigh className="h-4 w-4" weight="fill" />
              Play Cheer
            </button>
            <Link
              href="/learn"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-full transition-colors shadow-sm"
            >
              <Pencil className="h-4 w-4" weight="bold" />
              Draw More
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {/* Alphabet Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alphabet</span>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">A</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-extrabold text-foreground">{alphabetCompleted}</span>
              <span className="text-lg text-muted-foreground">/ {alphabetTotal}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Letters completed</p>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-full bg-green-500 rounded-full"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Starting A-Z</span>
              <span className="font-bold text-green-600">{Math.round(progressPercent)}% Complete</span>
            </div>
          </motion.div>

          {/* Drawing Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Drawing</span>
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Pencil className="h-4 w-4 text-orange-500" weight="bold" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-extrabold text-foreground">{completedItems.length}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">activities Drawings created</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Crayons, brushes & stencils</span>
            </div>
          </motion.div>

          {/* Stars Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Stars</span>
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Star className="h-4 w-4 text-orange-500" weight="fill" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-extrabold text-foreground">{totals.totalStars}</span>
              <Star className="h-6 w-6 text-amber-400" weight="fill" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">Stars earned</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Current Rank:</span>
              <span className="font-bold text-amber-600 flex items-center gap-1">
                <Trophy className="h-3 w-3" weight="fill" />
                {getRank()}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Continue Learning */}
        {continueItem && continueCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Link
              href={`/learn/${continueItem.category_id}/${continueItem.slug}/draw`}
              className="group flex items-center gap-5 bg-gradient-to-r from-green-50 to-green-100/50 border-2 border-green-200 rounded-2xl p-5 hover:shadow-lg hover:border-green-300 transition-all"
            >
              <div className="h-16 w-16 shrink-0 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <span className="text-4xl">{continueItem.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-green-600 bg-green-200 px-2 py-0.5 rounded-full">
                    Continue Learning
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {continueCategory.title}: {continueItem.word}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {continueItem.pronunciation || "Tap to start drawing"}
                </p>
              </div>
              <div className="h-12 w-12 shrink-0 rounded-full bg-green-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Play className="h-5 w-5 text-white ml-0.5" weight="fill" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* Sticker Gallery */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600" weight="duotone" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-foreground">My Sticker Gallery</h2>
                <p className="text-sm text-muted-foreground">Tap any artwork to admire your masterpiece!</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[
                { key: "all" as const, label: `All (${completedItems.length})` },
                { key: "letters" as const, label: `Letters (${alphabetItems.length})` },
                { key: "objects" as const, label: `Objects (${objectItems.length})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                    filter === tab.key
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <p className="text-6xl mb-4">🎨</p>
              <h3 className="text-xl font-bold text-foreground mb-2">No artwork yet!</h3>
              <p className="text-muted-foreground mb-4">Start drawing to fill your sticker gallery.</p>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-full transition-colors"
              >
                <Pencil className="h-4 w-4" weight="bold" />
                Start Drawing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item, i) => {
                const stars = getLessonStars(item.id);
                const catColor = categoryColors[item.category_id] || "#2e7d32";

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={`/learn/${item.category_id}/${item.slug}`}
                      className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                    >
                      {/* Image area */}
                      <div
                        className="relative h-48 flex items-center justify-center"
                        style={{ backgroundColor: item.bg_color || "#f5f5f5" }}
                      >
                        <span className="text-8xl group-hover:scale-110 transition-transform">
                          {item.emoji}
                        </span>

                        {/* Category badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                            style={{ backgroundColor: catColor }}
                          >
                            {item.category_id.charAt(0).toUpperCase() + item.category_id.slice(1)}
                          </span>
                        </div>

                        {/* Stars badge */}
                        <div className="absolute top-3 right-3">
                          <span className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                            <Star className="h-3 w-3 text-amber-400" weight="fill" />
                            {stars}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-foreground">{item.word}</h3>
                            <p className="text-xs text-muted-foreground">
                              {item.category_id.charAt(0).toUpperCase() + item.category_id.slice(1)} • {getRelativeTime(item)}
                            </p>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <Eye className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Weekly Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" weight="duotone" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Great job this week!</h3>
                <p className="text-sm text-muted-foreground">
                  Your child practiced {completedItems.length} distinct fine-motor strokes and recognized {alphabetCompleted} phonetic associations.
                </p>
              </div>
            </div>
            <Link
              href="/parent/dashboard"
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-foreground font-bold px-5 py-2.5 rounded-full transition-colors shrink-0"
            >
              Parent Insights
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
