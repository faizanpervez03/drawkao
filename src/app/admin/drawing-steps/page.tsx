"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PencilLine,
  Plus,
  PencilSimple,
  Trash,
  ArrowUp,
  ArrowDown,
  X,
  Check,
  Warning,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

interface DrawingStep {
  id: string;
  item_id: string;
  step_number: number;
  instruction: string;
  hint: string;
  _itemName?: string;
  _itemEmoji?: string;
}

interface StepForm {
  item_id: string;
  step_number: number;
  instruction: string;
  hint: string;
}

interface ItemOption {
  id: string;
  label: string;
  emoji: string;
}

export default function AdminDrawingStepsPage() {
  const [steps, setSteps] = useState<DrawingStep[]>([]);
  const [items, setItems] = useState<ItemOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStep, setEditingStep] = useState<DrawingStep | null>(null);
  const [form, setForm] = useState<StepForm>({ item_id: "", step_number: 1, instruction: "", hint: "" });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const supabase = createClient();

  async function fetchData() {
    const [stepsRes, itemsRes] = await Promise.all([
      supabase.from("drawing_steps").select("*").order("item_id", { ascending: true }).order("step_number", { ascending: true }),
      supabase.from("items").select("id, label, word, emoji"),
    ]);

    const itemsMap: Record<string, any> = {};
    (itemsRes.data || []).forEach((item: any) => { itemsMap[item.id] = item; });

    const enriched = (stepsRes.data || []).map((step: any) => ({
      ...step,
      _itemName: itemsMap[step.item_id]?.label || itemsMap[step.item_id]?.word || step.item_id,
      _itemEmoji: itemsMap[step.item_id]?.emoji || "📝",
    }));

    setSteps(enriched);
    setItems((itemsRes.data || []).map((i: any) => ({ id: i.id, label: i.label || i.word, emoji: i.emoji || "📝" })));
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  function openAddForItem(itemId: string) {
    const itemSteps = steps.filter((s) => s.item_id === itemId);
    setEditingStep(null);
    setForm({ item_id: itemId, step_number: itemSteps.length + 1, instruction: "", hint: "" });
    setShowModal(true);
  }

  function openAddGlobal() {
    setEditingStep(null);
    setForm({ item_id: items[0]?.id || "", step_number: 1, instruction: "", hint: "" });
    setShowModal(true);
  }

  function openEdit(step: DrawingStep) {
    setEditingStep(step);
    setForm({ item_id: step.item_id, step_number: step.step_number, instruction: step.instruction, hint: step.hint || "" });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.instruction.trim() || !form.item_id) return;
    setSaving(true);

    if (editingStep) {
      await supabase.from("drawing_steps").update({ instruction: form.instruction, hint: form.hint, step_number: form.step_number }).eq("id", editingStep.id);
    } else {
      await supabase.from("drawing_steps").insert({ item_id: form.item_id, step_number: form.step_number, instruction: form.instruction, hint: form.hint });
    }

    setShowModal(false);
    setSaving(false);
    fetchData();
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await supabase.from("drawing_steps").delete().eq("id", id);
    setDeleting(null);
    setConfirmDelete(null);
    fetchData();
  }

  async function handleMove(step: DrawingStep, direction: "up" | "down") {
    const itemSteps = steps.filter((s) => s.item_id === step.item_id).sort((a, b) => a.step_number - b.step_number);
    const idx = itemSteps.findIndex((s) => s.id === step.id);
    if (direction === "up" && idx > 0) {
      const other = itemSteps[idx - 1];
      await supabase.from("drawing_steps").update({ step_number: other.step_number }).eq("id", step.id);
      await supabase.from("drawing_steps").update({ step_number: step.step_number }).eq("id", other.id);
    } else if (direction === "down" && idx < itemSteps.length - 1) {
      const other = itemSteps[idx + 1];
      await supabase.from("drawing_steps").update({ step_number: other.step_number }).eq("id", step.id);
      await supabase.from("drawing_steps").update({ step_number: step.step_number }).eq("id", other.id);
    }
    fetchData();
  }

  const grouped = steps.reduce<Record<string, DrawingStep[]>>((acc, step) => {
    if (!acc[step.item_id]) acc[step.item_id] = [];
    acc[step.item_id].push(step);
    return acc;
  }, {});

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Drawing Steps</h1>
          <p className="text-gray-500 mt-1">Manage step-by-step drawing instructions for each lesson</p>
        </div>
        <button onClick={openAddGlobal} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm">
          <Plus className="h-4 w-4" weight="bold" />
          Add Step
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Steps</p>
          <p className="text-3xl font-extrabold text-gray-900">{steps.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Lessons with Steps</p>
          <p className="text-3xl font-extrabold text-gray-900">{Object.keys(grouped).length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Avg Steps per Lesson</p>
          <p className="text-3xl font-extrabold text-gray-900">
            {Object.keys(grouped).length > 0 ? (steps.length / Object.keys(grouped).length).toFixed(1) : "0"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <PencilLine className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No drawing steps yet</p>
          <p className="text-sm text-gray-400 mt-1">Add steps to help children learn how to draw</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([itemId, itemSteps], i) => {
            const sorted = itemSteps.sort((a, b) => a.step_number - b.step_number);
            const firstStep = sorted[0];
            return (
              <motion.div key={itemId} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{firstStep._itemEmoji}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{firstStep._itemName}</p>
                      <p className="text-xs text-gray-400">{sorted.length} steps</p>
                    </div>
                  </div>
                  <button onClick={() => openAddForItem(itemId)} className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
                    <Plus className="h-3 w-3" />
                    Add Step
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {sorted.map((step) => (
                    <div key={step.id} className="px-6 py-3 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                      <span className="h-7 w-7 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {step.step_number}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{step.instruction}</p>
                        {step.hint && <p className="text-xs text-gray-400 mt-0.5">Hint: {step.hint}</p>}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => handleMove(step, "up")} className="h-7 w-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                          <ArrowUp className="h-3 w-3 text-gray-400" />
                        </button>
                        <button onClick={() => handleMove(step, "down")} className="h-7 w-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                          <ArrowDown className="h-3 w-3 text-gray-400" />
                        </button>
                        <button onClick={() => openEdit(step)} className="h-7 w-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                          <PencilSimple className="h-3 w-3 text-gray-400" />
                        </button>
                        <button onClick={() => setConfirmDelete(step.id)} className="h-7 w-7 rounded-lg hover:bg-red-50 flex items-center justify-center">
                          <Trash className="h-3 w-3 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
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
                <h3 className="font-bold text-gray-900">Delete Step</h3>
                <p className="text-xs text-gray-500">This cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">Are you sure you want to delete this step?</p>
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
              <h2 className="text-lg font-bold text-gray-900">{editingStep ? "Edit Step" : "Add Step"}</h2>
              <button onClick={() => setShowModal(false)} className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Lesson</label>
                <select value={form.item_id} onChange={(e) => setForm({ ...form, item_id: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40">
                  {items.map((item) => <option key={item.id} value={item.id}>{item.emoji} {item.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Step Number</label>
                  <input type="number" min="1" value={form.step_number} onChange={(e) => setForm({ ...form, step_number: parseInt(e.target.value) || 1 })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40" />
                </div>
                <div />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Instruction</label>
                <textarea rows={3} value={form.instruction} onChange={(e) => setForm({ ...form, instruction: e.target.value })} placeholder="e.g. Draw a large circle for the body"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Hint (optional)</label>
                <input value={form.hint} onChange={(e) => setForm({ ...form, hint: e.target.value })} placeholder="e.g. Make it round like a ball"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40" />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.instruction.trim()}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50">
                <Check className="h-3.5 w-3.5" />
                {saving ? "Saving..." : editingStep ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
