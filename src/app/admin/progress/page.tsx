"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChartLineUp,
  Star,
  CheckCircle,
  Clock,
  TrendUp,
  Users,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

interface ProgressEntry {
  id: string;
  child_id: string;
  item_id: string;
  category_id: string;
  stars_earned: number;
  completed: boolean;
  created_at: string;
  _itemName?: string;
  _categoryName?: string;
}

const categoryColors: Record<string, string> = {
  alphabet: "#2e7d32",
  fruits: "#e57373",
  animals: "#5c9ce6",
  shapes: "#f5a623",
  vehicles: "#e57373",
  numbers: "#9575cd",
  nature: "#4caf50",
};

const categoryEmojis: Record<string, string> = {
  alphabet: "🔤",
  fruits: "🍎",
  animals: "🐱",
  shapes: "⬡",
  vehicles: "🚗",
  numbers: "🔢",
  nature: "🌸",
};

export default function AdminProgressPage() {
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const supabase = createClient();

  useEffect(() => {
    async function fetchProgress() {
      const [progressRes, itemsRes, catsRes] = await Promise.all([
        supabase.from("user_progress").select("*").order("created_at", { ascending: false }),
        supabase.from("items").select("id, label, word, emoji"),
        supabase.from("categories").select("id, name, emoji"),
      ]);

      const itemsMap: Record<string, any> = {};
      (itemsRes.data || []).forEach((item: any) => { itemsMap[item.id] = item; });

      const catsMap: Record<string, any> = {};
      (catsRes.data || []).forEach((cat: any) => { catsMap[cat.id] = cat; });

      const enriched = (progressRes.data || []).map((p: any) => ({
        ...p,
        _itemName: itemsMap[p.item_id]?.label || itemsMap[p.item_id]?.word || p.item_id,
        _categoryName: catsMap[p.category_id]?.name || p.category_id,
      }));

      setProgress(enriched);
      setLoading(false);
    }
    fetchProgress();
  }, [supabase]);

  const totalCompletions = progress.filter((p) => p.completed).length;
  const totalStars = progress.reduce((sum, p) => sum + (p.stars_earned || 0), 0);
  const uniqueChildren = new Set(progress.map((p) => p.child_id).filter(Boolean)).size;

  const categoryStats: Record<string, { count: number; stars: number; name: string; emoji: string }> = {};
  progress.forEach((p) => {
    const cat = p.category_id || "unknown";
    if (!categoryStats[cat]) categoryStats[cat] = { count: 0, stars: 0, name: p._categoryName || cat, emoji: categoryEmojis[cat] || "📚" };
    if (p.completed) categoryStats[cat].count++;
    categoryStats[cat].stars += p.stars_earned || 0;
  });

  const totalPages = Math.ceil(progress.length / ITEMS_PER_PAGE);
  const paginated = progress.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Learning Progress</h1>
        <p className="text-gray-500 mt-1">Track how children are progressing through lessons</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Completions", value: totalCompletions, icon: CheckCircle, bg: "bg-green-50", color: "#2e7d32" },
          { label: "Stars Earned", value: totalStars, icon: Star, bg: "bg-amber-50", color: "#f5a623" },
          { label: "Active Children", value: uniqueChildren, icon: Users, bg: "bg-blue-50", color: "#5c9ce6" },
          { label: "Avg Stars/Lesson", value: totalCompletions > 0 ? (totalStars / totalCompletions).toFixed(1) : "0", icon: TrendUp, bg: "bg-purple-50", color: "#9575cd" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Progress by Category</h2>
        <div className="space-y-3">
          {Object.entries(categoryStats).map(([cat, stats]) => {
            const color = categoryColors[cat] || "#999";
            return (
              <div key={cat} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
                  style={{ backgroundColor: `${color}15` }}
                >
                  {stats.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{stats.name}</p>
                  <p className="text-xs text-gray-400">{stats.count} completions</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-400" weight="fill" />
                  <span className="text-sm font-semibold text-gray-700">{stats.stars}</span>
                </div>
              </div>
            );
          })}
          {Object.keys(categoryStats).length === 0 && !loading && (
            <div className="text-center py-10">
              <ChartLineUp className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No progress data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Completions Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">All Completions</h2>
        </div>

        <div className="grid grid-cols-[1fr_140px_100px_80px_120px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lesson</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Child</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stars</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20">
            <Clock className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No completions yet</p>
          </div>
        ) : (
          paginated.map((p, i) => {
            const color = categoryColors[p.category_id] || "#999";
            return (
              <motion.div
                key={p.id || i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="grid grid-cols-[1fr_140px_100px_80px_120px] gap-4 px-6 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors items-center"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" weight="fill" />
                  <span className="text-sm font-medium text-gray-800 truncate">{p._itemName}</span>
                </div>
                <div>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${color}15`, color }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                    {p._categoryName}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 truncate block">{p.child_id?.slice(0, 8) || "—"}</span>
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: Math.min(p.stars_earned || 0, 3) }).map((_, s) => (
                      <Star key={s} className="h-3 w-3 text-amber-400" weight="fill" />
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</span>
                </div>
              </motion.div>
            );
          })
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {((page - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(page * ITEMS_PER_PAGE, progress.length)} of {progress.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
              >
                &lt; Prev
              </button>
              <span className="text-sm font-semibold text-gray-700">{page}/{totalPages}</span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
              >
                Next &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
