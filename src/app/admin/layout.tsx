"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/admin",             icon: "⊞", label: "Dashboard"    },
  { href: "/admin/content",     icon: "✏️", label: "Content Editor" },
  { href: "/admin/contacts",    icon: "👥", label: "Contacts"     },
  { href: "/admin/submissions", icon: "📋", label: "Submissions"  },
  { href: "/admin/pipeline",    icon: "🎯", label: "Pipeline"     },
  { href: "/admin/automations", icon: "⚡", label: "Automations"  },
  { href: "/admin/webhooks",    icon: "🔗", label: "Webhooks"     },
  { href: "/admin/templates",   icon: "📧", label: "Email Templates" },
  { href: "/admin/analytics",   icon: "📊", label: "Analytics"   },
  { href: "/",                  icon: "↗",  label: "View Site"   },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8F7FF] overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar */}
      <aside className={`flex-shrink-0 bg-[#0A0A0F] flex flex-col transition-all duration-200 ${collapsed ? "w-16" : "w-56"}`}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-white/10">
          <div className="w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">JS</div>
          {!collapsed && <span className="text-white font-bold text-sm truncate">Admin Panel</span>}
          <button onClick={() => setCollapsed(c => !c)} className="ml-auto text-gray-500 hover:text-white text-xs">
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV.map(n => {
            const active = n.href === "/admin" ? path === "/admin" : path.startsWith(n.href) && n.href !== "/";
            return (
              <Link key={n.href} href={n.href}
                className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-[#7C3AED] text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}>
                <span className="text-base flex-shrink-0">{n.icon}</span>
                {!collapsed && <span className="truncate">{n.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          {!collapsed && <p className="text-[10px] text-gray-600">BrandElevate CRM v1.0</p>}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <h1 className="font-semibold text-gray-800 text-sm">
            {NAV.find(n => path === "/admin" ? n.href === "/admin" : path.startsWith(n.href) && n.href !== "/")?.label ?? "Admin"}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Jasmeet Singh</span>
            <div className="w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-xs font-bold">JS</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </main>
    </div>
  );
}
