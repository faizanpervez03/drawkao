"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, PencilSimple, Trash, ArrowRight, X, Check, Warning } from "@phosphor-icons/react";
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

interface CategoryForm {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  sort_order: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryForm | null>(null);
  const [form, setForm] = useState<CategoryForm>({ id: "", name: "", description: "", emoji: "📚", color: "#2e7d32", sort_order: 0 });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const supabase = createClient();

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

  useEffect(() => { fetchData(); }, []);

  function openAdd() {
    setEditingCat(null);
    setForm({ id: "", name: "", description: "", emoji: "📚", color: "#2e7d32", sort_order: categories.length });
    setShowModal(true);
  }

  function openEdit(cat: Category) {
    setEditingCat(cat);
    setForm({ id: cat.id, name: cat.name, description: cat.description || "", emoji: cat.emoji || "📚", color: cat.color || "#2e7d32", sort_order: cat.sort_order || 0 });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);

    if (editingCat) {
      await supabase.from("categories").update({ name: form.name, description: form.description, emoji: form.emoji, color: form.color, sort_order: form.sort_order }).eq("id", editingCat.id);
    } else {
      await supabase.from("categories").insert({ id: form.id || form.name.toLowerCase().replace(/\s+/g, "_"), name: form.name, description: form.description, emoji: form.emoji, color: form.color, sort_order: form.sort_order, is_recommended: false });
    }

    setShowModal(false);
    setSaving(false);
    fetchData();
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await supabase.from("categories").delete().eq("id", id);
    setDeleting(null);
    setConfirmDelete(null);
    fetchData();
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">Organize your lessons into learning modules</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm">
          <Plus className="h-4 w-4" weight="bold" />
          Add Category
        </button>
      </div>

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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => {
            const color = categoryColors[cat.id] || cat.color || "#999";
            const count = itemCounts[cat.id] || 0;
            return (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: `${color}15` }}>
                    {cat.emoji || "📚"}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(cat)} className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                      <PencilSimple className="h-4 w-4 text-gray-500" />
                    </button>
                    <button onClick={() => setConfirmDelete(cat.id)} className="h-8 w-8 rounded-lg hover:bg-red-50 flex items-center justify-center">
                      <Trash className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{count} lessons</p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${color}15`, color }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                    Active
                  </span>
                  <Link href={`/learn/${cat.id}`} className="flex items-center gap-1 text-sm font-semibold text-gray-400 hover:text-green-600 transition-colors">
                    View<ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
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
                <h3 className="font-bold text-gray-900">Delete Category</h3>
                <p className="text-xs text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">Are you sure? All lessons in this category will also be deleted.</p>
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
              <h2 className="text-lg font-bold text-gray-900">{editingCat ? "Edit Category" : "Add Category"}</h2>
              <button onClick={() => setShowModal(false)} className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              {!editingCat && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">ID (URL slug)</label>
                  <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="e.g. fruits"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40" />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Fruits"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Draw & discover yummy fruits"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Emoji</label>
                  <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="h-9 w-9 rounded-lg border border-gray-200 cursor-pointer" />
                    <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name.trim()}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50">
                <Check className="h-3.5 w-3.5" />
                {saving ? "Saving..." : editingCat ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
