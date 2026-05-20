"use client";
import { useEffect, useState } from "react";

interface Analytics {
  kpis: { totalContacts: number; newToday: number; newThisWeek: number; totalSubmissions: number; submissionsThisWeek: number; activeAutomations: number; automationSuccessRate: number; automationRunsThisMonth: number };
  breakdowns: { pipeline: Record<string, number>; status: Record<string, number>; source: Record<string, number> };
  automations: { success: number; failed: number };
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <div className={`w-2 h-2 rounded-full ${color}`} />
      </div>
      <p className="text-3xl font-extrabold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function PieChart({ data, colors }: { data: Record<string, number>; colors: string[] }) {
  const total = Object.values(data).reduce((s, v) => s + v, 0);
  if (total === 0) return <p className="text-sm text-gray-400 text-center py-4">No data</p>;
  return (
    <div className="space-y-2">
      {Object.entries(data).map(([label, value], i) => {
        const pct = Math.round((value / total) * 100);
        return (
          <div key={label} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${colors[i % colors.length]}`} />
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-0.5">
                <span className="capitalize text-gray-700 font-medium">{label}</span>
                <span className="text-gray-500">{value} ({pct}%)</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${colors[i % colors.length]} rounded-full`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics").then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" /></div>;
  if (!data) return <p className="text-red-500">Failed to load analytics</p>;

  const { kpis, breakdowns, automations } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
        <p className="text-sm text-gray-500 mt-0.5">Overview of your CRM and automation performance</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Contacts" value={kpis.totalContacts} icon="👥" color="bg-purple-400" />
        <StatCard label="New Today" value={kpis.newToday} icon="✨" color="bg-blue-400" />
        <StatCard label="This Week" value={kpis.newThisWeek} icon="📅" color="bg-indigo-400" />
        <StatCard label="Total Submissions" value={kpis.totalSubmissions} icon="📋" color="bg-green-400" />
        <StatCard label="Submissions This Week" value={kpis.submissionsThisWeek} icon="🗓️" color="bg-yellow-400" />
        <StatCard label="Active Automations" value={kpis.activeAutomations} icon="⚡" color="bg-orange-400" />
        <StatCard label="Automation Runs" value={kpis.automationRunsThisMonth} icon="🔄" color="bg-pink-400" />
        <StatCard label="Success Rate" value={`${kpis.automationSuccessRate}%`} icon="✅" color={kpis.automationSuccessRate >= 80 ? "bg-green-400" : "bg-red-400"} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Pipeline Distribution</h3>
          <PieChart data={breakdowns.pipeline} colors={["bg-gray-400","bg-blue-400","bg-purple-400","bg-yellow-400","bg-green-400"]} />
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Contact Status</h3>
          <PieChart data={breakdowns.status} colors={["bg-blue-400","bg-yellow-400","bg-purple-400","bg-orange-400","bg-green-400","bg-red-400"]} />
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Lead Sources</h3>
          <PieChart data={breakdowns.source} colors={["bg-[#7C3AED]","bg-blue-400","bg-green-400","bg-orange-400","bg-pink-400"]} />
        </div>
      </div>

      {/* Automation performance */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Automation Performance (Last 30 days)</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-3xl font-extrabold text-[#7C3AED]">{kpis.automationRunsThisMonth}</p>
            <p className="text-xs text-purple-400 mt-1">Total Runs</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-3xl font-extrabold text-green-600">{automations.success}</p>
            <p className="text-xs text-green-400 mt-1">Successful</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <p className="text-3xl font-extrabold text-red-500">{automations.failed}</p>
            <p className="text-xs text-red-400 mt-1">Failed</p>
          </div>
        </div>
        {kpis.automationRunsThisMonth > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Success rate</span>
              <span>{kpis.automationSuccessRate}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${kpis.automationSuccessRate >= 80 ? "bg-green-400" : kpis.automationSuccessRate >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
                style={{ width: `${kpis.automationSuccessRate}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
