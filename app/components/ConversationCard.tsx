"use client";
import React from "react";
import { Message, MessageRoleEnum, MessageTypeEnum } from "@/lib/types/conversation.type";

interface ConversationCardProps {
  messages: Message[];
  activeTranscript?: string | null;
}

const ConversationCard: React.FC<ConversationCardProps> = ({ 
  messages, 
  activeTranscript 
}) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageContent = (message: Message): string => {
    switch (message.type) {
      case MessageTypeEnum.TRANSCRIPT:
        return message.transcript || "";
      case MessageTypeEnum.FUNCTION_CALL:
        return `Function called: ${message.functionCall.name}`;
      case MessageTypeEnum.FUNCTION_CALL_RESULT:
        return `Function result: ${JSON.stringify(message.functionCallResult.result)}`;
      default:
        return "";
    }
  };

  const getMessageRole = (message: Message): string => {
    if (message.type === MessageTypeEnum.TRANSCRIPT) {
      return message.role === MessageRoleEnum.USER ? "User" : "AI";
    }
    return ""; // Return empty string for system messages
  };

  const getMessageIcon = (role: string) => {
    switch (role) {
      case "User":
        return "👤";
      case "AI":
        return "🤖";
      default:
        return "⚙️";
    }
  };

  const getMessageColor = (role: string) => {
    switch (role) {
      case "User":
        return "bg-blue-50 border-blue-200";
      case "AI":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  // Filter out empty messages and combine consecutive messages from same speaker
  const processedMessages = messages
    .filter(message => {
      const content = getMessageContent(message);
      return content && content.trim() !== '';
    })
    .reduce((acc, message) => {
      const role = getMessageRole(message);
      const content = getMessageContent(message);
      
      if (!role) {
        // System message - add as separate message
        acc.push({ role, content, timestamp: formatTime(Date.now()) });
      } else if (acc.length > 0 && acc[acc.length - 1].role === role) {
        // Same speaker - combine content
        acc[acc.length - 1].content += " " + content;
      } else {
        // Different speaker - add new message
        acc.push({ role, content, timestamp: formatTime(Date.now()) });
      }
      
      return acc;
    }, [] as Array<{ role: string; content: string; timestamp: string }>);

  console.log("Processed messages:", processedMessages);

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex-shrink-0">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          💬 Conversation History
        </h2>
        <p className="text-purple-100 text-sm mt-1">
          {processedMessages.length} messages exchanged
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {processedMessages.length === 0 && !activeTranscript ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">💭</div>
            <p>No conversation yet. Start talking to see the history!</p>
          </div>
        ) : (
          processedMessages.map((message, index) => (
            <div key={index} className={`rounded-lg border p-4 ${getMessageColor(message.role)}`}>
              <div className="flex items-start gap-3">
                {message.role && <div className="text-2xl">{getMessageIcon(message.role)}</div>}
                <div className="flex-1 min-w-0">
                  {message.role && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">
                        {message.role}
                      </span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp}
                      </span>
                    </div>
                  )}
                  <div className="text-gray-700 leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Active Transcript (if any) */}
        {activeTranscript && (
          <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎤</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">
                    User (Listening...)
                  </span>
                  <span className="text-xs text-yellow-600 bg-yellow-200 px-2 py-1 rounded-full">
                    Live
                  </span>
                </div>
                <div className="text-gray-700 leading-relaxed">
                  {activeTranscript}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t flex-shrink-0">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
              User
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-400 rounded-full"></span>
              AI
            </span>
          </div>
          <span className="text-xs">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard; 