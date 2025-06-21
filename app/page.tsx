'use client';

import { useState } from 'react';
import { useVapi } from '@/hooks/useVapi';
import ConversationCard from './components/ConversationCard';

export default function Home() {
  const [userInput, setUserInput] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [listening, setListening] = useState<boolean>(false);
  const [callActive, setCallActive] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);

  const { 
    isSpeechActive, 
    audioLevel, 
    activeTranscript, 
    messages,
    start, 
    stop, 
    toggleCall 
  } = useVapi();

  const startCall = () => {
    setCallActive(true);
    toggleCall();
    start();
  }
  
  const endCall = () => {
    stop();
    setCallActive(false);
  };

  // 🧠 Submit Text to Fake GPT
  const handleSubmit = async (): Promise<void> => {
    if (!userInput.trim()) return;

    setLoading(true);
    setAiResponse('');

    const mockResponse = await fakeGPTReply(userInput);

    setAiResponse(mockResponse);
    setLoading(false);
  };

  // 🔊 Speak AI Response
  const playAdvice = (): void => {
    if (!aiResponse) return;
    const utterance = new SpeechSynthesisUtterance(aiResponse);
    speechSynthesis.speak(utterance);
  };

  // 🎙️ Voice-to-text Input
  const startListening = () => {
    setCallActive(true);
    toggleCall();
    start();
    setListening(true);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🧠 Proactive Progress AI</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Talk to me about your day. I'll listen and suggest a small task for tomorrow.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">💬 Start Conversation</h2>
          
          <textarea
            className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Speak or type here..."
            value={activeTranscript?.transcript || userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              onClick={startListening}
              className={`flex-1 ${
                listening ? 'bg-yellow-500' : 'bg-blue-500'
              } text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity`}
            >
              {listening ? 'Listening...' : '🎤 Start Talking'}
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Thinking...' : '🧠 Get Advice'}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={startCall}
              disabled={callActive}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              📞 Call AI
            </button>

            {callActive && (
              <button
                onClick={endCall}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                🔴 Hang Up
              </button>
            )}
          </div>

          {/* Show Transcript Button */}
          {messages.length > 0 && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {showTranscript ? '📋 Hide Transcript' : '📋 Show Final Transcript'}
              </button>
            </div>
          )}

          {/* Transcript Display */}
          {showTranscript && messages.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Final Transcript</h3>
              <ConversationCard 
                messages={messages} 
                activeTranscript={null}
              />
            </div>
          )}

          {aiResponse && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800">AI Advice:</h3>
              <p className="text-green-700 mt-2">{aiResponse}</p>
              <button
                onClick={playAdvice}
                className="mt-3 bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition-colors"
              >
                🔊 Hear it
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// 🔁 Temporary mock response — will be replaced later with real GPT if needed
async function fakeGPTReply(input: string): Promise<string> {
  await new Promise((res) => setTimeout(res, 1000));
  return `Thanks for sharing. It sounds like you're overwhelmed. Be kind to yourself — tomorrow, just try to open your assignment doc after breakfast.`;
}
