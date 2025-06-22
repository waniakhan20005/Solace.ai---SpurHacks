"use client";
import React from 'react';
import Image from 'next/image';
import { useVapi } from '@/hooks/useVapi';
 
const RadialCard: React.FC<{ audioLevel: number; isSpeechActive: boolean; toggleCall: () => void }> = ({ audioLevel, isSpeechActive, toggleCall }) => {
  return (
      <div className='relative flex items-center justify-center p-4 rounded-xl shadow-lg w-full h-full'>
        <div className="flex items-center justify-center h-full relative" style={{ width: '300px', height: '300px' }}>
          <div className="relative filter drop-shadow-lg" onClick={toggleCall} style={{ cursor: 'pointer', zIndex: 10 }}>
            <Image
              src="/smiley2.svg"
              alt="Smiley face with a headset"
              width={300}
              height={300}
              className="transform transition-transform duration-500 hover:scale-105"
            />
          </div>
          <span className="absolute top-48 w-[calc(100%-70%)] h-[calc(100%-70%)] bg-primary blur-[120px]"></span>
        </div>
      </div>
  );
};
 
export default RadialCard;