import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RoyalLogo } from '../RoyalLogo';
import { UserSwitcherPill } from '../UserSwitcherPill';
import { OverviewView } from './OverviewView';
import { InvestNowView } from './InvestNowView';
import { MyInvestmentsView } from './MyInvestmentsView';
import { MyEarningsView } from './MyEarningsView';
import { LevelTeamView } from './LevelTeamView';
import { TransactionsView } from './TransactionsView';
import { WithdrawalView } from './WithdrawalView';
import { SecurityView } from './SecurityView';
import { SupabaseSyncView } from './SupabaseSyncView';

import { 
  LayoutDashboard, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  Users, 
  History, 
  ArrowDownLeft, 
  ShieldCheck, 
  Cloud, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Headphones, 
  ChevronRight,
  Globe
} from 'lucide-react';

export const DashboardLayout = ({ onExitDashboard }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  if (!user) return null;

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invest', label: 'Invest Now ($5)', icon: Sparkles, badge: '2% ROI' },
    { id: 'my_investments', label: 'My Investments', icon: Layers },
    { id: 'my_earnings', label: 'My Earnings', icon: TrendingUp },
    { id: 'level_team', label: 'Level Team', icon: Users, badge: '15 Levels' },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'withdrawal', label: 'Withdraw Funds', icon: ArrowDownLeft, badge: 'Min $2' },
    { id: 'security', label: 'Security & Profile', icon: ShieldCheck },
    { id: 'cloud_sync', label: 'Supabase / Cloud', icon: Cloud },
  ];

  const handleMenuClick = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 flex flex-col">
      
      {/* 1. TOP HEADER (Matching image 3) */}
      <header className="sticky top-0 z-40 bg-[#060c21]/95 backdrop-blur-xl border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Mobile Toggle & Brand Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg bg-slate-800/60 text-slate-300 hover:text-white"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <div onClick={() => setActiveTab('overview')} className="cursor-pointer">
                <RoyalLogo size="md" showTagline={true} />
              </div>
            </div>

            {/* Right: Actions & User Info (Matching image 3) */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              
              {/* Notification icon */}
              <button 
                onClick={() => setShowNotificationToast(!showNotificationToast)}
                className="relative p-2 rounded-xl bg-cyan-950/40 border border-cyan-900/60 text-slate-300 hover:text-cyan-300 transition"
                title="System Notifications"
              >
                <Bell className="w-4 h-4 text-cyan-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              </button>

              {/* Support Pill */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-900/60 text-xs text-slate-300">
                <Headphones className="w-3.5 h-3.5 text-cyan-400" />
                <span>Support 24/7</span>
              </div>

              {/* Language Pill */}
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-900/60 text-xs text-slate-300">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-[11px]">EN</span>
              </div>

              {/* Multi-User Switcher for testing */}
              <UserSwitcherPill />

              {/* User Profile Pill from Image 3 */}
              <div className="flex items-center gap-2.5 pl-2 border-l border-cyan-900/50">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shrink-0 shadow-md shadow-cyan-500/20">
                  <div className="w-full h-full rounded-full bg-[#08122c] flex items-center justify-center font-bold text-cyan-300 text-xs overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                </div>

                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                    {user.name}
                  </div>
                  <div className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider">
                    {user.memberId}
                  </div>
                </div>
              </div>

              {/* Exit Dashboard */}
              <button
                onClick={onExitDashboard}
                className="hidden lg:flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800/40 transition"
                title="Back to Landing Page"
              >
                <span>Landing</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Notification Toast Dropdown */}
      {showNotificationToast && (
        <div className="fixed top-24 right-6 z-50 w-80 rounded-2xl bg-[#091530] border border-cyan-500/40 shadow-2xl p-4 backdrop-blur-xl animate-fadeIn">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-900/60">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Live System Alerts</span>
            <button onClick={() => setShowNotificationToast(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-900">
              <div className="font-semibold text-white">Daily ROI Cycle Ready</div>
              <div className="text-[10px] text-slate-400">2.0% daily return ready to claim for your active packages.</div>
            </div>
            <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-900">
              <div className="font-semibold text-white">4X Capping Safeguard Active</div>
              <div className="text-[10px] text-slate-400">Your total earnings limit is set to 400% of total investment.</div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BODY: SIDEBAR + MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Sidebar Menu */}
          <aside className={`
            lg:col-span-3 glass-panel rounded-2xl p-4 border border-cyan-500/30 sticky top-28 z-30
            ${sidebarOpen ? 'fixed inset-x-4 top-24 z-50 bg-[#060c21] shadow-2xl' : 'hidden lg:block'}
          `}>
            {/* User Mini Profile in sidebar */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/80 to-[#0b1b42] border border-cyan-500/30 mb-4">
              <div className="text-[10px] text-cyan-300 font-semibold uppercase tracking-wider">
                Isolated Account
              </div>
              <div className="text-sm font-black text-white truncate mt-0.5">
                {user.name}
              </div>
              <div className="text-xs font-mono font-bold text-cyan-400 mt-0.5">
                {user.memberId}
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition group ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-cyan-400 group-hover:text-cyan-300'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isActive 
                          ? 'bg-black/25 text-white' 
                          : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Logout button */}
            <div className="pt-4 mt-4 border-t border-cyan-900/50">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-500/20 border border-rose-500/20 transition"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Main Dashboard Workspace */}
          <main className="lg:col-span-9 w-full min-h-[600px]">
            {activeTab === 'overview' && <OverviewView onNavigate={handleMenuClick} />}
            {activeTab === 'invest' && <InvestNowView onComplete={handleMenuClick} />}
            {activeTab === 'my_investments' && <MyInvestmentsView onNavigateToInvest={() => handleMenuClick('invest')} />}
            {activeTab === 'my_earnings' && <MyEarningsView onNavigateToInvest={() => handleMenuClick('invest')} />}
            {activeTab === 'level_team' && <LevelTeamView />}
            {activeTab === 'transactions' && <TransactionsView />}
            {activeTab === 'withdrawal' && <WithdrawalView />}
            {activeTab === 'security' && <SecurityView />}
            {activeTab === 'cloud_sync' && <SupabaseSyncView />}
          </main>

        </div>
      </div>

      {/* Footer minimal info inside dashboard */}
      <footer className="mt-auto py-4 border-t border-cyan-950 text-center text-[11px] text-slate-500">
        ROYALBIT • The Future of Digital Finance • Strictly Private Isolated Session for {user.memberId}
      </footer>

    </div>
  );
};

