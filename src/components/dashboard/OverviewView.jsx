import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage, BUSINESS_RULES } from '../../services/storage';
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Award, 
  ArrowDownLeft, 
  Layers, 
  CheckCircle, 
  AlertTriangle,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OverviewView = ({ onNavigate }) => {
  const { user, refreshUser } = useAuth();
  const [claiming, setClaiming] = useState(false);
  const [claimMessage, setClaimMessage] = useState(null);

  if (!user) return null;

  const packages = storage.getUserPackages(user.id);
  const activePackages = packages.filter(p => p.status === 'ACTIVE');
  const transactions = storage.getUserTransactions(user.id).slice(0, 5);

  // Business calculations
  const totalInvestment = user.totalInvestment || 0;
  const totalEarnings = user.totalEarnings || 0;
  const maxCappingLimit = totalInvestment * BUSINESS_RULES.CAPPING_MULTIPLIER; // 4X
  const remainingCapping = Math.max(0, maxCappingLimit - totalEarnings);
  const cappingPercent = maxCappingLimit > 0 ? Math.min(100, (totalEarnings / maxCappingLimit) * 100) : 0;

  // Calculate Today's Daily ROI capacity (2% on active packages)
  const todayRoiAmount = activePackages.reduce((acc, p) => acc + (p.dailyRoiAmount || 0), 0);

  // Calculate Level Income portion from transactions
  const userAllTransactions = storage.getUserTransactions(user.id);
  const levelIncomeTotal = userAllTransactions
    .filter(t => t.type === 'LEVEL_INCOME' || t.type === 'DIRECT_REFERRAL')
    .reduce((acc, t) => acc + t.amount, 0);

  const handleClaimDailyRoi = () => {
    setClaiming(true);
    setClaimMessage(null);

    try {
      const result = storage.claimDailyRoi(user.id);
      refreshUser();

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      setClaimMessage({
        type: 'success',
        text: `Successfully claimed $${result.creditedAmount.toFixed(2)} Daily ROI (2.0%)! Balance updated.`,
      });
    } catch (err) {
      setClaimMessage({
        type: 'error',
        text: err.message || 'Failed to claim daily ROI.',
      });
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. WELCOME HEADER (Matching uploaded image 3) */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-cyan-500/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                Welcome Back, {user.name}
              </h1>
              <span className="text-2xl">👋</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs">
              <span className="text-cyan-400 font-mono font-bold bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800">
                Member ID: {user.memberId}
              </span>
              <span className="text-slate-400">
                Join Date: <strong className="text-slate-200">{user.joinedAt}</strong>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {user.kycStatus === 'VERIFIED' ? 'KYC Verified' : 'Standard Account'}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleClaimDailyRoi}
              disabled={claiming || activePackages.length === 0}
              className="px-4 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 text-xs disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>{claiming ? 'Processing...' : "Claim Today's 2% ROI"}</span>
            </button>

            <button
              onClick={() => onNavigate('invest')}
              className="px-4 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 text-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Invest $5 Package</span>
            </button>
          </div>
        </div>

        {/* Claim feedback message */}
        {claimMessage && (
          <div className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
            claimMessage.type === 'success' 
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200' 
              : 'bg-rose-500/20 border border-rose-500/40 text-rose-200'
          }`}>
            {claimMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{claimMessage.text}</span>
          </div>
        )}
      </div>

      {/* 2. 4X CAPPING GAUGE BANNER (Excel Rule) */}
      <div className="rounded-2xl p-5 bg-gradient-to-r from-[#0a1b42] to-[#071330] border border-cyan-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              4X Maximum Capping Limit Status
            </span>
          </div>
          <div className="text-xs font-mono text-cyan-300">
            Total Cap: <strong className="text-white">${maxCappingLimit.toFixed(2)}</strong> (400% of ${totalInvestment.toFixed(2)})
          </div>
        </div>

        <div className="w-full bg-slate-900/80 rounded-full h-3 border border-cyan-900/50 overflow-hidden mb-2">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-400 transition-all duration-700"
            style={{ width: `${cappingPercent}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-300">
          <span>
            Earned: <strong className="text-cyan-300">${totalEarnings.toFixed(2)}</strong> ({cappingPercent.toFixed(1)}%)
          </span>
          <span>
            Remaining Earning Capacity: <strong className="text-emerald-400">${remainingCapping.toFixed(2)}</strong>
          </span>
        </div>
      </div>

      {/* 3. 4 KEY STAT CARDS (Matching image 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Investment */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 hover:border-cyan-400/50 transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">
              {Math.floor(totalInvestment / BUSINESS_RULES.BASE_PACKAGE_PRICE)} Packages
            </span>
          </div>
          <div className="text-xs text-slate-400 font-medium">Total Investment</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            ${totalInvestment.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            ≈ ₹{(totalInvestment * 83).toLocaleString()} INR
          </div>
        </div>

        {/* Card 2: Total Earnings */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 hover:border-cyan-400/50 transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
              Lifetime
            </span>
          </div>
          <div className="text-xs text-slate-400 font-medium">Total Earnings</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            ${totalEarnings.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            ≈ ₹{(totalEarnings * 83).toLocaleString()} INR
          </div>
        </div>

        {/* Card 3: Today's ROI */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 hover:border-cyan-400/50 transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-950 px-2 py-0.5 rounded">
              2.0% / Day
            </span>
          </div>
          <div className="text-xs text-slate-400 font-medium">Today's Daily ROI</div>
          <div className="text-2xl font-black text-purple-300 font-mono mt-1">
            ${todayRoiAmount.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            ≈ ₹{(todayRoiAmount * 83).toLocaleString()} INR
          </div>
        </div>

        {/* Card 4: Level & Referral Income */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 hover:border-cyan-400/50 transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950 px-2 py-0.5 rounded">
              15 Levels
            </span>
          </div>
          <div className="text-xs text-slate-400 font-medium">15-Level Team Income</div>
          <div className="text-2xl font-black text-amber-300 font-mono mt-1">
            ${levelIncomeTotal.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            ≈ ₹{(levelIncomeTotal * 83).toLocaleString()} INR
          </div>
        </div>

      </div>

      {/* 4. WALLET BALANCE & WITHDRAW QUICK BAR */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-md shadow-cyan-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Available Withdrawable Balance</div>
            <div className="text-2xl font-black text-white font-mono">
              ${user.walletBalance.toFixed(2)} USD
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('withdrawal')}
            className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 text-xs"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Withdraw ($2 Min, 5% Fee)</span>
          </button>
        </div>
      </div>

      {/* 5. ROYALBIT BRAND BANNER & ACTIVE PACKAGES PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Banner from image 3 */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-5 border border-cyan-500/30 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Official RoyalBit Core Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] mb-2">
              Earn 2% Daily ROI for 80 Days
            </h3>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed mb-4">
              Your investment packages earn algorithmic payouts every 24 hours up to 160% total returns, backed by deep 15-level team commissions.
            </p>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-cyan-500/20 mt-2">
            <img 
              src="/images/dashboard-banner.jpg" 
              alt="RoyalBit Investment Plan" 
              className="w-full h-44 object-cover object-center rounded-xl"
            />
          </div>
        </div>

        {/* Investment Plan Tiers from Excel */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-cyan-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Base $5 Multiples Structure</span>
              </h3>
              <button
                onClick={() => onNavigate('invest')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Invest Now →
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#08122c] border border-cyan-900/60 hover:border-cyan-500/40 transition">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white">Starter Unit</span>
                  <span className="text-xs font-extrabold text-cyan-400 font-mono">$5 USD</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Daily ROI: <strong className="text-slate-200">2.0% ($0.10/day)</strong> • 80 Days • 160% Return ($8.00)
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#08122c] border border-cyan-900/60 hover:border-cyan-500/40 transition">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white">Growth Multiplier (20 Pkgs)</span>
                  <span className="text-xs font-extrabold text-cyan-400 font-mono">$100 USD</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Daily ROI: <strong className="text-slate-200">2.0% ($2.00/day)</strong> • 80 Days • 160% Return ($160.00)
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#08122c] border border-cyan-900/60 hover:border-cyan-500/40 transition">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white">Royal Elite (200 Pkgs)</span>
                  <span className="text-xs font-extrabold text-amber-400 font-mono">$1,000 USD</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Daily ROI: <strong className="text-slate-200">2.0% ($20.00/day)</strong> • 80 Days • 160% Return ($1,600.00)
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('invest')}
            className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold text-white bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/50 transition flex items-center justify-center gap-1.5"
          >
            <span>Activate Custom $5 Multiples</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 6. RECENT TRANSACTIONS (Strictly Isolated to this user) */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Recent Transactions</h3>
            <p className="text-xs text-slate-400">Strictly isolated activity ledger for your account</p>
          </div>
          <button
            onClick={() => onNavigate('transactions')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            View All ({userAllTransactions.length}) →
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No transactions yet. Activate a $5 package to start receiving daily ROI!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cyan-900/60 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-950/60">
                {transactions.map((tx) => {
                  const isCredit = tx.type === 'ROI_CREDIT' || tx.type === 'LEVEL_INCOME' || tx.type === 'DIRECT_REFERRAL';
                  return (
                    <tr key={tx.id} className="hover:bg-cyan-950/20 transition">
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.type === 'ROI_CREDIT' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                          tx.type === 'LEVEL_INCOME' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          tx.type === 'DIRECT_REFERRAL' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                          tx.type === 'WITHDRAWAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                          'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        }`}>
                          {tx.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-200 font-medium">
                        {tx.description}
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                        {tx.date}
                      </td>
                      <td className={`py-3 px-3 text-right font-mono font-bold ${
                        isCredit ? 'text-emerald-400' : 'text-slate-200'
                      }`}>
                        {isCredit ? '+' : '-'}${tx.netAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center justify-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>{tx.status}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

