"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Headphones,
  Trash,
  ArrowUUpLeft,
  Check,
  Eye,
  Pencil,
  PaintBrush,
  Star,
} from "@phosphor-icons/react";
import type { Item } from "@/types/database";
import { fetchItem, fetchItemsByCategory } from "@/lib/data-client";
import { speak, speakWord } from "@/lib/audio";
import { useProgress } from "@/lib/progress/ProgressProvider";

const colors = ["#e57373", "#2e7d32", "#f5a623", "#5c9ce6", "#2d2d2d", "#9575cd", "#ffb74d"];

const brushSizes = [4, 9, 16];

const pencilCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Cpath d='M2 22l1-4L16 5l3 3L6 21l-4 1z' fill='%23ffd54f' stroke='%235d4037' stroke-width='1.5' stroke-linejoin='round'/%3E%3Cpath d='M2 22l4-1-3-3z' fill='%235d4037'/%3E%3C/svg%3E") 2 22, crosshair`;

const steps = [
  { id: 1, label: "See & Hear", icon: Eye, description: "Look at the letter and hear the word" },
  { id: 2, label: "Draw", icon: Pencil, description: "Trace or draw the letter" },
  { id: 3, label: "Color", icon: PaintBrush, description: "Color your drawing" },
];

export default function DrawPage() {
  const params = useParams();
  const letter = (params.letter as string).toLowerCase();
  const { completeLesson } = useProgress();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#e57373");
  const [brushSize, setBrushSize] = useState(9);
  const [currentStep, setCurrentStep] = useState(1);
  const [strokes, setStrokes] = useState<ImageData[]>([]);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [nextLetter, setNextLetter] = useState<string | null>(null);

  useEffect(() => {
    fetchItem("alphabet", letter).then((data) => {
      setItem(data);
      setLoading(false);
    });
    // Find next letter
    fetchItemsByCategory("alphabet").then((items) => {
      const idx = items.findIndex((i) => i.slug === letter);
      if (idx < items.length - 1) {
        setNextLetter(items[idx + 1].slug);
      } else {
        setNextLetter(null);
      }
    });
  }, [letter]);

  useEffect(() => {
    if (currentStep === 1 && item) {
      // Auto-speak when entering See & Hear step
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
          <h1 className="text-2xl font-bold text-foreground">Letter not found</h1>
          <Link href="/learn/alphabet" className="text-primary font-semibold hover:underline">
            Back to Alphabet
          </Link>
        </div>
      </div>
    );
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (currentStep < 2) return; // Can't draw on See & Hear step
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
    ctx.lineWidth = currentStep === 3 ? brushSize + 6 : brushSize;
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
        speak("Now trace the letter. Follow the dots!");
      } else if (currentStep + 1 === 3) {
        speak("Time to color! Pick your favorite colors!");
      }
    } else {
      // Save progress using ProgressContext
      await completeLesson(item.id, "alphabet", 3, 100);
      setCompleted(true);
      setShowReward(true);
      speak("Amazing! You completed the lesson!");
    }
  };

  const handleListenAgain = () => {
    speakWord(item.word);
  };

  return (
    <div className="h-[calc(100dvh-64px)] bg-background overflow-hidden">
      <div className="mx-auto max-w-5xl px-3 sm:px-6 py-2 sm:py-3 h-full flex flex-col">
        {/* Top row: Back + Steps + Listen — all in one line */}
        <div className="flex items-center justify-between gap-3 mb-2 shrink-0">
          <Link
            href={`/learn/alphabet/${letter}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" weight="bold" />
            <span className="hidden sm:inline">Back to {item.word}</span>
          </Link>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 min-w-0">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isDone = currentStep > step.id;
              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full transition-all ${
                      isActive
                        ? "bg-primary text-white shadow-md"
                        : isDone
                        ? "bg-primary/20 text-primary"
                        : "bg-border text-muted-foreground"
                    }`}
                  >
                    {isDone ? (
                      <Check className="h-3.5 w-3.5" weight="bold" />
                    ) : (
                      <Icon className="h-3.5 w-3.5" weight={isActive ? "fill" : "bold"} />
                    )}
                    <span className="text-xs font-semibold hidden sm:inline">{step.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-4 sm:w-8 h-0.5 mx-1 ${isDone ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleListenAgain}
            className="inline-flex items-center gap-1.5 bg-accent text-white hover:bg-accent/90 font-bold px-3.5 py-1.5 rounded-full shadow-md transition-all text-sm shrink-0"
          >
            <Headphones className="h-4 w-4" weight="fill" />
            Listen
          </button>
        </div>

        {/* Step description */}
        <div className="text-center mb-2 shrink-0">
          <p className="text-xs sm:text-sm text-muted-foreground">{steps[currentStep - 1]?.description}</p>
        </div>

        {/* Main content area */}
        <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {currentStep === 1 ? (
            /* STEP 1: See & Hear */
            <motion.div
              key="see-hear"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border-2 border-border rounded-3xl overflow-hidden h-full"
            >
              <div className="p-4 sm:p-6 h-full flex flex-col items-center justify-center">
                {/* Big emoji */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-[5rem] sm:text-[7rem] mb-3 cursor-pointer hover:scale-110 transition-transform"
                  onClick={handleListenAgain}
                >
                  {item.emoji}
                </motion.div>

                {/* Word */}
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl sm:text-4xl font-extrabold text-foreground mb-1"
                >
                  {item.word}
                </motion.h1>

                {/* Pronunciation */}
                {item.pronunciation && (
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-base text-muted-foreground font-mono mb-4"
                  >
                    {item.pronunciation}
                  </motion.p>
                )}

                {/* Listen button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={handleListenAgain}
                  className="inline-flex items-center gap-2 bg-accent text-white hover:bg-accent/90 font-bold px-6 py-3 rounded-full shadow-[0_4px_14px_rgba(245,166,35,0.3)] transition-all"
                >
                  <Headphones className="h-5 w-5" weight="fill" />
                  Tap to Hear Again
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* STEP 2, 3, 4: Trace, Draw, Color */
            <motion.div
              key="draw"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border-2 border-border rounded-3xl overflow-hidden h-full"
            >
              <div className="relative h-full bg-background m-3 sm:m-4 rounded-2xl overflow-hidden">
                {/* Guide hint */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                  <span className="text-sm">
                    {currentStep === 2 ? "✏️" : "🎨"}
                  </span>
                  {currentStep === 2 && "Trace the letter"}
                  {currentStep === 3 && "Color your drawing"}
                </div>

                {/* Brush size picker */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-card/90 border border-border rounded-full px-2 py-1.5 shadow-sm">
                  {brushSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setBrushSize(s)}
                      title={`Size ${s === 4 ? "Small" : s === 9 ? "Medium" : "Large"}`}
                      className={`flex items-center justify-center h-7 w-7 rounded-full transition-all ${
                        brushSize === s ? "bg-primary/15 ring-2 ring-primary" : "hover:bg-border"
                      }`}
                    >
                      <span className="rounded-full bg-foreground block" style={{ width: s, height: s }} />
                    </button>
                  ))}
                </div>

                {/* Guide overlay - handwriting lines + dotted letter for tracing */}
                {currentStep === 2 && (
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 400 300"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Guide lines like writing paper */}
                    <line x1="70" y1="115" x2="330" y2="115" stroke="#bcd4f0" strokeWidth="2" />
                    <line x1="70" y1="145" x2="330" y2="145" stroke="#bcd4f0" strokeWidth="1.5" strokeDasharray="8 8" />
                    <line x1="70" y1="220" x2="330" y2="220" stroke="#bcd4f0" strokeWidth="2" />
                    {/* Dotted uppercase + lowercase pair */}
                    <text
                      x="200"
                      y="220"
                      textAnchor="middle"
                      fontSize="150"
                      fontFamily="Poppins, sans-serif"
                      fontWeight="400"
                      fill="none"
                      stroke="#b8b8b8"
                      strokeWidth="2.5"
                      strokeDasharray="7 7"
                      strokeLinecap="round"
                    >
                      {`${item.label.toUpperCase()}${item.label.toLowerCase()}`}
                    </text>
                  </svg>
                )}

                {/* Guide overlay - faint letter for reference during coloring */}
                {currentStep === 3 && (
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none opacity-15"
                    viewBox="0 0 400 300"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <text
                      x="200"
                      y="220"
                      textAnchor="middle"
                      fontSize="150"
                      fontFamily="Poppins, sans-serif"
                      fontWeight="400"
                      fill="#999"
                    >
                      {`${item.label.toUpperCase()}${item.label.toLowerCase()}`}
                    </text>
                  </svg>
                )}

                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="absolute inset-0 w-full h-full touch-none"
                  style={{ cursor: pencilCursor }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        {/* Color palette - only show on Color step */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 py-2 shrink-0"
          >
            <span className="text-sm font-medium text-muted-foreground mr-2">Colors</span>
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`h-8 w-8 rounded-full transition-all ${
                  selectedColor === color
                    ? "ring-4 ring-offset-2 ring-offset-background scale-110"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </motion.div>
        )}

        {/* Bottom row: nav + actions combined */}
        {!completed && (
          <div className="flex items-center justify-between gap-2 py-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Link
                href={`/learn/alphabet/${letter}`}
                className="inline-flex items-center gap-1.5 bg-card border-2 border-border hover:border-primary/30 text-foreground font-semibold px-3.5 py-2 rounded-full transition-all text-sm"
              >
                <ArrowLeft className="h-4 w-4" weight="bold" />
                <span className="hidden sm:inline">Back to Letter</span>
                <span className="sm:hidden">Back</span>
              </Link>
              {currentStep >= 2 && (
                <>
                  <button
                    onClick={undo}
                    className="inline-flex items-center gap-1.5 bg-card border-2 border-border hover:border-primary/30 text-foreground font-semibold px-3.5 py-2 rounded-full transition-all text-sm"
                  >
                    <ArrowUUpLeft className="h-4 w-4" weight="bold" />
                    <span className="hidden sm:inline">Undo</span>
                  </button>
                  <button
                    onClick={clearCanvas}
                    className="inline-flex items-center gap-1.5 bg-card border-2 border-border hover:border-primary/30 text-foreground font-semibold px-3.5 py-2 rounded-full transition-all text-sm"
                  >
                    <Trash className="h-4 w-4" weight="bold" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/learn/alphabet"
                className="inline-flex items-center gap-1.5 bg-card border-2 border-border hover:border-primary/30 text-foreground font-semibold px-3.5 py-2 rounded-full transition-all text-sm"
              >
                <span className="hidden sm:inline">All Letters</span>
                <span className="sm:hidden">All</span>
                <ArrowRight className="h-4 w-4" weight="bold" />
              </Link>
              <button
                onClick={handleNextStep}
                disabled={!hasDrawn && (currentStep === 2 || currentStep === 3)}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-5 py-2 rounded-full shadow-[0_4px_14px_rgba(46,125,50,0.3)] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
              >
                {currentStep < 4 ? "Next Step" : "Finish"}
                <ArrowRight className="h-4 w-4" weight="bold" />
              </button>
            </div>
          </div>
        )}

        {/* Reward overlay */}
        <AnimatePresence>
          {showReward && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                className="bg-card rounded-3xl p-8 sm:p-12 max-w-md w-full text-center shadow-2xl"
              >
                {/* Stars animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex justify-center gap-2 mb-6"
                >
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3 + i * 0.15, type: "spring" }}
                    >
                      <Star className="h-12 w-12 text-accent" weight="fill" />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <h2 className="text-3xl font-extrabold text-foreground mb-2">
                    Amazing Job! 🎉
                  </h2>
                  <p className="text-lg text-muted-foreground mb-2">
                    You completed &quot;{item.word}&quot; {item.emoji}
                  </p>
                  <p className="text-sm text-primary font-semibold mb-8">
                    +3 Stars Earned!
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      href="/my-progress"
                      onClick={() => setShowReward(false)}
                      className="inline-flex items-center gap-2 bg-accent text-white hover:bg-accent/90 font-semibold px-6 py-3 rounded-full transition-all"
                    >
                      My Progress
                    </Link>
                    <button
                      onClick={() => {
                        setShowReward(false);
                        setCompleted(false);
                        setCurrentStep(1);
                        clearCanvas();
                      }}
                      className="inline-flex items-center gap-2 bg-card border-2 border-border hover:border-primary/30 text-foreground font-semibold px-6 py-3 rounded-full transition-all"
                    >
                      Draw Again
                    </button>
                    {nextLetter ? (
                      <Link
                        href={`/learn/alphabet/${nextLetter}/draw`}
                        onClick={() => setShowReward(false)}
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 py-3 rounded-full shadow-[0_4px_14px_rgba(46,125,50,0.3)] transition-all"
                      >
                        Next Letter
                        <ArrowRight className="h-4 w-4" weight="bold" />
                      </Link>
                    ) : (
                      <Link
                        href="/learn/alphabet"
                        onClick={() => setShowReward(false)}
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 py-3 rounded-full shadow-[0_4px_14px_rgba(46,125,50,0.3)] transition-all"
                      >
                        All Letters
                        <ArrowRight className="h-4 w-4" weight="bold" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
