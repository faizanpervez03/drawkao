"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  SpeakerHigh,
  Trash,
  ArrowUUpLeft,
  Check,
  Star,
  Palette,
  Pencil,
  Eye,
  PaintBrush,
} from "@phosphor-icons/react";
import type { Item } from "@/types/database";
import { fetchItem, fetchItemsByCategory } from "@/lib/data-client";
import { speak, speakWord } from "@/lib/audio";
import { useProgress } from "@/lib/progress/ProgressProvider";

const colors = [
  { name: "Red", hex: "#e57373" },
  { name: "Green", hex: "#2e7d32" },
  { name: "Yellow", hex: "#f5a623" },
  { name: "Blue", hex: "#5c9ce6" },
  { name: "Orange", hex: "#ff9800" },
  { name: "Purple", hex: "#9575cd" },
  { name: "Pink", hex: "#f48fb1" },
  { name: "Brown", hex: "#795548" },
];

const steps = [
  { id: 1, label: "See & Hear", icon: Eye, description: "Look at the item and hear the word" },
  { id: 2, label: "Draw", icon: Pencil, description: "Trace or draw the item" },
  { id: 3, label: "Color", icon: PaintBrush, description: "Color your drawing" },
];

export default function FruitDrawPage() {
  const params = useParams();
  const category = params.category as string;
  const slug = params.slug as string;
  const { completeLesson } = useProgress();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#e57373");
  const [currentStep, setCurrentStep] = useState(1);
  const [strokes, setStrokes] = useState<ImageData[]>([]);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [nextItem, setNextItem] = useState<Item | null>(null);

  useEffect(() => {
    fetchItem(category, slug).then((data) => {
      setItem(data);
      setLoading(false);
    });
    fetchItemsByCategory(category).then((items) => {
      const idx = items.findIndex((i) => i.slug === slug);
      if (idx < items.length - 1) {
        setNextItem(items[idx + 1]);
      }
    });
  }, [category, slug]);

  useEffect(() => {
    if (currentStep === 1 && item) {
      const timer = setTimeout(() => {
        speakWord(item.word);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, item]);

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
            Back to {category}
          </Link>
        </div>
      </div>
    );
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (currentStep < 2) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let x: number, y: number;
    if ("touches" in e) {
      x = (e.touches[0].clientX - rect.left) * scaleX;
      y = (e.touches[0].clientY - rect.top) * scaleY;
    } else {
      x = (e.clientX - rect.left) * scaleX;
      y = (e.clientY - rect.top) * scaleY;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = currentStep === 3 ? selectedColor : "#333";
    ctx.lineWidth = currentStep === 3 ? 12 : 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let x: number, y: number;
    if ("touches" in e) {
      e.preventDefault();
      x = (e.touches[0].clientX - rect.left) * scaleX;
      y = (e.touches[0].clientY - rect.top) * scaleY;
    } else {
      x = (e.clientX - rect.left) * scaleX;
      y = (e.clientY - rect.top) * scaleY;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.closePath();
    setIsDrawing(false);
    setHasDrawn(true);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokes((prev) => [...prev, imageData]);
  };

  const undo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (strokes.length > 0) {
      const newStrokes = strokes.slice(0, -1);
      setStrokes(newStrokes);
      if (newStrokes.length > 0) {
        ctx.putImageData(newStrokes[newStrokes.length - 1], 0, 0);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
    setHasDrawn(false);
  };

  const handleNextStep = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      if (currentStep + 1 === 2) {
        speakWord(item.word);
      } else if (currentStep + 1 === 3) {
        speakWord(item.word);
      }
    } else {
      await completeLesson(item.id, category, 3, 100);
      setCompleted(true);
      setShowReward(true);
      speak("Amazing work! You did it!");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/learn/${category}/${slug}`}
              className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {steps[currentStep - 1].label}: {item.word} {item.emoji}
              </h1>
              <p className="text-sm text-gray-500">{steps[currentStep - 1].description}</p>
            </div>
          </div>
          <button
            onClick={() => speakWord(item.word)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm"
          >
            <SpeakerHigh className="h-5 w-5" weight="fill" />
            Listen
          </button>
        </div>
      </div>

      {/* Step Progress */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                currentStep === step.id
                  ? "bg-green-500 text-white font-bold"
                  : currentStep > step.id
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-400"
              }`}>
                {currentStep > step.id ? (
                  <Check className="h-4 w-4" weight="bold" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
                <span className="text-sm">{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${
                  currentStep > step.id ? "bg-green-400" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {/* Step 1: See & Hear */}
          {currentStep === 1 && (
            <motion.div
              key="see-hear"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm text-center"
            >
              <div
                className="rounded-2xl py-16 mb-6 flex items-center justify-center"
                style={{ backgroundColor: item.bg_color || "#f5f5f5" }}
              >
                <motion.span
                  className="text-[160px]"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {item.emoji}
                </motion.span>
              </div>
              <h2 className="text-4xl font-extrabold text-gray-800 mb-2">{item.word}</h2>
              {item.pronunciation && (
                <p className="text-lg text-gray-500 mb-4">{item.pronunciation}</p>
              )}
              <button
                onClick={() => speakWord(item.word)}
                className="inline-flex items-center gap-2 bg-green-100 text-green-700 font-bold px-6 py-3 rounded-full hover:bg-green-200 transition-colors"
              >
                <SpeakerHigh className="h-5 w-5" weight="fill" />
                Hear Again
              </button>
            </motion.div>
          )}

          {/* Step 2 & 3: Draw / Color */}
          {(currentStep === 2 || currentStep === 3) && (
            <motion.div
              key="draw-color"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Canvas */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm mb-4">
                <div className="relative bg-white rounded-lg overflow-hidden border border-gray-100">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={450}
                    className="w-full h-auto cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                  {/* Reference image */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
                    <span className="text-[180px]">{item.emoji}</span>
                  </div>
                </div>
              </div>

              {/* Color Palette (only in step 3) */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-200 px-5 py-4 shadow-sm mb-4"
                >
                  <div className="flex items-center gap-3">
                    <Palette className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">Pick Your Colors</span>
                    <div className="flex-1" />
                    <div className="flex items-center gap-2">
                      {colors.map((color) => (
                        <button
                          key={color.hex}
                          onClick={() => setSelectedColor(color.hex)}
                          className={`h-8 w-8 rounded-full transition-all ${
                            selectedColor === color.hex
                              ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                              : "hover:scale-105"
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={undo}
                    disabled={strokes.length === 0}
                    className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    <ArrowUUpLeft className="h-4 w-4" />
                    Undo
                  </button>
                  <button
                    onClick={clearCanvas}
                    disabled={strokes.length === 0}
                    className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    <Trash className="h-4 w-4" />
                    Clear
                  </button>
                </div>
                <button
                  onClick={handleNextStep}
                  disabled={!hasDrawn}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-full transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {currentStep === 3 ? (
                    <>
                      <Check className="h-5 w-5" weight="bold" />
                      I&apos;m Done!
                    </>
                  ) : (
                    <>
                      Next Step
                      <ArrowRight className="h-5 w-5" weight="bold" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reward Modal */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl"
            >
              <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Great Job!</h2>
              <p className="text-gray-500 mb-6">You did amazing work on {item.word}!</p>

              {/* Stars */}
              <div className="flex items-center justify-center gap-3 mb-6">
                {[1, 2, 3].map((star) => (
                  <motion.div
                    key={star}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + star * 0.15, type: "spring" }}
                  >
                    <Star className="h-12 w-12 text-amber-400" weight="fill" />
                  </motion.div>
                ))}
              </div>

              {/* Completed Image */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
                <div className="text-8xl mb-3">{item.emoji}</div>
                <h3 className="font-bold text-gray-800 text-lg">My {item.word}</h3>
                <p className="text-sm text-gray-500">Beautiful work!</p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {nextItem && (
                  <Link
                    href={`/learn/${category}/${nextItem.slug}/draw`}
                    className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-full transition-colors"
                  >
                    Next: {nextItem.word}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                )}
                <div className="flex gap-3">
                  <Link
                    href="/my-progress"
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-700 font-semibold py-3 rounded-full transition-colors"
                  >
                    My Progress
                  </Link>
                  <Link
                    href={`/learn/${category}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-full transition-colors"
                  >
                    Back to {category}
                  </Link>
                </div>
                <button
                  onClick={() => {
                    setShowReward(false);
                    setCompleted(false);
                    setCurrentStep(1);
                    clearCanvas();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-full transition-colors"
                >
                  Draw Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
