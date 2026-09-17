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
  Check,
  Star,
  CaretDown,
  CaretRight,
  List,
  X,
  SpeakerHigh,
  SignOut,
  SignOut as SignOutIcon,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Overview", icon: House },
  { label: "Child Work", icon: PencilLine },
  { label: "Screen Time", icon: Monitor },
  { label: "Gallery", icon: Palette },
  { label: "Worksheets", icon: Printer },
  { label: "Billing", icon: CreditCard },
  { label: "Security", icon: Lock },
];

export default function ParentDashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");
  const [userName, setUserName] = useState("Parent");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/parent/auth"); return; }
      setUserName(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Parent");
      setUserEmail(user.email || "");
      setLoading(false);
    }
    fetchUser();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#faf9f6]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-gray-200 shrink-0">
        <div className="p-4 border-b border-gray-100">
          <Image src="/images/DrawKao_Logo.png" alt="Draw Kao" width={100} height={32} className="h-8 w-auto" />
        </div>

        <div className="p-3 border-b border-gray-100">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-green-700">L</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">Leo</p>
                <p className="text-[10px] text-gray-500">Age 5</p>
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
              <span className="text-[10px] font-bold text-white">{userName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{userName}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
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
          <div className="flex-1 flex items-center gap-1.5 text-xs text-gray-400">
            <span>Parent Portal</span>
            <CaretRight className="h-3 w-3" />
            <span className="font-semibold text-gray-700">Overview</span>
          </div>
          <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Leo</span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
            {/* Welcome */}
            <div className="mb-5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Welcome back, {userName}</h1>
              <p className="text-sm text-gray-500 mt-0.5">Here&apos;s what Leo is working on today.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Lessons Done", value: "12", color: "bg-green-50 text-green-700" },
                { label: "Stars Earned", value: "34", color: "bg-amber-50 text-amber-700" },
                { label: "Streak", value: "5 days", color: "bg-blue-50 text-blue-700" },
              ].map((stat) => (
                <div key={stat.label} className={`${stat.color} rounded-xl p-3 text-center`}>
                  <p className="text-lg font-extrabold">{stat.value}</p>
                  <p className="text-[10px] font-medium opacity-75">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Today's Path */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-900">Today&apos;s Drawing Path</h2>
                <span className="text-[10px] text-gray-400">Level 1</span>
              </div>
              <div className="space-y-2">
                {[
                  { n: 1, t: "Letter: \"C is for -\"", b: "Ready", bc: "bg-green-100 text-green-700" },
                  { n: 2, t: "Shape Mastery: Circles", b: "2/4", bc: "bg-orange-100 text-orange-700" },
                  { n: 3, t: "Color Exploration", b: "Done", bc: "bg-gray-100 text-gray-500" },
                ].map((s) => (
                  <div key={s.n} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${s.n === 1 ? "bg-green-500" : s.n === 2 ? "bg-orange-500" : "bg-purple-500"}`}>
                      {s.n}
                    </div>
                    <span className="text-sm font-medium text-gray-800 flex-1 truncate">{s.t}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.bc}`}>{s.b}</span>
                  </div>
                ))}
              </div>
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
                  <span className="text-2xl font-extrabold text-gray-900">25<span className="text-xs font-normal text-gray-500 ml-0.5">min</span></span>
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "42%" }} />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-600">
                  <input type="checkbox" defaultChecked className="h-3.5 w-3.5 rounded border-gray-300 text-green-600" />
                  Eye-rest every 12 mins
                </label>
              </div>

              {/* Recent Art */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-gray-900">Recent Art</h2>
                  <button className="text-[10px] font-semibold text-gray-400 hover:text-green-600">View All</button>
                </div>
                <div className="flex gap-2">
                  {["🍎", "🍌", "🐦"].map((e, i) => (
                    <div key={i} className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                      <span className="text-2xl">{e}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voice Sticker */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <SpeakerHigh className="h-4 w-4 text-purple-600" weight="fill" />
                  <h2 className="text-sm font-bold text-gray-900">Voice Sticker</h2>
                </div>
                <p className="text-xs text-gray-500 mb-3">Record a note for Leo</p>
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
