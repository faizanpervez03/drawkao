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
  ArrowRight,
  CheckCircle,
  Clock,
  Eye,
  Download,
  ShieldCheck,
  Key,
  Bell,
  Trash,
  GearSix,
  Funnel,
  GridFour,
  ListDashes,
  ChartBar,
  Timer,
  Sun,
  Moon,
  ToggleRight,
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

interface LessonRecord {
  id: string;
  item_id: string;
  label: string;
  emoji: string;
  category: string;
  category_id: string;
  slug: string;
  stars: number;
  completed: boolean;
  completed_at: string | null;
  drawing_steps_count: number;
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
  const [lessons, setLessons] = useState<LessonRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "in_progress">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [recommendedLessons, setRecommendedLessons] = useState<{ label: string; emoji: string; slug: string; categoryId: string; status: "ready" | "in_progress" | "done" }[]>([]);
  const [screenTime, setScreenTime] = useState({ daily: 0, limit: 60, eyeRest: true, autoStop: true });
  const [eyeRestMins, setEyeRestMins] = useState(12);
  const [notifications, setNotifications] = useState({ lessonComplete: true, weeklyReport: true, newContent: false });
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

      if (profiles?.display_name) setChildName(profiles.display_name);

      const { data: progress } = await supabase
        .from("user_progress")
        .select("id, item_id, stars, completed, completed_at")
        .eq("user_id", u.id);

      const { count: totalItems } = await supabase
        .from("items")
        .select("id", { count: "exact", head: true });

      const { data: items } = await supabase
        .from("items")
        .select("id, slug, label, emoji, category_id, sort_order, drawing_steps")
        .order("sort_order", { ascending: true });

      const { data: categories } = await supabase
        .from("categories")
        .select("id, name");

      const catMap: Record<string, string> = {};
      categories?.forEach((c) => { catMap[c.id] = c.name; });

      const progressMap: Record<string, { completed: boolean; stars: number; completed_at: string | null }> = {};
      progress?.forEach((p) => { progressMap[p.item_id] = { completed: p.completed, stars: p.stars, completed_at: p.completed_at }; });

      const allLessons: LessonRecord[] = (items || []).map((item) => {
        const prog = progressMap[item.id];
        return {
          id: item.id,
          item_id: item.id,
          label: item.label,
          emoji: item.emoji,
          category: catMap[item.category_id] || "General",
          category_id: item.category_id,
          slug: item.slug,
          stars: prog?.stars || 0,
          completed: prog?.completed || false,
          completed_at: prog?.completed_at || null,
          drawing_steps_count: Array.isArray(item.drawing_steps) ? item.drawing_steps.length : 0,
        };
      });
      setLessons(allLessons);

      const completedLessons = allLessons.filter((l) => l.completed);
      const totalStars = completedLessons.reduce((sum, l) => sum + l.stars, 0);

      const sortedDates = completedLessons
        .filter((l) => l.completed_at)
        .map((l) => new Date(l.completed_at!).toDateString())
        .filter((d, i, arr) => arr.indexOf(d) === i)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      let streak = 0;
      const today = new Date();
      for (let i = 0; i < sortedDates.length; i++) {
        const expected = new Date(today);
        expected.setDate(expected.getDate() - i);
        if (sortedDates[i] === expected.toDateString()) streak++;
        else break;
      }

      setStats({
        lessonsDone: completedLessons.length,
        starsEarned: totalStars,
        streak,
        totalItems: totalItems || 0,
      });

      setScreenTime({ daily: completedLessons.length * 5, limit: 60, eyeRest: true, autoStop: true });

      const upcoming = allLessons
        .filter((l) => !l.completed && l.stars === 0)
        .slice(0, 4)
        .map((l) => ({
          label: `${l.label}: ${l.emoji}`,
          emoji: l.emoji,
          slug: l.slug,
          categoryId: l.category_id,
          status: l.completed ? "done" as const : l.stars > 0 ? "in_progress" as const : "ready" as const,
        }));
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

