'use client';

import { useState } from 'react';
import { useVapi } from '@/hooks/useVapi';

export default function Home() {
  const [userInput, setUserInput] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [listening, setListening] = useState<boolean>(false);
  const [callActive, setCallActive] = useState<boolean>(false);


  const { isSpeechActive, audioLevel, activeTranscript, start, stop, toggleCall } = useVapi();
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
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">🧠 Proactive Progress AI</h1>
        <p className="text-center text-gray-600">
          Talk to me about your day. I’ll listen and suggest a small task for tomorrow.
        </p>

        <textarea
          className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring"
          placeholder="Speak or type here..."
          value={activeTranscript?.transcript || userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            onClick={startListening}
            className={`flex-1 ${
              listening ? 'bg-yellow-500' : 'bg-blue-500'
            } text-white py-2 px-4 rounded-lg hover:opacity-90`}
          >
            {listening ? 'Listening...' : '🎤 Start Talking'}
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Thinking...' : '🧠 Get Advice'}
          </button>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={startCall}
            disabled={callActive}
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            📞 Call AI
          </button>

          {callActive && (
            <button
              onClick={endCall}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
            >
              🔴 Hang Up
            </button>
          )}
        </div>

        {aiResponse && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">AI Advice:</h2>
            <p className="text-gray-800 mt-2">{aiResponse}</p>
            <button
              onClick={playAdvice}
              className="mt-3 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
            >
              🔊 Hear it
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// 🔁 Temporary mock response — will be replaced later with real GPT if needed
async function fakeGPTReply(input: string): Promise<string> {
  await new Promise((res) => setTimeout(res, 1000));
  return `Thanks for sharing. It sounds like you're overwhelmed. Be kind to yourself — tomorrow, just try to open your assignment doc after breakfast.`;
}
