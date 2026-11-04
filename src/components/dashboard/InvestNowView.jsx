import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage, BUSINESS_RULES } from '../../services/storage';
import { 
  Sparkles, 
  Coins, 
  Clock, 
  ShieldCheck, 
  Wallet, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Check, 
  Copy 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const InvestNowView = ({ onComplete }) => {
  const { user, refreshUser } = useAuth();
  const [selectedUnits, setSelectedUnits] = useState(20); // Default 20 packages = $100
  const [paymentMethod, setPaymentMethod] = useState('crypto_trc20'); // 'wallet' or 'crypto_trc20' or 'crypto_bep20'
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const totalAmount = selectedUnits * BUSINESS_RULES.BASE_PACKAGE_PRICE;
  const dailyRoi = totalAmount * BUSINESS_RULES.DAILY_ROI_PERCENT;
  const totalRoi80Days = totalAmount * BUSINESS_RULES.MAX_ROI_RETURN_PERCENT;
  const cappingRoomNew = totalAmount * BUSINESS_RULES.CAPPING_MULTIPLIER;

  const mockCryptoAddress = paymentMethod === 'crypto_bep20' 
    ? '0x71C...b92F4A80B4c489E5F2a2491aF' 
    : 'TX9R8...LkpN74wK2mVh8A69kQ2Jv';

  const handleCopy = () => {
    navigator.clipboard.writeText(mockCryptoAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvest = async () => {
    setError('');
    setIsProcessing(true);

    try {
      if (selectedUnits < 1) {
        throw new Error('Please select at least 1 package ($5 USD).');
      }

      if (paymentMethod === 'wallet') {
        if (user.walletBalance < totalAmount) {
          throw new Error(`Insufficient wallet balance ($${user.walletBalance.toFixed(2)}). Please select Crypto USDT or reduce packages.`);
        }
        // Deduct from wallet balance
        storage.updateUser(user.id, {
          walletBalance: user.walletBalance - totalAmount,
        });
      }

      const methodLabel = paymentMethod === 'wallet' 
        ? 'Wallet Balance' 
        : paymentMethod === 'crypto_trc20' 
          ? 'USDT TRC20' 
          : 'USDT BEP20';

      const result = storage.investInPackage(user.id, totalAmount, methodLabel);
      refreshUser();

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      setSuccessData({
        units: selectedUnits,
        amount: totalAmount,
        packageId: result.package.id,
      });
    } catch (err) {
      setError(err.message || 'Investment failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>$5 USD Entry Package Engine</span>
            </div>
            <h2 className="text-2xl font-black text-white font-['Outfit']">
              Activate Investment Packages
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Select $5 base packages. Earn 2% daily ROI for 80 days with automatic 15-level team distributions.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#08122c] border border-cyan-900/60 text-right sm:text-left">
            <span className="text-[11px] text-slate-400 block">Available Wallet Balance</span>
            <span className="text-base font-extrabold text-cyan-400 font-mono">
              ${user.walletBalance.toFixed(2)} USD
            </span>
          </div>
        </div>
      </div>

      {successData ? (
        /* Success Screen */
        <div className="glass-panel rounded-2xl p-8 border border-emerald-500/40 text-center animate-scaleUp">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black text-white font-['Outfit'] mb-2">
            Investment Package Activated!
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-6">
            Congratulations! You have activated <strong className="text-white">{successData.units} packages (${successData.amount.toFixed(2)} USD)</strong>. Your 2% daily ROI cycle has started for 80 days.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-6 text-left">
            <div className="p-3 rounded-xl bg-[#08122c] border border-cyan-900/60">
              <span className="text-[10px] text-slate-400 block uppercase">Daily Payout</span>
              <span className="text-base font-bold text-cyan-400 font-mono">
                ${(successData.amount * BUSINESS_RULES.DAILY_ROI_PERCENT).toFixed(2)}/day
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#08122c] border border-cyan-900/60">
              <span className="text-[10px] text-slate-400 block uppercase">80-Day Max Return</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                ${(successData.amount * BUSINESS_RULES.MAX_ROI_RETURN_PERCENT).toFixed(2)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#08122c] border border-cyan-900/60">
              <span className="text-[10px] text-slate-400 block uppercase">4X Capping Added</span>
              <span className="text-base font-bold text-amber-400 font-mono">
                ${(successData.amount * BUSINESS_RULES.CAPPING_MULTIPLIER).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => onComplete('my_investments')}
              className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/25 text-xs flex items-center gap-2"
            >
              <span>View My Investments</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSuccessData(null)}
              className="px-5 py-3 rounded-xl font-semibold text-slate-300 bg-[#08122c] hover:bg-slate-800 border border-cyan-900 text-xs"
            >
              Invest More
            </button>
          </div>
        </div>
      ) : (
        /* Package Selector & Checkout */
        <div className="space-y-6">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Quick Package Multiples ($5 Base) */}
          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30">
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-3">
              1. Select $5 Base Packages Quantity
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { units: 1, label: 'Starter' },
                { units: 2, label: 'Double' },
                { units: 5, label: 'Bronze' },
                { units: 10, label: 'Silver' },
                { units: 20, label: 'Gold' },
                { units: 50, label: 'Platinum' },
                { units: 100, label: 'Diamond' },
                { units: 200, label: 'Royal' },
              ].map(({ units, label }) => {
                const isSelected = selectedUnits === units;
                const cost = units * BUSINESS_RULES.BASE_PACKAGE_PRICE;
                return (
                  <button
                    key={units}
                    type="button"
                    onClick={() => setSelectedUnits(units)}
                    className={`p-3.5 rounded-xl text-left border transition relative ${
                      isSelected
                        ? 'bg-cyan-600/25 border-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                        : 'bg-[#08122c] border-cyan-900/60 hover:border-cyan-600 text-slate-300'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    )}
                    <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                      {label}
                    </div>
                    <div className="text-lg font-black text-white font-mono mt-0.5">
                      ${cost}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {units}x $5 Package
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Input */}
            <div className="p-3.5 rounded-xl bg-[#08122c] border border-cyan-900/60 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-300 font-medium">Or Custom Number of $5 Packages:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={selectedUnits}
                  onChange={(e) => setSelectedUnits(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 bg-[#050b1a] border border-cyan-900 focus:border-cyan-400 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono text-center focus:outline-none"
                />
                <span className="text-xs font-bold text-cyan-400 font-mono">
                  = ${totalAmount}.00 USD
                </span>
              </div>
            </div>
          </div>

          {/* 2. Projected Returns Breakdown */}
          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              2. Projected Return Economics (80-Day Cycle)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#08122c] border border-cyan-900/60">
                <span className="text-[10px] text-slate-400 block uppercase">Total Investment</span>
                <span className="text-lg font-black text-white font-mono">${totalAmount.toFixed(2)}</span>
                <span className="text-[10px] text-cyan-400 block mt-0.5">{selectedUnits} Packages</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#08122c] border border-cyan-900/60">
                <span className="text-[10px] text-slate-400 block uppercase">Daily ROI (2%)</span>
                <span className="text-lg font-black text-cyan-400 font-mono">${dailyRoi.toFixed(2)}/day</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">80 Days Tenure</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#08122c] border border-cyan-900/60">
                <span className="text-[10px] text-slate-400 block uppercase">Total ROI (160%)</span>
                <span className="text-lg font-black text-emerald-400 font-mono">${totalRoi80Days.toFixed(2)}</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">+60% Net Yield</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#08122c] border border-cyan-900/60">
                <span className="text-[10px] text-slate-400 block uppercase">4X Capping Limit</span>
                <span className="text-lg font-black text-amber-400 font-mono">${cappingRoomNew.toFixed(2)}</span>
                <span className="text-[10px] text-amber-400 block mt-0.5">Max Earnings Cap</span>
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30">
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-3">
              3. Select Payment Method
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('crypto_trc20')}
                className={`p-3.5 rounded-xl text-left border transition ${
                  paymentMethod === 'crypto_trc20'
                    ? 'bg-cyan-600/25 border-cyan-400 text-white'
                    : 'bg-[#08122c] border-cyan-900/60 text-slate-300'
                }`}
              >
                <div className="text-xs font-bold text-white">USDT (TRC-20)</div>
                <div className="text-[10px] text-cyan-400">Tron Blockchain (Fast)</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('crypto_bep20')}
                className={`p-3.5 rounded-xl text-left border transition ${
                  paymentMethod === 'crypto_bep20'
                    ? 'bg-cyan-600/25 border-cyan-400 text-white'
                    : 'bg-[#08122c] border-cyan-900/60 text-slate-300'
                }`}
              >
                <div className="text-xs font-bold text-white">USDT (BEP-20)</div>
                <div className="text-[10px] text-cyan-400">BNB Smart Chain</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3.5 rounded-xl text-left border transition ${
                  paymentMethod === 'wallet'
                    ? 'bg-cyan-600/25 border-cyan-400 text-white'
                    : 'bg-[#08122c] border-cyan-900/60 text-slate-300'
                }`}
              >
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Internal Wallet</span>
                  <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  ${user.walletBalance.toFixed(2)} Available
                </div>
              </button>
            </div>

            {/* Crypto Address / QR Simulator */}
            {paymentMethod !== 'wallet' && (
              <div className="p-4 rounded-xl bg-[#08122c] border border-cyan-900/60 flex flex-col sm:flex-row items-center gap-4">
                <div className="p-2 bg-white rounded-lg shrink-0">
                  <QrCode className="w-20 h-20 text-slate-900" />
                </div>
                <div className="flex-1 w-full text-center sm:text-left">
                  <span className="text-[11px] text-slate-400 block mb-1">
                    Send exact <strong className="text-white">${totalAmount}.00 USDT</strong> to:
                  </span>
                  <div className="flex items-center gap-2 bg-[#050b1a] p-2 rounded-lg border border-cyan-900">
                    <span className="text-xs font-mono text-cyan-300 truncate flex-1">
                      {mockCryptoAddress}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Copy Address"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-amber-400/90 mt-1 block">
                    Instant automated detection simulator active. Click "Confirm Investment" below.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleInvest}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Activating Package...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Confirm & Activate {selectedUnits}x $5 Package (${totalAmount}.00 USD)</span>
              </>
            )}
          </button>

        </div>
      )}

    </div>
  );
};

