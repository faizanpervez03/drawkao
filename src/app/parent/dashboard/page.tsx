"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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
  Play,
  Download,
  Shield,
  Circle,
  Warning,
  SpeakerHigh,
  Share,
  Gear,
  Bell,
  CaretDown,
  CaretRight,
  List,
  X,
  CheckCircle,
  Eye,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Overview & Plan", href: "#overview", icon: House, active: true },
  { label: "Child Work & Path", href: "#work", icon: PencilLine },
  { label: "Screen Time & Pacing", href: "#screentime", icon: Monitor },
  { label: "Art Gallery & Audio", href: "#gallery", icon: Palette },
  { label: "Printable Worksheets", href: "#worksheets", icon: Printer },
  { label: "Subscription & Billing", href: "#billing", icon: CreditCard },
  { label: "Parent Gate & Security", href: "#security", icon: Lock },
];

const completedWorks = [
  { title: "A • Cheerful A...", subtitle: "Coloring • 92% boundary control", time: "Yesterday", emoji: "🍎" },
  { title: "B • Sunny Ban...", subtitle: "Tracing • Steady arcs", time: "2 days ago", emoji: "🍌" },
  { title: "Blue Bird Song", subtitle: "Free draw • Original design", time: "4 days ago", emoji: "🐦" },
];

