"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";

interface Contact { id: string; name: string; email: string; phone: string; company: string; source: string; status: string; pipeline_stage: string; tags: string[]; goals: string; assigned_to: string; created_at: string; metadata: Record<string, string> }
interface Note { id: string; content: string; author: string; created_at: string }
interface Activity { id: string; type: string; title: string; description: string; created_at: string }
interface Deal { id: string; title: string; value: number; stage: string; created_at: string }
interface Submission { id: string; form_name: string; data: Record<string, string>; created_at: string; status: string }

const STATUSES = ["new","contacted","qualified","proposal","won","lost"];
const STAGES = ["lead","prospect","proposal","negotiation","closed"];
const STATUS_COLORS: Record<string,string> = { new:"bg-blue-100 text-blue-700", contacted:"bg-yellow-100 text-yellow-700", qualified:"bg-purple-100 text-purple-700", proposal:"bg-orange-100 text-orange-700", won:"bg-green-100 text-green-700", lost:"bg-red-100 text-red-700" };
const ACTIVITY_ICONS: Record<string,string> = { form_submission:"📋", email_sent:"📧", call:"📞", meeting:"🤝", note:"📝", status_change:"🔄", automation:"⚡" };

export default function ContactDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<{ contact: Contact; notes: Note[]; activities: Activity[]; deals: Deal[]; submissions: Submission[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [dealForm, setDealForm] = useState({ title: "", value: "", stage: "lead" });
  const [addingDeal, setAddingDeal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Contact>>({});

  const load = () => {
    fetch(`/api/contacts/${id}`).then(r => r.json()).then(d => { setData(d); setEditForm(d.contact); setLoading(false); });
  };
  useEffect(load, [id]);

  const update = async (patch: Partial<Contact>) => {
    await fetch(`/api/contacts/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    load();
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    setAddingNote(true);
    await fetch(`/api/contacts/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "add_note", content: noteText }) });
    setNoteText("");
    setAddingNote(false);
    load();
  };

  const addDeal = async () => {
    setAddingDeal(true);
    await fetch(`/api/contacts/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "add_deal", ...dealForm, value: parseFloat(dealForm.value) || 0 }) });
    setDealForm({ title: "", value: "", stage: "lead" });
    setAddingDeal(false);
    load();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" /></div>;
  if (!data) return <p className="text-red-500">Contact not found</p>;
  const { contact, notes, activities, deals, submissions } = data;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/contacts" className="text-gray-400 hover:text-gray-600 text-sm">← Contacts</Link>
          <div className="w-12 h-12 rounded-full bg-[#7C3AED] flex items-center justify-center text-white font-extrabold text-lg">{contact.name?.[0]?.toUpperCase()}</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{contact.name}</h2>
            <p className="text-sm text-gray-500">{contact.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select value={contact.status} onChange={e => update({ status: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none">
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={contact.pipeline_stage} onChange={e => update({ pipeline_stage: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none">
            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {["overview","notes","deals","submissions","activity"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${tab === t ? "bg-white text-[#7C3AED] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t} {t === "notes" ? `(${notes?.length ?? 0})` : t === "deals" ? `(${deals?.length ?? 0})` : t === "submissions" ? `(${submissions?.length ?? 0})` : ""}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Contact Info</h3>
              <button onClick={() => setEditing(!editing)} className="text-xs text-[#7C3AED] font-semibold hover:underline">{editing ? "Cancel" : "Edit"}</button>
            </div>
            {editing ? (
              <div className="space-y-3">
                {[["name","Name"],["email","Email"],["phone","Phone"],["company","Company"],["assigned_to","Assigned To"],["goals","Goals"]].map(([k,l]) => (
                  <div key={k}>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">{l}</label>
                    <input value={(editForm as Record<string,string>)[k] ?? ""} onChange={e => setEditForm(f => ({ ...f, [k]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED]" />
                  </div>
                ))}
                <button onClick={() => { update(editForm); setEditing(false); }} className="w-full bg-[#7C3AED] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#6D28D9]">Save Changes</button>
              </div>
            ) : (
              <div className="space-y-3">
                {[["Name", contact.name],["Email", contact.email],["Phone", contact.phone || "—"],["Company", contact.company || "—"],["Source", contact.source],["Assigned to", contact.assigned_to],["Goals", contact.goals || "—"],["Joined", new Date(contact.created_at).toLocaleDateString()]].map(([l,v]) => (
                  <div key={l} className="flex justify-between">
                    <span className="text-xs font-semibold text-gray-500">{l}</span>
                    <span className="text-xs text-gray-800 text-right max-w-48">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-500">Tags</span>
                  <div className="flex flex-wrap gap-1 justify-end max-w-48">
                    {(contact.tags ?? []).map(t => <span key={t} className="text-[10px] bg-purple-50 text-[#7C3AED] px-1.5 py-0.5 rounded-full font-medium">{t}</span>)}
                    {(contact.tags ?? []).length === 0 && <span className="text-xs text-gray-400">No tags</span>}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3">Status & Pipeline</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Status</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLORS[contact.status] ?? ""}`}>{contact.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Pipeline Stage</span>
                  <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-full">{contact.pipeline_stage}</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3">Summary</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-purple-50 rounded-xl p-3"><p className="text-xl font-extrabold text-[#7C3AED]">{notes?.length ?? 0}</p><p className="text-[10px] text-purple-400 mt-0.5">Notes</p></div>
                <div className="bg-blue-50 rounded-xl p-3"><p className="text-xl font-extrabold text-blue-600">{submissions?.length ?? 0}</p><p className="text-[10px] text-blue-400 mt-0.5">Forms</p></div>
                <div className="bg-green-50 rounded-xl p-3"><p className="text-xl font-extrabold text-green-600">{deals?.length ?? 0}</p><p className="text-[10px] text-green-400 mt-0.5">Deals</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "notes" && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-800">Notes</h3>
          <div className="flex gap-3">
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add a note..." rows={3}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7C3AED] resize-none" />
            <button onClick={addNote} disabled={addingNote || !noteText.trim()} className="px-5 bg-[#7C3AED] text-white rounded-xl text-sm font-semibold hover:bg-[#6D28D9] disabled:opacity-50 self-end pb-3">
              {addingNote ? "…" : "Add"}
            </button>
          </div>
          <div className="space-y-3">
            {(notes ?? []).map(n => (
              <div key={n.id} className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700">{n.content}</p>
                <p className="text-xs text-gray-400 mt-2">{n.author} · {new Date(n.created_at).toLocaleString()}</p>
              </div>
            ))}
            {(notes ?? []).length === 0 && <p className="text-sm text-gray-400 text-center py-4">No notes yet</p>}
          </div>
        </div>
      )}

      {tab === "deals" && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-800">Deals</h3>
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="Deal title" value={dealForm.title} onChange={e => setDealForm(f => ({ ...f, title: e.target.value }))} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED]" />
            <input placeholder="Value ($)" value={dealForm.value} onChange={e => setDealForm(f => ({ ...f, value: e.target.value }))} type="number" className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED]" />
            <select value={dealForm.stage} onChange={e => setDealForm(f => ({ ...f, stage: e.target.value }))} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none">
              {["lead","prospect","proposal","negotiation","won","lost"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button onClick={addDeal} disabled={addingDeal || !dealForm.title} className="bg-[#7C3AED] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#6D28D9] disabled:opacity-50">
            {addingDeal ? "Adding…" : "+ Add Deal"}
          </button>
          <div className="space-y-2">
            {(deals ?? []).map(d => (
              <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div><p className="text-sm font-semibold text-gray-800">{d.title}</p><p className="text-xs text-gray-400">{new Date(d.created_at).toLocaleDateString()}</p></div>
                <div className="text-right"><p className="text-sm font-bold text-green-600">${Number(d.value).toLocaleString()}</p><span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{d.stage}</span></div>
              </div>
            ))}
            {(deals ?? []).length === 0 && <p className="text-sm text-gray-400 text-center py-4">No deals yet</p>}
          </div>
        </div>
      )}

      {tab === "submissions" && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
          <h3 className="font-bold text-gray-800">Form Submissions</h3>
          {(submissions ?? []).map(s => (
            <div key={s.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between mb-2"><span className="text-xs font-bold text-[#7C3AED] uppercase">{s.form_name}</span><span className="text-xs text-gray-400">{new Date(s.created_at).toLocaleString()}</span></div>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(s.data).map(([k, v]) => v && (
                  <div key={k}><span className="text-[10px] text-gray-500 font-semibold capitalize">{k}: </span><span className="text-xs text-gray-700">{String(v)}</span></div>
                ))}
              </div>
            </div>
          ))}
          {(submissions ?? []).length === 0 && <p className="text-sm text-gray-400 text-center py-4">No submissions</p>}
        </div>
      )}

      {tab === "activity" && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Activity Timeline</h3>
          <div className="space-y-0">
            {(activities ?? []).map((a, i) => (
              <div key={a.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">{ACTIVITY_ICONS[a.type] ?? "•"}</div>
                  {i < (activities?.length ?? 0) - 1 && <div className="w-px flex-1 bg-gray-100 my-1" />}
                </div>
                <div className="pb-4 flex-1">
                  <p className="text-sm font-semibold text-gray-800">{a.title}</p>
                  {a.description && <p className="text-xs text-gray-500 mt-0.5">{a.description}</p>}
                  <p className="text-xs text-gray-400 mt-1">{new Date(a.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {(activities ?? []).length === 0 && <p className="text-sm text-gray-400 text-center py-4">No activity yet</p>}
          </div>
        </div>
      )}
    </div>
  );
}
