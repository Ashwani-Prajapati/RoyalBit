import React from 'react';
import { RoyalLogo } from './RoyalLogo';
import { ShieldCheck, Heart, Award, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#030611] border-t border-cyan-950/80 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          <div className="md:col-span-2 space-y-4">
            <RoyalLogo size="md" showTagline={true} />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              RoyalBit is a next-generation crypto investment platform delivering algorithmic 2% daily ROI returns for 80 days with a 15-level affiliate matrix and strict 4X capital safety capping.
            </p>
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Cryptographic Security & Transparent Isolated Ledgers</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 font-['Outfit'] tracking-wider">
              Platform Rules
            </h4>
            <ul className="space-y-2">
              <li className="hover:text-cyan-300 transition">Base Package: $5 USD</li>
              <li className="hover:text-cyan-300 transition">Daily ROI: 2% (80 Days / 160%)</li>
              <li className="hover:text-cyan-300 transition">Direct Referral: 5% Bonus</li>
              <li className="hover:text-cyan-300 transition">15-Level Downline System</li>
              <li className="hover:text-cyan-300 transition">4X Maximum Lifetime Capping</li>
              <li className="hover:text-cyan-300 transition">Min Withdrawal: $2 (5% Fee)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 font-['Outfit'] tracking-wider">
              Supported Networks
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 hover:text-cyan-300 transition">
                <span>USDT Tether (TRC-20)</span>
                <ArrowUpRight className="w-3 h-3 text-cyan-400" />
              </li>
              <li className="flex items-center gap-1.5 hover:text-cyan-300 transition">
                <span>USDT Tether (BEP-20)</span>
                <ArrowUpRight className="w-3 h-3 text-cyan-400" />
              </li>
              <li className="flex items-center gap-1.5 hover:text-cyan-300 transition">
                <span>Bitcoin (BTC)</span>
                <ArrowUpRight className="w-3 h-3 text-cyan-400" />
              </li>
              <li className="flex items-center gap-1.5 hover:text-cyan-300 transition">
                <span>Tron (TRX)</span>
                <ArrowUpRight className="w-3 h-3 text-cyan-400" />
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-cyan-950/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} ROYALBIT. All rights reserved. The Future of Digital Finance.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Terms & Conditions</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Risk Disclosure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

