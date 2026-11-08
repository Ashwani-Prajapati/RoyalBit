import React from 'react';
import { RoyalLogo } from './RoyalLogo';
import { AlertCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden bg-radial-grid">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-lg w-full glass-panel rounded-3xl p-8 sm:p-12 border border-rose-500/30 shadow-2xl shadow-black/80">
        
        {/* Brand Logo */}
        <div className="flex justify-center mb-6">
          <RoyalLogo size="md" showTagline={false} />
        </div>

        {/* Error Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-500/40 text-rose-400 text-xs font-semibold mb-4">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>HTTP ERROR 404</span>
        </div>

        {/* 404 Main Title */}
        <div className="relative mb-2">
          <span className="text-8xl sm:text-9xl font-black font-['Outfit'] tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-500 to-amber-500">
            404
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] mb-3">
          Not Found
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed max-w-md mx-auto">
          The requested URL was not found on this server. The resource may have been deleted, moved, or is temporarily offline.
        </p>

        {/* Technical Error Details Box */}
        <div className="bg-[#08122c] border border-cyan-900/60 rounded-xl p-4 mb-6 text-left font-mono text-[11px] text-slate-400 space-y-1.5">
          <div className="flex justify-between border-b border-cyan-950/60 pb-1.5">
            <span className="text-slate-500">Status:</span>
            <span className="text-rose-400 font-bold">404 NOT_FOUND</span>
          </div>
          <div className="flex justify-between border-b border-cyan-950/60 pb-1.5">
            <span className="text-slate-500">Error Code:</span>
            <span className="text-slate-200">ERR_RESOURCE_NOT_FOUND</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Platform:</span>
            <span className="text-cyan-400">ROYALBIT Engine v2.0</span>
          </div>
        </div>

        {/* Retry Button */}
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reload Page</span>
        </button>
      </div>

      <div className="mt-8 text-xs text-slate-500 font-mono">
        ROYALBIT • Error: 404 Not Found
      </div>
    </div>
  );
};
