'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { FiMic, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useVapi } from "@/hooks/useVapi";
import RadialCard from "../components/RadialCard";
import ConversationCard from "../components/ConversationCard";
import SummarySection from "../components/SummaryButton";
import { MessageTypeEnum, TranscriptMessageTypeEnum } from "@/lib/types/conversation.type";
import { useTranscript } from "@/lib/context/TranscriptContext";

const SmileyWithHeadset = () => (
    <div className="relative filter drop-shadow-lg">
      <Image
        src="/smiley2.svg"
        alt="Smiley face with a headset"
        width={300}
        height={300}
        className="transform transition-transform duration-500 hover:scale-105"
      />
    </div>
);

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

export default function CallPage() {
    const router = useRouter();
    const { audioLevel, isSpeechActive, toggleCall, messages, activeTranscript } = useVapi();
    const [transcript, setTranscript] = useState<string>("");
    const { setTranscriptData } = useTranscript();

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

    const handleExit = () => {
        // Pass the transcript data to the context
        setTranscriptData({
            messages: messages,
            completeTranscript: transcript
        });
        router.push('/transcript');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBF3E9] text-gray-800 font-inter p-4">
            <div className="flex items-center justify-center w-full h-full">
                <div className="flex items-center justify-center">
                    <RadialCard audioLevel={audioLevel} isSpeechActive={isSpeechActive} toggleCall={toggleCall} />
                </div>
            </div>
            
            {/* Control buttons at bottom */}
            <div className="absolute bottom-16 flex items-center gap-8">
                <ControlButton icon={FiMic} label="Mute" />
                <ControlButton icon={FiX} label="Exit" onClick={handleExit} />
            </div>
        </div>
    );
} 