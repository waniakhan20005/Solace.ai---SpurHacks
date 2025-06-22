'use client';

import { useState } from 'react';
import { useVapi } from '@/hooks/useVapi';
import ConversationCard from './components/ConversationCard';

export default function Home() {
  return (
    <div className="bg-[url('/background.png')] bg-cover bg-center min-h-screen">
      <h1 className="text-center text-3xl font-mono">Solace.ai</h1>
    </div>
  );
}

// 🔁 Temporary mock response — will be replaced later with real GPT if needed
async function fakeGPTReply(input: string): Promise<string> {
  await new Promise((res) => setTimeout(res, 1000));
  return `Thanks for sharing. It sounds like you're overwhelmed. Be kind to yourself — tomorrow, just try to open your assignment doc after breakfast.`;
}
