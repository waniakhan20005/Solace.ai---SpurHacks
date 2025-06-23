'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Squiggle = () => (
    <Image src="/squiggle.svg" alt="Squiggle" width={69} height={17} />
);

const NotionLogo = () => (
    <Image src="/notionicon.svg" alt="Notion Logo" width={24} height={24} className="inline" />
);

const SmileyWithHeadset = () => (
    <div className="relative filter drop-shadow-lg">
      <Image
        src="/smiley3.svg"
        alt="Smiley face with a headset"
        width={250}
        height={250}
        className="transform transition-transform duration-500 hover:scale-105"
      />
    </div>
);

export default function JournalPage() {
    const router = useRouter();

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[url('/backround3.svg')] bg-cover bg-center text-gray-800 font-sans p-4">
            <div className="absolute top-8 left-8">
                <button 
                  onClick={() => router.push('/dashboard')} 
                  className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 hover:bg-gray-500/10"
                  aria-label="Go to dashboard"
                >
                    <Squiggle />
                </button>
            </div>

            <main className="flex flex-col items-center justify-center text-center px-8">
                <h1 className="font-roboto-mono font-normal text-[85px] tracking-wider mb-4">
                    Solace.ai
                </h1>
                <p className="text-xl text-gray-600 mb-8 font-inter">
                    Journaling made easy as talking.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-[150px]">
                    <button className="flex items-center justify-center px-8 py-4 border border-gray-400 rounded-full text-lg font-inter transform transition-all duration-300 ease-in-out hover:bg-gray-100/50 hover:scale-105 active:scale-95">
                        View on Notion
                        <span className="ml-3"><NotionLogo /></span>
                    </button>
                    <div className="mt-4 sm:mt-0">
                        <SmileyWithHeadset />
                    </div>
                </div>
            </main>
        </div>
    );
} 