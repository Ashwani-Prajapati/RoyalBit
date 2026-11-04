import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { 
  History, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle, 
  Clock, 
  Copy, 
  Check 
} from 'lucide-react';

export const TransactionsView = () => {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  if (!user) return null;

  const allTransactions = storage.getUserTransactions(user.id);

  // Filter by category
  let filtered = allTransactions;
  if (filterType !== 'ALL') {
    filtered = filtered.filter(t => t.type === filterType);
  }

  // Filter by search
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim();
    filtered = filtered.filter(t => 
      t.description.toLowerCase().includes(term) || 
      t.txHash.toLowerCase().includes(term) ||
      t.id.toLowerCase().includes(term)
    );
  }

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30">
        <h2 className="text-2xl font-black text-white font-['Outfit']">
          Transaction History & Ledger
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Complete, isolated financial ledger of all package purchases, ROI payouts, affiliate commissions, and withdrawals.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-2 sm:pb-0 scrollbar-none">
            {[
              { id: 'ALL', label: 'All Transactions' },
              { id: 'ROI_CREDIT', label: 'Daily ROI (2%)' },
              { id: 'LEVEL_INCOME', label: 'Level Income' },
              { id: 'DIRECT_REFERRAL', label: 'Direct Referral (5%)' },
              { id: 'INVESTMENT', label: 'Investments' },
              { id: 'WITHDRAWAL', label: 'Withdrawals' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
                  filterType === tab.id
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30 font-bold'
                    : 'bg-[#08122c] text-slate-300 hover:text-white border border-cyan-900/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tx hash or desc..."
              className="w-full bg-[#08122c] border border-cyan-900 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Transactions Table */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No transactions found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cyan-900/60 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Transaction Details</th>
                  <th className="py-2.5 px-3">Tx Hash</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3 text-right">Gross Amount</th>
                  <th className="py-2.5 px-3 text-right">Fee (5%)</th>
                  <th className="py-2.5 px-3 text-right">Net Amount</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-950/60">
                {filtered.map((tx) => {
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

                      <td className="py-3 px-3 text-white font-medium">
                        {tx.description}
                      </td>

                      <td className="py-3 px-3 font-mono text-cyan-400 text-[11px]">
                        <button
                          onClick={() => handleCopy(tx.id, tx.txHash)}
                          className="flex items-center gap-1 hover:underline"
                          title="Copy Tx Hash"
                        >
                          <span>{tx.txHash}</span>
                          {copiedId === tx.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                        </button>
                      </td>

                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                        {tx.date}
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-slate-300">
                        ${tx.amount.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-rose-300">
                        {tx.fee > 0 ? `-$${tx.fee.toFixed(2)}` : '$0.00'}
                      </td>

                      <td className={`py-3 px-3 text-right font-mono font-bold ${
                        isCredit ? 'text-emerald-400' : 'text-slate-100'
                      }`}>
                        {isCredit ? '+' : '-'}${tx.netAmount.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="text-[10px] text-emerald-400 font-semibold inline-flex items-center gap-1">
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

