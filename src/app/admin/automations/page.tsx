"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Automation { id: string; name: string; description: string; is_active: boolean; trigger_type: string; trigger_config: Record<string, string>; actions: { type: string; config: Record<string, string> }[]; run_count: number; last_run_at: string; created_at: string }

const TRIGGER_LABELS: Record<string, string> = { form_submission: "📋 Form Submitted", contact_created: "👤 Contact Created", status_changed: "🔄 Status Changed", tag_added: "🏷️ Tag Added" };
const ACTION_LABELS: Record<string, string> = { send_email: "📧 Send Email", webhook: "🔗 Webhook", log: "📝 Log", add_tag: "🏷️ Add Tag", update_pipeline: "🎯 Update Pipeline", update_status: "🔄 Update Status" };

export default function Automations() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", trigger_type: "form_submission", trigger_form: "contact", action_type: "send_email", action_to: "{{contact.email}}", action_subject: "Thanks for reaching out, {{contact.name}}!", action_body: "Hi {{contact.name}},\n\nThank you for reaching out!\n\nBest,\nJasmeet Chandhok" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/automations").then(r => r.json()).then(d => { setAutomations(d.data ?? []); setLoading(false); });
  };
  useEffect(load, []);

  const toggle = async (id: string, is_active: boolean) => {
    await fetch(`/api/automations/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active }) });
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, is_active } : a));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this automation?")) return;
    await fetch(`/api/automations/${id}`, { method: "DELETE" });
    setAutomations(prev => prev.filter(a => a.id !== id));
  };

  const create = async () => {
    setSaving(true);
    const body = {
      name: form.name,
      description: form.description,
      trigger_type: form.trigger_type,
      trigger_config: form.trigger_type === "form_submission" ? { form_name: form.trigger_form } : {},
      actions: form.action_type === "send_email"
        ? [{ type: "send_email", config: { to: form.action_to, subject: form.action_subject, body: form.action_body } }]
        : form.action_type === "add_tag"
        ? [{ type: "add_tag", config: { tag: form.action_body } }]
        : [{ type: form.action_type, config: {} }],
      is_active: true,
    };
    await fetch("/api/automations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    setShowNew(false);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Automations</h2>
          <p className="text-sm text-gray-500 mt-0.5">Zapier-like workflows — trigger → action</p>
        </div>
        <button onClick={() => setShowNew(true)} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-2 rounded-xl text-sm font-semibold">+ New Automation</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {automations.map(a => (
            <div key={a.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-800">{a.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{a.is_active ? "Active" : "Paused"}</span>
                  </div>
                  {a.description && <p className="text-xs text-gray-500 mb-3">{a.description}</p>}

                  {/* Flow diagram */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                      <span className="text-xs font-bold text-blue-600">TRIGGER</span>
                      <span className="text-xs text-blue-800">{TRIGGER_LABELS[a.trigger_type] ?? a.trigger_type}</span>
                      {a.trigger_config?.form_name && <span className="text-[10px] bg-blue-200 text-blue-700 px-1.5 py-0.5 rounded-full">{a.trigger_config.form_name}</span>}
                    </div>
                    <span className="text-gray-400 text-lg">→</span>
                    <div className="flex flex-wrap gap-2">
                      {(a.actions ?? []).map((act, i) => (
                        <div key={i} className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-xl px-3 py-2">
                          <span className="text-xs font-bold text-[#7C3AED]">ACTION {i + 1}</span>
                          <span className="text-xs text-purple-800">{ACTION_LABELS[act.type] ?? act.type}</span>
                          {act.config?.tag && <span className="text-[10px] bg-purple-200 text-purple-700 px-1.5 py-0.5 rounded-full">{act.config.tag}</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span>Ran <strong className="text-gray-600">{a.run_count}</strong> times</span>
                    {a.last_run_at && <span>Last run {new Date(a.last_run_at).toLocaleDateString()}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggle(a.id, !a.is_active)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${a.is_active ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>
                    {a.is_active ? "Pause" : "Activate"}
                  </button>
                  <Link href={`/admin/automations/${a.id}`} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors">Edit</Link>
                  <button onClick={() => remove(a.id)} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-semibold text-red-600 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {automations.length === 0 && <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">No automations yet. Create your first workflow!</div>}
        </div>
      )}

      {/* New Automation Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl my-4">
            <h3 className="font-bold text-gray-900 text-lg mb-5">New Automation</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Welcome Email on Contact Form"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Description</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What does this automation do?"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED]" />
              </div>

              <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                <p className="text-xs font-extrabold text-blue-700 uppercase tracking-wide">⚡ Trigger</p>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">When this happens…</label>
                  <select value={form.trigger_type} onChange={e => setForm(f => ({ ...f, trigger_type: e.target.value }))}
                    className="w-full border border-blue-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none">
                    {Object.entries(TRIGGER_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                {form.trigger_type === "form_submission" && (
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Form name</label>
                    <input value={form.trigger_form} onChange={e => setForm(f => ({ ...f, trigger_form: e.target.value }))}
                      className="w-full border border-blue-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                  </div>
                )}
              </div>

              <div className="bg-purple-50 rounded-xl p-4 space-y-3">
                <p className="text-xs font-extrabold text-purple-700 uppercase tracking-wide">🎬 Action</p>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">Do this…</label>
                  <select value={form.action_type} onChange={e => setForm(f => ({ ...f, action_type: e.target.value }))}
                    className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none">
                    {Object.entries(ACTION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                {form.action_type === "send_email" && <>
                  <input value={form.action_to} onChange={e => setForm(f => ({ ...f, action_to: e.target.value }))} placeholder="To: {{contact.email}}"
                    className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                  <input value={form.action_subject} onChange={e => setForm(f => ({ ...f, action_subject: e.target.value }))} placeholder="Subject"
                    className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                  <textarea value={form.action_body} onChange={e => setForm(f => ({ ...f, action_body: e.target.value }))} rows={4} placeholder="Email body..."
                    className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none" />
                  <p className="text-[10px] text-purple-400">Available variables: {"{{contact.name}}"} {"{{contact.email}}"}</p>
                </>}
                {form.action_type === "add_tag" && (
                  <input value={form.action_body} onChange={e => setForm(f => ({ ...f, action_body: e.target.value }))} placeholder="Tag name (e.g. hot-lead)"
                    className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowNew(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={create} disabled={saving || !form.name}
                className="flex-1 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                {saving ? "Creating…" : "Create Automation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
