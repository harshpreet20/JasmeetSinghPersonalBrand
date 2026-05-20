"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

interface Contact { id: string; name: string; email: string; company: string; status: string; pipeline_stage: string; tags: string[]; created_at: string }

const STAGES = [
  { key: "lead",         label: "Lead",        color: "bg-gray-100",    dot: "bg-gray-400" },
  { key: "prospect",     label: "Prospect",    color: "bg-blue-50",     dot: "bg-blue-400" },
  { key: "proposal",     label: "Proposal",    color: "bg-purple-50",   dot: "bg-purple-400" },
  { key: "negotiation",  label: "Negotiation", color: "bg-yellow-50",   dot: "bg-yellow-400" },
  { key: "closed",       label: "Closed / Won",color: "bg-green-50",    dot: "bg-green-400" },
];

export default function Pipeline() {
  const supabase = createClient();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("crm_contacts").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setContacts(data ?? []); setLoading(false); });
  }, []);

  const moveContact = async (id: string, stage: string) => {
    await supabase.from("crm_contacts").update({ pipeline_stage: stage }).eq("id", id);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, pipeline_stage: stage } : c));
  };

  const onDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    if (dragging) moveContact(dragging, stage);
    setDragging(null);
  };

  const byStage = (key: string) => contacts.filter(c => c.pipeline_stage === key);
  const totalByStage = (key: string) => byStage(key).length;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Pipeline</h2>
          <p className="text-sm text-gray-500 mt-0.5">Drag contacts between stages</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Total: <strong>{contacts.length}</strong></span>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map(stage => (
          <div key={stage.key} className="flex-shrink-0 w-64"
            onDragOver={e => e.preventDefault()}
            onDrop={e => onDrop(e, stage.key)}>
            <div className={`rounded-2xl p-4 min-h-96 ${stage.color} border border-white/50`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${stage.dot}`} />
                  <h3 className="text-sm font-bold text-gray-700">{stage.label}</h3>
                </div>
                <span className="text-xs font-bold bg-white text-gray-600 px-2 py-0.5 rounded-full shadow-sm">{totalByStage(stage.key)}</span>
              </div>

              <div className="space-y-2">
                {byStage(stage.key).map(c => (
                  <div key={c.id} draggable
                    onDragStart={() => setDragging(c.id)}
                    onDragEnd={() => setDragging(null)}
                    className={`bg-white rounded-xl p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow border border-gray-100 ${dragging === c.id ? "opacity-50" : ""}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center text-[10px] font-extrabold flex-shrink-0">{c.name?.[0]?.toUpperCase()}</div>
                      <Link href={`/admin/contacts/${c.id}`} className="text-xs font-bold text-gray-800 hover:text-[#7C3AED] truncate">{c.name}</Link>
                    </div>
                    <p className="text-[10px] text-gray-400 truncate mb-1.5">{c.email}</p>
                    {c.company && <p className="text-[10px] text-gray-500 truncate">{c.company}</p>}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(c.tags ?? []).map(t => <span key={t} className="text-[9px] bg-purple-50 text-[#7C3AED] px-1.5 py-0.5 rounded-full font-bold">{t}</span>)}
                    </div>
                    <p className="text-[9px] text-gray-300 mt-1.5">{new Date(c.created_at).toLocaleDateString()}</p>
                  </div>
                ))}

                {byStage(stage.key).length === 0 && (
                  <div className="text-center py-8 text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">Drop here</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
