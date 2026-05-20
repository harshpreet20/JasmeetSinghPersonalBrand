"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

interface Template { id: string; name: string; subject: string; body_html: string; variables: string[]; created_at: string; updated_at: string }

export default function Templates() {
  const supabase = createClient();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Template | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "", body_html: "", variables: "" });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState({ name: "John Doe", email: "john@example.com" });

  const load = () => {
    supabase.from("email_templates").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setTemplates(data ?? []); setLoading(false); });
  };
  useEffect(load, []);

  const save = async () => {
    setSaving(true);
    const vars = form.variables.split(",").map(v => v.trim()).filter(Boolean);
    if (isNew) {
      await supabase.from("email_templates").insert({ name: form.name, subject: form.subject, body_html: form.body_html, variables: vars });
    } else if (selected) {
      await supabase.from("email_templates").update({ name: form.name, subject: form.subject, body_html: form.body_html, variables: vars, updated_at: new Date().toISOString() }).eq("id", selected.id);
    }
    setSaving(false);
    setIsNew(false);
    setSelected(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    await supabase.from("email_templates").delete().eq("id", id);
    setTemplates(prev => prev.filter(t => t.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const openEdit = (t: Template) => {
    setIsNew(false);
    setSelected(t);
    setForm({ name: t.name, subject: t.subject, body_html: t.body_html, variables: (t.variables ?? []).join(", ") });
  };

  const renderPreview = (html: string) => html
    .replace(/\{\{name\}\}/g, preview.name)
    .replace(/\{\{email\}\}/g, preview.email)
    .replace(/\{\{contact\.name\}\}/g, preview.name)
    .replace(/\{\{contact\.email\}\}/g, preview.email);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Email Templates</h2>
          <p className="text-sm text-gray-500 mt-0.5">Reusable templates for automations</p>
        </div>
        <button onClick={() => { setIsNew(true); setSelected(null); setForm({ name: "", subject: "", body_html: "<p>Hi {{name}},</p><p></p><p>Best,<br/>Jasmeet Singh</p>", variables: "name, email" }); }}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-2 rounded-xl text-sm font-semibold">+ New Template</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* List */}
        <div className="space-y-2">
          {loading ? (
            <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" /></div>
          ) : templates.map(t => (
            <div key={t.id}
              onClick={() => openEdit(t)}
              className={`bg-white rounded-2xl p-4 shadow-sm border cursor-pointer transition-all ${selected?.id === t.id ? "border-[#7C3AED] shadow-purple-100 shadow-lg" : "border-gray-100 hover:border-gray-200 hover:shadow-md"}`}>
              <p className="font-bold text-sm text-gray-800 mb-1">{t.name}</p>
              <p className="text-xs text-gray-500 truncate">{t.subject}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-1 flex-wrap">
                  {(t.variables ?? []).map(v => <span key={v} className="text-[9px] bg-purple-50 text-[#7C3AED] px-1.5 py-0.5 rounded-full font-bold">{"{{"}{v}{"}}"}</span>)}
                </div>
                <button onClick={e => { e.stopPropagation(); remove(t.id); }} className="text-[10px] text-red-400 hover:text-red-600 font-semibold">Delete</button>
              </div>
            </div>
          ))}
          {!loading && templates.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No templates yet</p>}
        </div>

        {/* Editor */}
        {(selected || isNew) && (
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800">{isNew ? "New Template" : "Edit Template"}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-bold text-gray-600 block mb-1.5">Template Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED]" /></div>
              <div><label className="text-xs font-bold text-gray-600 block mb-1.5">Variables (comma-separated)</label>
                <input value={form.variables} onChange={e => setForm(f => ({ ...f, variables: e.target.value }))} placeholder="name, email, call_date"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED]" /></div>
            </div>
            <div><label className="text-xs font-bold text-gray-600 block mb-1.5">Subject</label>
              <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED]" /></div>
            <div><label className="text-xs font-bold text-gray-600 block mb-1.5">Body HTML</label>
              <textarea value={form.body_html} onChange={e => setForm(f => ({ ...f, body_html: e.target.value }))} rows={8}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED] font-mono resize-none" /></div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-600">Live Preview</p>
                <div className="flex gap-2">
                  <input value={preview.name} onChange={e => setPreview(p => ({ ...p, name: e.target.value }))} placeholder="Test name"
                    className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none w-28" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Subject: {renderPreview(form.subject)}</p>
                <hr className="mb-3 border-gray-100" />
                <div className="text-sm text-gray-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: renderPreview(form.body_html) }} />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setSelected(null); setIsNew(false); }} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={saving || !form.name || !form.subject}
                className="flex-1 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                {saving ? "Saving…" : "Save Template"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
