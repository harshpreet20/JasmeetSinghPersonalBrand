import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, sessionToken, problemSummary } = await req.json()

    const { data: lead } = await getSupabase()
      .from('form_submissions')
      .insert({
        name,
        email,
        phone,
        problem_statement: problemSummary,
        source_page: 'chatbot_widget',
        status: 'new',
        form_name: 'chatbot_lead',
        data: { name, email, phone, problem: problemSummary }
      })
      .select('id')
      .single()

    if (lead && sessionToken) {
      await getSupabase()
        .from('chat_sessions')
        .update({
          converted_to_lead: true,
          lead_form_id: lead.id,
          visitor_name: name,
          visitor_email: email
        })
        .eq('session_token', sessionToken)
    }

    return NextResponse.json({ success: true, leadId: lead?.id })
  } catch (error) {
    console.error('Lead capture error:', error)
    return NextResponse.json({ error: 'Failed to capture lead' }, { status: 500 })
  }
}
