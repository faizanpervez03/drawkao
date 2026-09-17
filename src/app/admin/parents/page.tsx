"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  MagnifyingGlass,
  Plus,
  EnvelopeSimple,
  Phone,
  Clock,
  Eye,
  Trash,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

interface ParentAccount {
  id: string;
  email: string;
  created_at: string;
  last_sign_in: string | null;
  child_count: number;
}

export default function AdminParentsPage() {
  const [parents, setParents] = useState<ParentAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function fetchParents() {
      const { data: profiles } = await supabase
        .from("child_profiles")
        .select("id, parent_id, created_at");

      const parentMap: Record<string, ParentAccount> = {};
      (profiles || []).forEach((p: any) => {
        if (!parentMap[p.parent_id]) {
          parentMap[p.parent_id] = {
            id: p.parent_id,
            email: `${p.parent_id.slice(0, 8)}...`,
            created_at: p.created_at,
            last_sign_in: null,
            child_count: 0,
          };
        }
        parentMap[p.parent_id].child_count++;
      });

      setParents(Object.values(parentMap));
      setLoading(false);
    }
    fetchParents();
  }, [supabase]);

  const filtered = parents.filter(
    (p) =>
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Parents</h1>
          <p className="text-gray-500 mt-1">Manage parent accounts and their children</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm">
          <Plus className="h-4 w-4" weight="bold" />
          Add Parent
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="relative max-w-md">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search parents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
          />
        </div>
      </div>

      {/* Parents Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-[1fr_140px_100px_100px_80px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Parent</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Joined</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Children</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No parents found</p>
          </div>
        ) : (
          filtered.map((parent, i) => (
            <motion.div
              key={parent.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-[1fr_140px_100px_100px_80px] gap-4 px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors items-center"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{parent.email}</p>
                  <p className="text-xs text-gray-400 truncate">ID: {parent.id.slice(0, 12)}...</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {new Date(parent.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
                  <Users className="h-3 w-3" />
                  {parent.child_count}
                </span>
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                  Active
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-gray-500" />
                </button>
                <button className="h-8 w-8 rounded-lg hover:bg-red-50 flex items-center justify-center">
                  <Trash className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
