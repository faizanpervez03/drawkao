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
  ArrowLeft,
  Plus,
  Check,
  Star,
  Clock,
  Download,
  Shield,
  CaretDown,
  CaretRight,
  List,
  X,
  SpeakerHigh,
  Share,
  Gear,
  SignOut,
  User,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Overview & Plan", icon: House },
  { label: "Child Work & Path", icon: PencilLine },
  { label: "Screen Time & Pacing", icon: Monitor },
  { label: "Art Gallery & Audio", icon: Palette },
  { label: "Printable Worksheets", icon: Printer },
  { label: "Subscription & Billing", icon: CreditCard },
  { label: "Parent Gate & Security", icon: Lock },
];

export default function ParentDashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview & Plan");
  const [userName, setUserName] = useState("Parent");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/parent/auth");
        return;
      }

      const fullName = user.user_metadata?.full_name
        || user.user_metadata?.name
        || user.email?.split("@")[0]
        || "Parent";

      setUserName(fullName);
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
    <div className="flex h-screen bg-[#f8f7f4]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 shrink-0">
        <div className="p-5 border-b border-gray-100">
          <Image src="/images/DrawKao_Logo.png" alt="Draw Kao" width={120} height={40} className="h-10 w-auto" />
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
              <Lock className="h-3 w-3" weight="fill" />
              Parent Portal
            </span>
          </div>
        </div>

        {/* Active Child */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Child</span>
            <Check className="h-4 w-4 text-green-500" weight="fill" />
          </div>
          <div className="bg-gray-50 rounded-xl p-3 cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-sm font-bold text-green-700">L</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">Leo</p>
                <p className="text-xs text-gray-500">Age 5 • Preschool</p>
              </div>
              <CaretDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">Sibling: Maya (3)</span>
            <button className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1">
              <Plus className="h-3 w-3" />
              Add Child
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 text-left ${
                activeNav === item.label
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="h-5 w-5" weight={activeNav === item.label ? "fill" : "regular"} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 space-y-2">
          <Link
            href="/learn"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
          >
            <PencilLine className="h-4 w-4" weight="fill" />
            Return to Drawing
          </Link>
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">{userName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
              <p className="text-xs text-gray-400 truncate">{userEmail}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
              <SignOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 lg:hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <Image src="/images/DrawKao_Logo.png" alt="Draw Kao" width={120} height={40} className="h-10 w-auto" />
              <button onClick={() => setSidebarOpen(false)} className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 px-3">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { setActiveNav(item.label); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 text-left ${
                    activeNav === item.label ? "bg-green-50 text-green-700 border border-green-200" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
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
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden h-10 w-10 rounded-xl hover:bg-gray-100 flex items-center justify-center mr-3">
            <List className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex-1 flex items-center gap-2 text-sm text-gray-500">
            <span>Parent Portal</span>
            <CaretRight className="h-3 w-3" />
            <span className="font-semibold text-gray-800">Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block">Active Child:</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
              Leo • Preschool
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {/* Welcome */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Welcome back, {userName}</h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full uppercase">
                  <Check className="h-3 w-3" weight="fill" />
                  Active Guardian
                </span>
              </div>
              <p className="text-sm text-gray-500">Manage Leo&apos;s daily drawing routine and track progress.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="xl:col-span-2 space-y-6">
                {/* Today's Path */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                        <PencilLine className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Today&apos;s Drawing Path</h2>
                        <p className="text-xs text-gray-500">Level 1 • Preschool Fine-Motor</p>
                      </div>
                    </div>
                    <button className="text-sm font-semibold text-gray-600 hover:text-green-600 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                      Edit Pace
                    </button>
                  </div>

                  <div className="space-y-3">
                    {[
                      { num: 1, title: "Letter of the day: \"C is for -\"", sub: "Phonetics • Tactile stroke guidance", badge: "Ready", badgeColor: "bg-green-100 text-green-700" },
                      { num: 2, title: "Shape Mastery: Circles & Triang...", sub: "Geometric motor confidence • 4 exercises", badge: "2/4", badgeColor: "bg-orange-100 text-orange-700" },
                      { num: 3, title: "Free Color Exploration", sub: "Creative expression • Palette intuition", badge: "Done", badgeColor: "bg-gray-100 text-gray-600" },
                    ].map((step) => (
                      <div key={step.num} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${step.num === 1 ? "bg-green-500" : step.num === 2 ? "bg-orange-500" : "bg-purple-500"}`}>
                          {step.num}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{step.title}</p>
                          <p className="text-xs text-gray-500">{step.sub}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${step.badgeColor}`}>{step.badge}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-green-600 transition-colors">
                      <Plus className="h-4 w-4" />
                      Assign Custom Step
                    </button>
                    <span className="text-xs text-gray-400">Pace: <span className="font-semibold text-gray-600">Gentle • 15 min</span></span>
                  </div>
                </div>

                {/* Screen Time */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Monitor className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Screen Time</h2>
                        <p className="text-xs text-gray-500">Mindful tablet interaction</p>
                      </div>
                    </div>
                    <button className="relative h-6 w-11 rounded-full bg-green-500 transition-colors">
                      <span className="absolute top-0.5 left-5 h-5 w-5 rounded-full bg-white shadow" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Daily Max</span>
                        <span className="text-2xl font-extrabold text-gray-900">25 <span className="text-sm font-normal text-gray-500">min</span></span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "42%" }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>10m</span>
                        <span>25m (Rec)</span>
                        <span>60m</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <span className="text-sm font-medium text-gray-700 block mb-2">Reminders</span>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-green-600" />
                          Eye-rest every 12 mins
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-green-600" />
                          Spaced audio prompts
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-4">
                    <Printer className="h-5 w-5 text-orange-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">Download Printable Worksheets</p>
                      <p className="text-xs text-gray-500">Today&apos;s 4-page PDF guide</p>
                    </div>
                    <button className="bg-white border border-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50 transition-colors shrink-0">
                      Get PDF
                    </button>
                  </div>
                </div>

                {/* Recent Artworks */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <Palette className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Recent Artworks</h2>
                        <p className="text-xs text-gray-500">From Leo&apos;s easel</p>
                      </div>
                    </div>
                    <button className="text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors">View All (34)</button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { title: "Cheerful A...", sub: "92% control", time: "Yesterday", emoji: "🍎" },
                      { title: "Sunny Ban...", sub: "Steady arcs", time: "2 days", emoji: "🍌" },
                      { title: "Blue Bird", sub: "Original design", time: "4 days", emoji: "🐦" },
                    ].map((work, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="text-[10px] text-gray-400 mb-1">{work.time}</div>
                        <div className="h-16 bg-white rounded-lg flex items-center justify-center mb-2 border border-gray-100">
                          <span className="text-3xl">{work.emoji}</span>
                        </div>
                        <p className="text-xs font-bold text-gray-900 truncate">{work.title}</p>
                        <p className="text-[10px] text-gray-500">{work.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-center gap-3">
                    <SpeakerHigh className="h-5 w-5 text-purple-600 shrink-0" weight="fill" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">Voice Sticker</p>
                      <p className="text-xs text-gray-500">Record a note for Leo</p>
                    </div>
                    <button className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0">
                      <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      Record
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Subscription */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full uppercase">Active Plan</span>
                  <h3 className="text-xl font-extrabold text-gray-900 mt-3 mb-1">Family Club</h3>
                  <p className="text-sm text-gray-500 mb-4">For up to 4 children</p>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-extrabold text-gray-900">$7.99</span>
                    <span className="text-sm text-gray-500">/mo</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">Billed annually ($68/yr)</p>

                  <div className="space-y-2 mb-5">
                    {[
                      "Unlimited drawing levels",
                      "Up to 4 child profiles",
                      "Weekly progress reports",
                      "100% ad-free & COPPA safe",
                      "High-res printables",
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 shrink-0" weight="fill" />
                        <span className="text-sm text-gray-600">{f}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
                    <CreditCard className="h-4 w-4" weight="fill" />
                    Manage Billing
                  </button>
                </div>

                {/* Security */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-5 w-5 text-orange-500" />
                    <h3 className="font-bold text-gray-900">Parent Gate</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Prevents children from accessing portal</p>
                  <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Barrier: Word Math</p>
                      <p className="text-[10px] text-gray-400">Currently active</p>
                    </div>
                    <button className="text-xs font-semibold text-green-600 hover:text-green-700">Configure</button>
                  </div>
                </div>

                {/* Educator Advice */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-lg">👩‍🏫</span>
                    <h3 className="font-bold text-gray-900">Educator Advice</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Questions about grip, focus, or development?</p>
                  <button className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
                    <PencilLine className="h-4 w-4" />
                    Ask an Educator
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
