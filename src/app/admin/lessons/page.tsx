"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlass,
  Plus,
  Download,
  Funnel,
  ArrowDown,
  ArrowUp,
  BookOpen,
  CheckCircle,
  PencilSimple,
  Warning,
  X,
  Trash,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import type { Category, Item } from "@/types/database";

const ITEMS_PER_PAGE = 7;

const categoryColors: Record<string, string> = {
  alphabet: "#2e7d32",
  fruits: "#e57373",
  animals: "#5c9ce6",
  shapes: "#f5a623",
  vehicles: "#e57373",
  numbers: "#9575cd",
  nature: "#4caf50",
};

interface ItemWithMeta extends Item {
  _stepsCount: number;
  _completionCount: number;
}

interface LessonForm {
  id: string;
  label: string;
  slug: string;
  emoji: string;
  word: string;
  pronunciation: string;
  category_id: string;
  color: string;
  sort_order: number;
}

export default function AdminLessonsPage() {
  const [items, setItems] = useState<ItemWithMeta[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState<"label" | "category_id">("label");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemWithMeta | null>(null);
  const [form, setForm] = useState<LessonForm>({ id: "", label: "", slug: "", emoji: "📝", word: "", pronunciation: "", category_id: "", color: "#2e7d32", sort_order: 0 });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const supabase = createClient();

  async function fetchData() {
    const [itemsRes, catsRes, stepsRes, progressRes] = await Promise.all([
      supabase.from("items").select("*").order("sort_order", { ascending: true }),
      supabase.from("categories").select("*").order("sort_order", { ascending: true }),
      supabase.from("drawing_steps").select("item_id"),
      supabase.from("user_progress").select("item_id, completed"),
    ]);

    const stepsData = stepsRes.data || [];
    const progressData = progressRes.data || [];

    const stepsCounts: Record<string, number> = {};
    stepsData.forEach((s: any) => {
      stepsCounts[s.item_id] = (stepsCounts[s.item_id] || 0) + 1;
    });

    const completionCounts: Record<string, number> = {};
    progressData.forEach((p: any) => {
      if (p.completed) {
        completionCounts[p.item_id] = (completionCounts[p.item_id] || 0) + 1;
      }
    });

    const enriched = (itemsRes.data || []).map((item: Item) => ({
      ...item,
      _stepsCount: stepsCounts[item.id] || (item.drawing_steps?.length || 0),
      _completionCount: completionCounts[item.id] || 0,
    }));

    setItems(enriched);
    setCategories(catsRes.data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function openAdd() {
    setEditingItem(null);
    setForm({ id: "", label: "", slug: "", emoji: "📝", word: "", pronunciation: "", category_id: categories[0]?.id || "", color: "#2e7d32", sort_order: items.length });
    setShowModal(true);
  }

  function openEdit(item: ItemWithMeta) {
    setEditingItem(item);
    setForm({ id: item.id, label: item.label || "", slug: item.slug || "", emoji: item.emoji || "📝", word: item.word || "", pronunciation: item.pronunciation || "", category_id: item.category_id, color: item.color || "#2e7d32", sort_order: item.sort_order || 0 });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.label.trim() || !form.category_id) return;
    setSaving(true);
    const slug = form.slug || form.label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const id = editingItem ? editingItem.id : form.id || slug;

    if (editingItem) {
      await supabase.from("items").update({ label: form.label, slug, emoji: form.emoji, word: form.word, pronunciation: form.pronunciation, category_id: form.category_id, color: form.color, sort_order: form.sort_order }).eq("id", editingItem.id);
    } else {
      await supabase.from("items").insert({ id, label: form.label, slug, emoji: form.emoji, word: form.word, pronunciation: form.pronunciation, category_id: form.category_id, color: form.color, sort_order: form.sort_order, drawing_steps: [] });
    }
    setShowModal(false);
    setSaving(false);
    fetchData();
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await supabase.from("items").delete().eq("id", id);
    setDeleting(null);
    setConfirmDelete(null);
    fetchData();
  }

  const categoryMap = useMemo(() => {
    const map: Record<string, Category> = {};
    categories.forEach((c) => (map[c.id] = c));
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    let result = items;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.label?.toLowerCase().includes(q) ||
          item.slug?.toLowerCase().includes(q) ||
          item.word?.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((item) => item.category_id === categoryFilter);
    }

    result.sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      if (sortDir === "asc") return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    });

    return result;
  }, [items, search, categoryFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalLessons = items.length;
  const totalCompletions = items.reduce((sum, item) => sum + item._completionCount, 0);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
        Curriculum Studio / Core Modules
      </p>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Lessons</h1>
          <p className="text-gray-500 mt-1">
            Create, edit, and organize guided drawing lessons across categories.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
            <Download className="h-4 w-4" />
            Export Catalog
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm">
            <Plus className="h-4 w-4" weight="bold" />
            + Add Lesson
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Lessons", value: totalLessons, sub: `${totalLessons} ready for audit`, icon: BookOpen, bg: "bg-blue-50", color: "#5c9ce6" },
          { label: "Published", value: totalLessons, sub: `Across ${categories.length} modules`, icon: CheckCircle, bg: "bg-green-50", color: "#2e7d32" },
          { label: "Drafts", value: 0, sub: "0 pending audio", icon: PencilSimple, bg: "bg-orange-50", color: "#f5a623" },
          { label: "Total Completions", value: totalCompletions, sub: "Across all lessons", icon: Warning, bg: "bg-red-50", color: "#e57373" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
              <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search lessons, letters, or words..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <Funnel className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">Sort by:</span>
            <button
              onClick={() => {
                if (sortField === "label") {
                  setSortDir(sortDir === "asc" ? "desc" : "asc");
                } else {
                  setSortField("label");
                  setSortDir("asc");
                }
              }}
              className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors"
            >
              Alphabetical
              {sortField === "label" && (sortDir === "asc" ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />)}
            </button>
          </div>
        </div>
      </div>

      {/* Lessons Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_140px_120px_80px_100px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lesson</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Steps</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Completions</span>
        </div>

        {/* Table Body */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No lessons found</p>
          </div>
        ) : (
          paginated.map((item, i) => {
            const cat = categoryMap[item.category_id];
            const color = categoryColors[item.category_id] || "#999";
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-[1fr_140px_120px_80px_100px] gap-4 px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors items-center"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{item.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.label || item.word}</p>
                    <p className="text-xs text-gray-400 truncate">
                      Prompt: &quot;{item.pronunciation || item.word}&quot;
                    </p>
                  </div>
                </div>
                <div>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${color}15`, color }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                    {cat?.name || item.category_id}
                  </span>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                    <CheckCircle className="h-3 w-3" weight="fill" />
                    Published
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">{item._stepsCount} steps</span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-800">{item._completionCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(item)} className="h-7 w-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                    <PencilSimple className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                  <button onClick={() => setConfirmDelete(item.id)} className="h-7 w-7 rounded-lg hover:bg-red-50 flex items-center justify-center">
                    <Trash className="h-3.5 w-3.5 text-red-400" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {((page - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} lessons
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              &lt; Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-8 w-8 rounded-lg text-sm font-bold transition-colors ${
                  p === page
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next &gt;
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                <Warning className="h-5 w-5 text-red-600" weight="fill" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Delete Lesson</h3>
                <p className="text-xs text-gray-500">This cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">Are you sure you want to delete this lesson?</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} disabled={deleting === confirmDelete}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50">
                {deleting === confirmDelete ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">{editingItem ? "Edit Lesson" : "Add Lesson"}</h2>
              <button onClick={() => setShowModal(false)} className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Label</label>
                <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Apple"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Emoji</label>
                  <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40">
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Word</label>
                  <input value={form.word} onChange={(e) => setForm({ ...form, word: e.target.value })} placeholder="e.g. apple"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pronunciation</label>
                  <input value={form.pronunciation} onChange={(e) => setForm({ ...form, pronunciation: e.target.value })} placeholder="e.g. A-P-L"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.label.trim()}
                className="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50">
                {saving ? "Saving..." : editingItem ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
