'use client'

import dynamic from 'next/dynamic'

// Lazy load ChatWidget only when needed to reduce initial bundle size
const ChatWidget = dynamic(() => import('./ChatWidget'), {
  ssr: false,
  loading: () => null // No loading state needed - widget appears on demand
})

export default function ChatWidgetLoader() {
  return <ChatWidget />
}
