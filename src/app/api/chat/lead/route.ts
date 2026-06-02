import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return typeof email === 'string' && emailRegex.test(email) && email.length <= 255
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^[0-9+\-\s()]{6,20}$/
  return typeof phone === 'string' && phoneRegex.test(phone) && phone.length <= 20
}

function validateName(name: string): boolean {
  return typeof name === 'string' && name.length >= 2 && name.length <= 255
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, sessionToken, problemSummary } = await req.json()

    // Validate required fields
    if (!validateName(name)) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
    }
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (!validatePhone(phone)) {
      return NextResponse.json({ error: 'Invalid phone' }, { status: 400 })
    }

    // Validate problemSummary if provided
    if (problemSummary && (typeof problemSummary !== 'string' || problemSummary.length > 2000)) {
      return NextResponse.json({ error: 'Invalid problem summary' }, { status: 400 })
    }

    // Validate sessionToken if provided
    if (sessionToken && (typeof sessionToken !== 'string' || sessionToken.length > 255)) {
      return NextResponse.json({ error: 'Invalid sessionToken' }, { status: 400 })
    }

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
