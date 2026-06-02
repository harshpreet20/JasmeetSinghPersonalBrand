"use client";
import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase-browser";

interface KnowledgeItem {
  id: string;
  category: string;
  title: string;
  content: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = ["faqs", "services", "objections", "career_paths"];

const EMPTY: Omit<KnowledgeItem, "id" | "created_at" | "updated_at"> = {
  category: "faqs",
  title: "",
  content: "",
  is_active: true,
  sort_order: 0,
};

export default function KnowledgePage() {
  const supabase = createClient();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("faqs");
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<typeof EMPTY>({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("chatbot_knowledge")
      .select("*")
      .order("sort_order", { ascending: true });
    setItems((data as KnowledgeItem[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of CATEGORIES) counts[cat] = 0;
    items.forEach(i => { counts[i.category] = (counts[i.category] ?? 0) + 1; });
    return counts;
  }, [items]);

  const categoryItems = useMemo(
    () => items.filter(i => i.category === selectedCategory),
    [items, selectedCategory]
  );

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  function openItem(item: KnowledgeItem) {
    setSelectedItem(item);
    setIsNew(false);
    setForm({
      category: item.category,
      title: item.title,
      content: item.content,
      is_active: item.is_active,
      sort_order: item.sort_order,
    });
    setConfirmDelete(false);
  }

  function newItem() {
    setSelectedItem(null);
    setIsNew(true);
    setForm({ ...EMPTY, category: selectedCategory });
    setConfirmDelete(false);
  }

  async function save() {
    setSaving(true);
    if (isNew) {
      const { data, error } = await supabase
        .from("chatbot_knowledge")
        .insert([form])
        .select()
        .single();
      setSaving(false);
      if (error) {
        showToast("Failed to create: " + error.message, false);
      } else {
        showToast("Created successfully", true);
        setItems(prev => [...prev, data as KnowledgeItem].sort((a, b) => a.sort_order - b.sort_order));
        setSelectedItem(data as KnowledgeItem);
        setIsNew(false);
      }
    } else if (selectedItem) {
      const { data, error } = await supabase
        .from("chatbot_knowledge")
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq("id", selectedItem.id)
        .select()
        .single();
      setSaving(false);
      if (error) {
        showToast("Failed to save: " + error.message, false);
      } else {
        showToast("Saved successfully", true);
        setItems(prev => prev.map(i => i.id === selectedItem.id ? (data as KnowledgeItem) : i));
        setSelectedItem(data as KnowledgeItem);
      }
    }
  }

  async function deleteItem() {
    if (!selectedItem) return;
    setDeleting(true);
    const { error } = await supabase
      .from("chatbot_knowledge")
      .delete()
      .eq("id", selectedItem.id);
    setDeleting(false);
    if (error) {
      showToast("Failed to delete: " + error.message, false);
    } else {
      showToast("Deleted", true);
      setItems(prev => prev.filter(i => i.id !== selectedItem.id));
      setSelectedItem(null);
      setIsNew(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Knowledge Base</h2>
          <p className="text-sm text-gray-500 mt-0.5">Changes take effect immediately on the next chat message.</p>
        </div>
      </div>

      <div className="flex gap-5 h-[calc(100vh-200px)]">
        {/* Left: Categories */}
        <aside className="w-44 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Categories</p>
          </div>
          <nav className="py-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setSelectedItem(null); setIsNew(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-between ${
                  selectedCategory === cat
                    ? "bg-[#7C3AED]/10 text-[#7C3AED]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="capitalize">{cat.replace(/_/g, " ")}</span>
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${selectedCategory === cat ? "bg-[#7C3AED]/20 text-[#7C3AED]" : "bg-gray-100 text-gray-500"}`}>
                  {categoryCounts[cat] ?? 0}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Center: Items list */}
        <div className="w-64 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide capitalize">{selectedCategory.replace(/_/g, " ")}</p>
            <button
              onClick={newItem}
              className="text-xs font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
            >
              + New
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : categoryItems.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No items</p>
            ) : (
              categoryItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => openItem(item)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors ${
                    selectedItem?.id === item.id
                      ? "bg-purple-50 border-l-2 border-l-[#7C3AED]"
                      : "hover:bg-gray-50/80"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {!item.is_active && (
                      <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full font-medium">Off</span>
                    )}
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                  </div>
                  <p className="text-xs text-gray-400 leading-snug line-clamp-2">
                    {item.content.slice(0, 100)}{item.content.length > 100 ? "…" : ""}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Edit panel */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {!selectedItem && !isNew ? (
            <div className="flex-1 flex items-center justify-center text-gray-300 text-sm">
              Select an item or create a new one
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
                <p className="text-sm font-bold text-gray-900">{isNew ? "New Item" : "Edit Item"}</p>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. What grades do you teach?"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Content</label>
                  <textarea
                    value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    rows={10}
                    placeholder="Knowledge content that will be included in the chatbot system prompt…"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Sort Order</label>
                    <input
                      type="number"
                      value={form.sort_order}
                      onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                      className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Active</label>
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? "bg-[#7C3AED]" : "bg-gray-200"}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.is_active ? "left-5" : "left-0.5"}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={save}
                  disabled={saving || !form.title.trim()}
                  className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                {!isNew && (
                  confirmDelete ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Are you sure?</span>
                      <button
                        onClick={deleteItem}
                        disabled={deleting}
                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-semibold disabled:opacity-60 transition-colors"
                      >
                        {deleting ? "Deleting…" : "Yes, delete"}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="text-sm text-red-500 hover:text-red-600 font-medium px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg text-white transition-all ${toast.ok ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
