import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage, BUSINESS_RULES } from '../../services/storage';
import { 
  ArrowDownLeft, 
  Wallet, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Coins, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WithdrawalView = () => {
  const { user, refreshUser } = useAuth();
  const [amount, setAmount] = useState(10); // Default $10
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('USDT (TRC20)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  if (!user) return null;

  const numAmount = Number(amount) || 0;
  const fee = numAmount * BUSINESS_RULES.WITHDRAWAL_FEE_PERCENT;
  const netPayable = Math.max(0, numAmount - fee);

  const withdrawals = storage.getUserTransactions(user.id).filter(t => t.type === 'WITHDRAWAL');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (numAmount < BUSINESS_RULES.MIN_WITHDRAWAL) {
        throw new Error(`Minimum withdrawal amount is $${BUSINESS_RULES.MIN_WITHDRAWAL}.00 USD.`);
      }

      if (numAmount % BUSINESS_RULES.WITHDRAWAL_INCREMENT !== 0) {
        throw new Error(`Withdrawal must be in whole $${BUSINESS_RULES.WITHDRAWAL_INCREMENT} increments (e.g. $2, $3, $4, $5, $10). No decimal cents.`);
      }

      if (!address || address.trim().length < 10) {
        throw new Error('Please enter a valid Crypto Wallet Address.');
      }

      if (numAmount > user.walletBalance) {
        throw new Error(`Insufficient wallet balance. You have $${user.walletBalance.toFixed(2)} available.`);
      }

      const result = storage.requestWithdrawal(user.id, numAmount, address, network);
      refreshUser();

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSuccessInfo({
        amount: numAmount,
        fee: result.fee,
        netAmount: result.netAmount,
        address,
        txHash: result.transaction.txHash,
      });

      setAddress('');
    } catch (err) {
      setError(err.message || 'Withdrawal request failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold mb-2">
              <Coins className="w-3.5 h-3.5 text-cyan-400" />
              <span>Instant Crypto Payouts</span>
            </div>
            <h2 className="text-2xl font-black text-white font-['Outfit']">
              Withdraw Funds
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Minimum $2.00 USD • Whole $1 increments • Standard 5% system deduction fee.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#08122c] border border-cyan-900/60 text-right sm:text-left">
            <span className="text-[11px] text-slate-400 block">Available Withdrawable Balance</span>
            <span className="text-xl font-black text-emerald-400 font-mono">
              ${user.walletBalance.toFixed(2)} USD
            </span>
          </div>
        </div>
      </div>

      {successInfo && (
        <div className="glass-panel rounded-2xl p-6 border border-emerald-500/40 text-center animate-scaleUp">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto mb-3 text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-white font-['Outfit'] mb-1">
            Withdrawal Request Completed!
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4">
            Payout of <strong className="text-emerald-400 font-mono">${successInfo.netAmount.toFixed(2)} USD</strong> (Gross: ${successInfo.amount.toFixed(2)}, 5% Fee: ${successInfo.fee.toFixed(2)}) has been debited and queued for blockchain transfer.
          </p>
          <div className="inline-block p-2.5 rounded-xl bg-[#08122c] border border-cyan-900 text-xs font-mono text-cyan-300 mb-4">
            Tx Reference: {successInfo.txHash}
          </div>
          <div>
            <button
              onClick={() => setSuccessInfo(null)}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
            >
              Make Another Withdrawal
            </button>
          </div>
        </div>
      )}

      {/* Main Withdrawal Form & Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Column */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-cyan-500/30">
          <h3 className="text-base font-bold text-white mb-4">
            Withdrawal Details
          </h3>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Withdrawal Amount (USD)
                </label>
                <span className="text-[10px] text-cyan-400">
                  Min $2.00 • $1 Increments
                </span>
              </div>
              <div className="relative">
                <span className="text-cyan-400 text-sm font-bold absolute left-3.5 top-1/2 -translate-y-1/2">$</span>
                <input
                  type="number"
                  min="2"
                  step="1"
                  max={Math.floor(user.walletBalance)}
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  placeholder="e.g. 10"
                  required
                  className="w-full bg-[#08122c] border border-cyan-900 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2 mt-2">
                {[2, 5, 10, 20, 50, 100].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold font-mono transition ${
                      amount === preset 
                        ? 'bg-cyan-500 text-white' 
                        : 'bg-[#08122c] text-slate-300 hover:text-white border border-cyan-900'
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
                {user.walletBalance >= 2 && (
                  <button
                    type="button"
                    onClick={() => setAmount(Math.floor(user.walletBalance))}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 ml-auto"
                  >
                    Max (${Math.floor(user.walletBalance)})
                  </button>
                )}
              </div>
            </div>

            {/* Network Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Crypto Transfer Network
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNetwork('USDT (TRC20)')}
                  className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition ${
                    network === 'USDT (TRC20)'
                      ? 'bg-cyan-600/25 border-cyan-400 text-white'
                      : 'bg-[#08122c] border-cyan-900 text-slate-400'
                  }`}
                >
                  <div>USDT (TRC-20)</div>
                  <div className="text-[10px] text-cyan-400">Tron Blockchain</div>
                </button>
                <button
                  type="button"
                  onClick={() => setNetwork('USDT (BEP20)')}
                  className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition ${
                    network === 'USDT (BEP20)'
                      ? 'bg-cyan-600/25 border-cyan-400 text-white'
                      : 'bg-[#08122c] border-cyan-900 text-slate-400'
                  }`}
                >
                  <div>USDT (BEP-20)</div>
                  <div className="text-[10px] text-cyan-400">BNB Smart Chain</div>
                </button>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Destination Wallet Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. TX9R8... or 0x71C..."
                required
                className="w-full bg-[#08122c] border border-cyan-900 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Live Calculation Box */}
            <div className="p-4 rounded-xl bg-[#08122c] border border-cyan-900/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Requested Amount:</span>
                <span className="font-mono text-white font-bold">${numAmount.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-rose-300">
                <span>System Deduction Fee (5%):</span>
                <span className="font-mono font-bold">-${fee.toFixed(2)} USD</span>
              </div>
              <div className="pt-2 border-t border-cyan-950 flex justify-between text-emerald-400 text-sm font-bold">
                <span>Net Credited to Wallet:</span>
                <span className="font-mono">${netPayable.toFixed(2)} USD</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || user.walletBalance < BUSINESS_RULES.MIN_WITHDRAWAL}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 text-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authorizing Payout...</span>
              ) : (
                <>
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Withdraw ${netPayable.toFixed(2)} USD Now</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Withdrawal Rules Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Withdrawal Rules & Policy</span>
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                <span>
                  <strong>Minimum Payout:</strong> $2.00 USD. Balances below $2 cannot be withdrawn.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                <span>
                  <strong>Increments:</strong> Only whole $1 amounts ($2, $3, $4, $5, $10, etc.) are allowed.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                <span>
                  <strong>5% System Fee:</strong> A 5% platform maintenance fee is deducted automatically on every payout.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                <span>
                  <strong>Blockchain Delivery:</strong> Payouts are transferred automatically in USDT Tether (TRC20 / BEP20).
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Recent Withdrawals */}
          <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Your Withdrawal History
            </h4>
            {withdrawals.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No withdrawals yet.
              </div>
            ) : (
              <div className="space-y-2">
                {withdrawals.slice(0, 3).map((w) => (
                  <div key={w.id} className="p-2.5 rounded-xl bg-[#08122c] border border-cyan-900/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white font-mono">
                        ${w.netAmount.toFixed(2)} USD
                      </div>
                      <div className="text-[10px] text-slate-400">{w.date}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {w.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

