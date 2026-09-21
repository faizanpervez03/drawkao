"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Heart, PencilLine, Sparkle } from "@phosphor-icons/react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <Sparkle className="h-4 w-4" weight="fill" />
            Our Story
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
            About <span className="text-primary">Draw Kao</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We believe every child learns best when they&apos;re having fun. Draw Kao combines
            the joy of drawing with early education to help kids aged 4-8 learn letters, words,
            numbers, animals, and shapes — one stroke at a time.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary" weight="fill" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Our Mission</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Draw Kao was created with one simple goal: make early learning accessible, fun,
            and engaging for every child. We work with pediatric educators to design activities
            that are age-appropriate, interactive, and effective. Our drawing-based approach
            helps children develop fine motor skills while building vocabulary and cognitive abilities.
          </p>
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: PencilLine, title: "Learn by Doing", desc: "Children draw, trace, and color their way to understanding letters, numbers, and words." },
            { icon: Star, title: "Built for Kids", desc: "Designed with pediatric educators. Safe, ad-free, and age-appropriate content." },
            { icon: Heart, title: "Parent Friendly", desc: "Track your child's progress, manage screen time, and celebrate achievements together." },
          ].map((item, i) => (
            <motion.div key={item.title} custom={i + 2} initial="hidden" animate="visible" variants={fadeUp}
              className="bg-card border border-border rounded-2xl p-5 text-center">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <item.icon className="h-6 w-6 text-primary" weight="duotone" />
              </div>
              <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp} className="text-center">
          <p className="text-muted-foreground mb-4">Ready to start your child&apos;s learning journey?</p>
          <Link href="/learn" className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 py-3.5 rounded-full shadow-[0_4px_16px_rgba(46,125,50,0.3)] transition-all">
            Start Drawing
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
