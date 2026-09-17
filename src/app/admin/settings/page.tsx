"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Gear,
  Bell,
  Lock,
  Download,
  CheckCircle,
  Warning,
  Trash,
} from "@phosphor-icons/react";

interface SettingItem {
  label: string;
  key: string;
  value: boolean | string;
  type: "toggle" | "text" | "email" | "number";
}

interface SettingSection {
  title: string;
  icon: React.ElementType;
  items: SettingItem[];
}

const defaultSettings: SettingSection[] = [
  {
    title: "General",
    icon: Gear,
    items: [
      { label: "Platform Name", key: "platform_name", value: "Draw Kao", type: "text" },
      { label: "Tagline", key: "tagline", value: "Learn Through Drawing", type: "text" },
      { label: "Support Email", key: "support_email", value: "support@drawkao.com", type: "email" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { label: "Email Notifications", key: "email_notifications", value: true, type: "toggle" },
      { label: "Weekly Progress Reports", key: "weekly_reports", value: true, type: "toggle" },
      { label: "New User Alerts", key: "new_user_alerts", value: false, type: "toggle" },
    ],
  },
  {
    title: "Security",
    icon: Lock,
    items: [
      { label: "Require Email Verification", key: "email_verification", value: true, type: "toggle" },
      { label: "Two-Factor Authentication", key: "two_factor", value: false, type: "toggle" },
      { label: "Session Timeout (minutes)", key: "session_timeout", value: "60", type: "number" },
    ],
  },
];

function loadSettings(): SettingSection[] {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const saved = localStorage.getItem("dk_admin_settings");
    if (saved) return JSON.parse(saved);
  } catch {}
  return defaultSettings;
}

function saveSettings(settings: SettingSection[]) {
  try {
    localStorage.setItem("dk_admin_settings", JSON.stringify(settings));
  } catch {}
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingSection[]>(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setMounted(true);
  }, []);

  const handleToggle = (sectionIdx: number, itemIdx: number) => {
    setSettings((prev) => {
      const next = [...prev];
      const section = { ...next[sectionIdx] };
      const items = [...section.items];
      const item = { ...items[itemIdx] };
      item.value = !item.value;
      items[itemIdx] = item;
      section.items = items;
      next[sectionIdx] = section;
      return next;
    });
  };

  const handleTextChange = (sectionIdx: number, itemIdx: number, value: string) => {
    setSettings((prev) => {
      const next = [...prev];
      const section = { ...next[sectionIdx] };
      const items = [...section.items];
      const item = { ...items[itemIdx] };
      item.value = value;
      items[itemIdx] = item;
      section.items = items;
      next[sectionIdx] = section;
      return next;
    });
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!mounted) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Configure your Draw Kao platform</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm"
        >
          {saved ? (
            <>
              <CheckCircle className="h-4 w-4" weight="fill" />
              Saved!
            </>
          ) : (
            <>
              <Download className="h-4 w-4" weight="bold" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settings.map((section, sectionIdx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIdx * 0.05 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
          >
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
              <section.icon className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {section.items.map((item, itemIdx) => (
                <div key={item.key} className="px-6 py-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  {item.type === "toggle" ? (
                    <button
                      onClick={() => handleToggle(sectionIdx, itemIdx)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        item.value ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                        style={{ left: item.value ? "22px" : "2px" }}
                      />
                    </button>
                  ) : (
                    <input
                      type={item.type}
                      value={item.value as string}
                      onChange={(e) => handleTextChange(sectionIdx, itemIdx, e.target.value)}
                      className="h-10 w-64 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-red-200 overflow-hidden"
        >
          <div className="px-6 py-4 bg-red-50 border-b border-red-200 flex items-center gap-3">
            <Warning className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Reset All Settings</p>
                <p className="text-xs text-gray-400">Restore all settings to their default values</p>
              </div>
              <button
                onClick={() => {
                  setSettings(defaultSettings);
                  saveSettings(defaultSettings);
                }}
                className="px-4 py-2 bg-orange-100 text-orange-700 font-semibold rounded-xl text-sm hover:bg-orange-200 transition-colors"
              >
                Reset to Default
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Reset All Progress</p>
                <p className="text-xs text-gray-400">This will clear all child progress data</p>
              </div>
              <button className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-xl text-sm hover:bg-red-200 transition-colors flex items-center gap-2">
                <Trash className="h-3 w-3" />
                Reset
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
