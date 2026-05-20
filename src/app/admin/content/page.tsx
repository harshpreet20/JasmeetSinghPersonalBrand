"use client";
import { useEffect, useState, useCallback } from "react";

interface ContentRow { id: string; section: string; key: string; value: string; content_type: string; label: string }

const SECTION_LABELS: Record<string, string> = { navbar: "🔝 Navbar", hero: "🎯 Hero Section", about: "👤 About Section", services: "💼 Services", process: "🔄 Coaching Process", video: "▶️ Video Section", blog: "📝 Blog", testimonials: "💬 Testimonials", contact: "📞 Contact Form", footer: "🦶 Footer" };

function Field({ row, onSave }: { row: ContentRow; onSave: (section: string, key: string, value: string) => Promise<void> }) {
  const [val, setVal] = useState(row.value ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const dirty = val !== (row.value ?? "");

  const save = async () => {
    setSaving(true);
    await onSave(row.section, row.key, val);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">{row.label || row.key}</label>
        {row.content_type === "image" ? (
          <div className="space-y-2">
            <input value={val} onChange={e => setVal(e.target.value)} placeholder="Paste image URL here..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED] font-mono" />
            {val && <img src={val} alt="preview" className="h-24 w-auto rounded-lg object-cover border border-gray-200" onError={e => (e.currentTarget.style.display = "none")} />}
          </div>
        ) : row.content_type === "url" ? (
          <input value={val} onChange={e => setVal(e.target.value)} placeholder="https://..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED] font-mono" />
        ) : row.key.includes("body") || row.key.includes("bio") || row.key.includes("subtext") || row.key.includes("quote") || row.key.includes("excerpt") ? (
          <textarea value={val} onChange={e => setVal(e.target.value)} rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED] resize-none" />
        ) : (
          <input value={val} onChange={e => setVal(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED]" />
        )}
      </div>
      <button onClick={save} disabled={!dirty || saving}
        className={`mt-6 px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex-shrink-0 ${
          saved ? "bg-green-100 text-green-700" : dirty ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9]" : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}>
        {saving ? "Saving…" : saved ? "✓ Saved" : "Save"}
      </button>
    </div>
  );
}

export default function ContentEditor() {
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/content").then(r => r.json()).then(d => { setRows(d.data ?? []); setLoading(false); });
  }, []);

  const handleSave = useCallback(async (section: string, key: string, value: string) => {
    await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section, key, value }) });
    setRows(prev => prev.map(r => r.section === section && r.key === key ? { ...r, value } : r));
  }, []);

  const sections = [...new Set(rows.map(r => r.section))];
  const filtered = rows.filter(r => r.section === activeSection && (
    !search || r.label?.toLowerCase().includes(search.toLowerCase()) || r.key.toLowerCase().includes(search.toLowerCase()) || r.value?.toLowerCase().includes(search.toLowerCase())
  ));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Content Editor</h2>
          <p className="text-sm text-gray-500 mt-0.5">Edit every text, image, and URL on the website</p>
        </div>
        <a href="/" target="_blank" className="flex items-center gap-2 text-sm text-[#7C3AED] font-semibold hover:underline">↗ Preview Site</a>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search content fields..."
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED] bg-white" />

      <div className="flex gap-4">
        {/* Section tabs */}
        <div className="w-48 flex-shrink-0 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 h-fit">
          {sections.map(s => (
            <button key={s} onClick={() => setActiveSection(s)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5 ${activeSection === s ? "bg-[#7C3AED] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
              {SECTION_LABELS[s] ?? s}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-2">{SECTION_LABELS[activeSection] ?? activeSection}</h3>
          <p className="text-xs text-gray-400 mb-4">{filtered.length} fields</p>
          {filtered.length === 0 ? <p className="text-sm text-gray-400 py-8 text-center">No fields found</p> : (
            filtered.map(row => <Field key={`${row.section}.${row.key}`} row={row} onSave={handleSave} />)
          )}
        </div>
      </div>
    </div>
  );
}