  const filteredLessons = lessons.filter((l) => {
    if (filterStatus === "completed") return l.completed;
    if (filterStatus === "in_progress") return !l.completed;
    return true;
  });

  const completedCount = lessons.filter((l) => l.completed).length;
  const inProgressCount = lessons.filter((l) => !l.completed && l.stars > 0).length;
  const notStartedCount = lessons.filter((l) => !l.completed && l.stars === 0).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  function renderContent() {
    switch (activeNav) {
      case "Overview":
        return <OverviewContent userName={userName} childName={childName} stats={stats} recommendedLessons={recommendedLessons} lessons={lessons} />;
      case "Child Work":
        return <ChildWorkContent lessons={filteredLessons} filterStatus={filterStatus} setFilterStatus={setFilterStatus} viewMode={viewMode} setViewMode={setViewMode} completedCount={completedCount} inProgressCount={inProgressCount} notStartedCount={notStartedCount} />;
      case "Screen Time":
        return <ScreenTimeContent screenTime={screenTime} setScreenTime={setScreenTime} eyeRestMins={eyeRestMins} setEyeRestMins={setEyeRestMins} />;
      case "Gallery":
        return <GalleryContent lessons={lessons} />;
      case "Worksheets":
        return <WorksheetsContent />;
      case "Billing":
        return <BillingContent userName={userName} />;
      case "Security":
        return <SecurityContent notifications={notifications} setNotifications={setNotifications} />;
      default:
        return null;
    }
  }

