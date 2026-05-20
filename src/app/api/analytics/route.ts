import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString();

  const [
    totalContacts, newToday, newThisWeek,
    totalSubmissions, submissionsThisWeek,
    totalAutomations, automationLogs,
    pipelineData, statusData, sourceData,
    recentContacts, recentSubmissions,
  ] = await Promise.all([
    supabase.from("crm_contacts").select("id", { count: "exact", head: true }),
    supabase.from("crm_contacts").select("id", { count: "exact", head: true }).gte("created_at", today),
    supabase.from("crm_contacts").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
    supabase.from("form_submissions").select("id", { count: "exact", head: true }),
    supabase.from("form_submissions").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
    supabase.from("automations").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("automation_logs").select("id,status", { count: "exact" }).gte("created_at", monthAgo),
    supabase.from("crm_contacts").select("pipeline_stage"),
    supabase.from("crm_contacts").select("status"),
    supabase.from("crm_contacts").select("source"),
    supabase.from("crm_contacts").select("name,email,created_at,status,pipeline_stage").order("created_at", { ascending: false }).limit(5),
    supabase.from("form_submissions").select("form_name,data,created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const pipelineBreakdown = (pipelineData.data ?? []).reduce((acc: Record<string, number>, r) => {
    acc[r.pipeline_stage] = (acc[r.pipeline_stage] ?? 0) + 1; return acc;
  }, {});

  const statusBreakdown = (statusData.data ?? []).reduce((acc: Record<string, number>, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1; return acc;
  }, {});

  const sourceBreakdown = (sourceData.data ?? []).reduce((acc: Record<string, number>, r) => {
    acc[r.source ?? "unknown"] = (acc[r.source ?? "unknown"] ?? 0) + 1; return acc;
  }, {});

  const autoSuccess = (automationLogs.data ?? []).filter(l => l.status === "success").length;
  const autoFailed = (automationLogs.data ?? []).filter(l => l.status === "failed").length;

  return NextResponse.json({
    kpis: {
      totalContacts: totalContacts.count ?? 0,
      newToday: newToday.count ?? 0,
      newThisWeek: newThisWeek.count ?? 0,
      totalSubmissions: totalSubmissions.count ?? 0,
      submissionsThisWeek: submissionsThisWeek.count ?? 0,
      activeAutomations: totalAutomations.count ?? 0,
      automationSuccessRate: automationLogs.count ? Math.round((autoSuccess / automationLogs.count) * 100) : 0,
      automationRunsThisMonth: automationLogs.count ?? 0,
    },
    breakdowns: { pipeline: pipelineBreakdown, status: statusBreakdown, source: sourceBreakdown },
    recent: { contacts: recentContacts.data, submissions: recentSubmissions.data },
    automations: { success: autoSuccess, failed: autoFailed },
  });
}