export default function ParentDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview & Plan");
  const [supabase] = useState(() => createClient());

  return (
    <div className="flex h-screen bg-[#f8f7f4]">
      {/* Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/DrawKao_Logo.png" alt="Draw Kao" width={120} height={40} className="h-10 w-auto" />
          </Link>
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
          <div className="bg-gray-50 rounded-xl p-3">
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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 text-left ${
                activeNav === item.label
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="h-5 w-5" weight={activeNav === item.label ? "fill" : "regular"} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Return to Drawing */}
        <div className="p-3 border-t border-gray-100">
          <Link
            href="/learn"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
          >
            <PencilLine className="h-4 w-4" weight="fill" />
            Return to Drawing
          </Link>
          <div className="flex items-center gap-3 mt-3 px-3">
            <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-xs font-bold text-white">S</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">Sarah</p>
              <p className="text-xs text-gray-400">Educator Guardian</p>
            </div>
            <Gear className="h-4 w-4 text-gray-400 shrink-0" />
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
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
                    activeNav === item.label
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "text-gray-600 hover:bg-gray-50"
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden h-10 w-10 rounded-xl hover:bg-gray-100 flex items-center justify-center mr-3">
            <List className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex-1 flex items-center gap-2 text-sm text-gray-500">
            <span>Parent Portal • Protected Zone</span>
            <CaretRight className="h-3 w-3" />
            <span className="font-semibold text-gray-800">Leo&apos;s Dashboard & Subscription</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block">Active Child Easel:</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
              Leo • Preschool
            </span>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Welcome back, Sarah</h1>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full uppercase">
                    <Check className="h-3 w-3" weight="fill" />
                    Active Educator Guardian
                  </span>
                </div>
                <p className="text-sm text-gray-500 max-w-lg">
                  Manage Leo&apos;s daily drawing routine, review fine-motor progression, leave encouraging voice stickers, and supervise your family plan.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-lg">🎓</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Draw Kao Family Club</p>
                    <p className="text-xs text-gray-500">Auto-renews on Oct 18, 2026</p>
                  </div>
                  <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Annual Active</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="xl:col-span-2 space-y-6">
                {/* Today's Guided Drawing Path */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                        <PencilLine className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Today&apos;s Guided Drawing Path</h2>
                        <p className="text-xs text-gray-500">Level 1 • Preschool Fine-Motor Foundation</p>
                      </div>
                    </div>
                    <button className="text-sm font-semibold text-gray-600 hover:text-green-600 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                      Edit Curriculum Pace
                    </button>
                  </div>

                  {/* Steps */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">Letter of the day: &quot;C is for -&quot;</p>
                        <p className="text-xs text-gray-500">Phonetics • Tactile stroke guidance</p>
                      </div>
                      <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full shrink-0">Ready on Leo&apos;s Tablet</span>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold shrink-0">2</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">Shape Mastery: Circles &amp; Triang...</p>
                        <p className="text-xs text-gray-500">Geometric motor confidence • 4 exercises</p>
                      </div>
                      <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full shrink-0">In Progress (2/4)</span>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold shrink-0">3</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">Free Color Exploration: &quot;Cheerful A...&quot;</p>
                        <p className="text-xs text-gray-500">Creative expression • Palette intuition</p>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <Star className="h-3 w-3 text-amber-400" weight="fill" />
                        <Star className="h-3 w-3 text-amber-400" weight="fill" />
                        <Star className="h-3 w-3 text-gray-300" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">Done</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors">
                      <Plus className="h-4 w-4" />
                      Assign Custom Drawing Step
                    </button>
                    <p className="text-xs text-gray-400 mt-1">Pace mode: <span className="font-semibold text-gray-600">Gentle • 15 min daily</span></p>
                  </div>
                </motion.div>

                {/* Screen Time & Physical Sensory Bounds */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Monitor className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Screen Time &amp; Physical Sensory Bounds</h2>
                        <p className="text-xs text-gray-500">Encouraging mindful, tactile tablet interaction</p>
                      </div>
                    </div>
                    <button className="relative h-6 w-11 rounded-full bg-green-500 transition-colors">
                      <span className="absolute top-0.5 left-5 h-5 w-5 rounded-full bg-white shadow transition-transform" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Daily Max Session</span>
                        <span className="text-2xl font-extrabold text-gray-900">25 <span className="text-sm font-normal text-gray-500">min</span></span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "42%" }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>10 min</span>
                        <span>25 min (Recommended)</span>
                        <span>60 min</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <span className="text-sm font-medium text-gray-700 block mb-2">Pacing Reminders</span>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          Gentle eye-rest break every 12 mins
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          Spaced audio prompts (No rushing)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                      <Printer className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">Download Leo&apos;s Matching Printable Worksheets</p>
                      <p className="text-xs text-gray-500">Switch to real crayons and paper using today&apos;s 4-page PDF guide.</p>
                    </div>
                    <button className="bg-white border border-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors shrink-0">
                      Get PDF Sheets
                    </button>
                  </div>
                </motion.div>

                {/* Recent Completed Artworks */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <Palette className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Recent Completed Artworks</h2>
                        <p className="text-xs text-gray-500">Saved straight from Leo&apos;s easel tablet</p>
                      </div>
                    </div>
                    <button className="text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors">
                      View All (34 works)
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {completedWorks.map((work, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="text-xs text-gray-400 mb-2">{work.time}</div>
                        <div className="h-20 w-full bg-white rounded-lg flex items-center justify-center mb-2 border border-gray-100">
                          <span className="text-4xl">{work.emoji}</span>
                        </div>
                        <p className="text-xs font-bold text-gray-900 truncate">{work.title}</p>
                        <p className="text-[10px] text-gray-500 truncate">{work.subtitle}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                      <SpeakerHigh className="h-5 w-5 text-purple-600" weight="fill" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">Record a Parent Voice Sticker</p>
                      <p className="text-xs text-gray-500">Leo will hear your gentle voice note next time he draws!</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-2 rounded-lg text-sm transition-colors">
                        <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                        Record
                      </button>
                      <span className="text-xs text-gray-400">(10s)</span>
                      <button className="h-9 w-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <Share className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Subscription Tier */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full uppercase">Current Active Tier</span>
                    <span className="text-xs text-gray-400">Renews Annually</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 mb-2">Draw Kao Unlimited Family</h3>
                  <p className="text-sm text-gray-500 mb-4">Unrestricted drawing journeys, offline worksheets, and fine-motor developmental trackers for up to 4 children.</p>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-extrabold text-gray-900">$7.99</span>
                    <span className="text-sm text-gray-500">/ month</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs text-gray-400">Annual Paid</span>
                    <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">($68/yr)</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">Next billing run: <span className="font-semibold text-gray-600">October 18, 2026</span> ($68.00)</p>

                  <div className="space-y-2.5 mb-6">
                    {[
                      "Unlimited guided drawing levels (Letters, Shapes, Animals, Numbers)",
                      "Up to 4 individual child profile easels with custom pacing",
                      "Weekly child developmental progress & grip stability reports",
                      "100% ad-free • Zero tracking • COPPA & FERPA certified safe",
                      "Unlimited high-res printables for analog coloring table work",
                    ].map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" weight="fill" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-900">Payment Method</span>
                      <button className="text-xs font-semibold text-green-600 hover:text-green-700">Change Card</button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-10 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">VISA</span>
                      </div>
                      <span className="text-sm text-gray-600">Visa ending in •••• 4289</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Expires 08/2026 • Default billing card</p>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                    <CreditCard className="h-4 w-4" weight="fill" />
                    Manage Payment &amp; Invoices
                  </button>
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <button className="text-xs text-gray-400 hover:text-gray-600 underline">Download PDF Invoices</button>
                    <button className="text-xs text-gray-400 hover:text-gray-600 underline">Pause or Cancel Plan</button>
                  </div>
                </motion.div>

                {/* Parent Gate & PIN Security */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Parent Gate &amp; PIN Security</h3>
                      <p className="text-xs text-gray-500">Prevents children from entering portal &amp; settings</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-900">Child Barrier Method</span>
                      <button className="text-xs font-semibold text-green-600 hover:text-green-700">Configure PIN</button>
                    </div>
                    <p className="text-xs text-gray-500">Currently: <span className="font-semibold text-gray-700">Word Multiplication Math Barrier</span></p>
                  </div>
                </motion.div>

                {/* Early Childhood Educator Advice */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <span className="text-lg">👩‍🏫</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Early Childhood Educator Advice</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Have questions about Leo&apos;s pencil grip, hand dominance, or focus threshold? Our certified pedagogical team is ready to review worksheets with you.
                  </p>
                  <button className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
                    <PencilLine className="h-4 w-4" />
                    Ask an Art Educator
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="h-12 bg-white border-t border-gray-200 flex items-center px-4 sm:px-6 shrink-0">
          <div className="flex-1 flex items-center gap-3">
            <Image src="/images/DrawKao_Logo.png" alt="Draw Kao" width={80} height={28} className="h-7 w-auto" />
            <span className="text-xs text-gray-400">© Draw Kao • Tactile Learning &amp; Creative Drawing for Early Learners.</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-xs text-gray-400 hover:text-gray-600">Parent Gate &amp; Guides</button>
            <button className="text-xs text-gray-400 hover:text-gray-600">Child Safety &amp; Privacy</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
