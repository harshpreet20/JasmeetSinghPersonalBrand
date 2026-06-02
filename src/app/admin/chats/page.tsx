"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface ChatSession {
  id: string;
  session_key: string;
  messages: Message[] | null;
  user_agent: string | null;
  page_url: string | null;
  total_messages: number;
  started_at: string;
  last_message_at: string | null;
  session_token: string | null;
  visitor_name: string | null;
  visitor_email: string | null;
  converted_to_lead: boolean;
  lead_form_id: string | null;
  created_at: string;
}

function trunc(s: string | null | undefined, n: number) {
  if (!s) return "—";
  return s.length > n ? s.slice(0, n) + "…" : s;
}

export default function ChatsPage() {
  const supabase = createClient();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ChatSession | null>(null);

  useEffect(() => {
    supabase
      .from("chat_sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setSessions((data as ChatSession[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Chat Sessions</h2>
          <p className="text-sm text-gray-500 mt-0.5">{sessions.length} session{sessions.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No chat sessions yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {["Visitor", "Page URL", "Messages", "Converted", "Date"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.map(s => {
                  const visitor = s.visitor_name
                    ? (s.visitor_email ? `${s.visitor_name} (${s.visitor_email})` : s.visitor_name)
                    : s.visitor_email ?? "Anonymous";
                  return (
                    <tr
                      key={s.id}
                      onClick={() => setSelected(s)}
                      className="border-b border-gray-50 hover:bg-purple-50/40 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-800">{visitor}</td>
                      <td className="px-4 py-3 text-gray-500">{trunc(s.page_url, 40)}</td>
                      <td className="px-4 py-3 text-gray-600">{s.total_messages ?? (s.messages?.length ?? 0)}</td>
                      <td className="px-4 py-3">
                        {s.converted_to_lead
                          ? <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Yes</span>
                          : <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">No</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{new Date(s.created_at).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer */}
      {selected && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/30" onClick={() => setSelected(null)} />
          <aside className="w-[520px] max-w-full bg-white shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Chat Transcript</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selected.visitor_name ?? selected.visitor_email ?? "Anonymous"} · {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>

            {/* Meta */}
            <div className="px-6 py-3 border-b border-gray-50 bg-gray-50/50 flex flex-wrap gap-4 text-xs text-gray-500">
              {selected.page_url && <span><span className="font-medium">Page:</span> {trunc(selected.page_url, 60)}</span>}
              {selected.converted_to_lead && (
                <span className="text-green-600 font-medium">
                  Converted to lead
                  {selected.lead_form_id && (
                    <Link href={`/admin/leads`} className="ml-2 underline hover:text-green-700">View Lead →</Link>
                  )}
                </span>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
              {(selected.messages ?? []).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No messages</p>
              ) : (
                (selected.messages ?? []).map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#7C3AED] text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      }`}
                    >
                      {msg.content}
                      {msg.timestamp && (
                        <p className={`text-[10px] mt-1 ${msg.role === "user" ? "text-purple-200" : "text-gray-400"}`}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
