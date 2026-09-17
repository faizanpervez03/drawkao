"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "#about", label: "About" },
  { href: "/my-progress", label: "My Progress" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[5rem] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/images/DrawKao_Logo.png"
              alt="Draw Kao"
              width={280}
              height={80}
              className="h-18 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-[15px] font-medium px-4 py-2 rounded-full transition-colors group ${
                    active
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  <svg
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-3 transition-all duration-300 ${
                      active ? "w-[calc(100%-16px)]" : "w-0 group-hover:w-[calc(100%-16px)]"
                    }`}
                    viewBox="0 0 100 16"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 10C15 4 25 12 40 6C55 0 65 14 80 8C90 4 95 10 100 8"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className={active ? "text-primary" : "text-accent/70"}
                      fill="none"
                    />
                  </svg>
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/parent/auth"
              className="text-[15px] font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-full hover:bg-secondary transition-colors"
            >
              For Parents
            </Link>
            <ThemeToggle />
            <Link
              href="/parent/auth"
              className="inline-flex items-center bg-accent text-white hover:bg-accent/90 text-[15px] font-bold px-6 py-2.5 rounded-full shadow-[0_4px_14px_rgba(245,166,35,0.3)] hover:shadow-[0_6px_20px_rgba(245,166,35,0.4)] transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 text-foreground rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" weight="bold" /> : <List className="h-6 w-6" weight="bold" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-card border-t border-border overflow-hidden"
          >
            <div className="px-5 py-4 space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative block text-[15px] font-medium py-3 px-4 rounded-xl transition-colors group ${
                      active
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                    <svg
                      className={`absolute bottom-1 left-4 h-2.5 transition-all duration-300 ${
                        active ? "w-[calc(100%-32px)]" : "w-0 group-hover:w-[calc(100%-32px)]"
                      }`}
                      viewBox="0 0 100 16"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 10C15 4 25 12 40 6C55 0 65 14 80 8C90 4 95 10 100 8"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className={active ? "text-primary" : "text-accent/70"}
                        fill="none"
                      />
                    </svg>
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-border space-y-2 mt-2">
                <Link
                  href="/parent/auth"
                  className="block text-center text-[15px] text-muted-foreground py-3 rounded-full hover:bg-secondary transition-colors"
                >
                  For Parents
                </Link>
                <Link
                  href="/parent/auth"
                  className="block text-center bg-accent text-white text-[15px] font-bold py-3 rounded-full shadow-md"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
