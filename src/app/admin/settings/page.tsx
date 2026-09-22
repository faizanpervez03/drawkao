"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gear, Bell, Lock, Download, CheckCircle, Warning, Trash } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

const defaultSettings = {
  platform_name: "Draw Kao",
  tagline: "Learn Through Drawing",
  support_email: "support@drawkao.com",
  email_notifications: true,
  weekly_reports: true,
  new_user_alerts: false,
  email_verification: true,
  two_factor: false,
  session_timeout: "60",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from("admin_settings").select("key, value").limit(50);
      if (data && data.length > 0) {
        const loaded = { ...defaultSettings };
        data.forEach((s: any) => {
          if (s.key in loaded) {
            if (typeof loaded[s.key as keyof typeof loaded] === "boolean") {
              (loaded as any)[s.key] = s.value === "true";
            } else {
              (loaded as any)[s.key] = s.value;
            }
          }
        });
        setSettings(loaded);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value: String(value),
    }));

    for (const item of updates) {
      await supabase
        .from("admin_settings")
        .upsert({ key: item.key, value: item.value }, { onConflict: "key" });
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = async () => {
    setResetting(true);
    for (const [key, value] of Object.entries(defaultSettings)) {
      await supabase
        .from("admin_settings")
        .upsert({ key, value: String(value) }, { onConflict: "key" });
    }
    setSettings(defaultSettings);
    setResetting(false);
  };

  if (loading) {
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Configure your Draw Kao platform</p>
        </div>
        <button onClick={handleSave}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm">
          {saved ? (
            <><CheckCircle className="h-4 w-4" weight="fill" /> Saved!</>
          ) : (
            <><Download className="h-4 w-4" weight="bold" /> Save Changes</>
          )}
        </button>
      </div>

      <div className="space-y-6">
        {/* General */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
            <Gear className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">General</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { key: "platform_name" as const, label: "Platform Name" },
              { key: "tagline" as const, label: "Tagline" },
              { key: "support_email" as const, label: "Support Email" },
            ].map((item) => (
              <div key={item.key} className="px-6 py-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <input type="text" value={settings[item.key]}
                  onChange={(e) => setSettings({ ...settings, [item.key]: e.target.value })}
                  className="h-10 w-64 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
            <Bell className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { key: "email_notifications" as const, label: "Email Notifications" },
              { key: "weekly_reports" as const, label: "Weekly Progress Reports" },
              { key: "new_user_alerts" as const, label: "New User Alerts" },
            ].map((item) => (
              <div key={item.key} className="px-6 py-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <button onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
                  className={`relative h-6 w-11 rounded-full transition-colors ${settings[item.key] ? "bg-green-500" : "bg-gray-300"}`}>
                  <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                    style={{ left: settings[item.key] ? "22px" : "2px" }} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
            <Lock className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">Security</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { key: "email_verification" as const, label: "Require Email Verification" },
              { key: "two_factor" as const, label: "Two-Factor Authentication" },
            ].map((item) => (
              <div key={item.key} className="px-6 py-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <button onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
                  className={`relative h-6 w-11 rounded-full transition-colors ${settings[item.key] ? "bg-green-500" : "bg-gray-300"}`}>
                  <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                    style={{ left: settings[item.key] ? "22px" : "2px" }} />
                </button>
              </div>
            ))}
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Session Timeout (minutes)</span>
              <input type="number" min="5" max="480" value={settings.session_timeout}
                onChange={(e) => setSettings({ ...settings, session_timeout: e.target.value })}
                className="h-10 w-32 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" />
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-red-200 overflow-hidden">
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
              <button onClick={handleReset} disabled={resetting}
                className="px-4 py-2 bg-orange-100 text-orange-700 font-semibold rounded-xl text-sm hover:bg-orange-200 transition-colors disabled:opacity-50">
                {resetting ? "Resetting..." : "Reset to Default"}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Reset All Progress</p>
                <p className="text-xs text-gray-400">This will clear all child progress data</p>
              </div>
              <button className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-xl text-sm hover:bg-red-200 transition-colors flex items-center gap-2">
                <Trash className="h-3 w-3" /> Reset
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
