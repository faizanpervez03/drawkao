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

export default function AdminDrawingStepsPage() {
  const [steps, setSteps] = useState<DrawingStep[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchSteps() {
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
      setLoading(false);
    }
    fetchSteps();
  }, [supabase]);

  const grouped = steps.reduce<Record<string, DrawingStep[]>>((acc, step) => {
    if (!acc[step.item_id]) acc[step.item_id] = [];
    acc[step.item_id].push(step);
    return acc;
  }, {});

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Drawing Steps</h1>
          <p className="text-gray-500 mt-1">Manage step-by-step drawing instructions for each lesson</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm">
          <Plus className="h-4 w-4" weight="bold" />
          Add Step
        </button>
      </div>

      {/* Stats */}
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

      {/* Steps by Item */}
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
            const firstStep = itemSteps[0];
            return (
              <motion.div
                key={itemId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              >
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{firstStep._itemEmoji}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{firstStep._itemName}</p>
                      <p className="text-xs text-gray-400">{itemSteps.length} steps</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
                    <Plus className="h-3 w-3" />
                    Add Step
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {itemSteps.map((step) => (
                    <div key={step.id} className="px-6 py-3 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                      <span className="h-7 w-7 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {step.step_number}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{step.instruction}</p>
                        {step.hint && <p className="text-xs text-gray-400 mt-0.5">Hint: {step.hint}</p>}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button className="h-7 w-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                          <ArrowUp className="h-3 w-3 text-gray-400" />
                        </button>
                        <button className="h-7 w-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                          <ArrowDown className="h-3 w-3 text-gray-400" />
                        </button>
                        <button className="h-7 w-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                          <PencilSimple className="h-3 w-3 text-gray-400" />
                        </button>
                        <button className="h-7 w-7 rounded-lg hover:bg-red-50 flex items-center justify-center">
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
    </div>
  );
}
