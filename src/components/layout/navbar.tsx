"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { List, X, SignOut, User, CaretDown, GearSix, House } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/about", label: "About" },
  { href: "/my-progress", label: "My Progress" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [supabase] = useState(() => createClient());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name
          || user.user_metadata?.name
          || user.email?.split("@")[0]
          || "";
        setUserName(name);
        setUserEmail(user.email || "");
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
    checkUser();
  }, [supabase]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");
    router.push("/");
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[5rem] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image src="/images/DrawKao_Logo.png" alt="Draw Kao" width={160} height={50} className="h-14 w-auto" priority />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-[15px] font-medium px-4 py-2 rounded-full transition-colors ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                  {active && (
                    <svg className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2" viewBox="0 0 32 8" fill="none">
                      <path
                        d="M2 6C6 2 12 2 16 4C20 6 26 2 30 2"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="text-accent"
                        fill="none"
                      />
                    </svg>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground font-semibold px-4 py-2 rounded-full transition-colors text-sm cursor-pointer"
                >
                  <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{userInitial}</span>
                  </div>
                  <span className="max-w-[100px] truncate">{userName}</span>
                  <CaretDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
                        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        >
                          <House className="h-4 w-4" />
                          Home
                        </Link>
                        <Link
                          href="/parent/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        >
                          <GearSix className="h-4 w-4" />
                          Parent Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <SignOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/parent/auth"
                  className="text-[15px] font-semibold text-primary border-2 border-primary hover:bg-primary hover:text-primary-foreground px-5 py-2 rounded-full transition-all"
                >
                  For Parents
                </Link>
                <Link
                  href="/parent/auth"
                  className="inline-flex items-center bg-accent text-white hover:bg-accent/90 text-[15px] font-bold px-6 py-2.5 rounded-full shadow-[0_4px_14px_rgba(245,166,35,0.3)] hover:shadow-[0_6px_20px_rgba(245,166,35,0.4)] transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
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
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-border space-y-2 mt-2">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-white">{userInitial}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
                        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                      </div>
                    </div>
                    <Link
                      href="/parent/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 text-[15px] font-medium text-muted-foreground py-3 rounded-xl px-4 hover:bg-secondary"
                    >
                      <GearSix className="h-4 w-4" />
                      Parent Dashboard
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="w-full flex items-center gap-3 text-center text-[15px] text-red-500 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 px-4 cursor-pointer"
                    >
                      <SignOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/parent/auth"
                      onClick={() => setMobileOpen(false)}
                      className="block text-center text-[15px] font-semibold text-primary border-2 border-primary py-2.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      For Parents
                    </Link>
                    <Link
                      href="/parent/auth"
                      onClick={() => setMobileOpen(false)}
                      className="block text-center bg-accent text-white text-[15px] font-bold py-3 rounded-full shadow-md"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
