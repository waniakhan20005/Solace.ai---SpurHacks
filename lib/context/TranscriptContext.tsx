"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Message } from '@/lib/types/conversation.type';

interface TranscriptContextType {
  transcriptData: {
    messages: Message[];
    completeTranscript: string;
  } | null;
  setTranscriptData: (data: { messages: Message[]; completeTranscript: string } | null) => void;
}

const TranscriptContext = createContext<TranscriptContextType | undefined>(undefined);

export function TranscriptProvider({ children }: { children: ReactNode }) {
  const [transcriptData, setTranscriptData] = useState<{
    messages: Message[];
    completeTranscript: string;
  } | null>(null);

  return (
    <TranscriptContext.Provider value={{ transcriptData, setTranscriptData }}>
      {children}
    </TranscriptContext.Provider>
  );
}

export function useTranscript() {
  const context = useContext(TranscriptContext);
  if (context === undefined) {
    throw new Error('useTranscript must be used within a TranscriptProvider');
  }
  return context;
} 