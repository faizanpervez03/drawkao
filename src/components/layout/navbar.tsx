"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { List, X, SignOut, User } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "#about", label: "About" },
  { href: "/my-progress", label: "My Progress" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name
          || user.user_metadata?.name
          || user.email?.split("@")[0]
          || "";
        setUserName(name);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
    checkUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserName("");
    router.push("/");
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

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
              <div className="flex items-center gap-2">
                <Link
                  href="/parent/dashboard"
                  className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-semibold px-4 py-2 rounded-full transition-colors text-sm"
                >
                  <div className="h-7 w-7 rounded-full bg-green-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{userName.charAt(0).toUpperCase()}</span>
                  </div>
                  {userName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  title="Sign out"
                >
                  <SignOut className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/parent/auth"
                  className="text-[15px] font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-full hover:bg-secondary transition-colors"
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
                    <Link
                      href="/parent/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-center text-[15px] font-medium text-green-700 py-3 rounded-full bg-green-50 px-4"
                    >
                      <div className="h-7 w-7 rounded-full bg-green-600 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{userName.charAt(0).toUpperCase()}</span>
                      </div>
                      {userName}
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 text-center text-[15px] text-gray-500 py-3 rounded-full hover:bg-secondary"
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
                      className="block text-center text-[15px] text-muted-foreground py-3 rounded-full hover:bg-secondary transition-colors"
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
