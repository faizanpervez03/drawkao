"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Headphones, Pencil, ArrowRight } from "@phosphor-icons/react";
import type { Category } from "@/types/database";
import { fetchCategories } from "@/lib/data-client";
import { speak } from "@/lib/audio";

const fallbackCategories: Category[] = [
  {
    id: "alphabet",
    name: "Alphabets",
    description: "Learn A-Z with fun drawings",
    letters: "A B C",
    emoji: "🍎",
    color: "#2e7d32",
    sort_order: 1,
    is_recommended: true,
    created_at: "",
  },
  {
    id: "fruits",
    name: "Fruits",
    description: "Draw & discover yummy fruits",
    letters: "🍎 🍊 🍌",
    emoji: "🍊",
    color: "#e57373",
    sort_order: 2,
    is_recommended: false,
    created_at: "",
  },
  {
    id: "animals",
    name: "Animals",
    description: "Sketch cute furry friends",
    letters: "🐱 🐶 🐸",
    emoji: "🐱",
    color: "#5c9ce6",
    sort_order: 3,
    is_recommended: false,
    created_at: "",
  },
  {
    id: "shapes",
    name: "Shapes",
    description: "Draw, recognize & learn",
    letters: "● ▲ ■",
    emoji: "⬡",
    color: "#f5a623",
    sort_order: 4,
    is_recommended: false,
    created_at: "",
  },
  {
    id: "vehicles",
    name: "Vehicles",
    description: "Cars, trains & planes",
    letters: "🚗 🚂 ✈️",
    emoji: "🚗",
    color: "#e57373",
    sort_order: 5,
    is_recommended: false,
    created_at: "",
  },
  {
    id: "nature",
    name: "Nature",
    description: "Trees, flowers & sunshine",
    letters: "🌸 🌳 ☀️",
    emoji: "🌸",
    color: "#4caf50",
    sort_order: 6,
    is_recommended: false,
    created_at: "",
  },
];

const categoryColors: Record<string, string> = {
  alphabet: "#2e7d32",
  fruits: "#e57373",
  animals: "#5c9ce6",
  shapes: "#f5a623",
  vehicles: "#e57373",
  nature: "#4caf50",
};

const categoryImages: Record<string, string> = {
  alphabet: "/images/abc.avif",
  alphabets: "/images/abc.avif",
  fruits: "/images/apple.webp",
  animals: "/images/cat.jpg",
  shapes: "/images/shapes.jpg",
  vehicles: "/images/car.jpg",
  vehicle: "/images/car.jpg",
  nature: "/images/nature.jpg",
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function LearnPage() {
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then((data) => {
      if (data.length > 0) {
        setCategories(data);
      }
      setLoading(false);
    });
  }, []);

  const getCategoryImage = (cat: Category) => {
    const byId = categoryImages[cat.id];
    if (byId) return byId;
    const byName = categoryImages[cat.name.toLowerCase()];
    if (byName) return byName;
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Level 1 Exploration
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              What do you want to learn?
            </h1>
            <p className="text-muted-foreground text-lg">
              Pick a topic to start your drawing adventure.
            </p>
          </div>
          <button
            onClick={() => speak("What do you want to learn? Pick a topic to start your drawing adventure.")}
            className="inline-flex items-center gap-2 bg-accent text-white hover:bg-accent/90 font-bold px-5 py-3 rounded-full shadow-[0_4px_14px_rgba(245,166,35,0.3)] transition-all self-start"
          >
            <Headphones className="h-5 w-5" weight="fill" />
            Listen
          </button>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {categories.map((cat, i) => {
            const color = categoryColors[cat.id] || cat.color || "#2e7d32";
            const image = getCategoryImage(cat);

            return (
              <motion.div
                key={cat.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <Link
                  href={`/learn/${cat.id}`}
                  className="group flex items-center gap-4 bg-card border-2 border-border rounded-2xl p-4 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:border-primary/30"
                >
                  {/* Icon/Image */}
                  <div
                    className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center overflow-hidden bg-secondary/50 p-2"
                  >
                    {image ? (
                      <Image
                        src={image}
                        alt={cat.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <span className="text-3xl">{cat.emoji}</span>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-lg">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{cat.description}</p>
                  </div>

                  {/* Arrow */}
                  <div
                    className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <ArrowRight className="h-5 w-5" style={{ color }} weight="bold" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Free Draw Pad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-card border-2 border-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Pencil className="h-7 w-7 text-primary" weight="duotone" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">Free Draw Pad</h3>
              <p className="text-sm text-muted-foreground">
                No rules, just pick colors and make anything.
              </p>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 py-3 rounded-full shadow-[0_4px_14px_rgba(46,125,50,0.3)] transition-all shrink-0">
            Open Blank Page
            <ArrowRight className="h-4 w-4" weight="bold" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
