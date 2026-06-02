"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

const NAV = [
  { href: "/admin",             icon: "▦",  label: "Dashboard"       },
  { href: "/admin/blog",        icon: "✍️", label: "Blog"            },
  { href: "/admin/content",     icon: "✏",  label: "Content Editor"  },
  { href: "/admin/contacts",    icon: "👥", label: "Contacts"        },
  { href: "/admin/submissions", icon: "📋", label: "Submissions"     },
  { href: "/admin/pipeline",    icon: "🎯", label: "Pipeline"        },
  { href: "/admin/automations", icon: "⚡", label: "Automations"     },
  { href: "/admin/webhooks",    icon: "🔗", label: "Webhooks"        },
  { href: "/admin/templates",   icon: "📧", label: "Email Templates" },
  { href: "/admin/analytics",   icon: "📊", label: "Analytics"       },
  { href: "/admin/leads",       icon: "🎯", label: "Leads"           },
  { href: "/admin/chats",       icon: "💬", label: "Chats"           },
  { href: "/admin/knowledge",   icon: "🧠", label: "Knowledge Base"  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const supabase = createClient();

  const isLoginPage = path === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoadingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [isLoginPage]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  // Render login page without the sidebar shell
  if (isLoginPage) {
    return <>{children}</>
  }

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A10]">
        <div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F5F4FF] overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar */}
      <aside className={`flex-shrink-0 bg-[#0A0A0F] flex flex-col transition-all duration-200 ${collapsed ? "w-[60px]" : "w-56"}`}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-3 border-b border-white/[0.06] flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-[#7C3AED] flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-900/40">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          {!collapsed && <span className="text-white font-bold text-[13px] tracking-tight truncate">BrandElevate</span>}
          <button onClick={() => setCollapsed(c => !c)} className="ml-auto text-white/20 hover:text-white/60 transition-colors flex-shrink-0 text-xs p-1">
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map(n => {
            const active = n.href === "/admin" ? path === "/admin" : path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href}
                title={collapsed ? n.label : undefined}
                className={`flex items-center gap-3 mx-2 mb-0.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                  active
                    ? "bg-[#7C3AED] text-white shadow-lg shadow-purple-900/30"
                    : "text-gray-500 hover:text-white hover:bg-white/[0.05]"
                }`}>
                <span className="text-base leading-none flex-shrink-0">{n.icon}</span>
                {!collapsed && <span className="truncate">{n.label}</span>}
              </Link>
            );
          })}

          <div className="mx-2 my-2 border-t border-white/[0.06]" />

          <Link href="/" target="_blank"
            title={collapsed ? "View Site" : undefined}
            className="flex items-center gap-3 mx-2 mb-0.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:text-white hover:bg-white/[0.05] transition-all">
            <span className="text-base leading-none flex-shrink-0">↗</span>
            {!collapsed && <span>View Site</span>}
          </Link>
        </nav>

        {/* User + logout */}
        <div className="border-t border-white/[0.06] p-3 flex-shrink-0">
          {user && (
            <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
              <div className="w-7 h-7 rounded-full bg-[#7C3AED]/30 border border-[#7C3AED]/40 flex items-center justify-center text-[#8B5CF6] text-xs font-bold flex-shrink-0">
                {user.email?.[0]?.toUpperCase() ?? "A"}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[11px] font-semibold truncate">{user.email}</p>
                  <button onClick={signOut} className="text-gray-600 hover:text-red-400 text-[10px] transition-colors mt-0.5">
                    Sign out
                  </button>
                </div>
              )}
              {collapsed && (
                <button onClick={signOut} title="Sign out" className="text-gray-600 hover:text-red-400 transition-colors text-xs">⏻</button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200/80 flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
            <h1 className="font-semibold text-gray-800 text-sm">
              {NAV.find(n => n.href === "/admin" ? path === "/admin" : path.startsWith(n.href))?.label ?? "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-xs text-gray-400 hover:text-[#7C3AED] transition-colors flex items-center gap-1">
              <span>↗</span> View Site
            </a>
            <div className="h-4 w-px bg-gray-200" />
            <span className="text-xs text-gray-500">{user?.email}</span>
            <button onClick={signOut}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium border border-gray-200 hover:border-red-300 px-3 py-1.5 rounded-lg">
              Sign out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
