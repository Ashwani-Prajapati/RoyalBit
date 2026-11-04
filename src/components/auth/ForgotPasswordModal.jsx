import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RoyalLogo } from '../RoyalLogo';
import { Mail, Lock, X, AlertCircle, CheckCircle2, ArrowRight, KeyRound } from 'lucide-react';

export const ForgotPasswordModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: Reset Password, 3: Success
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleVerifyEmail = (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) return setError('Please enter your registered email address.');
    setStep(2);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!newPassword || newPassword.length < 6) {
      return setError('New password must be at least 6 characters.');
    }
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email, newPassword);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setStep(1);
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
    onSwitchToLogin();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-gradient-to-b from-[#0c1838] to-[#060c20] rounded-2xl border border-cyan-500/40 p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <RoyalLogo size="md" showTagline={false} />
          </div>
          <h2 className="text-2xl font-black text-white font-['Outfit'] tracking-wide">
            Reset Password
          </h2>
          <p className="text-xs text-cyan-200/70 mt-1">
            Recover access to your RoyalBit crypto account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@royalbit.io"
                  required
                  className="w-full bg-[#08122c] border border-cyan-900/60 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 text-sm"
            >
              <span>Continue to Password Reset</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full bg-[#08122c] border border-cyan-900/60 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  className="w-full bg-[#08122c] border border-cyan-900/60 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>Update Password</span>
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Password Updated!</h3>
            <p className="text-xs text-slate-300">
              Your password has been successfully reset. You can now log into your account.
            </p>
            <button
              onClick={handleFinish}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/25 text-sm"
            >
              Sign In Now
            </button>
          </div>
        )}

        <div className="mt-5 text-center text-xs text-slate-400">
          Remember your password?{' '}
          <button
            onClick={() => {
              onClose();
              onSwitchToLogin();
            }}
            className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

