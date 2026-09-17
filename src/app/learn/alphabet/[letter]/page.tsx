"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Headphones,
  Pencil,
  SpeakerHigh,
  Check,
} from "@phosphor-icons/react";
import type { Item } from "@/types/database";
import { fetchItem, fetchItemsByCategory } from "@/lib/data-client";
import { speak, speakLetter, speakWord, speakPhonetic } from "@/lib/audio";

const steps = [
  { label: "Trace a Apple", done: true },
  { label: "Color Apple", done: true },
  { label: "Learn Sign", done: false },
];

export default function LetterPage() {
  const params = useParams();
  const letter = (params.letter as string).toLowerCase();
  const [item, setItem] = useState<Item | null>(null);
  const [prevItem, setPrevItem] = useState<Item | null>(null);
  const [nextItem, setNextItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchItem("alphabet", letter).then((data) => {
      setItem(data);
      if (data) {
        fetchItemsByCategory("alphabet").then((items) => {
          const idx = items.findIndex((i) => i.slug === letter);
          setPrevItem(idx > 0 ? items[idx - 1] : null);
          setNextItem(idx < items.length - 1 ? items[idx + 1] : null);
        });
      }
      setLoading(false);
    });
  }, [letter]);

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
          <h1 className="text-2xl font-bold text-foreground">Letter not found</h1>
          <Link href="/learn/alphabet" className="text-primary font-semibold hover:underline">
            Back to Alphabet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/learn/alphabet"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" weight="bold" />
            <span className="hidden sm:inline">Alphabet</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-semibold">Letter {item.label}</span>
          </Link>
          <button
            onClick={async () => {
              await speakWord(item.word);
            }}
            className="inline-flex items-center gap-2 bg-accent/10 text-accent font-semibold px-4 py-2 rounded-full hover:bg-accent/20 transition-colors"
          >
            <SpeakerHigh className="h-4 w-4" weight="fill" />
            <span className="hidden sm:inline">Listen Please</span>
          </button>
        </div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card border-2 border-border rounded-3xl overflow-hidden"
        >
          {/* Letter & Word display */}
          <div className="p-6 sm:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
              {/* Letter */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div
                    className="w-40 h-40 sm:w-52 sm:h-52 rounded-3xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: item.bg_color }}
                    onClick={async () => {
                      await speakLetter(item.label);
                    }}
                  >
                    <span
                      className="text-8xl sm:text-[10rem] font-extrabold leading-none"
                      style={{ color: item.color }}
                    >
                      {item.label}
                    </span>
                  </div>
                  {/* Tap hint */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-card border border-border rounded-full px-3 py-1 shadow-md flex items-center gap-1">
                    <span className="text-xs">👆</span>
                    <span className="text-[10px] font-medium text-muted-foreground">Tap Me!</span>
                  </div>
                </div>
              </motion.div>

              {/* Word & info */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-center sm:text-left space-y-4"
              >
                <div className="flex items-center justify-center sm:justify-start gap-4">
                  <span className="text-7xl sm:text-8xl">{item.emoji}</span>
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                    {item.word}
                  </h1>
                  {item.pronunciation && (
                    <p className="text-lg text-muted-foreground mt-1 font-mono">
                      {item.pronunciation}
                    </p>
                  )}
                </div>
                <button
                  onClick={async () => {
                    await speakWord(item.word);
                    if (item.pronunciation) {
                      setTimeout(() => speakPhonetic(item.pronunciation!), 1500);
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-accent text-white hover:bg-accent/90 font-bold px-6 py-3 rounded-full shadow-[0_4px_14px_rgba(245,166,35,0.3)] transition-all"
                >
                  <Headphones className="h-5 w-5" weight="fill" />
                  Listen & Speak
                </button>
              </motion.div>
            </div>
          </div>

          {/* Let's Draw button */}
          <div className="px-6 sm:px-10 pb-6 sm:pb-10">
            <Link
              href={`/learn/alphabet/${letter}/draw`}
              className="flex items-center justify-center gap-3 w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-bold py-4 rounded-2xl shadow-[0_4px_16px_rgba(46,125,50,0.3)] hover:shadow-[0_6px_24px_rgba(46,125,50,0.4)] transition-all"
            >
              <Pencil className="h-5 w-5" weight="duotone" />
              Let&apos;s Draw &quot;{item.label}&quot;
              <ArrowRight className="h-5 w-5" weight="bold" />
            </Link>
          </div>

          {/* Progress steps */}
          <div className="border-t border-border px-6 sm:px-10 py-4">
            <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  {step.done ? (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" weight="bold" />
                    </div>
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-border" />
                  )}
                  <span
                    className={`text-sm ${
                      step.done ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom navigation */}
        <div className="flex items-center justify-between mt-6 gap-4">
          {prevItem ? (
            <Link
              href={`/learn/alphabet/${prevItem.slug}`}
              className="inline-flex items-center gap-2 bg-card border-2 border-border hover:border-primary/30 text-foreground font-semibold px-5 py-3 rounded-full transition-all hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4" weight="bold" />
              <span className="hidden sm:inline">{prevItem.label} — {prevItem.word}</span>
              <span className="sm:hidden">Prev</span>
            </Link>
          ) : (
            <div />
          )}
          {nextItem ? (
            <Link
              href={`/learn/alphabet/${nextItem.slug}`}
              className="inline-flex items-center gap-2 bg-card border-2 border-border hover:border-primary/30 text-foreground font-semibold px-5 py-3 rounded-full transition-all hover:shadow-md"
            >
              <span className="hidden sm:inline">{nextItem.label} — {nextItem.word}</span>
              <span className="sm:hidden">Next</span>
              <ArrowRight className="h-4 w-4" weight="bold" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
