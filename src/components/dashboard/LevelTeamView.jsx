import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage, LEVEL_PERCENTAGES } from '../../services/storage';
import { 
  Users, 
  Layers, 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  Filter, 
  Search, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const LevelTeamView = () => {
  const { user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState('all'); // 'all' or '1' to '15'
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) return null;

  const teamData = storage.getLevelTeamHierarchy(user.id);
  const { levels, totalMembers, totalTeamInvestment } = teamData;

  // Flatten or filter by selected level
  let displayedMembers = [];
  if (selectedLevel === 'all') {
    Object.entries(levels).forEach(([lvl, members]) => {
      members.forEach(m => {
        displayedMembers.push({ ...m, levelNum: lvl });
      });
    });
  } else {
    const lvlNum = parseInt(selectedLevel);
    displayedMembers = (levels[lvlNum] || []).map(m => ({ ...m, levelNum: selectedLevel }));
  }

  // Filter by search
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim();
    displayedMembers = displayedMembers.filter(
      m => m.name.toLowerCase().includes(term) || 
           m.username.toLowerCase().includes(term) || 
           m.memberId.toLowerCase().includes(term)
    );
  }

  const directReferralsCount = (levels[1] || []).length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold mb-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>15-Level Downline Explorer</span>
            </div>
            <h2 className="text-2xl font-black text-white font-['Outfit']">
              Level Team Network
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Private audit of your 15-tier downline structure and generated investment volume.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono">
              Sponsor: {user.memberId}
            </span>
          </div>
        </div>
      </div>

      {/* Network Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950 px-2 py-0.5 rounded">
              Direct Tier
            </span>
          </div>
          <span className="text-xs text-slate-400 block font-medium">Direct Level 1 Referrals</span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {directReferralsCount} Members
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">10% Commission Rate</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-950 px-2 py-0.5 rounded">
              15 Levels
            </span>
          </div>
          <span className="text-xs text-slate-400 block font-medium">Total Team Members</span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {totalMembers} Members
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Across all 15 downline tiers</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950 px-2 py-0.5 rounded">
              Turnover
            </span>
          </div>
          <span className="text-xs text-slate-400 block font-medium">Total Team Investment</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            ${totalTeamInvestment.toFixed(2)} USD
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Combined package sales</span>
        </div>
      </div>

      {/* Level Filters & Search */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Level Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedLevel('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition ${
                selectedLevel === 'all'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                  : 'bg-[#08122c] text-slate-300 hover:text-white border border-cyan-900'
              }`}
            >
              All Levels ({totalMembers})
            </button>

            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((lvl) => {
              const count = (levels[lvl] || []).length;
              return (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(String(lvl))}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
                    selectedLevel === String(lvl)
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30 font-bold'
                      : 'bg-[#08122c] text-slate-400 hover:text-slate-200 border border-cyan-900/60'
                  }`}
                >
                  L{lvl} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search member ID or name..."
              className="w-full bg-[#08122c] border border-cyan-900 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Member Table */}
        {displayedMembers.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No downline members found for this level selection.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cyan-900/60 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Member ID</th>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Level Tier</th>
                  <th className="py-2.5 px-3">Level Commission</th>
                  <th className="py-2.5 px-3">Total Investment</th>
                  <th className="py-2.5 px-3">Join Date</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-950/60">
                {displayedMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-cyan-950/20 transition">
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-900">
                        {m.memberId}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{m.name}</div>
                      <div className="text-[10px] text-slate-400">@{m.username}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30 text-[10px]">
                        Level {m.levelNum}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                      {m.levelPercentage}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      ${m.totalInvestment.toFixed(2)} USD
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {m.joinedAt}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] text-emerald-400 font-semibold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

