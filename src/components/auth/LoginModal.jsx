import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RoyalLogo } from '../RoyalLogo';
import { Mail, Lock, LogIn, X, AlertCircle, Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LoginModal = ({ isOpen, onClose, onSwitchToSignup, onSwitchToForgot }) => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!identifier.trim()) throw new Error('Please enter your Username, Email, or Member ID.');
      if (!password) throw new Error('Please enter your password.');

      await login(identifier, password);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = (demoId, demoPass) => {
    setIdentifier(demoId);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-gradient-to-b from-[#0c1838] to-[#060c20] rounded-2xl border border-cyan-500/40 p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <RoyalLogo size="md" showTagline={false} />
          </div>
          <h2 className="text-2xl font-black text-white font-['Outfit'] tracking-wide">
            Account Login
          </h2>
          <p className="text-xs text-cyan-200/70 mt-1">
            Access your private, isolated RoyalBit trading & ROI dashboard
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email, Username, or Member ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. RB1004587 or jitendrasingh"
                required
                className="w-full bg-[#08122c] border border-cyan-900/60 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSwitchToForgot();
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-[#08122c] border border-cyan-900/60 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-[#08122c] text-cyan-500 focus:ring-cyan-400"
              />
              <span>Remember me for 30 days</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials for evaluation */}
        <div className="mt-5 pt-4 border-t border-cyan-900/40">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>One-Click Test Accounts:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('RB1004587', 'password123')}
              className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/40 hover:border-cyan-500 text-left transition group"
            >
              <div className="text-xs font-semibold text-white group-hover:text-cyan-300">
                Jitendra Singh
              </div>
              <div className="text-[10px] text-cyan-400 font-mono">RB1004587 ($1k Inv)</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('RB1004588', 'password123')}
              className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/40 hover:border-cyan-500 text-left transition group"
            >
              <div className="text-xs font-semibold text-white group-hover:text-cyan-300">
                Sarah Connor
              </div>
              <div className="text-[10px] text-cyan-400 font-mono">RB1004588 ($50 Inv)</div>
            </button>
          </div>
        </div>

        {/* Switch to Sign Up */}
        <div className="mt-5 text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <button
            onClick={() => {
              onClose();
              onSwitchToSignup();
            }}
            className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline"
          >
            Create Free Account
          </button>
        </div>
      </div>
    </div>
  );
};

