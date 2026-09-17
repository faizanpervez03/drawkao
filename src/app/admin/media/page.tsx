"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Image,
  Upload,
  MagnifyingGlass,
  GridFour,
  List,
  Trash,
  Download,
  Eye,
} from "@phosphor-icons/react";

const mockMedia = [
  { name: "apple.webp", type: "image", size: "24 KB", category: "Fruits", date: "2024-01-15" },
  { name: "cat.jpg", type: "image", size: "31 KB", category: "Animals", date: "2024-01-15" },
  { name: "shapes.jpg", type: "image", size: "28 KB", category: "Shapes", date: "2024-01-15" },
  { name: "car.jpg", type: "image", size: "22 KB", category: "Vehicles", date: "2024-01-15" },
  { name: "abc.avif", type: "image", size: "35 KB", category: "Alphabet", date: "2024-01-15" },
  { name: "nature.jpg", type: "image", size: "29 KB", category: "Nature", date: "2024-01-15" },
  { name: "hero_section_img.png", type: "image", size: "156 KB", category: "Homepage", date: "2024-01-15" },
  { name: "DrawKao_Logo.png", type: "image", size: "45 KB", category: "Brand", date: "2024-01-15" },
];

export default function AdminMediaPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  const filtered = mockMedia.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Media Library</h1>
          <p className="text-gray-500 mt-1">Manage images, icons, and assets</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm">
          <Upload className="h-4 w-4" weight="bold" />
          Upload File
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex items-center gap-3">
        <div className="flex-1 relative max-w-md">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
          />
        </div>
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setView("grid")}
            className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors ${view === "grid" ? "bg-white shadow-sm text-green-600" : "text-gray-400"}`}
          >
            <GridFour className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors ${view === "list" ? "bg-white shadow-sm text-green-600" : "text-gray-400"}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((file, i) => (
            <motion.div
              key={file.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <Image className="h-10 w-10 text-gray-300" />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{file.size} • {file.category}</p>
              </div>
              <div className="px-3 pb-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="h-7 w-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                  <Eye className="h-3.5 w-3.5 text-gray-500" />
                </button>
                <button className="h-7 w-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                  <Download className="h-3.5 w-3.5 text-gray-500" />
                </button>
                <button className="h-7 w-7 rounded-lg hover:bg-red-50 flex items-center justify-center">
                  <Trash className="h-3.5 w-3.5 text-red-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-[1fr_80px_120px_100px_80px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">File</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Size</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</span>
          </div>
          {filtered.map((file, i) => (
            <div key={file.name} className="grid grid-cols-[1fr_80px_120px_100px_80px] gap-4 px-6 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors items-center">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <Image className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
              </div>
              <span className="text-sm text-gray-500">{file.size}</span>
              <span className="text-sm text-gray-500">{file.category}</span>
              <span className="text-sm text-gray-500">{file.date}</span>
              <div className="flex items-center gap-1">
                <button className="h-7 w-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                  <Eye className="h-3.5 w-3.5 text-gray-500" />
                </button>
                <button className="h-7 w-7 rounded-lg hover:bg-red-50 flex items-center justify-center">
                  <Trash className="h-3.5 w-3.5 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
