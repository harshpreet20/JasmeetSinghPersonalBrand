"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

interface Webhook { id: string; name: string; url: string; events: string[]; is_active: boolean; created_at: string }
interface WebhookLog { id: string; event_type: string; response_status: number; duration_ms: number; created_at: string }

const EVENTS = ["form_submission","contact_created","status_changed","automation_run"];

export default function Webhooks() {
  const supabase = createClient();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", url: "", events: [] as string[], secret: "" });
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);

  const load = async () => {
    const [wh, wl] = await Promise.all([
      supabase.from("webhooks").select("*").order("created_at", { ascending: false }),
      supabase.from("webhook_logs").select("*").order("created_at", { ascending: false }).limit(20),
    ]);
    setWebhooks(wh.data ?? []);
    setLogs(wl.data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    setSaving(true);
    await supabase.from("webhooks").insert({ name: form.name, url: form.url, events: form.events, secret: form.secret || null });
    setSaving(false);
    setShowNew(false);
    setForm({ name: "", url: "", events: [], secret: "" });
    load();
  };

  const toggle = async (id: string, is_active: boolean) => {
    await supabase.from("webhooks").update({ is_active }).eq("id", id);
    setWebhooks(prev => prev.map(w => w.id === id ? { ...w, is_active } : w));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this webhook?")) return;
    await supabase.from("webhooks").delete().eq("id", id);
    setWebhooks(prev => prev.filter(w => w.id !== id));
  };

  const testWebhook = async (id: string, url: string) => {
    setTesting(id);
    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "test", message: "Test from BrandElevate CRM", timestamp: new Date().toISOString() }) });
      alert(`✅ Response: ${res.status} ${res.statusText}`);
    } catch (e) {
      alert(`❌ Error: ${String(e)}`);
    }
    setTesting(null);
    load();
  };

  const toggleEvent = (event: string) => {
    setForm(f => ({ ...f, events: f.events.includes(event) ? f.events.filter(e => e !== event) : [...f.events, event] }));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Webhooks</h2>
          <p className="text-sm text-gray-500 mt-0.5">Receive real-time notifications in external services</p>
        </div>
        <button onClick={() => setShowNew(true)} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-2 rounded-xl text-sm font-semibold">+ Add Webhook</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {webhooks.map(w => (
            <div key={w.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800">{w.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${w.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{w.is_active ? "Active" : "Paused"}</span>
                  </div>
                  <p className="text-xs font-mono text-gray-500 break-all mb-2">{w.url}</p>
                  <div className="flex flex-wrap gap-1">
                    {(w.events ?? []).map(e => <span key={e} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{e}</span>)}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => testWebhook(w.id, w.url)} disabled={testing === w.id}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50">
                    {testing === w.id ? "Testing…" : "Test"}
                  </button>
                  <button onClick={() => toggle(w.id, !w.is_active)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${w.is_active ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>
                    {w.is_active ? "Pause" : "Activate"}
                  </button>
                  <button onClick={() => remove(w.id)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {webhooks.length === 0 && <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">No webhooks yet.</div>}
        </div>
      )}

      {/* Recent logs */}
      {logs.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Recent Deliveries</h3>
          <div className="space-y-2">
            {logs.map(l => (
              <div key={l.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${(l.response_status ?? 0) >= 200 && l.response_status < 300 ? "bg-green-400" : "bg-red-400"}`} />
                  <span className="text-xs text-gray-700 font-medium">{l.event_type}</span>
                  {l.response_status && <span className="text-[10px] font-mono text-gray-400">HTTP {l.response_status}</span>}
                  {l.duration_ms && <span className="text-[10px] text-gray-400">{l.duration_ms}ms</span>}
                </div>
                <span className="text-[10px] text-gray-400">{new Date(l.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showNew && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-gray-900 mb-4">New Webhook</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-bold text-gray-600 block mb-1.5">Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Slack Notifications"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED]" /></div>
              <div><label className="text-xs font-bold text-gray-600 block mb-1.5">URL *</label>
                <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://hooks.zapier.com/..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED] font-mono" /></div>
              <div><label className="text-xs font-bold text-gray-600 block mb-1.5">Secret (optional)</label>
                <input value={form.secret} onChange={e => setForm(f => ({ ...f, secret: e.target.value }))} placeholder="Signing secret"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED]" /></div>
              <div><label className="text-xs font-bold text-gray-600 block mb-2">Events</label>
                <div className="flex flex-wrap gap-2">
                  {EVENTS.map(e => (
                    <button key={e} onClick={() => toggleEvent(e)} type="button"
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${form.events.includes(e) ? "bg-[#7C3AED] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowNew(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={create} disabled={saving || !form.name || !form.url}
                className="flex-1 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                {saving ? "Creating…" : "Create Webhook"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
