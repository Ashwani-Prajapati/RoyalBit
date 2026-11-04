import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, ChevronDown, Check, UserPlus, LogOut } from 'lucide-react';

export const UserSwitcherPill = ({ onOpenSignup, onOpenLogin }) => {
  const { user, allUsers, switchUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 text-xs text-cyan-200 transition shadow-sm backdrop-blur-md"
        title="Multi-User Test Switcher: Test separate isolated accounts"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <Users className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-semibold text-white truncate max-w-[110px]">
          {user ? user.name : 'Switch User'}
        </span>
        <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
          {user ? user.memberId : 'RB'}
        </span>
        <ChevronDown className="w-3 h-3 text-cyan-300" />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-72 rounded-xl bg-[#091530] border border-cyan-500/30 shadow-2xl p-2 z-50 backdrop-blur-xl"
          onClick={() => setIsOpen(false)}
        >
          <div className="px-3 py-2 text-[11px] font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-900/50 flex justify-between items-center">
            <span>Isolated Accounts</span>
            <span className="text-[10px] text-slate-400 font-normal">Strict Data Privacy</span>
          </div>

          <div className="py-1 max-h-56 overflow-y-auto space-y-1">
            {allUsers.map((u) => {
              const isCurrent = user?.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition ${
                    isCurrent 
                      ? 'bg-cyan-600/20 border border-cyan-500/40 text-cyan-200 font-medium' 
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      {u.name}
                      {u.id === 'user_jitendra' && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded">Primary Demo</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                      <span>{u.memberId}</span>
                      <span>•</span>
                      <span>${u.totalInvestment?.toFixed(0) || 0} Invested</span>
                    </div>
                  </div>
                  {isCurrent && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 mt-1 border-t border-cyan-900/50 flex items-center gap-1">
            <button
              onClick={() => {
                if (onOpenSignup) onOpenSignup();
              }}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-[11px] text-cyan-300 font-semibold transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create New User</span>
            </button>
            {user && (
              <button
                onClick={logout}
                className="flex items-center justify-center p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 transition"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

