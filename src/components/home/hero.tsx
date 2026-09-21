"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkle } from "@phosphor-icons/react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const floatBadge = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pb-4 sm:pb-6 lg:pb-8" id="learn">
      {/* Soft background blobs */}
      <div className="absolute top-0 left-[8%] h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute bottom-0 right-[5%] h-64 w-64 rounded-full bg-accent/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 lg:pt-14 pb-4 sm:pb-6 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">
          {/* Text side */}
          <div className="space-y-6 text-center lg:text-left">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full"
            >
              <Sparkle className="h-4 w-4" weight="fill" />
              Little Strokes, Big Learning!
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.08] tracking-tight text-foreground"
            >
              <span className="text-primary">Learn Through</span>{" "}
              <span className="relative inline-block">
                <span className="text-accent">Drawing</span>
                <svg
                    className="absolute -bottom-1.5 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                  >
                    <path
                      d="M2 8C50 2 150 2 198 8"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="text-primary/35"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed"
            >
              Draw Kao helps children learn letters, words, fruits, animals,
              shapes and more — one drawing at a time.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3 pt-1 justify-center lg:justify-start"
            >
              <Link
                href="/learn"
                className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 text-base font-bold px-8 py-3.5 rounded-full shadow-[0_4px_16px_rgba(46,125,50,0.3)] hover:shadow-[0_6px_24px_rgba(46,125,50,0.4)] transition-all gap-2"
              >
                Start Drawing
                <ArrowRight className="h-4 w-4" weight="bold" />
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center border-2 border-border text-muted-foreground hover:bg-secondary hover:border-border text-base font-semibold px-8 py-3.5 rounded-full gap-2 transition-all"
              >
                <Play className="h-4 w-4" weight="fill" />
                Watch Video
              </Link>
            </motion.div>

            <motion.p
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-xs text-muted-foreground flex items-center gap-1.5 justify-center lg:justify-start"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Designed with pediatric learning educators
            </motion.p>
          </div>

          {/* Illustration side - Interactive */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-2xl">
              {/* Character */}
              <Image
                src="/images/kid_hero_img.png"
                alt="Child drawing and learning with Draw Kao"
                width={600}
                height={500}
                className="w-full h-auto"
                priority
              />

              {/* Floating Apple */}
              <motion.div
                custom={0.8}
                initial="hidden"
                animate="visible"
                variants={floatBadge}
                className="absolute -left-6 top-[18%] z-10"
              >
                <motion.div
                  animate={{
                    y: [0, -12, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-card rounded-2xl p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-border overflow-hidden"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden">
                    <Image
                      src="/images/apple.webp"
                      alt="Apple"
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating Cat */}
              <motion.div
                custom={1}
                initial="hidden"
                animate="visible"
                variants={floatBadge}
                className="absolute -right-4 top-[8%] z-10"
              >
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    x: [0, 3, -3, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-card rounded-2xl p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-border overflow-hidden"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden">
                    <Image
                      src="/images/cat.jpg"
                      alt="Cat"
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating Story Time */}
              <motion.div
                custom={1.2}
                initial="hidden"
                animate="visible"
                variants={floatBadge}
                className="absolute -right-2 bottom-[20%] z-10"
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-gradient-to-r from-accent to-accent/80 text-white rounded-2xl px-4 py-3 shadow-[0_8px_30px_rgba(245,166,35,0.4)] flex items-center gap-3 overflow-hidden"
                >
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src="/images/book.jpg"
                      alt="Book"
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Story Time</span>
                    <span className="text-[10px] opacity-80">Listen & Learn</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating Badge: Draw Learn Grow */}
              <motion.div
                custom={1.4}
                initial="hidden"
                animate="visible"
                variants={floatBadge}
                className="absolute -left-2 top-[3%] z-10"
              >
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-card rounded-2xl px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex items-center gap-2 border border-border overflow-hidden"
                >
                  <div className="relative w-6 h-6 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src="/images/pencil.jpg"
                      alt="Pencil"
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold text-primary">Draw</span>
                  <span className="text-accent text-xs">•</span>
                  <span className="text-xs font-bold text-accent">Learn</span>
                  <span className="text-primary text-xs">•</span>
                  <span className="text-xs font-bold text-primary">Grow</span>
                </motion.div>
              </motion.div>

              {/* Floating Star */}
              <motion.div
                custom={1.6}
                initial="hidden"
                animate="visible"
                variants={floatBadge}
                className="absolute right-[15%] -top-2 z-10"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative w-10 h-10 rounded-full overflow-hidden shadow-[0_4px_20px_rgba(245,166,35,0.4)]"
                >
                  <Image
                    src="/images/star.jpg"
                    alt="Star"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