  return (
    <div className="flex h-screen bg-[#faf9f6]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-gray-200 shrink-0">
        <div className="p-4 border-b border-gray-100 flex justify-center">
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/images/DrawKao_Logo.png" alt="Draw Kao" width={120} height={40} className="h-10 w-auto" />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2">
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
            <nav className="flex-1 overflow-y-auto py-3 px-2">
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
              <Link href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg mb-1">
                <House className="h-4 w-4" />
                Back to Home
              </Link>
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
            <span className="font-semibold text-gray-700">{activeNav}</span>
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
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ==================== OVERVIEW ==================== */
function OverviewContent({ userName, childName, stats, recommendedLessons, lessons }: {
  userName: string;
  childName: string;
  stats: DashboardStats;
  recommendedLessons: { label: string; emoji: string; slug: string; categoryId: string; status: "ready" | "in_progress" | "done" }[];
  lessons: LessonRecord[];
}) {
  const recentActivity = lessons
    .filter((l) => l.completed)
    .sort((a, b) => new Date(b.completed_at || 0).getTime() - new Date(a.completed_at || 0).getTime())
    .slice(0, 5);

  return (
    <>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Welcome back, {userName}</h1>
        <p className="text-sm text-gray-500 mt-0.5">Here&apos;s what {childName} is working on today.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1"><Books className="h-4 w-4 text-green-600" weight="fill" /></div>
          <p className="text-lg font-extrabold text-green-700">{stats.lessonsDone}</p>
          <p className="text-[10px] font-medium text-green-600/75">Lessons Done</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1"><Star className="h-4 w-4 text-amber-600" weight="fill" /></div>
          <p className="text-lg font-extrabold text-amber-700">{stats.starsEarned}</p>
          <p className="text-[10px] font-medium text-amber-600/75">Stars Earned</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1"><Flame className="h-4 w-4 text-blue-600" weight="fill" /></div>
          <p className="text-lg font-extrabold text-blue-700">{stats.streak} days</p>
          <p className="text-[10px] font-medium text-blue-600/75">Streak</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900">Today&apos;s Drawing Path</h2>
          <span className="text-[10px] text-gray-400">Level {Math.floor(stats.lessonsDone / 10) + 1}</span>
        </div>
        {recommendedLessons.length > 0 ? (
          <div className="space-y-2">
            {recommendedLessons.map((lesson, i) => (
              <Link key={i} href={`/learn/${lesson.categoryId}/${lesson.slug}/draw`}
                className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                  lesson.status === "done" ? "bg-purple-500" : lesson.status === "in_progress" ? "bg-orange-500" : "bg-green-500"
                }`}>{i + 1}</div>
                <span className="text-sm font-medium text-gray-800 flex-1 truncate">{lesson.label}</span>
                {lesson.status === "done" ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Done</span>
                ) : lesson.status === "in_progress" ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">In Progress</span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">Ready<ArrowRight className="h-2.5 w-2.5" /></span>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-400 mb-2">No lessons started yet!</p>
            <Link href="/learn" className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors">Start Learning<ArrowRight className="h-3 w-3" /></Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900">Screen Time</h2>
            <span className="text-xs text-green-600 font-medium">{stats.lessonsDone * 5} min</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(stats.lessonsDone * 5, 60)}%` }} />
            </div>
            <span className="text-[10px] text-gray-400">60 min limit</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900">Recent Activity</h2>
            {recentActivity.length > 0 && <Link href="#" onClick={() => {}} className="text-[10px] font-semibold text-gray-400 hover:text-green-600">View All</Link>}
          </div>
          {recentActivity.length > 0 ? (
            <div className="space-y-1.5">
              {recentActivity.slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-center gap-2">
                  <span className="text-lg">{a.emoji}</span>
                  <span className="text-xs font-medium text-gray-700 flex-1 truncate">{a.label}</span>
                  <div className="flex items-center gap-0.5">{Array.from({ length: a.stars }).map((_, i) => <Star key={i} className="h-2.5 w-2.5 text-amber-400" weight="fill" />)}</div>
                </div>
              ))}
            </div>
          ) : <p className="text-xs text-gray-400 text-center py-2">No activity yet</p>}
        </div>
      </div>
    </>
  );
}

/* ==================== CHILD WORK ==================== */
function ChildWorkContent({ lessons, filterStatus, setFilterStatus, viewMode, setViewMode, completedCount, inProgressCount, notStartedCount }: {
  lessons: LessonRecord[];
  filterStatus: "all" | "completed" | "in_progress";
  setFilterStatus: (s: "all" | "completed" | "in_progress") => void;
  viewMode: "grid" | "list";
  setViewMode: (m: "grid" | "list") => void;
  completedCount: number;
  inProgressCount: number;
  notStartedCount: number;
}) {
  return (
    <>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Child Work</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track {`child's`} progress across all lessons.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <button onClick={() => setFilterStatus("all")} className={`rounded-xl p-3 text-center transition-all ${filterStatus === "all" ? "bg-green-100 ring-2 ring-green-500" : "bg-green-50 hover:bg-green-100"}`}>
          <p className="text-lg font-extrabold text-green-700">{lessons.length}</p>
          <p className="text-[10px] font-medium text-green-600/75">Total Lessons</p>
        </button>
        <button onClick={() => setFilterStatus("completed")} className={`rounded-xl p-3 text-center transition-all ${filterStatus === "completed" ? "bg-amber-100 ring-2 ring-amber-500" : "bg-amber-50 hover:bg-amber-100"}`}>
          <p className="text-lg font-extrabold text-amber-700">{completedCount}</p>
          <p className="text-[10px] font-medium text-amber-600/75">Completed</p>
        </button>
        <button onClick={() => setFilterStatus("in_progress")} className={`rounded-xl p-3 text-center transition-all ${filterStatus === "in_progress" ? "bg-blue-100 ring-2 ring-blue-500" : "bg-blue-50 hover:bg-blue-100"}`}>
          <p className="text-lg font-extrabold text-blue-700">{inProgressCount + notStartedCount}</p>
          <p className="text-[10px] font-medium text-blue-600/75">Remaining</p>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Funnel className="h-4 w-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-600">{lessons.length} lessons</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-green-600" : "text-gray-400 hover:text-gray-600"}`}>
              <GridFour className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-green-600" : "text-gray-400 hover:text-gray-600"}`}>
              <ListDashes className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400 mb-2">No lessons found</p>
            <Link href="/learn" className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors">Start Learning</Link>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {lessons.map((lesson) => (
              <Link key={lesson.id} href={`/learn/${lesson.category_id}/${lesson.slug}/draw`}
                className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors text-center group">
                <span className="text-3xl block mb-2">{lesson.emoji}</span>
                <p className="text-xs font-bold text-gray-800 truncate">{lesson.label}</p>
                <p className="text-[10px] text-gray-400 mb-2">{lesson.category}</p>
                {lesson.completed ? (
                  <div className="flex items-center justify-center gap-0.5">
                    {Array.from({ length: lesson.stars }).map((_, i) => <Star key={i} className="h-3 w-3 text-amber-400" weight="fill" />)}
                    {Array.from({ length: 3 - lesson.stars }).map((_, i) => <Star key={i} className="h-3 w-3 text-gray-200" />)}
                  </div>
                ) : (
                  <span className="text-[10px] font-medium text-gray-400">Not started</span>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {lessons.map((lesson) => (
              <Link key={lesson.id} href={`/learn/${lesson.category_id}/${lesson.slug}/draw`}
                className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-2xl">{lesson.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{lesson.label}</p>
                  <p className="text-[10px] text-gray-400">{lesson.category}</p>
                </div>
                {lesson.completed ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" weight="fill" />
                    <div className="flex items-center gap-0.5">{Array.from({ length: lesson.stars }).map((_, i) => <Star key={i} className="h-3 w-3 text-amber-400" weight="fill" />)}</div>
                  </div>
                ) : (
                  <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1"><Clock className="h-3 w-3" /> Not started</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/* ==================== SCREEN TIME ==================== */
function ScreenTimeContent({ screenTime, setScreenTime, eyeRestMins, setEyeRestMins }: {
  screenTime: { daily: number; limit: number; eyeRest: boolean; autoStop: boolean };
  setScreenTime: (s: { daily: number; limit: number; eyeRest: boolean; autoStop: boolean }) => void;
  eyeRestMins: number;
  setEyeRestMins: (m: number) => void;
}) {
  const percentage = Math.min((screenTime.daily / screenTime.limit) * 100, 100);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekData = [15, 25, 20, 35, screenTime.daily, 0, 0];

  return (
    <>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Screen Time</h1>
        <p className="text-sm text-gray-500 mt-0.5">Monitor and manage {`child's`} learning time.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-3xl font-extrabold text-gray-900">{screenTime.daily}<span className="text-sm font-normal text-gray-500 ml-1">min today</span></p>
            <p className="text-xs text-gray-400 mt-1">Daily limit: {screenTime.limit} min</p>
          </div>
          <div className="h-16 w-16 rounded-full border-4 border-green-500 flex items-center justify-center">
            <span className="text-sm font-bold text-green-600">{Math.round(percentage)}%</span>
          </div>
        </div>
        <div className="bg-gray-100 rounded-full h-3 mb-4">
          <div className={`h-3 rounded-full transition-all ${percentage > 80 ? "bg-red-500" : percentage > 50 ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${percentage}%` }} />
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {days.map((day, i) => (
            <div key={day} className="text-center">
              <div className="h-20 bg-gray-50 rounded-lg relative overflow-hidden mb-1">
                <div className="absolute bottom-0 left-0 right-0 bg-green-400 rounded-b-lg" style={{ height: `${(weekData[i] / screenTime.limit) * 100}%` }} />
              </div>
              <span className="text-[10px] font-medium text-gray-500">{day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-500" weight="fill" />
              <h2 className="text-sm font-bold text-gray-900">Eye Rest Reminder</h2>
            </div>
            <button onClick={() => setScreenTime({ ...screenTime, eyeRest: !screenTime.eyeRest })}
              className={`relative h-5 w-9 rounded-full transition-colors ${screenTime.eyeRest ? "bg-green-500" : "bg-gray-300"}`}>
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${screenTime.eyeRest ? "left-4.5" : "left-0.5"}`} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-3">Take a break every</p>
          <div className="flex gap-2">
            {[5, 10, 12, 15, 20].map((m) => (
              <button key={m} onClick={() => setEyeRestMins(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${eyeRestMins === m ? "bg-green-100 text-green-700 ring-1 ring-green-500" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {m}m
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-orange-500" weight="fill" />
              <h2 className="text-sm font-bold text-gray-900">Daily Limit</h2>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-3">Maximum screen time per day</p>
          <div className="flex gap-2">
            {[30, 45, 60, 90, 120].map((m) => (
              <button key={m} onClick={() => setScreenTime({ ...screenTime, limit: m })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${screenTime.limit === m ? "bg-green-100 text-green-700 ring-1 ring-green-500" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {m}m
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <ChartBar className="h-4 w-4 text-purple-500" weight="fill" />
            <h2 className="text-sm font-bold text-gray-900">Weekly Summary</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-lg font-extrabold text-purple-700">{weekData.reduce((a, b) => a + b, 0)}</p>
              <p className="text-[10px] text-purple-600/75">Total minutes</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-lg font-extrabold text-blue-700">{Math.round(weekData.reduce((a, b) => a + b, 0) / 7)}</p>
              <p className="text-[10px] text-blue-600/75">Avg per day</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-lg font-extrabold text-green-700">{weekData.filter((d) => d > 0).length}</p>
              <p className="text-[10px] text-green-600/75">Active days</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ==================== GALLERY ==================== */
function GalleryContent({ lessons }: { lessons: LessonRecord[] }) {
  const completed = lessons.filter((l) => l.completed);

  return (
    <>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Gallery</h1>
        <p className="text-sm text-gray-500 mt-0.5">Completed drawings and achievements.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
        {completed.length > 0 ? completed.map((lesson) => (
          <div key={lesson.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="aspect-square bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center">
              <span className="text-5xl group-hover:scale-110 transition-transform">{lesson.emoji}</span>
            </div>
            <div className="p-2.5">
              <p className="text-xs font-bold text-gray-800 truncate">{lesson.label}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-gray-400">{lesson.category}</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: lesson.stars }).map((_, i) => <Star key={i} className="h-2.5 w-2.5 text-amber-400" weight="fill" />)}
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-12">
            <Palette className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400 mb-2">No drawings yet!</p>
            <Link href="/learn" className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors">Start Drawing</Link>
          </div>
        )}
      </div>
    </>
  );
}

/* ==================== WORKSHEETS ==================== */
function WorksheetsContent() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const worksheets = [
    { name: "Alphabet Tracing A-Z", type: "alphabet", pages: 6, icon: "📝", desc: "Trace and practice all 26 letters" },
    { name: "Number Practice 1-20", type: "numbers", pages: 2, icon: "🔢", desc: "Trace and write numbers 1 to 20" },
    { name: "Shape Coloring Book", type: "shapes", pages: 1, icon: "🎨", desc: "Learn to draw 8 basic shapes" },
    { name: "Animal Coloring Pages", type: "coloring", pages: 1, icon: "🐱", desc: "Color in 6 friendly animals" },
    { name: "Animal Drawing Guide", type: "animals", pages: 1, icon: "🐾", desc: "Step-by-step animal drawing" },
    { name: "Vehicle Drawing Guide", type: "vehicles", pages: 1, icon: "🚗", desc: "Step-by-step vehicle drawing" },
  ];

  const handleDownload = async (type: string, name: string) => {
    setDownloading(type);
    try {
      const res = await fetch(`/api/worksheets/${type}`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download worksheet. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Worksheets</h1>
        <p className="text-sm text-gray-500 mt-0.5">Download printable worksheets for offline practice.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {worksheets.map((ws) => (
          <div key={ws.type} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <span className="text-3xl">{ws.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">{ws.name}</p>
              <p className="text-[10px] text-gray-400">{ws.desc}</p>
              <p className="text-[10px] text-gray-300 mt-0.5">PDF • {ws.pages} {ws.pages === 1 ? "page" : "pages"}</p>
            </div>
            <button
              onClick={() => handleDownload(ws.type, ws.name)}
              disabled={downloading === ws.type}
              className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading === ws.type ? (
                <div className="h-3 w-3 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
              ) : (
                <Download className="h-3 w-3" />
              )}
              {downloading === ws.type ? "Generating..." : "Download"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

/* ==================== BILLING ==================== */
function BillingContent({ userName }: { userName: string }) {
  return (
    <>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Billing</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your subscription and payment methods.</p>
      </div>

      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium opacity-80">Current Plan</p>
            <p className="text-2xl font-extrabold">Family Club</p>
          </div>
          <Trophy className="h-8 w-8 opacity-80" weight="fill" />
        </div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-3xl font-extrabold">$7.99</span>
          <span className="text-sm opacity-80">/mo</span>
        </div>
        <p className="text-xs opacity-70">Billed $68/year • Renews Dec 2026</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Payment Method</h2>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="h-10 w-16 bg-blue-600 rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">VISA</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">•••• •••• •••• 4242</p>
            <p className="text-[10px] text-gray-400">Expires 12/2027</p>
          </div>
          <button className="text-xs font-semibold text-green-600 hover:text-green-700">Edit</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Billing History</h2>
        <div className="space-y-2">
          {[{ date: "Aug 18, 2026", amount: "$7.99", status: "Paid" }, { date: "Jul 18, 2026", amount: "$7.99", status: "Paid" }, { date: "Jun 18, 2026", amount: "$7.99", status: "Paid" }].map((b, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs font-medium text-gray-800">{b.date}</p>
                <p className="text-[10px] text-gray-400">Family Club</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-800">{b.amount}</p>
                <span className="text-[10px] font-medium text-green-600">{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ==================== SECURITY ==================== */
function SecurityContent({ notifications, setNotifications }: {
  notifications: { lessonComplete: boolean; weeklyReport: boolean; newContent: boolean };
  setNotifications: (n: { lessonComplete: boolean; weeklyReport: boolean; newContent: boolean }) => void;
}) {
  return (
    <>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Security</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage account security and notifications.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-4 w-4 text-green-500" weight="fill" />
          <h2 className="text-sm font-bold text-gray-900">Account Security</h2>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs font-medium text-gray-800">Password</p>
                <p className="text-[10px] text-gray-400">Last changed 30 days ago</p>
              </div>
            </div>
            <button className="text-xs font-semibold text-green-600 hover:text-green-700">Change</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs font-medium text-gray-800">Two-Factor Auth</p>
                <p className="text-[10px] text-gray-400">Add extra security to your account</p>
              </div>
            </div>
            <button className="text-xs font-semibold text-green-600 hover:text-green-700">Enable</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="h-4 w-4 text-blue-500" weight="fill" />
          <h2 className="text-sm font-bold text-gray-900">Notifications</h2>
        </div>
        <div className="space-y-3">
          {[
            { key: "lessonComplete" as const, label: "Lesson Completed", desc: "When your child finishes a lesson" },
            { key: "weeklyReport" as const, label: "Weekly Report", desc: "Summary of weekly progress" },
            { key: "newContent" as const, label: "New Content", desc: "When new lessons are available" },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-800">{n.label}</p>
                <p className="text-[10px] text-gray-400">{n.desc}</p>
              </div>
              <button onClick={() => setNotifications({ ...notifications, [n.key]: !notifications[n.key] })}
                className={`relative h-5 w-9 rounded-full transition-colors ${notifications[n.key] ? "bg-green-500" : "bg-gray-300"}`}>
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${notifications[n.key] ? "left-4.5" : "left-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Trash className="h-4 w-4 text-red-500" weight="fill" />
          <h2 className="text-sm font-bold text-red-900">Danger Zone</h2>
        </div>
        <p className="text-xs text-red-600/80 mb-3">Permanently delete your account and all associated data.</p>
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors">
          Delete Account
        </button>
      </div>
    </>
  );
}
