"use client";
import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase-browser";

interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  child_class: string | null;
  problem_statement: string | null;
  source_page: string | null;
  status: string | null;
  admin_notes: string | null;
  assigned_to: string | null;
  created_at: string;
  data: Record<string, string> | null;
  form_name: string | null;
  source_url: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  read: "bg-gray-100 text-gray-600",
  replied: "bg-green-100 text-green-700",
  closed: "bg-red-100 text-red-600",
};

const STATUSES = ["all", "new", "read", "replied", "closed"];

function trunc(s: string | null | undefined, n: number) {
  if (!s) return "—";
  return s.length > n ? s.slice(0, n) + "…" : s;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [drawerStatus, setDrawerStatus] = useState("");
  const [drawerNotes, setDrawerNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const supabase = createClient();

  async function loadLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from("form_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setLeads(data as Lead[]);
    setLoading(false);
  }

  useEffect(() => { loadLeads(); }, []);

  const filtered = useMemo(() => {
    return leads.filter(l => {
      const name = l.name ?? l.data?.name ?? "";
      const email = l.email ?? l.data?.email ?? "";
      const problem = l.problem_statement ?? l.data?.problem_statement ?? "";
      const matchStatus = statusFilter === "all" || l.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch = !q || name.toLowerCase().includes(q) || email.toLowerCase().includes(q) || problem.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [leads, statusFilter, search]);

  function openDrawer(lead: Lead) {
    setSelected(lead);
    setDrawerStatus(lead.status ?? "new");
    setDrawerNotes(lead.admin_notes ?? "");
  }

  function closeDrawer() { setSelected(null); }

  async function saveLead() {
    if (!selected) return;
    setSaving(true);
    const { error } = await supabase
      .from("form_submissions")
      .update({ status: drawerStatus, admin_notes: drawerNotes })
      .eq("id", selected.id);
    setSaving(false);
    if (error) {
      showToast("Failed to save: " + error.message, false);
    } else {
      showToast("Saved successfully", true);
      setLeads(prev => prev.map(l => l.id === selected.id ? { ...l, status: drawerStatus, admin_notes: drawerNotes } : l));
      setSelected(prev => prev ? { ...prev, status: drawerStatus, admin_notes: drawerNotes } : null);
    }
  }

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  function exportCSV() {
    const cols = ["Name", "Email", "Phone", "Child Class", "Problem Statement", "Source", "Status", "Date"];
    const rows = filtered.map(l => [
      l.name ?? l.data?.name ?? "",
      l.email ?? l.data?.email ?? "",
      l.phone ?? l.data?.phone ?? "",
      l.child_class ?? l.data?.child_class ?? "",
      l.problem_statement ?? l.data?.problem_statement ?? "",
      l.source_page ?? l.source_url ?? "",
      l.status ?? "",
      new Date(l.created_at).toLocaleDateString(),
    ]);
    const csv = [cols, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "leads.csv";
    a.click();
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Leads</h2>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={exportCSV} className="text-sm bg-white border border-gray-200 hover:border-[#7C3AED] text-gray-600 hover:text-[#7C3AED] px-4 py-2 rounded-xl font-medium transition-colors shadow-sm">
          ↓ Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-white border border-gray-200 text-sm rounded-xl px-3 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
        >
          {STATUSES.map(s => <option key={s} value={s}>{s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <input
          type="text"
          placeholder="Search by name, email, problem…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] bg-white border border-gray-200 text-sm rounded-xl px-3 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 placeholder-gray-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No leads found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {["Name", "Email", "Phone", "Class", "Problem", "Source", "Date", "Status"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => {
                  const name = l.name ?? l.data?.name ?? "—";
                  const email = l.email ?? l.data?.email ?? "—";
                  const phone = l.phone ?? l.data?.phone ?? "—";
                  const childClass = l.child_class ?? l.data?.child_class ?? "—";
                  const problem = l.problem_statement ?? l.data?.problem_statement ?? null;
                  const source = l.source_page ?? l.source_url ?? "—";
                  const status = l.status ?? "new";
                  return (
                    <tr
                      key={l.id}
                      onClick={() => openDrawer(l)}
                      className="border-b border-gray-50 hover:bg-purple-50/40 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-800">{name}</td>
                      <td className="px-4 py-3 text-gray-600">{email}</td>
                      <td className="px-4 py-3 text-gray-600">{phone}</td>
                      <td className="px-4 py-3 text-gray-600">{childClass}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-[180px]">{trunc(problem, 80)}</td>
                      <td className="px-4 py-3 text-gray-500">{trunc(source, 30)}</td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{new Date(l.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600"}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer */}
      {selected && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/30" onClick={closeDrawer} />
          <aside className="w-[480px] max-w-full bg-white shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Lead Details</h3>
              <button onClick={closeDrawer} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {([
                ["Name", selected.name ?? selected.data?.name],
                ["Email", selected.email ?? selected.data?.email],
                ["Phone", selected.phone ?? selected.data?.phone],
                ["Child Class", selected.child_class ?? selected.data?.child_class],
                ["Source", selected.source_page ?? selected.source_url],
                ["Form", selected.form_name],
                ["Submitted", new Date(selected.created_at).toLocaleString()],
              ] as [string, string | null | undefined][]).map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                  <p className="text-sm text-gray-800">{value || "—"}</p>
                </div>
              ))}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Problem Statement</p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{selected.problem_statement ?? selected.data?.problem_statement ?? "—"}</p>
              </div>
              {selected.data && Object.keys(selected.data).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">All Form Data</p>
                  <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                    {Object.entries(selected.data).map(([k, v]) => (
                      <div key={k} className="flex gap-2 text-xs">
                        <span className="text-gray-500 w-28 flex-shrink-0 capitalize">{k.replace(/_/g, " ")}:</span>
                        <span className="text-gray-700">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Status</label>
                <select
                  value={drawerStatus}
                  onChange={e => setDrawerStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
                >
                  {["new", "read", "replied", "closed"].map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Admin Notes</label>
                <textarea
                  value={drawerNotes}
                  onChange={e => setDrawerNotes(e.target.value)}
                  rows={4}
                  placeholder="Add internal notes…"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={saveLead}
                disabled={saving}
                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg text-white transition-all ${toast.ok ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
