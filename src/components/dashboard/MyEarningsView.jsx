import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage, BUSINESS_RULES, LEVEL_PERCENTAGES } from '../../services/storage';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Award, 
  ShieldCheck, 
  Layers, 
  PieChart, 
  AlertCircle,
  ArrowUpRight 
} from 'lucide-react';

export const MyEarningsView = ({ onNavigateToInvest }) => {
  const { user } = useAuth();
  if (!user) return null;

  const transactions = storage.getUserTransactions(user.id);

  // Group earnings
  const roiEarnings = transactions
    .filter(t => t.type === 'ROI_CREDIT')
    .reduce((acc, t) => acc + t.amount, 0);

  const directReferralEarnings = transactions
    .filter(t => t.type === 'DIRECT_REFERRAL')
    .reduce((acc, t) => acc + t.amount, 0);

  const levelEarnings = transactions
    .filter(t => t.type === 'LEVEL_INCOME')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalInvestment = user.totalInvestment || 0;
  const totalEarnings = user.totalEarnings || (roiEarnings + directReferralEarnings + levelEarnings);
  const maxCap = totalInvestment * BUSINESS_RULES.CAPPING_MULTIPLIER;
  const remainingRoom = Math.max(0, maxCap - totalEarnings);
  const capPercent = maxCap > 0 ? Math.min(100, (totalEarnings / maxCap) * 100) : 0;

  // Breakdown by level
  const earningsByLevel = {};
  for (let i = 1; i <= 15; i++) {
    earningsByLevel[i] = {
      count: 0,
      totalAmount: 0,
    };
  }

  transactions.forEach(t => {
    if (t.type === 'LEVEL_INCOME' && t.level && earningsByLevel[t.level]) {
      earningsByLevel[t.level].count += 1;
      earningsByLevel[t.level].totalAmount += t.amount;
    }
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30">
        <h2 className="text-2xl font-black text-white font-['Outfit']">
          My Earnings & Commission Center
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Detailed financial audit of your Daily ROI, Direct Referrals, 15-Level Team commissions, and 4X Capping limit.
        </p>
      </div>

      {/* 4X Capping Gauge */}
      <div className="glass-panel rounded-2xl p-6 border border-amber-500/40 bg-gradient-to-r from-[#0c1a3d] via-[#091533] to-[#0a1b42]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                4X Maximum Lifetime Capping System
              </h3>
              <p className="text-xs text-slate-400">
                Total earnings limit: 400% ($20.00 max profit per $5 package)
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase block">Max Earnings Cap</span>
            <span className="text-lg font-black text-amber-400 font-mono">
              ${maxCap.toFixed(2)} USD
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="text-slate-300">
              Cap Consumption: <strong className="text-cyan-300">${totalEarnings.toFixed(2)}</strong> of <strong className="text-white">${maxCap.toFixed(2)}</strong>
            </span>
            <span className="text-amber-400 font-mono font-bold">
              {capPercent.toFixed(1)}% Used
            </span>
          </div>
          <div className="w-full bg-[#050b1a] rounded-full h-3 border border-amber-500/30 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 transition-all duration-700"
              style={{ width: `${capPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-3 border-t border-cyan-900/40">
          <div className="text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Remaining capacity: <strong className="text-emerald-400 font-mono">${remainingRoom.toFixed(2)} USD</strong> before re-investment needed.
            </span>
          </div>

          <button
            onClick={onNavigateToInvest}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 transition flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Re-Invest to Expand Cap</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Earnings Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Daily ROI */}
        <div className="glass-panel rounded-2xl p-5 border border-purple-500/40">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
              2.0% Daily
            </span>
          </div>
          <span className="text-xs text-slate-400 block font-medium">Daily ROI Payouts</span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            ${roiEarnings.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            80-day cycle returns (160%)
          </span>
        </div>

        {/* Direct Referrals (5%) */}
        <div className="glass-panel rounded-2xl p-5 border border-blue-500/40">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
              5% Direct
            </span>
          </div>
          <span className="text-xs text-slate-400 block font-medium">Direct Referral Bonus</span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            ${directReferralEarnings.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            5% on direct package sales
          </span>
        </div>

        {/* 15-Level Income */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/40">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Levels 1 - 15
            </span>
          </div>
          <span className="text-xs text-slate-400 block font-medium">15-Level Team Income</span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            ${levelEarnings.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            40% total level distributions
          </span>
        </div>

      </div>

      {/* 15-Level Performance Breakdown Table */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Earnings by Downline Level (1 - 15)</span>
            </h3>
            <p className="text-xs text-slate-400">Distribution breakdown per level percentage</p>
          </div>
          <span className="text-xs text-cyan-400 font-mono">
            Total Distributed: 40%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-cyan-900/60 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Level</th>
                <th className="py-2.5 px-3">Commission %</th>
                <th className="py-2.5 px-3">Unit Yield ($5)</th>
                <th className="py-2.5 px-3">Transactions</th>
                <th className="py-2.5 px-3 text-right">Earned Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-950/60 font-medium">
              {Object.entries(LEVEL_PERCENTAGES).map(([lvl, pct]) => {
                const data = earningsByLevel[lvl] || { count: 0, totalAmount: 0 };
                return (
                  <tr key={lvl} className="hover:bg-cyan-950/20 transition">
                    <td className="py-2.5 px-3 text-white font-bold">
                      Level {lvl}
                    </td>
                    <td className="py-2.5 px-3 text-cyan-300 font-mono font-bold">
                      {(pct * 100).toFixed(0)}%
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-mono">
                      ${(5 * pct).toFixed(2)} USD
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono">
                      {data.count} Credits
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                      ${data.totalAmount.toFixed(2)} USD
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

