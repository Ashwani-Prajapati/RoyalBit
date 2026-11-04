import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import { testSupabaseConnection, SUPABASE_SQL_SCHEMA } from '../../services/supabase';
import { 
  Database, 
  Cloud, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw 
} from 'lucide-react';

export const SupabaseSyncView = () => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const config = storage.getSupabaseConfig();
    if (config.url) setUrl(config.url);
    if (config.anonKey) setAnonKey(config.anonKey);
    if (config.isConnected) {
      setTestResult({ success: true, message: 'Cloud database bridge configured.' });
    }
  }, []);

  const handleTestConnection = async (e) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    const res = await testSupabaseConnection(url.trim(), anonKey.trim());
    setTesting(false);
    setTestResult(res);

    if (res.success) {
      storage.saveSupabaseConfig({
        url: url.trim(),
        anonKey: anonKey.trim(),
        isConnected: true,
      });
    }
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white font-['Outfit']">
              Cloud Database Architecture (Supabase / Firebase)
            </h2>
            <p className="text-xs text-slate-300">
              Dual-mode support: Seamless offline-resilient local persistence + instant cloud sync capability.
            </p>
          </div>
        </div>
      </div>

      {/* Cloud Status */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30">
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>Connect Supabase / Postgres Instance</span>
        </h3>
        <p className="text-xs text-slate-300 mb-5 leading-relaxed">
          RoyalBit is pre-architected to seamlessly bind to any Supabase backend. When credentials are not provided, it runs natively on an isolated local storage database engine with zero setup.
        </p>

        {testResult && (
          <div className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
            testResult.success 
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200' 
              : 'bg-rose-500/20 border border-rose-500/40 text-rose-200'
          }`}>
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}

        <form onSubmit={handleTestConnection} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full bg-[#08122c] border border-cyan-900 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Supabase Anon / Public API Key
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-[#08122c] border border-cyan-900 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={testing || !url || !anonKey}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-xs flex items-center gap-2 disabled:opacity-50 transition"
            >
              {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
              <span>{testing ? 'Testing Connection...' : 'Test & Save Connection'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SQL Migration Script */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-white">
              Database Migration SQL Schema
            </h3>
            <p className="text-xs text-slate-400">
              Run this SQL script in your Supabase SQL Editor to initialize all tables
            </p>
          </div>
          <button
            onClick={handleCopySchema}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-semibold hover:border-cyan-500 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied SQL!' : 'Copy SQL'}</span>
          </button>
        </div>

        <pre className="bg-[#050b1a] p-4 rounded-xl border border-cyan-950 text-[11px] font-mono text-cyan-200/90 overflow-x-auto max-h-64 leading-relaxed">
          {SUPABASE_SQL_SCHEMA}
        </pre>
      </div>

    </div>
  );
};

