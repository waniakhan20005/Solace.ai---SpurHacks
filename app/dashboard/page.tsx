'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Squiggle = () => (
    <Image
      src="/squiggle.svg"
      alt="Squiggle"
      width={69}
      height={17}
    />
);

const SmileyWithHeadset = () => (
    <div className="relative filter drop-shadow-lg">
      <Image
        src="/smiley2.svg"
        alt="Smiley face with a headset"
        width={250}
        height={250}
        className="transform transition-transform duration-500 hover:scale-105"
      />
    </div>
);

export default function DashboardPage() {
  const userName = 'Sumayyah';
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[url('/homebackround.svg')] bg-cover bg-center text-gray-800 font-sans p-4">
        <div className="absolute top-8 left-8">
            <button 
              onClick={() => router.push('/')} 
              className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 hover:bg-gray-500/10"
              aria-label="Go to homepage"
            >
                <Squiggle />
            </button>
        </div>

        <main className="flex flex-col items-center justify-center text-center gap-10">
            <h1 className="font-roboto-mono font-normal text-6xl tracking-wider leading-tight">
                Hi, <span className="font-semibold">{userName}!</span>
                <br />
                Ready to check in?
            </h1>
            <p className="font-inter text-2xl text-gray-600 mb-10">
                How are you feeling today?
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-x-[150px] gap-y-10">
                <div className="flex flex-col gap-4 w-64">
                    <Link href="/call" passHref>
                        <button className="w-full px-6 py-3 border border-gray-400 rounded-full text-lg font-inter transform transition-all duration-300 ease-in-out hover:bg-gray-100/50 hover:scale-105 active:scale-95">
                            Start Call
                        </button>
                    </Link>
                    <Link href="/view-in-notion" passHref>
                        <button className="w-full px-6 py-3 border border-gray-400 rounded-full text-lg font-inter transform transition-all duration-300 ease-in-out hover:bg-gray-100/50 hover:scale-105 active:scale-95">
                            View Journal
                        </button>
                    </Link>
                </div>

                <div className="flex-shrink-0">
                    <SmileyWithHeadset />
                </div>
            </div>
        </main>
    </div>
  );
} 