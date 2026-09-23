"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Heart, PencilLine, Sparkle, Users, Shield, Rocket, BookOpen, Clock, Trophy } from "@phosphor-icons/react";

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
          <p className="text-muted-foreground leading-relaxed mb-4">
            Draw Kao was created with one simple goal: make early learning accessible, fun,
            and engaging for every child. We work with pediatric educators to design activities
            that are age-appropriate, interactive, and effective. Our drawing-based approach
            helps children develop fine motor skills while building vocabulary and cognitive abilities.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We believe that creativity is the foundation of learning. When a child picks up a
            pencil and draws an apple, they&apos;re not just making art — they&apos;re learning the
            letter A, the word &quot;apple,&quot; the color red, and the shape of a circle. Every
            stroke is a step forward in their educational journey.
          </p>
        </motion.div>

        {/* Story / How it started */}
        <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Rocket className="h-5 w-5 text-accent" weight="fill" />
            </div>
            <h2 className="text-xl font-bold text-foreground">How It Started</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Draw Kao began when a group of parents and educators noticed that children learn
            faster when they use their hands. Traditional flashcards and videos only go so far —
            but when a child draws, traces, and colors, the lesson sticks. We built Draw Kao to
            bring that hands-on learning experience to every home, making it easy for parents to
            support their child&apos;s education without needing to be teachers themselves.
          </p>
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: PencilLine, title: "Learn by Doing", desc: "Children draw, trace, and color their way to understanding letters, numbers, and words." },
            { icon: Star, title: "Built for Kids", desc: "Designed with pediatric educators. Safe, ad-free, and age-appropriate content." },
            { icon: Heart, title: "Parent Friendly", desc: "Track your child's progress, manage screen time, and celebrate achievements together." },
          ].map((item, i) => (
            <motion.div key={item.title} custom={i + 3} initial="hidden" animate="visible" variants={fadeUp}
              className="bg-card border border-border rounded-2xl p-5 text-center">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <item.icon className="h-6 w-6 text-primary" weight="duotone" />
              </div>
              <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp} className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: Users, value: "10,000+", label: "Happy Families" },
              { icon: BookOpen, value: "100+", label: "Drawing Lessons" },
              { icon: Clock, value: "500K+", label: "Drawings Created" },
              { icon: Trophy, value: "4.9★", label: "Parent Rating" },
            ].map((stat, i) => (
              <div key={stat.label}>
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" weight="duotone" />
                <p className="text-2xl font-extrabold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Why Draw Kao */}
        <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp} className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" weight="fill" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Why Parents Trust Draw Kao</h2>
          </div>
          <ul className="space-y-3">
            {[
              "No ads, no distractions — pure learning environment",
              "Screen time controls and eye rest reminders",
              "Progress tracking with real-time updates",
              "Works on tablets, phones, and computers",
              "Content reviewed by early childhood educators",
              "Free to start with no credit card required",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-muted-foreground">
                <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Star className="h-3 w-3 text-primary" weight="fill" />
                </span>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA */}
        <motion.div custom={8} initial="hidden" animate="visible" variants={fadeUp} className="text-center">
          <p className="text-muted-foreground mb-4">Ready to start your child&apos;s learning journey?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/learn" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 py-3.5 rounded-full shadow-[0_4px_16px_rgba(46,125,50,0.3)] transition-all">
              Start Drawing
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 border-2 border-border text-muted-foreground hover:bg-secondary font-semibold px-8 py-3.5 rounded-full transition-all">
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
