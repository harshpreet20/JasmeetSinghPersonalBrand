"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";

interface Automation { id: string; name: string; description: string; is_active: boolean; trigger_type: string; trigger_config: Record<string,unknown>; actions: { type: string; config: Record<string,string> }[]; run_count: number; last_run_at: string }
interface Log { id: string; status: string; created_at: string; input_data: Record<string,unknown>; output_data: Record<string,unknown>; error_message: string; crm_contacts?: { name: string; email: string } }

export default function AutomationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [automation, setAutomation] = useState<Automation | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Automation>>({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch(`/api/automations/${id}`).then(r => r.json()).then(d => {
      setAutomation(d.automation);
      setEditData(d.automation);
      setLogs(d.logs ?? []);
      setLoading(false);
    });
  };
  useEffect(load, [id]);

  const save = async () => {
    setSaving(true);
    await fetch(`/api/automations/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editData) });
    setSaving(false);
    setEditing(false);
    load();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" /></div>;
  if (!automation) return <p className="text-red-500">Not found</p>;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Link href="/admin/automations" className="text-gray-400 hover:text-gray-600 text-sm">← Automations</Link>
        <h2 className="text-xl font-bold text-gray-900">{automation.name}</h2>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${automation.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{automation.is_active ? "Active" : "Paused"}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Config */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Configuration</h3>
            <button onClick={() => setEditing(!editing)} className="text-xs text-[#7C3AED] font-semibold hover:underline">{editing ? "Cancel" : "Edit"}</button>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Name</label>
                <input value={editData.name ?? ""} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Description</label>
                <input value={editData.description ?? ""} onChange={e => setEditData(d => ({ ...d, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Trigger Config (JSON)</label>
                <textarea value={JSON.stringify(editData.trigger_config, null, 2)} onChange={e => { try { setEditData(d => ({ ...d, trigger_config: JSON.parse(e.target.value) })); } catch {} }} rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED] font-mono resize-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Actions (JSON)</label>
                <textarea value={JSON.stringify(editData.actions, null, 2)} onChange={e => { try { setEditData(d => ({ ...d, actions: JSON.parse(e.target.value) })); } catch {} }} rows={8}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED] font-mono resize-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={editData.is_active ?? false} onChange={e => setEditData(d => ({ ...d, is_active: e.target.checked }))} className="w-4 h-4 accent-[#7C3AED]" />
                <label htmlFor="active" className="text-sm font-semibold text-gray-700">Active</label>
              </div>
              <button onClick={save} disabled={saving} className="w-full bg-[#7C3AED] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#6D28D9] disabled:opacity-50">
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div><span className="text-xs text-gray-400 font-semibold block">Trigger</span><p className="text-sm text-gray-700 font-mono mt-0.5">{automation.trigger_type}</p></div>
              <div><span className="text-xs text-gray-400 font-semibold block">Trigger Config</span><pre className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2 mt-0.5 overflow-auto">{JSON.stringify(automation.trigger_config, null, 2)}</pre></div>
              <div><span className="text-xs text-gray-400 font-semibold block">Actions ({automation.actions?.length ?? 0})</span>
                <pre className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2 mt-0.5 overflow-auto max-h-48">{JSON.stringify(automation.actions, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Stats</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-purple-50 rounded-xl p-3"><p className="text-2xl font-extrabold text-[#7C3AED]">{automation.run_count}</p><p className="text-[10px] text-purple-400 mt-0.5">Total Runs</p></div>
              <div className="bg-green-50 rounded-xl p-3"><p className="text-2xl font-extrabold text-green-600">{logs.filter(l => l.status === "success").length}</p><p className="text-[10px] text-green-400 mt-0.5">Successful</p></div>
              <div className="bg-red-50 rounded-xl p-3"><p className="text-2xl font-extrabold text-red-500">{logs.filter(l => l.status === "failed").length}</p><p className="text-[10px] text-red-400 mt-0.5">Failed</p></div>
            </div>
            {automation.last_run_at && <p className="text-xs text-gray-400 mt-3 text-center">Last run: {new Date(automation.last_run_at).toLocaleString()}</p>}
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Execution Logs <span className="text-gray-400 font-normal text-sm">({logs.length})</span></h3>
        <div className="space-y-2">
          {logs.map(l => (
            <div key={l.id} className={`rounded-xl p-3 border ${l.status === "success" ? "bg-green-50 border-green-100" : l.status === "failed" ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${l.status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{l.status}</span>
                  {l.crm_contacts && <span className="text-xs text-gray-600">{l.crm_contacts.name} ({l.crm_contacts.email})</span>}
                </div>
                <span className="text-[10px] text-gray-400">{new Date(l.created_at).toLocaleString()}</span>
              </div>
              {l.error_message && <p className="text-xs text-red-600 mt-1">{l.error_message}</p>}
            </div>
          ))}
          {logs.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No runs yet</p>}
        </div>
      </div>
    </div>
  );
}
