'use client';

/**
 * Lazy-loads the global chat widget so route HTML can render without eagerly
 * pulling Framer Motion and streaming-chat code into every initial page chunk.
 */

import dynamic from 'next/dynamic';

const LazyChatWidget = dynamic(
  () => import('@/components/ui/ChatWidget').then((module) => module.ChatWidget),
  {
    ssr: false,
    loading: () => null,
  },
);

export function ChatWidgetLoader() {
  return <LazyChatWidget />;
}