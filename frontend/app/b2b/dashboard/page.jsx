"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Users, ScanFace, Package, LogOut, Plus, ChevronRight,
  RefreshCw, AlertCircle, Clock, User,
} from "lucide-react";
import { Api } from "@/shared/api/api";
import useB2BStore from "@/store/b2bStore";

export default function B2BDashboard() {
  const router = useRouter();
  const { apiKey, clientName, logout, isAuthenticated } = useB2BStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/b2b");
  }, [isAuthenticated, router]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await Api.b2b.listUsers(apiKey);
      if (Array.isArray(res)) setUsers(res);
      else setError(res?.detail || "Failed to load users");
    } catch {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    if (isAuthenticated) fetchUsers();
  }, [isAuthenticated, fetchUsers]);

  const handleLogout = () => {
    logout();
    router.push("/b2b");
  };

  const stats = [
    { label: "Total Users", value: users.length, icon: <Users size={18} />, color: "green" },
    { label: "Ready to Scan", value: users.length, icon: <ScanFace size={18} />, color: "gold" },
    { label: "Products Seeded", value: 12, icon: <Package size={18} />, color: "green" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      {/* Header */}
      <header className="bg-[#02331E] text-white px-6 py-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D4B038] flex items-center justify-center font-bold text-[#02331E] text-sm">
              S
            </div>
            <div>
              <span className="font-bold text-lg">SageAI</span>
              <span className="text-white/50 text-sm ml-2">B2B Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/70 hidden sm:block">{clientName}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/10"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Page title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#02331E]">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your end-users, run scans and view recommendations</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-[#02331E] hover:bg-[#024029] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition group"
          >
            <Plus size={16} />
            New User
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-sm">{s.label}</span>
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color === "gold" ? "bg-[#D4B038]/15 text-[#b8860b]" : "bg-[#02331E]/10 text-[#02331E]"}`}>
                  {s.icon}
                </span>
              </div>
              <p className="text-3xl font-bold text-[#02331E]">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => router.push("/b2b/scan")}
            className="bg-gradient-to-br from-[#02331E] to-[#024029] text-white rounded-2xl p-5 text-left hover:opacity-95 transition group shadow-sm"
          >
            <ScanFace size={24} className="mb-3 text-[#D4B038]" />
            <p className="font-semibold text-lg">Run a Scan</p>
            <p className="text-white/60 text-sm mt-1">Upload a skin image and analyse a user</p>
            <div className="flex items-center gap-1 text-[#D4B038] text-sm mt-3 group-hover:gap-2 transition-all">
              Start scanning <ChevronRight size={14} />
            </div>
          </button>
          <button
            onClick={() => users.length > 0 && router.push(`/b2b/recommendations`)}
            className="bg-white border border-gray-100 rounded-2xl p-5 text-left hover:shadow-md transition group shadow-sm"
          >
            <Package size={24} className="mb-3 text-[#02331E]" />
            <p className="font-semibold text-lg text-[#02331E]">View Recommendations</p>
            <p className="text-gray-500 text-sm mt-1">See personalised product picks for scanned users</p>
            <div className="flex items-center gap-1 text-[#02331E] text-sm mt-3 group-hover:gap-2 transition-all">
              Browse products <ChevronRight size={14} />
            </div>
          </button>
        </div>

        {/* Users table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-[#02331E]">End Users</h2>
            <button
              onClick={fetchUsers}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#02331E] transition"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-4 text-sm border-b border-red-100">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {loading ? (
            <div className="px-6 py-12 flex items-center justify-center">
              <svg className="animate-spin w-6 h-6 text-[#02331E]/40" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
              </svg>
            </div>
          ) : users.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Users size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No users yet.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-3 text-[#02331E] text-sm underline underline-offset-2"
              >
                Create your first user
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[#F7F9F7]">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">External ID</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Source</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F7F9F7] transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#02331E]/10 flex items-center justify-center">
                          <User size={14} className="text-[#02331E]" />
                        </div>
                        <span className="text-gray-800 font-medium">{u.email || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{u.external_user_id}</td>
                    <td className="px-6 py-4">
                      {u.source && (
                        <span className="bg-[#02331E]/8 text-[#02331E] text-xs px-2 py-0.5 rounded-full">
                          {u.source}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => router.push(`/b2b/scan?userId=${u.id}`)}
                          className="text-xs bg-[#02331E] text-white px-3 py-1.5 rounded-lg hover:bg-[#024029] transition"
                        >
                          Scan
                        </button>
                        <button
                          onClick={() => router.push(`/b2b/recommendations?userId=${u.id}`)}
                          className="text-xs border border-[#02331E] text-[#02331E] px-3 py-1.5 rounded-lg hover:bg-[#02331E]/5 transition"
                        >
                          Recs
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          apiKey={apiKey}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => { setShowCreateModal(false); fetchUsers(); }}
        />
      )}
    </div>
  );
}

function CreateUserModal({ apiKey, onClose, onCreated }) {
  const [form, setForm] = useState({ external_user_id: "", email: "", source: "portal", consent: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.external_user_id.trim()) { setError("External user ID is required"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await Api.b2b.createUser(apiKey, form);
      if (res?.id) onCreated();
      else setError(res?.detail || "Failed to create user");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <h3 className="text-lg font-bold text-[#02331E] mb-1">Create End User</h3>
        <p className="text-sm text-gray-500 mb-5">Add a new user under your B2B account</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">External User ID <span className="text-red-500">*</span></label>
            <input
              value={form.external_user_id}
              onChange={(e) => setForm({ ...form, external_user_id: e.target.value })}
              placeholder="e.g. user_12345"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02331E]/30 focus:border-[#02331E] text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="user@example.com"
              type="email"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02331E]/30 focus:border-[#02331E] text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <input
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              placeholder="e.g. portal, mobile_app"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02331E]/30 focus:border-[#02331E] text-sm"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => setForm({ ...form, consent: e.target.checked })}
              className="w-4 h-4 accent-[#02331E]"
            />
            <span className="text-sm text-gray-600">User has given consent to data processing</span>
          </label>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#02331E] text-white text-sm font-semibold hover:bg-[#024029] disabled:opacity-50 transition"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
