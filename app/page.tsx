'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Squiggle = () => (
  <Image
    src="/squiggle.svg"
    alt="Squiggle"
    width={69}
    height={17}
  />
);

const NotionLogo = () => (
  <Image
    src="/notionicon.svg"
    alt="Notion Logo"
    width={24}
    height={24}
    className="inline"
  />
);

const SmileyWithHeadset = () => (
  <div className="relative filter drop-shadow-lg">
    <Image
      src="/smiley1.svg"
      alt="Smiley face with a headset"
      width={250}
      height={250}
      className="transform transition-transform duration-500 hover:scale-105"
    />
  </div>
);

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[url('/backround.svg')] bg-cover bg-center text-gray-800 font-sans">
      <div className="absolute top-8 left-8">
        <Squiggle />
      </div>

      <main className="flex flex-col items-center justify-center text-center px-8">
        <h1 className="font-roboto-mono font-normal text-[85px] tracking-wider mb-4">
          Solace.ai
        </h1>
        <p className="font-inter text-2xl text-gray-600 mb-[65px]">
          Talk it out. Track your growth
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-[150px]">
          <Link href="/dashboard" passHref>
            <button className="flex items-center justify-center px-8 py-4 border border-gray-300 rounded-full text-lg font-inter transform hover:bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 active:bg-gray-200/75">
              <span className="mr-3">Sign in with Notion</span>
              <NotionLogo />
            </button>
          </Link>
          <div className="mt-4 sm:mt-0">
             <SmileyWithHeadset />
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-8 max-w-xs text-center font-inter">
            By signing in you agree to our Privacy Policy, and Community
            Guidelines.
        </p>
      </main>
    </div>
  );
}