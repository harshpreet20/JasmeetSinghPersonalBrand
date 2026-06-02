import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function buildSystemPrompt(): Promise<string> {
  const { data: knowledge } = await supabase
    .from('chatbot_knowledge')
    .select('category, title, content')
    .eq('is_active', true)
    .order('sort_order')

  const knowledgeText = knowledge
    ?.map(k => `[${k.category.toUpperCase()}] ${k.title}:\n${k.content}`)
    .join('\n\n') || ''

  return `You are Jasmeet Singh's career guidance assistant. You help Indian families — especially parents of students in Class 8 through college — figure out the right career path for their child.

Your personality: Direct, warm, solution-oriented. You speak like a trusted older sibling who has figured things out. Never vague. Always practical.

CRITICAL RULES:
1. Always speak from the family's pain point first — the confusion, the disagreement, the pressure.
2. Never give generic career advice. If someone asks "what career should my child choose", ask about their child's strengths and current situation before answering.
3. After 3-4 exchanges, if the visitor seems genuinely interested, gently ask for their name and email to book a free clarity call.
4. Never mention competitors. Never say "it depends" without immediately following it with what it depends on.
5. Do not make up facts. If you do not know something specific, say: "Let me connect you with Jasmeet directly — he will give you the exact answer."
6. Always end responses with a question that moves the conversation forward.

CONTEXT — Jasmeet's Services and Knowledge Base:
${knowledgeText}

TARGET AUDIENCE: Middle-class Indian families. Parents are your primary audience. They worry about: job security, ROI on education, social standing, their child's happiness, and not making the wrong choice. Acknowledge these worries explicitly. They are real.

LEAD CAPTURE: When a visitor shares their situation in detail, say: "This sounds like exactly what Jasmeet's Family Alignment Session is designed for. Can I take your name and email so he can reach out personally?" If they agree, acknowledge it and tell them you are logging their information.`
}

export async function POST(req: NextRequest) {
  try {
    const { messages, sessionToken, visitorMeta } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    const systemPrompt = await buildSystemPrompt()

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: systemPrompt,
      messages: messages.slice(-10),
    })

    const reply = response.content[0].type === 'text' ? response.content[0].text : ''

    if (sessionToken) {
      const { data: existing } = await supabase
        .from('chat_sessions')
        .select('id, messages')
        .eq('session_token', sessionToken)
        .single()

      const updatedMessages = [
        ...(existing?.messages || []),
        ...messages.slice(existing?.messages?.length || 0),
        { role: 'assistant', content: reply, timestamp: new Date().toISOString() }
      ]

      if (existing) {
        await supabase
          .from('chat_sessions')
          .update({ messages: updatedMessages, ...(visitorMeta || {}) })
          .eq('session_token', sessionToken)
      } else {
        await supabase.from('chat_sessions').insert({
          session_token: sessionToken,
          messages: updatedMessages,
          page_url: visitorMeta?.pageUrl,
          ...(visitorMeta || {})
        })
      }
    }

    return NextResponse.json({ reply, usage: response.usage })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 })
  }
}
