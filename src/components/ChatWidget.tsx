'use client'

import { useReducer, useRef, useEffect, useCallback, useState } from 'react'

type Message = { role: 'user' | 'assistant'; content: string; timestamp?: string }
type WidgetState =
  | { phase: 'CLOSED' }
  | { phase: 'OPEN' }
  | { phase: 'CHATTING'; messages: Message[]; msgCount: number }
  | { phase: 'LEAD_CAPTURE'; messages: Message[]; msgCount: number }
  | { phase: 'LEAD_CONFIRMED'; messages: Message[]; msgCount: number }

type Action =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'SHOW_LEAD_CAPTURE' }
  | { type: 'CONFIRM_LEAD' }

function reducer(state: WidgetState, action: Action): WidgetState {
  switch (action.type) {
    case 'OPEN':
      if (state.phase === 'CLOSED') return { phase: 'CHATTING', messages: [], msgCount: 0 }
      return state
    case 'CLOSE':
      return { phase: 'CLOSED' }
    case 'ADD_MESSAGE':
      if (state.phase === 'CHATTING' || state.phase === 'LEAD_CAPTURE' || state.phase === 'LEAD_CONFIRMED') {
        return { ...state, messages: [...state.messages, action.message], msgCount: state.msgCount + 1 }
      }
      return state
    case 'SHOW_LEAD_CAPTURE':
      if (state.phase === 'CHATTING') return { ...state, phase: 'LEAD_CAPTURE' }
      return state
    case 'CONFIRM_LEAD':
      if (state.phase === 'LEAD_CAPTURE') return { ...state, phase: 'LEAD_CONFIRMED' }
      return state
    default:
      return state
  }
}

const OPENING_MESSAGE: Message = {
  role: 'assistant',
  content: "Hi! I help families sort out career confusion. Is this for your child or yourself as a parent?",
  timestamp: new Date().toISOString()
}

