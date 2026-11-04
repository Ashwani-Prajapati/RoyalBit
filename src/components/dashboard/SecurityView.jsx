import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { 
  ShieldCheck, 
  KeyRound, 
  User, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  Eye, 
  EyeOff 
} from 'lucide-react';

export const SecurityView = () => {
  const { user, refreshUser } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  if (!user) return null;

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setStatusMsg(null);

    try {
      if (!name.trim()) throw new Error('Name cannot be empty.');
      storage.updateUser(user.id, { name: name.trim() });
      refreshUser();
      setStatusMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setStatusMsg(null);

    try {
      if (oldPassword !== user.password) {
        throw new Error('Current password is incorrect.');
      }
      if (!newPassword || newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters.');
      }
      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match.');
      }

      storage.updateUser(user.id, { password: newPassword });
      refreshUser();
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setStatusMsg({ type: 'success', text: 'Password changed successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30">
        <h2 className="text-2xl font-black text-white font-['Outfit']">
          Security & Account Credentials
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Manage your isolated cryptographic credentials, password protection, and account details.
        </p>
      </div>

      {statusMsg && (
        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200' 
            : 'bg-rose-500/20 border border-rose-500/40 text-rose-200'
        }`}>
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Account Identity (Read Only Unique Identifiers) */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-cyan-400" />
          <span>Core Account Identity (Unique & Immutable)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="p-3.5 rounded-xl bg-[#08122c] border border-cyan-900/60">
            <span className="text-[10px] text-slate-400 block uppercase">Assigned Member ID</span>
            <span className="text-base font-black text-cyan-400 font-mono tracking-wider mt-1 block">
              {user.memberId}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block">Unique platform identifier</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#08122c] border border-cyan-900/60">
            <span className="text-[10px] text-slate-400 block uppercase">Username</span>
            <span className="text-base font-bold text-white mt-1 block">
              @{user.username}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block">Permanent username</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#08122c] border border-cyan-900/60">
            <span className="text-[10px] text-slate-400 block uppercase">Registered Email</span>
            <span className="text-xs font-bold text-slate-200 font-mono mt-1 truncate block">
              {user.email}
            </span>
            <span className="text-[10px] text-emerald-400 mt-1 block">Verified</span>
          </div>
        </div>

        {/* Update Full Name */}
        <form onSubmit={handleUpdateProfile} className="flex items-end gap-3 pt-2">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#08122c] border border-cyan-900 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition"
          >
            Save Name
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-cyan-400" />
          <span>Change Account Password</span>
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-3.5 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter existing password"
              required
              className="w-full bg-[#08122c] border border-cyan-900 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                className="w-full bg-[#08122c] border border-cyan-900 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                required
                className="w-full bg-[#08122c] border border-cyan-900 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-xs transition"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* 2FA Security Toggle */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Two-Factor Authentication (2FA)</h4>
            <p className="text-xs text-slate-400">Add an additional security layer for withdrawal authorizations</p>
          </div>
        </div>

        <button
          onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            twoFactorEnabled
              ? 'bg-emerald-500 text-white'
              : 'bg-[#08122c] text-slate-300 border border-cyan-900 hover:border-cyan-600'
          }`}
        >
          {twoFactorEnabled ? '2FA Active' : 'Enable 2FA'}
        </button>
      </div>

    </div>
  );
};

