'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiX, FiFileText, FiDownload } from 'react-icons/fi';
import { Message, MessageRoleEnum, MessageTypeEnum } from '@/lib/types/conversation.type';
import { useTranscript } from '@/lib/context/TranscriptContext';

const ChatBubble = ({ speaker, text, timestamp }: { speaker: string, text: string, timestamp: string | null }) => {
    const isUser = speaker === 'user';
    return (
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full`}>
            <div className={`px-6 py-4 border border-gray-400 rounded-3xl ${isUser ? 'bg-white/50' : 'bg-white/70'} max-w-2xl`}>
                <p className="text-gray-800 font-inter">{text}</p>
            </div>
            {timestamp && <span className="mt-2 text-xs text-gray-500 font-inter">{timestamp}</span>}
        </div>
    );
};

const ControlButton = ({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick?: () => void }) => (
    <div className="flex flex-col items-center gap-2">
        <button 
            onClick={onClick}
            className="flex items-center justify-center w-20 h-20 border border-gray-400 rounded-full text-gray-600 transform transition-all duration-300 ease-in-out hover:bg-gray-200/50 hover:scale-110 active:scale-95"
        >
            <Icon className="w-8 h-8" />
        </button>
        <span className="text-gray-600 font-inter">{label}</span>
    </div>
);

export default function TranscriptPage() {
    const router = useRouter();
    const { transcriptData } = useTranscript();
    const [transcriptMessages, setTranscriptMessages] = useState<any[]>([]);

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
            return message.role === MessageRoleEnum.USER ? "user" : "ai";
        }
        return ""; // Return empty string for system messages
    };

    useEffect(() => {
        if (transcriptData) {
            const messages = transcriptData.messages || [];
            
            // Use the same processing logic as ConversationCard
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
                        acc.push({ speaker: 'system', text: content, timestamp: formatTime(Date.now()) });
                    } else if (acc.length > 0 && acc[acc.length - 1].speaker === role) {
                        // Same speaker - combine content
                        acc[acc.length - 1].text += " " + content;
                    } else {
                        // Different speaker - add new message
                        acc.push({ speaker: role, text: content, timestamp: formatTime(Date.now()) });
                    }
                    
                    return acc;
                }, [] as Array<{ speaker: string; text: string; timestamp: string }>);
            
            setTranscriptMessages(processedMessages);
        }
    }, [transcriptData]);

    return (
        <div className="min-h-screen flex flex-col justify-between bg-[#FBF3E9] font-inter p-8 md:p-16">
            <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full">
                {transcriptMessages.length > 0 ? (
                    transcriptMessages.map((message, index) => (
                        <ChatBubble key={index} {...message} />
                    ))
                ) : (
                    <div className="text-center text-gray-600">
                        <p>No transcript available</p>
                        <p className="text-sm mt-2">Start a conversation to generate a transcript</p>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-center gap-8 mt-16">
                <ControlButton icon={FiX} label="Exit" onClick={() => router.push('/dashboard')} />
                <ControlButton icon={FiFileText} label="View Entry" onClick={() => {
                    // Pass the transcript data to the summary page via context
                    if (transcriptData) {
                        router.push('/summary');
                    }
                }} />
                <ControlButton icon={FiDownload} label="Save" onClick={() => router.push('/view-in-notion')} />
            </div>
        </div>
    );
} 