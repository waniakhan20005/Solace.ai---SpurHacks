"use client";
import { useVapi } from "@/hooks/useVapi";
import RadialCard from "../components/RadialCard";
import ConversationCard from "../components/ConversationCard";
import SummarySection from "../components/SummaryButton";
import { useEffect, useState, useMemo } from "react";
import { MessageTypeEnum, TranscriptMessageTypeEnum } from "@/lib/types/conversation.type";

export default function Home() {
  const { audioLevel, isSpeechActive, toggleCall, messages, activeTranscript } = useVapi();
  const [transcript, setTranscript] = useState<string>("");

  const completeTranscript = useMemo(() => {
    let fullTranscript = "";
    
    messages.forEach((message) => {
      if (message.type === MessageTypeEnum.TRANSCRIPT && 
          message.transcriptType === TranscriptMessageTypeEnum.FINAL) {
        fullTranscript += `${message.role === 'user' ? 'User' : 'Assistant'}: ${message.transcript}\n\n`;
      }
    });
    
    if (activeTranscript && activeTranscript.transcriptType === TranscriptMessageTypeEnum.PARTIAL) {
      fullTranscript += `${activeTranscript.role === 'user' ? 'User' : 'Assistant'}: ${activeTranscript.transcript}...\n\n`;
    }
    
    return fullTranscript.trim();
  }, [messages, activeTranscript]);

  useEffect(() => {
    setTranscript(completeTranscript);
  }, [completeTranscript]);

  console.log("transcript", transcript);
  return (
    <main className="flex flex-col lg:flex-row min-h-screen w-screen p-4 lg:p-6 gap-6 bg-gray-50">
      {/* Left Column */}
      <div className="flex flex-col w-full lg:w-1/2 h-auto lg:h-full gap-6">
        {/* Radial Card - No longer wrapped in a separate card div */}
        <div className="flex-1 flex items-center justify-center">
          <RadialCard audioLevel={audioLevel} isSpeechActive={isSpeechActive} toggleCall={toggleCall} />
        </div>

        {/* AI Summary Section */}
        <SummarySection transcript={transcript} />
      </div>

      {/* Right Column (Conversation) */}
      <div className="w-full lg:w-1/2 h-screen lg:h-full">
        <ConversationCard messages={messages} activeTranscript={activeTranscript?.transcript} />
      </div>
    </main>
  );
}