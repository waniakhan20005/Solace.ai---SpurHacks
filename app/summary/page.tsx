'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiX, FiCopy, FiDownload } from 'react-icons/fi';
import Image from 'next/image';
import { useTranscript } from '@/lib/context/TranscriptContext';

const Squiggle = () => <Image src="/squiggle.svg" alt="Squiggle" width={69} height={17} />;

const InfoCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="border border-gray-400 rounded-3xl p-6 bg-white/30 backdrop-blur-sm">
        <h2 className="font-semibold text-lg mb-3">{title}</h2>
        <div className="text-gray-700 space-y-2">
            {children}
        </div>
    </div>
);

const LinedListItem = ({ text }: { text: string }) => (
    <div className="border-b border-gray-400 pb-2">
        {text}
    </div>
);

const ControlButton = ({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick?: () => void }) => (
    <div className="flex flex-col items-center gap-2">
        <button 
            onClick={onClick}
            className="flex items-center justify-center w-16 h-16 border border-gray-400 rounded-full text-gray-600 transform transition-all duration-300 ease-in-out hover:bg-gray-200/50 hover:scale-110 active:scale-95"
        >
            <Icon className="w-7 h-7" />
        </button>
        <span className="text-gray-600 text-sm">{label}</span>
    </div>
);

export default function SummaryPage() {
    const router = useRouter();
    const { transcriptData } = useTranscript();
    const [summary, setSummary] = useState<string>("");
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [isAddingToNotion, setIsAddingToNotion] = useState(false);
    const [summaryError, setSummaryError] = useState<string>("");
    const [notionError, setNotionError] = useState<string>("");
    const [notionSuccess, setNotionSuccess] = useState<string>("");
    const [notionUrl, setNotionUrl] = useState<string>("");
    const [moodTone, setMoodTone] = useState<string[]>([]);
    const [advice, setAdvice] = useState<string[]>([]);

    const generateSummary = async () => {
        if (!transcriptData?.completeTranscript?.trim()) {
            setSummaryError("No transcript available to summarize");
            return;
        }

        setIsGeneratingSummary(true);
        setSummaryError("");

        try {
            const response = await fetch('/api/generate-summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transcript: transcriptData.completeTranscript }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Use the structured data directly from the API response
            setSummary(data.summary || "No summary generated");
            setMoodTone(data.mood || ["Neutral"]);
            setAdvice(data.advices || ["Take time to reflect on your feelings"]);

        } catch (error) {
            console.error('Failed to generate summary:', error);
            setSummaryError(error instanceof Error ? error.message : 'Failed to generate summary');
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    const addToNotion = async () => {
        if (!summary.trim()) {
            setNotionError("No summary available to add to Notion");
            return;
        }

        setIsAddingToNotion(true);
        setNotionError("");
        setNotionSuccess("");

        try {
            const response = await fetch('/api/add-to-notion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    transcript: transcriptData?.completeTranscript || '', 
                    summary,
                    mood: moodTone,
                    advices: advice
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setNotionSuccess(data.message || "Successfully added to Notion");
            setNotionUrl(data.url || "");
        } catch (error) {
            console.error('Failed to add to Notion:', error);
            setNotionError(error instanceof Error ? error.message : 'Failed to add to Notion');
        } finally {
            setIsAddingToNotion(false);
        }
    };

    // Auto-generate summary when page loads if transcript data is available
    useEffect(() => {
        if (transcriptData?.completeTranscript && !summary) {
            generateSummary();
        }
    }, [transcriptData]);

    return (
        <div className="min-h-screen bg-[url('/backround.svg')] bg-cover bg-center font-inter text-gray-800 p-8">
            <header className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                    <button 
                      onClick={() => router.back()} 
                      className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 hover:bg-gray-500/10"
                      aria-label="Go back"
                    >
                        <Squiggle />
                    </button>
                    <p className="text-lg font-inter">Date: {new Date().toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                    })}</p>
                </div>
                <h1 className="font-roboto-mono font-normal text-6xl tracking-wider">Summary</h1>
                <div className="flex items-center gap-6">
                    <ControlButton icon={FiX} label="Exit" onClick={() => router.push('/dashboard')} />
                    <ControlButton icon={FiCopy} label="Copy" />
                    <ControlButton 
                        icon={FiDownload} 
                        label="Save" 
                        onClick={addToNotion}
                    />
                </div>
            </header>

            {/* Error Messages */}
            {(summaryError || notionError || notionSuccess) && (
                <div className="mb-8 space-y-2">
                    {summaryError && (
                        <div className="text-red-600 text-center bg-red-50 p-3 rounded-lg">
                            Error: {summaryError}
                        </div>
                    )}
                    {notionError && (
                        <div className="text-red-600 text-center bg-red-50 p-3 rounded-lg">
                            Notion Error: {notionError}
                        </div>
                    )}
                    {notionSuccess && (
                        <div className="text-green-600 text-center bg-green-50 p-3 rounded-lg">
                            {notionSuccess}
                            {notionUrl && (
                                <div className="mt-2">
                                    <a 
                                        href={notionUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                        View in Notion →
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Generate Summary Button */}
            {!summary && transcriptData?.completeTranscript && (
                <div className="mb-8 text-center">
                    <button
                        onClick={generateSummary}
                        disabled={isGeneratingSummary}
                        className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-inter"
                    >
                        {isGeneratingSummary ? 'Generating Summary...' : 'Generate Summary'}
                    </button>
                </div>
            )}

            <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                    <InfoCard title="How was my day:">
                        {summary ? (
                            <p>{summary}</p>
                        ) : (
                            <p className="text-gray-500 italic">
                                {transcriptData?.completeTranscript ? 
                                    "Click 'Generate Summary' to analyze your conversation" : 
                                    "No transcript available to summarize"
                                }
                            </p>
                        )}
                    </InfoCard>
                    <InfoCard title="Overall Mood/Tone:">
                        {moodTone.length > 0 ? (
                            moodTone.map((mood, index) => (
                                <LinedListItem key={index} text={`${index + 1}. ${mood.charAt(0).toUpperCase() + mood.slice(1)}`} />
                            ))
                        ) : (
                            <p className="text-gray-500 italic">Mood analysis will appear here after generating summary</p>
                        )}
                    </InfoCard>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    <InfoCard title="Advise / Next Steps:">
                        {advice.length > 0 ? (
                            advice.map((item, index) => (
                                <LinedListItem key={index} text={`${index + 1}. ${item}`} />
                            ))
                        ) : (
                            <p className="text-gray-500 italic">Advice and next steps will appear here after generating summary</p>
                        )}
                    </InfoCard>
                    <InfoCard title="Extra Notes:">
                        <div className="h-40 text-gray-500 italic">
                            Additional insights and notes will appear here
                        </div>
                    </InfoCard>
                </div>
            </main>
        </div>
    );
} 