export default function ChatWidget() {
  const [state, dispatch] = useReducer(reducer, { phase: 'CLOSED' })
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionToken] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    const stored = sessionStorage.getItem('chat_session_token')
    if (stored) return stored
    const token = crypto.randomUUID()
    sessionStorage.setItem('chat_session_token', token)
    return token
  })
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '' })
  const [leadSubmitting, setLeadSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return
    setInput('')

    const userMsg: Message = { role: 'user', content: text, timestamp: new Date().toISOString() }
    dispatch({ type: 'ADD_MESSAGE', message: userMsg })
    setIsTyping(true)

    const currentMessages = state.phase === 'CHATTING' || state.phase === 'LEAD_CAPTURE' || state.phase === 'LEAD_CONFIRMED'
      ? [...state.messages, userMsg]
      : [userMsg]

    const apiMessages = currentMessages.map(m => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          sessionToken,
          visitorMeta: { pageUrl: window.location.href }
        })
      })
      const data = await res.json()
      if (data.reply) {
        dispatch({ type: 'ADD_MESSAGE', message: { role: 'assistant', content: data.reply, timestamp: new Date().toISOString() } })
        // After 4 user messages, prompt lead capture
        const uCount = currentMessages.filter(m => m.role === 'user').length
        if (uCount >= 4 && state.phase === 'CHATTING') {
          dispatch({ type: 'SHOW_LEAD_CAPTURE' })
        }
      }
    } catch {
      dispatch({ type: 'ADD_MESSAGE', message: { role: 'assistant', content: "Sorry, something went wrong. Please try again.", timestamp: new Date().toISOString() } })
    } finally {
      setIsTyping(false)
    }
  }, [state, sessionToken])

  const submitLead = useCallback(async () => {
    if (!leadForm.name || !leadForm.email) return
    setLeadSubmitting(true)
    const msgs = state.phase === 'LEAD_CAPTURE' ? state.messages : []
    const summary = msgs.filter(m => m.role === 'user').map(m => m.content).join(' | ')
    try {
      await fetch('/api/chat/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...leadForm, sessionToken, problemSummary: summary })
      })
      dispatch({ type: 'CONFIRM_LEAD' })
      dispatch({ type: 'ADD_MESSAGE', message: { role: 'assistant', content: `Thank you ${leadForm.name}! Jasmeet will reach out to you at ${leadForm.email} within 24 hours. You can keep chatting in the meantime.`, timestamp: new Date().toISOString() } })
    } catch {
      dispatch({ type: 'ADD_MESSAGE', message: { role: 'assistant', content: "Couldn't save your details right now. Please try the contact form on the page.", timestamp: new Date().toISOString() } })
    } finally {
      setLeadSubmitting(false)
    }
  }, [leadForm, sessionToken, state])

  const handleOpen = () => {
    dispatch({ type: 'OPEN' })
    setTimeout(() => {
      dispatch({ type: 'ADD_MESSAGE', message: OPENING_MESSAGE })
    }, 300)
  }

  const messages = (state.phase === 'CHATTING' || state.phase === 'LEAD_CAPTURE' || state.phase === 'LEAD_CONFIRMED') ? state.messages : []
  const msgCount = (state.phase === 'CHATTING' || state.phase === 'LEAD_CAPTURE' || state.phase === 'LEAD_CONFIRMED') ? state.msgCount : 0

  return (
    <>
      {/* Floating button */}
      {state.phase === 'CLOSED' && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 w-15 h-15 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110"
          style={{ width: 60, height: 60 }}
          aria-label="Open career guidance chat"
        >
          <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        </button>
      )}

      {/* Chat panel */}
      {state.phase !== 'CLOSED' && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col w-[380px] max-w-[calc(100vw-24px)] h-[520px] max-h-[calc(100vh-80px)] bg-white rounded-2xl shadow-2xl overflow-hidden md:w-[380px] w-full md:right-6 right-0 md:bottom-6 bottom-0 md:max-w-[380px] md:h-[520px] h-[100dvh] md:rounded-2xl rounded-none">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">JS</div>
              <div>
                <p className="text-white font-bold text-sm">Career Guidance</p>
                <p className="text-purple-200 text-xs">Powered by Jasmeet Singh</p>
              </div>
            </div>
            <button
              onClick={() => dispatch({ type: 'CLOSE' })}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-1">JS</div>
                )}
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#7C3AED] text-white rounded-tr-sm' : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">JS</div>
                <div className="bg-white shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                  {[0,1,2].map(i => <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }}/>)}
                </div>
              </div>
            )}
            {/* Lead capture inline form */}
            {state.phase === 'LEAD_CAPTURE' && (
              <div className="bg-[#F3EFFF] border border-[#7C3AED]/20 rounded-2xl p-4 mt-1">
                <p className="text-xs font-semibold text-[#7C3AED] mb-3">Book a free clarity call with Jasmeet</p>
                <input
                  value={leadForm.name}
                  onChange={e => setLeadForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-2 outline-none focus:border-[#7C3AED]"
                />
                <input
                  type="email"
                  value={leadForm.email}
                  onChange={e => setLeadForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="Email address"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-2 outline-none focus:border-[#7C3AED]"
                />
                <input
                  value={leadForm.phone}
                  onChange={e => setLeadForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="Phone (optional)"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3 outline-none focus:border-[#7C3AED]"
                />
                <button
                  onClick={submitLead}
                  disabled={leadSubmitting || !leadForm.name || !leadForm.email}
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
                >
                  {leadSubmitting ? 'Saving…' : 'Get My Free Call'}
                </button>
              </div>
            )}
            <div ref={messagesEndRef}/>
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 bg-white p-3 flex-shrink-0">
            {msgCount >= 3 && state.phase !== 'LEAD_CONFIRMED' && (
              <a href="#contact" onClick={() => dispatch({ type: 'CLOSE' })} className="block text-center text-[#7C3AED] text-xs font-semibold mb-2 hover:underline">
                Book a Free Call Directly
              </a>
            )}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
                placeholder="Type your question…"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7C3AED] transition-colors"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center justify-center transition-colors disabled:opacity-50 flex-shrink-0"
              >
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
