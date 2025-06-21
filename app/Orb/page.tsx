"use client";
import { useVapi } from "@/hooks/useVapi";
import RadialCard from "../components/RadialCard";
import ConversationCard from "../components/ConversationCard";

export default function Home() {
  const { audioLevel, isSpeechActive, toggleCall, messages, activeTranscript } = useVapi();

  return (
    <main className="flex flex-col lg:flex-row min-h-screen w-screen p-4 lg:p-6 gap-6 bg-gray-50">
      {/* Left Column */}
      <div className="flex flex-col w-full lg:w-1/2 h-auto lg:h-full gap-6">
        {/* Radial Card - No longer wrapped in a separate card div */}
        <div className="flex-1 flex items-center justify-center">
          <RadialCard audioLevel={audioLevel} isSpeechActive={isSpeechActive} toggleCall={toggleCall} />
        </div>

        {/* AI Summary Section */}
        <div className="h-48 lg:h-1/3 bg-white rounded-xl shadow-lg p-6 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">AI Summary & Recommendations</h2>
          <div className="text-gray-600 space-y-2">
            <p>Your AI-powered summary and next steps will appear here after the conversation.</p>
          </div>
        </div>
      </div>

      {/* Right Column (Conversation) */}
      <div className="w-full lg:w-1/2 h-screen lg:h-full">
        <ConversationCard messages={messages} activeTranscript={activeTranscript?.transcript} />
      </div>
    </main>
  );
}