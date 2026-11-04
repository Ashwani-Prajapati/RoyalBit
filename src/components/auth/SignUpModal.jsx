import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RoyalLogo } from '../RoyalLogo';
import { User, Mail, Lock, CheckCircle, X, AlertCircle, ArrowRight, ShieldCheck, Sparkles, Hash } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SignUpModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    sponsorMemberId: 'RB1004587', // Default to Jitendra Singh sponsor if empty or user can customize/clear
    agreeTerms: true,
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.name.trim()) return setError('Please enter your full name.');
    if (!formData.username.trim()) return setError('Please choose a unique username.');
    if (formData.username.length < 3) return setError('Username must be at least 3 characters.');
    if (!formData.email.trim()) return setError('Please enter a valid email address.');
    if (!formData.password) return setError('Please create a password.');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters.');
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match. Please re-enter.');
    }
    if (!formData.agreeTerms) {
      return setError('You must agree to the Terms of Service to register.');
    }

    setIsSubmitting(true);

    try {
      const newUser = await signup({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        sponsorMemberId: formData.sponsorMemberId,
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setCreatedUser(newUser);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishAndEnter = () => {
    setCreatedUser(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-[#0c1838] to-[#060c20] rounded-2xl border border-cyan-500/40 p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {createdUser ? (
          /* Success Screen with Assigned Member ID */
          <div className="text-center py-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-lg shadow-emerald-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-white font-['Outfit'] mb-1">
              Account Created Successfully!
            </h2>
            <p className="text-xs text-slate-300 mb-6">
              Welcome to RoyalBit. Your unique identification credentials have been issued.
            </p>

            <div className="bg-[#08122c] border border-cyan-500/40 rounded-xl p-5 mb-6 text-left space-y-3">
              <div className="flex justify-between items-center border-b border-cyan-900/40 pb-2">
                <span className="text-xs text-slate-400">Assigned Member ID</span>
                <span className="text-base font-extrabold text-cyan-400 font-mono tracking-wider">
                  {createdUser.memberId}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-cyan-900/40 pb-2">
                <span className="text-xs text-slate-400">Username</span>
                <span className="text-sm font-semibold text-white">
                  @{createdUser.username}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-cyan-900/40 pb-2">
                <span className="text-xs text-slate-400">Full Name</span>
                <span className="text-sm font-semibold text-white">
                  {createdUser.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Registered Email</span>
                <span className="text-xs text-slate-300 font-mono">
                  {createdUser.email}
                </span>
              </div>
            </div>

            <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl text-left text-[11px] text-cyan-200/90 mb-6 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Isolated Account:</strong> Your account is completely private. You will only see your own balances, investments, ROI history, and team transactions.
              </span>
            </div>

            <button
              onClick={handleFinishAndEnter}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 text-sm"
            >
              <span>Access Your Dashboard Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Registration Form */
          <>
            <div className="text-center mb-5">
              <div className="flex justify-center mb-2">
                <RoyalLogo size="md" showTagline={false} />
              </div>
              <h2 className="text-2xl font-black text-white font-['Outfit'] tracking-wide">
                Create RoyalBit Account
              </h2>
              <p className="text-xs text-cyan-200/70 mt-1">
                Start earning 2% Daily ROI & 15-Level income with $5 packages
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      required
                      className="w-full bg-[#08122c] border border-cyan-900/60 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Unique Username
                  </label>
                  <div className="relative">
                    <span className="text-cyan-400 text-xs font-bold absolute left-3 top-1/2 -translate-y-1/2">@</span>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="johndoe77"
                      required
                      className="w-full bg-[#08122c] border border-cyan-900/60 focus:border-cyan-400 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="w-full bg-[#08122c] border border-cyan-900/60 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      required
                      className="w-full bg-[#08122c] border border-cyan-900/60 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      required
                      className="w-full bg-[#08122c] border border-cyan-900/60 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex justify-between items-center">
                  <span>Sponsor Member ID (Optional)</span>
                  <span className="text-[10px] text-cyan-400">For 15-Level Uplink</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="sponsorMemberId"
                    value={formData.sponsorMemberId}
                    onChange={handleChange}
                    placeholder="e.g. RB1004587 (leave empty for none)"
                    className="w-full bg-[#08122c] border border-cyan-900/60 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono transition"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-0.5 rounded border-slate-700 bg-[#08122c] text-cyan-500 focus:ring-cyan-400"
                  />
                  <span>
                    I agree to the <span className="text-cyan-400 underline">Terms of Service</span>, 2% Daily ROI rules (80-day cycle), and 4X Maximum Capping policy.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 mt-2 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Generating Member ID & Account...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Create Account & Generate Member ID</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <button
                onClick={() => {
                  onClose();
                  onSwitchToLogin();
                }}
                className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline"
              >
                Sign In
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

