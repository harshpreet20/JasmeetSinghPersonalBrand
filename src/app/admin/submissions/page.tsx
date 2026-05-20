"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Submission { id: string; form_name: string; data: Record<string, string>; created_at: string; status: string; contact_id: string; crm_contacts?: { name: string; email: string } }

const STATUS_COLORS: Record<string,string> = { new:"bg-blue-100 text-blue-700", reviewed:"bg-yellow-100 text-yellow-700", actioned:"bg-green-100 text-green-700", archived:"bg-gray-100 text-gray-500" };

export default function Submissions() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formFilter, setFormFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const load = async () => {
    setLoading(true);
    let q = supabase.from("form_submissions").select("*, crm_contacts(name,email)", { count: "exact" }).order("created_at", { ascending: false });
    if (formFilter) q = q.eq("form_name", formFilter);
    if (statusFilter) q = q.eq("status", statusFilter);
    const { data, count } = await q;
    let filtered = data ?? [];
    if (search) filtered = filtered.filter(r => JSON.stringify(r.data).toLowerCase().includes(search.toLowerCase()) || r.crm_contacts?.name?.toLowerCase().includes(search.toLowerCase()));
    setRows(filtered);
    setTotal(count ?? 0);
    setLoading(false);
  };

  useEffect(() => { load(); }, [search, formFilter, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("form_submissions").update({ status }).eq("id", id);
    setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const forms = [...new Set(rows.map(r => r.form_name))];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Form Submissions</h2>
        <p className="text-sm text-gray-500 mt-0.5">{total} total submissions</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search submissions..."
          className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED] bg-white" />
        <select value={formFilter} onChange={e => setFormFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none">
          <option value="">All Forms</option>
          {forms.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none">
          <option value="">All Status</option>
          {["new","reviewed","actioned","archived"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" /></div>
        ) : rows.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">No submissions found</div>
        ) : rows.map(s => (
          <div key={s.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#7C3AED] bg-purple-50 px-2.5 py-1 rounded-full uppercase tracking-wide">{s.form_name}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[s.status]}`}>{s.status}</span>
              </div>
              <div className="flex items-center gap-2">
                <select value={s.status} onChange={e => updateStatus(s.id, e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[#7C3AED]">
                  {["new","reviewed","actioned","archived"].map(st => <option key={st} value={st}>{st}</option>)}
                </select>
                <span className="text-xs text-gray-400">{new Date(s.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(s.data).map(([k, v]) => v && (
                <div key={k} className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">{k}</p>
                  <p className="text-sm text-gray-700 break-words">{String(v)}</p>
                </div>
              ))}
            </div>

            {s.crm_contacts && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-400">Contact:</span>
                <Link href={`/admin/contacts/${s.contact_id}`} className="text-xs text-[#7C3AED] font-semibold hover:underline">
                  {s.crm_contacts.name} ({s.crm_contacts.email})
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
