import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage, BUSINESS_RULES } from '../../services/storage';
import { 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Layers, 
  DollarSign, 
  ArrowUpRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MyInvestmentsView = ({ onNavigateToInvest }) => {
  const { user, refreshUser } = useAuth();
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimToast, setClaimToast] = useState(null);

  if (!user) return null;

  const packages = storage.getUserPackages(user.id);
  const activePackages = packages.filter(p => p.status === 'ACTIVE');
  const completedPackages = packages.filter(p => p.status === 'COMPLETED');

  const handleClaim = () => {
    setIsClaiming(true);
    setClaimToast(null);

    try {
      const res = storage.claimDailyRoi(user.id);
      refreshUser();

      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 }
      });

      setClaimToast({
        type: 'success',
        text: `Claimed $${res.creditedAmount.toFixed(2)} ROI across ${res.packagesUpdated} package(s)! Days elapsed updated.`
      });
    } catch (err) {
      setClaimToast({
        type: 'error',
        text: err.message || 'Unable to claim ROI.'
      });
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white font-['Outfit']">
            My Investment Packages
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Tracking your $5 packages, 2% daily ROI cycles (80-day lifespan), and payout claims.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleClaim}
            disabled={isClaiming || activePackages.length === 0}
            className="px-4 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 transition shadow-lg shadow-emerald-500/20 text-xs flex items-center gap-2 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>{isClaiming ? 'Processing...' : "Claim Daily 2% Payout"}</span>
          </button>

          <button
            onClick={onNavigateToInvest}
            className="px-4 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/25 text-xs flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Package</span>
          </button>
        </div>
      </div>

      {claimToast && (
        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
          claimToast.type === 'success' 
            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200' 
            : 'bg-rose-500/20 border border-rose-500/40 text-rose-200'
        }`}>
          {claimToast.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{claimToast.text}</span>
        </div>
      )}

      {/* Summary Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-xl p-4 border border-cyan-900/60">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Packages</span>
          <span className="text-xl font-black text-cyan-400 font-mono mt-1">
            {activePackages.length} Active Plans
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            ${activePackages.reduce((acc, p) => acc + p.packageAmount, 0).toFixed(2)} Capital Working
          </span>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-cyan-900/60">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Completed (80 Days)</span>
          <span className="text-xl font-black text-emerald-400 font-mono mt-1">
            {completedPackages.length} Matured Plans
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Full 160% returns paid out
          </span>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-cyan-900/60">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total ROI Credited</span>
          <span className="text-xl font-black text-amber-400 font-mono mt-1">
            ${packages.reduce((acc, p) => acc + (p.totalRoiEarned || 0), 0).toFixed(2)} USD
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Directly added to wallet balance
          </span>
        </div>
      </div>

      {/* Package Cards List */}
      <div className="space-y-4">
        {packages.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center border border-cyan-900/60">
            <Layers className="w-12 h-12 text-cyan-500/40 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Active Packages Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
              Start earning 2% daily returns for 80 days with our $5 USD entry packages.
            </p>
            <button
              onClick={onNavigateToInvest}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-xs inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Invest $5 Package Now</span>
            </button>
          </div>
        ) : (
          packages.map((pkg) => {
            const progressPercent = Math.min(100, (pkg.daysElapsed / pkg.daysTotal) * 100);
            const isCompleted = pkg.status === 'COMPLETED' || pkg.daysElapsed >= pkg.daysTotal;

            return (
              <div 
                key={pkg.id} 
                className={`glass-panel rounded-2xl p-5 border transition ${
                  isCompleted ? 'border-slate-800 opacity-80' : 'border-cyan-500/40 hover:border-cyan-400'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isCompleted ? 'bg-slate-800 text-slate-400' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    }`}>
                      {pkg.units || Math.floor(pkg.packageAmount / 5)}x
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-white font-mono">
                          ${pkg.packageAmount.toFixed(2)} USD Package
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCompleted 
                            ? 'bg-slate-800 text-slate-300' 
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {isCompleted ? 'Matured (80 Days)' : 'Active (Earning)'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <Calendar className="w-3 h-3 text-cyan-400" />
                        <span>Started: {pkg.startDate}</span>
                        <span>•</span>
                        <span>Plan: 2.0% / Day</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block">Daily Yield</span>
                    <span className="text-sm font-bold text-cyan-400 font-mono">
                      +${pkg.dailyRoiAmount.toFixed(2)} / Day
                    </span>
                  </div>
                </div>

                {/* Progress bar to 80 days */}
                <div className="mb-4">
                  <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                    <span className="text-slate-300">
                      Day Progress: <strong className="text-white font-mono">{pkg.daysElapsed}</strong> of <strong className="text-white font-mono">{pkg.daysTotal} Days</strong>
                    </span>
                    <span className="text-cyan-400 font-mono text-[11px]">
                      {progressPercent.toFixed(0)}% Completed
                    </span>
                  </div>
                  <div className="w-full bg-[#050b1a] rounded-full h-2.5 overflow-hidden border border-cyan-900/40">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted 
                          ? 'bg-slate-600' 
                          : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Return stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-cyan-950/60 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total ROI Earned:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      ${pkg.totalRoiEarned.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Max Return (160%):</span>
                    <span className="font-bold text-white font-mono">
                      ${pkg.maxReturn.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Remaining Days:</span>
                    <span className="font-bold text-cyan-300 font-mono">
                      {Math.max(0, pkg.daysTotal - pkg.daysElapsed)} Days
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">4X Capping Value:</span>
                    <span className="font-bold text-amber-400 font-mono">
                      ${(pkg.packageAmount * 4).toFixed(2)}
                    </span>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

