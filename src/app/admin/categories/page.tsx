"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  PencilSimple,
  Trash,
  ArrowRight,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types/database";

const categoryColors: Record<string, string> = {
  alphabet: "#2e7d32",
  fruits: "#e57373",
  animals: "#5c9ce6",
  shapes: "#f5a623",
  vehicles: "#e57373",
  numbers: "#9575cd",
  nature: "#4caf50",
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: cats } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
      const { data: items } = await supabase.from("items").select("category_id");

      const counts: Record<string, number> = {};
      (items || []).forEach((item: any) => {
        counts[item.category_id] = (counts[item.category_id] || 0) + 1;
      });

      setCategories(cats || []);
      setItemCounts(counts);
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">Organize your lessons into learning modules</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm">
          <Plus className="h-4 w-4" weight="bold" />
          Add Category
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Categories</p>
          <p className="text-3xl font-extrabold text-gray-900">{categories.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Lessons</p>
          <p className="text-3xl font-extrabold text-gray-900">{Object.values(itemCounts).reduce((a, b) => a + b, 0)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Avg Lessons/Category</p>
          <p className="text-3xl font-extrabold text-gray-900">
            {categories.length > 0 ? (Object.values(itemCounts).reduce((a, b) => a + b, 0) / categories.length).toFixed(1) : "0"}
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => {
            const color = categoryColors[cat.id] || "#999";
            const count = itemCounts[cat.id] || 0;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="h-14 w-14 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    {cat.emoji || "📚"}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                      <PencilSimple className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="h-8 w-8 rounded-lg hover:bg-red-50 flex items-center justify-center">
                      <Trash className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{count} lessons</p>
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${color}15`, color }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                    Active
                  </span>
                  <Link
                    href={`/learn/${cat.id}`}
                    className="flex items-center gap-1 text-sm font-semibold text-gray-400 hover:text-green-600 transition-colors"
                  >
                    View
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
