"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  House,
  BookOpen,
  PencilLine,
  SquaresFour,
  Image as ImageIcon,
  Users,
  ChartLineUp,
  Gear,
  List,
  X,
  ArrowLeft,
  Bell,
  MagnifyingGlass,
  User,
  SignOut,
  ListChecks,
} from "@phosphor-icons/react";
import { ThemeToggle } from "@/components/theme-toggle";

const navSections = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: House },
    ],
  },
  {
    title: "CONTENT",
    items: [
      { label: "Lessons", href: "/admin/lessons", icon: BookOpen },
      { label: "Drawing Steps", href: "/admin/drawing-steps", icon: PencilLine },
      { label: "Categories", href: "/admin/categories", icon: SquaresFour },
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    title: "USERS & PROGRESS",
    items: [
      { label: "Parents", href: "/admin/parents", icon: Users },
      { label: "Learning Progress", href: "/admin/progress", icon: ChartLineUp },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Gear },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border shrink-0">
        <div className="p-5 border-b border-border">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/DrawKao_Logo.png"
              alt="Draw Kao"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
            <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navSections.map((section) => (
            <div key={section.title} className="mb-6">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">{section.title}</p>
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" weight={isActive ? "fill" : "regular"} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary transition-all"
          >
            <span className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              <ListChecks className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Child App Preview</p>
            </div>
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </Link>
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
            <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">E</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">Admin</p>
              <p className="text-xs text-muted-foreground truncate">Platform Manager</p>
            </div>
            <SignOut className="h-4 w-4 text-muted-foreground shrink-0" />
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-card z-50 lg:hidden flex flex-col"
            >
              <div className="p-5 border-b border-border flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                  <Image
                    src="/images/DrawKao_Logo.png"
                    alt="Draw Kao"
                    width={120}
                    height={40}
                    className="h-10 w-auto"
                  />
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="h-8 w-8 rounded-lg hover:bg-secondary flex items-center justify-center">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4 px-3">
                {navSections.map((section) => (
                  <div key={section.title} className="mb-6">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">{section.title}</p>
                    {section.items.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          <item.icon className="h-5 w-5" weight={isActive ? "fill" : "regular"} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header */}
        <header className="h-16 bg-card border-b border-border flex items-center px-4 sm:px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden h-10 w-10 rounded-xl hover:bg-secondary flex items-center justify-center mr-3"
          >
            <List className="h-5 w-5 text-muted-foreground" />
          </button>

          <div className="flex-1 flex items-center gap-3 max-w-xl">
            <div className="flex-1 relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search lessons, prompts, parent accounts..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-secondary text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground bg-secondary border border-border px-1.5 py-0.5 rounded">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <ThemeToggle />
            <Link
              href="/"
              className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold px-4 py-2 rounded-full transition-colors"
            >
              Launch Learner Canvas
            </Link>
            <button className="relative h-10 w-10 rounded-xl hover:bg-secondary flex items-center justify-center">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
            </button>
            <button className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <User className="h-5 w-5 text-white" weight="fill" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
