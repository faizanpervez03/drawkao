"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  ChartLineUp,
  TrendUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
  Star,
  Smiley,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

interface Stats {
  totalCategories: number;
  totalItems: number;
  totalCompletions: number;
  totalStars: number;
  uniqueChildren: number;
  avgStars: string;
  recentActivity: { text: string; time: string; item: string; stars: number }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalCategories: 0,
    totalItems: 0,
    totalCompletions: 0,
    totalStars: 0,
    uniqueChildren: 0,
    avgStars: "0",
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      const [catRes, itemsRes, progressRes] = await Promise.all([
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase.from("items").select("*", { count: "exact", head: true }),
        supabase.from("user_progress").select("*").order("created_at", { ascending: false }),
      ]);

      const progressData = progressRes.data || [];
      const completedEntries = progressData.filter((p: any) => p.completed);
      const totalStars = progressData.reduce((sum: number, p: any) => sum + (p.stars_earned || p.stars || 0), 0);
      const uniqueChildren = new Set(progressData.map((p: any) => p.child_id || p.user_id).filter(Boolean)).size;
      const avgStars = completedEntries.length > 0 ? (totalStars / completedEntries.length).toFixed(1) : "0";

      const recentItems = progressData.slice(0, 8).map((p: any) => ({
        text: `Lesson completed`,
        time: new Date(p.updated_at || p.created_at).toLocaleDateString(),
        item: p.item_id || "Unknown",
        stars: p.stars_earned || p.stars || 0,
      }));

      setStats({
        totalCategories: catRes.count || 0,
        totalItems: itemsRes.count || 0,
        totalCompletions: completedEntries.length,
        totalStars,
        uniqueChildren,
        avgStars,
        recentActivity: recentItems.length > 0 ? recentItems : [
          { text: "No activity yet", time: "Just now", item: "—", stars: 0 },
        ],
      });
      setLoading(false);
    }

    fetchStats();
  }, [supabase]);

  const statCards = [
    {
      label: "Total Categories",
      value: stats.totalCategories,
      icon: BookOpen,
      color: "#2e7d32",
      bg: "bg-green-50",
      change: "Across platform",
    },
    {
      label: "Total Lessons",
      value: stats.totalItems,
      icon: CheckCircle,
      color: "#5c9ce6",
      bg: "bg-blue-50",
      change: "Published content",
    },
    {
      label: "Completions",
      value: stats.totalCompletions,
      icon: ChartLineUp,
      color: "#f5a623",
      bg: "bg-orange-50",
      change: "All time",
    },
    {
      label: "Active Learners",
      value: stats.uniqueChildren,
      icon: Users,
      color: "#9575cd",
      bg: "bg-purple-50",
      change: "Unique accounts",
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6" style={{ color: stat.color }} weight="duotone" />
              </div>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {stat.change}
              </span>
            </div>
            <p className="text-3xl font-extrabold text-gray-900">
              {loading ? "—" : stat.value}
            </p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {stats.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                <div className="h-9 w-9 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{activity.item}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
                {activity.stars > 0 && (
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Star className="h-3 w-3 text-amber-400" weight="fill" />
                    <span className="text-xs font-semibold text-gray-600">{activity.stars}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Platform Health</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <TrendUp className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Content Status</span>
              </div>
              <span className="text-sm font-bold text-green-700">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-blue-600" weight="fill" />
                <span className="text-sm font-medium text-gray-700">Avg Stars per Lesson</span>
              </div>
              <span className="text-sm font-bold text-blue-700">{stats.avgStars}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
              <div className="flex items-center gap-3">
                <ArrowUpRight className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">Completion Rate</span>
              </div>
              <span className="text-sm font-bold text-orange-700">
                {stats.totalItems > 0 ? Math.round((stats.totalCompletions / stats.totalItems) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Smiley className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Total Stars Earned</span>
              </div>
              <span className="text-sm font-bold text-purple-700">{stats.totalStars}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
