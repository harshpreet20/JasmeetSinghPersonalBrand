"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Contact { id: string; name: string; email: string; phone: string; company: string; source: string; status: string; pipeline_stage: string; tags: string[]; created_at: string; assigned_to: string }

const STATUS_COLORS: Record<string, string> = { new: "bg-blue-100 text-blue-700", contacted: "bg-yellow-100 text-yellow-700", qualified: "bg-purple-100 text-purple-700", proposal: "bg-orange-100 text-orange-700", won: "bg-green-100 text-green-700", lost: "bg-red-100 text-red-700" };
const STAGE_COLORS: Record<string, string> = { lead: "bg-gray-100 text-gray-600", prospect: "bg-blue-100 text-blue-700", proposal: "bg-purple-100 text-purple-700", negotiation: "bg-yellow-100 text-yellow-700", closed: "bg-green-100 text-green-700" };

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [stage, setStage] = useState("");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", goals: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page), limit: "20", ...(search && { search }), ...(status && { status }), ...(stage && { stage }) });
    const res = await fetch(`/api/contacts?${p}`);
    const d = await res.json();
    setContacts(d.data ?? []);
    setTotal(d.total ?? 0);
    setLoading(false);
  }, [search, status, stage, page]);

  useEffect(() => { load(); }, [load]);

  const addContact = async () => {
    setSaving(true);
    await fetch("/api/contacts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setShowAdd(false);
    setForm({ name: "", email: "", phone: "", company: "", goals: "" });
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Contacts</h2>
          <p className="text-sm text-gray-500 mt-0.5">{total} total contacts</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">+ Add Contact</button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search name, email, company..."
          className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED] bg-white" />
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#7C3AED]">
          <option value="">All Status</option>
          {["new","contacted","qualified","proposal","won","lost"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={stage} onChange={e => { setStage(e.target.value); setPage(1); }} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#7C3AED]">
          <option value="">All Stages</option>
          {["lead","prospect","proposal","negotiation","closed"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{["Name","Email","Company","Status","Stage","Source","Tags","Created","Actions"].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={9} className="text-center py-12"><div className="w-6 h-6 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              ) : contacts.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">No contacts found</td></tr>
              ) : contacts.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED] text-xs font-bold flex-shrink-0">{c.name?.[0]?.toUpperCase()}</div>
                      <span className="font-semibold text-gray-800 truncate max-w-28">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-36 truncate">{c.email}</td>
                  <td className="px-4 py-3 text-gray-500">{c.company || "—"}</td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status] ?? "bg-gray-100 text-gray-600"}`}>{c.status}</span></td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STAGE_COLORS[c.pipeline_stage] ?? "bg-gray-100 text-gray-600"}`}>{c.pipeline_stage}</span></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{c.source}</td>
                  <td className="px-4 py-3">{(c.tags ?? []).map(t => <span key={t} className="text-[10px] bg-purple-50 text-[#7C3AED] px-1.5 py-0.5 rounded-full mr-1 font-medium">{t}</span>)}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><Link href={`/admin/contacts/${c.id}`} className="text-[#7C3AED] hover:underline text-xs font-semibold">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Showing {((page-1)*20)+1}–{Math.min(page*20, total)} of {total}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:border-[#7C3AED]">← Prev</button>
              <button onClick={() => setPage(p => p+1)} disabled={page * 20 >= total} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:border-[#7C3AED]">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-gray-900 mb-4">Add New Contact</h3>
            <div className="space-y-3">
              {[["name","Name *"],["email","Email *"],["phone","Phone"],["company","Company"],["goals","Goals / Notes"]].map(([k, lbl]) => (
                <div key={k}>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">{lbl}</label>
                  <input value={(form as Record<string, string>)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED]" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={addContact} disabled={saving || !form.name || !form.email}
                className="flex-1 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors">
                {saving ? "Saving…" : "Add Contact"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
