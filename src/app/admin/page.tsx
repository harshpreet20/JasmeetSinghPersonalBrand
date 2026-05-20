"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Analytics {
  kpis: { totalContacts: number; newToday: number; newThisWeek: number; totalSubmissions: number; submissionsThisWeek: number; activeAutomations: number; automationSuccessRate: number; automationRunsThisMonth: number };
  breakdowns: { pipeline: Record<string, number>; status: Record<string, number>; source: Record<string, number> };
  recent: { contacts: { name: string; email: string; created_at: string; status: string; pipeline_stage: string }[]; submissions: { form_name: string; data: Record<string, string>; created_at: string }[] };
  automations: { success: number; failed: number };
}

const STATUS_COLOR: Record<string, string> = { new: "bg-blue-100 text-blue-700", contacted: "bg-yellow-100 text-yellow-700", qualified: "bg-purple-100 text-purple-700", proposal: "bg-orange-100 text-orange-700", won: "bg-green-100 text-green-700", lost: "bg-red-100 text-red-700" };
const STAGE_COLOR: Record<string, string> = { lead: "bg-gray-100 text-gray-600", prospect: "bg-blue-100 text-blue-700", proposal: "bg-purple-100 text-purple-700", negotiation: "bg-yellow-100 text-yellow-700", closed: "bg-green-100 text-green-700" };

function KPI({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <p className="text-xs font-medium text-gray-500 mb-2">{label}</p>
      <p className={`text-3xl font-extrabold ${color ?? "text-gray-900"}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-600 w-24 truncate capitalize">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700 w-6 text-right">{value}</span>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics").then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" /></div>;
  if (!data) return <p className="text-red-500">Failed to load analytics</p>;

  const { kpis, breakdowns, recent, automations } = data;
  const pipelineMax = Math.max(...Object.values(breakdowns.pipeline), 1);
  const statusMax = Math.max(...Object.values(breakdowns.status), 1);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Total Contacts" value={kpis.totalContacts} sub={`+${kpis.newToday} today`} color="text-[#7C3AED]" />
        <KPI label="New This Week" value={kpis.newThisWeek} sub="contacts" />
        <KPI label="Form Submissions" value={kpis.totalSubmissions} sub={`${kpis.submissionsThisWeek} this week`} />
        <KPI label="Automation Success" value={`${kpis.automationSuccessRate}%`} sub={`${kpis.automationRunsThisMonth} runs this month`} color={kpis.automationSuccessRate >= 80 ? "text-green-600" : "text-orange-500"} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pipeline breakdown */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Pipeline Stages</h3>
          <div className="space-y-3">
            {Object.entries(breakdowns.pipeline).map(([k, v]) => (
              <Bar key={k} label={k} value={v} max={pipelineMax} color="bg-[#7C3AED]" />
            ))}
          </div>
          <Link href="/admin/pipeline" className="block mt-4 text-xs text-[#7C3AED] font-semibold hover:underline">View Pipeline →</Link>
        </div>

        {/* Status breakdown */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Contact Status</h3>
          <div className="space-y-3">
            {Object.entries(breakdowns.status).map(([k, v]) => (
              <Bar key={k} label={k} value={v} max={statusMax} color="bg-blue-500" />
            ))}
          </div>
          <Link href="/admin/contacts" className="block mt-4 text-xs text-[#7C3AED] font-semibold hover:underline">View Contacts →</Link>
        </div>

        {/* Automation stats */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Automations</h3>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-extrabold text-green-600">{automations.success}</p>
              <p className="text-xs text-green-500 mt-0.5">Successful</p>
            </div>
            <div className="flex-1 bg-red-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-extrabold text-red-500">{automations.failed}</p>
              <p className="text-xs text-red-400 mt-0.5">Failed</p>
            </div>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold text-[#7C3AED]">{kpis.activeAutomations}</p>
            <p className="text-xs text-purple-400 mt-0.5">Active workflows</p>
          </div>
          <Link href="/admin/automations" className="block mt-4 text-xs text-[#7C3AED] font-semibold hover:underline">Manage Automations →</Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent contacts */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Recent Contacts</h3>
            <Link href="/admin/contacts" className="text-xs text-[#7C3AED] font-semibold hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {(recent.contacts ?? []).map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED] font-bold text-xs flex-shrink-0">
                  {c.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
                  <p className="text-xs text-gray-400 truncate">{c.email}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[c.status] ?? "bg-gray-100 text-gray-600"}`}>{c.status}</span>
              </div>
            ))}
            {(recent.contacts ?? []).length === 0 && <p className="text-sm text-gray-400 text-center py-4">No contacts yet</p>}
          </div>
        </div>

        {/* Recent submissions */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Recent Submissions</h3>
            <Link href="/admin/submissions" className="text-xs text-[#7C3AED] font-semibold hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {(recent.submissions ?? []).map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-base">📋</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{s.data?.name ?? "Unknown"}</p>
                  <p className="text-xs text-gray-500">{s.form_name} · {new Date(s.created_at).toLocaleDateString()}</p>
                  {s.data?.message && <p className="text-xs text-gray-400 truncate mt-0.5">{s.data.message}</p>}
                </div>
              </div>
            ))}
            {(recent.submissions ?? []).length === 0 && <p className="text-sm text-gray-400 text-center py-4">No submissions yet</p>}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/admin/content",     label: "✏️ Edit Website Content", color: "bg-purple-50 text-[#7C3AED] hover:bg-purple-100" },
            { href: "/admin/contacts",    label: "➕ Add Contact",          color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
            { href: "/admin/automations", label: "⚡ New Automation",        color: "bg-green-50 text-green-700 hover:bg-green-100" },
            { href: "/admin/webhooks",    label: "🔗 Add Webhook",          color: "bg-orange-50 text-orange-700 hover:bg-orange-100" },
            { href: "/admin/templates",   label: "📧 Create Template",      color: "bg-pink-50 text-pink-700 hover:bg-pink-100" },
          ].map(a => (
            <Link key={a.href} href={a.href} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${a.color}`}>{a.label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
