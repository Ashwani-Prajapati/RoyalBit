import React from 'react';
import { Crown } from 'lucide-react';

export const RoyalLogo = ({ size = 'md', showTagline = true, useImage = true }) => {
  if (useImage) {
    return (
      <div className="flex items-center gap-3">
        <div className="relative group flex items-center justify-center">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
          <img 
            src="/images/royalbit-logo.jpg" 
            alt="RoyalBit" 
            className={`relative rounded-lg object-contain shadow-lg ${
              size === 'sm' ? 'h-9 w-auto' : size === 'lg' ? 'h-16 w-auto' : 'h-11 w-auto'
            }`}
          />
        </div>
        {showTagline && (
          <div className="hidden sm:flex flex-col">
            <span className="font-extrabold tracking-wider text-white text-lg leading-tight font-['Outfit']">
              ROYAL<span className="text-cyan-400">BIT</span>
            </span>
            <span className="text-[10px] text-cyan-200/80 font-medium tracking-widest uppercase">
              The Future of Digital Finance
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-900 p-0.5 shadow-lg shadow-cyan-500/20">
        <div className="w-full h-full bg-[#08122c] rounded-[10px] flex items-center justify-center">
          <Crown className="w-5 h-5 text-amber-400 fill-amber-400/20" />
        </div>
      </div>
      <div>
        <div className="text-lg font-black tracking-wider text-white font-['Outfit'] flex items-center gap-1">
          ROYAL<span className="text-cyan-400">BIT</span>
        </div>
        {showTagline && (
          <div className="text-[10px] tracking-widest uppercase font-semibold text-cyan-300/70">
            The Future of Digital Finance
          </div>
        )}
      </div>
    </div>
  );
};

