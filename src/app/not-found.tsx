"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { House, ArrowRight } from "@phosphor-icons/react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="text-8xl font-extrabold text-primary/20 mb-4">404</div>
        <h1 className="text-2xl font-extrabold text-foreground mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          Oops! This page doesn&apos;t exist. Let&apos;s get you back to drawing and learning.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 py-3 rounded-full transition-all">
            <House className="h-4 w-4" weight="fill" />
            Go Home
          </Link>
          <Link href="/learn" className="inline-flex items-center justify-center gap-2 border-2 border-border text-muted-foreground hover:bg-secondary font-semibold px-6 py-3 rounded-full transition-all">
            Start Learning
            <ArrowRight className="h-4 w-4" weight="bold" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
