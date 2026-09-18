"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  House,
  PencilLine,
  Monitor,
  Palette,
  Printer,
  CreditCard,
  Lock,
  Plus,
  CaretDown,
  CaretRight,
  CaretLeft,
  List,
  X,
  SpeakerHigh,
  SignOut,
  Star,
  Trophy,
  Flame,
  Books,
  CheckCircle,
  ArrowRight,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navItems = [
  { label: "Overview", icon: House },
  { label: "Child Work", icon: PencilLine },
  { label: "Screen Time", icon: Monitor },
  { label: "Gallery", icon: Palette },
  { label: "Worksheets", icon: Printer },
  { label: "Billing", icon: CreditCard },
  { label: "Security", icon: Lock },
];

interface DashboardStats {
  lessonsDone: number;
  starsEarned: number;
  streak: number;
  totalItems: number;
}

interface RecentActivity {
  id: string;
  label: string;
  emoji: string;
  category: string;
  stars: number;
  completed_at: string;
}

export default function ParentDashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState("Parent");
  const [userEmail, setUserEmail] = useState("");
  const [childName, setChildName] = useState("My Child");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({ lessonsDone: 0, starsEarned: 0, streak: 0, totalItems: 0 });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [recommendedLessons, setRecommendedLessons] = useState<{ label: string; emoji: string; slug: string; categoryId: string; status: "ready" | "in_progress" | "done" }[]>([]);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    async function fetchDashboard() {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push("/parent/auth"); return; }

      setUser(u);
      const name = u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0] || "Parent";
      setUserName(name);
      setUserEmail(u.email || "");

      const { data: profiles } = await supabase
        .from("child_profiles")
        .select("display_name")
        .eq("parent_id", u.id)
        .limit(1)
        .maybeSingle();

      if (profiles?.display_name) {
        setChildName(profiles.display_name);
      }

      const { data: progress } = await supabase
        .from("user_progress")
        .select("id, item_id, stars, completed, completed_at")
        .eq("user_id", u.id);

      const { count: totalItems } = await supabase
        .from("items")
        .select("id", { count: "exact", head: true });

      const completedLessons = progress?.filter((p) => p.completed) || [];
      const totalStars = completedLessons.reduce((sum, p) => sum + (p.stars || 0), 0);

      const sortedDates = completedLessons
        .filter((p) => p.completed_at)
        .map((p) => new Date(p.completed_at!).toDateString())
        .filter((d, i, arr) => arr.indexOf(d) === i)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      let streak = 0;
      const today = new Date();
      for (let i = 0; i < sortedDates.length; i++) {
        const expected = new Date(today);
        expected.setDate(expected.getDate() - i);
        if (sortedDates[i] === expected.toDateString()) {
          streak++;
        } else {
          break;
        }
      }

      setStats({
        lessonsDone: completedLessons.length,
        starsEarned: totalStars,
        streak,
        totalItems: totalItems || 0,
      });

      const { data: items } = await supabase
        .from("items")
        .select("id, slug, label, emoji, category_id, sort_order")
        .order("sort_order", { ascending: true });

      const { data: categories } = await supabase
        .from("categories")
        .select("id, name");

      const catMap: Record<string, string> = {};
      categories?.forEach((c) => { catMap[c.id] = c.name; });

      const progressMap: Record<string, { completed: boolean; stars: number }> = {};
      progress?.forEach((p) => { progressMap[p.item_id] = { completed: p.completed, stars: p.stars }; });

      const recent: RecentActivity[] = completedLessons
        .sort((a, b) => new Date(b.completed_at || 0).getTime() - new Date(a.completed_at || 0).getTime())
        .slice(0, 5)
        .map((p) => {
          const item = items?.find((i) => i.id === p.item_id);
          return {
            id: p.id,
            label: item?.label || "Unknown",
            emoji: item?.emoji || "📝",
            category: catMap[item?.category_id || ""] || "General",
            stars: p.stars,
            completed_at: p.completed_at || "",
          };
        })
        .filter((a) => a.completed_at);
      setRecentActivity(recent);

      const upcoming = (items || [])
        .filter((item) => !progressMap[item.id] || (!progressMap[item.id].completed && progressMap[item.id].stars === 0))
        .slice(0, 4)
        .map((item) => {
          const prog = progressMap[item.id];
          return {
            label: `${item.label}: ${item.emoji}`,
            emoji: item.emoji,
            slug: item.slug,
            categoryId: item.category_id,
            status: !prog ? "ready" as const : prog.completed ? "done" as const : "in_progress" as const,
          };
        });
      setRecommendedLessons(upcoming);

      setLoading(false);
    }
    fetchDashboard();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const userInitial = userName.charAt(0).toUpperCase();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#faf9f6]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-gray-200 shrink-0">
        <div className="p-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/images/DrawKao_Logo.png" alt="Draw Kao" width={100} height={32} className="h-8 w-auto" />
          </Link>
        </div>

        <div className="p-3 border-b border-gray-100">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-green-700">{childName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{childName}</p>
                <p className="text-[10px] text-gray-500">{stats.lessonsDone} lessons done</p>
              </div>
              <CaretDown className="h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>
          <button className="w-full mt-2 text-xs font-semibold text-green-600 hover:text-green-700 flex items-center justify-center gap-1 py-1.5">
            <Plus className="h-3 w-3" /> Add Child
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-0.5 text-left ${
                activeNav === item.label
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="h-4 w-4" weight={activeNav === item.label ? "fill" : "regular"} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-gray-100 space-y-1">
          <Link href="/learn" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-2 rounded-lg transition-colors text-sm">
            <PencilLine className="h-4 w-4" weight="fill" />
            Draw
          </Link>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="h-7 w-7 rounded-full bg-green-600 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-white">{userInitial}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{userName}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Sign out">
              <SignOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-56 bg-white z-50 lg:hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <Image src="/images/DrawKao_Logo.png" alt="Draw Kao" width={100} height={32} className="h-8 w-auto" />
              <button onClick={() => setSidebarOpen(false)} className="h-7 w-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-2 px-2">
              {navItems.map((item) => (
                <button key={item.label} onClick={() => { setActiveNav(item.label); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-0.5 text-left ${
                    activeNav === item.label ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="p-2 border-t border-gray-100">
              <button onClick={handleLogout} className="w-full flex items-center gap-2 text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg">
                <SignOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-12 bg-white border-b border-gray-200 flex items-center px-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center mr-2">
            <List className="h-4 w-4 text-gray-600" />
          </button>

          <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-green-600 transition-colors mr-2">
            <CaretLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>

          <div className="flex-1 flex items-center gap-1.5 text-xs text-gray-400">
            <span className="text-gray-300">/</span>
            <span>Parent Portal</span>
            <CaretRight className="h-3 w-3" />
            <span className="font-semibold text-gray-700">Overview</span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-green-600 transition-colors bg-gray-50 hover:bg-green-50 px-3 py-1.5 rounded-full">
              <House className="h-3 w-3" />
              Home
            </Link>
            <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{childName}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
            {/* Welcome */}
            <div className="mb-5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Welcome back, {userName}</h1>
              <p className="text-sm text-gray-500 mt-0.5">Here&apos;s what {childName} is working on today.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Books className="h-4 w-4 text-green-600" weight="fill" />
                </div>
                <p className="text-lg font-extrabold text-green-700">{stats.lessonsDone}</p>
                <p className="text-[10px] font-medium text-green-600/75">Lessons Done</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Star className="h-4 w-4 text-amber-600" weight="fill" />
                </div>
                <p className="text-lg font-extrabold text-amber-700">{stats.starsEarned}</p>
                <p className="text-[10px] font-medium text-amber-600/75">Stars Earned</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Flame className="h-4 w-4 text-blue-600" weight="fill" />
                </div>
                <p className="text-lg font-extrabold text-blue-700">{stats.streak} days</p>
                <p className="text-[10px] font-medium text-blue-600/75">Streak</p>
              </div>
            </div>

            {/* Today's Drawing Path */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-900">Today&apos;s Drawing Path</h2>
                <span className="text-[10px] text-gray-400">Level {Math.floor(stats.lessonsDone / 10) + 1}</span>
              </div>
              {recommendedLessons.length > 0 ? (
                <div className="space-y-2">
                  {recommendedLessons.map((lesson, i) => (
                    <Link
                      key={i}
                      href={`/learn/${lesson.categoryId}/${lesson.slug}/draw`}
                      className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                        lesson.status === "done" ? "bg-purple-500" : lesson.status === "in_progress" ? "bg-orange-500" : "bg-green-500"
                      }`}>
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-800 flex-1 truncate">{lesson.label}</span>
                      {lesson.status === "done" ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Done</span>
                      ) : lesson.status === "in_progress" ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">In Progress</span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                          Ready
                          <ArrowRight className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-400 mb-2">No lessons started yet!</p>
                  <Link href="/learn" className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors">
                    Start Learning
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Screen Time */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-gray-900">Screen Time</h2>
                  <button className="relative h-5 w-9 rounded-full bg-green-500 transition-colors">
                    <span className="absolute top-0.5 left-4.5 h-4 w-4 rounded-full bg-white shadow" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl font-extrabold text-gray-900">{stats.lessonsDone * 5}<span className="text-xs font-normal text-gray-500 ml-0.5">min</span></span>
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.min(stats.lessonsDone * 5, 60)}%` }} />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-600">
                  <input type="checkbox" defaultChecked className="h-3.5 w-3.5 rounded border-gray-300 text-green-600" />
                  Eye-rest every 12 mins
                </label>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-gray-900">Recent Activity</h2>
                  {recentActivity.length > 0 && (
                    <Link href="/my-progress" className="text-[10px] font-semibold text-gray-400 hover:text-green-600">View All</Link>
                  )}
                </div>
                {recentActivity.length > 0 ? (
                  <div className="space-y-2">
                    {recentActivity.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <span className="text-xl">{activity.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate">{activity.label}</p>
                          <p className="text-[10px] text-gray-400">{activity.category}</p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: activity.stars }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-amber-400" weight="fill" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-gray-400">No activity yet</p>
                  </div>
                )}
              </div>

              {/* Voice Sticker */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <SpeakerHigh className="h-4 w-4 text-purple-600" weight="fill" />
                  <h2 className="text-sm font-bold text-gray-900">Voice Sticker</h2>
                </div>
                <p className="text-xs text-gray-500 mb-3">Record a note for {childName}</p>
                <button className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors">
                  <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  Record (10s)
                </button>
              </div>

              {/* Subscription */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h2 className="text-sm font-bold text-gray-900 mb-2">Family Club</h2>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-xl font-extrabold text-gray-900">$7.99</span>
                  <span className="text-xs text-gray-500">/mo</span>
                </div>
                <p className="text-[10px] text-gray-400 mb-3">Billed $68/year</p>
                <button className="w-full flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors text-xs">
                  <CreditCard className="h-3 w-3" weight="fill" />
                  Manage Billing
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
