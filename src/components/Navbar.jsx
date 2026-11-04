import React, { useState } from 'react';
import { RoyalLogo } from './RoyalLogo';
import { UserSwitcherPill } from './UserSwitcherPill';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogIn, UserPlus, Menu, X, Shield, Sparkles } from 'lucide-react';

export const Navbar = ({ 
  currentTab, 
  setCurrentTab, 
  onOpenLogin, 
  onOpenSignup,
  isInDashboard,
  setIsInDashboard
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About Us', id: 'about' },
    { label: 'Investment Plan', id: 'plan' },
    { label: '15-Level Program', id: 'levels' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Security', id: 'security' },
  ];

  const handleNavClick = (id) => {
    setIsInDashboard(false);
    setCurrentTab(id);
    setMobileMenuOpen(false);

    // Scroll to section if on page
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#060c21]/90 backdrop-blur-xl border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            className="cursor-pointer flex items-center" 
            onClick={() => { setIsInDashboard(false); setCurrentTab('home'); }}
          >
            <RoyalLogo size="md" showTagline={true} />
          </div>

          {/* Desktop Nav Links */}
          {!isInDashboard && (
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition ${
                    currentTab === link.id
                      ? 'text-cyan-400 bg-cyan-950/60 shadow-inner border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}

          {/* Auth & Dashboard Controls */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Multi-User Switcher for testing strict data isolation */}
            <UserSwitcherPill onOpenSignup={onOpenSignup} onOpenLogin={onOpenLogin} />

            {user ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsInDashboard(!isInDashboard)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/25 border border-cyan-400/40"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{isInDashboard ? 'View Landing Page' : 'Go to Dashboard'}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenLogin}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-[#08122c] hover:bg-cyan-950/80 border border-cyan-900/60 hover:border-cyan-500/50 transition"
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Login</span>
                </button>

                <button
                  onClick={onOpenSignup}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/30"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <UserSwitcherPill onOpenSignup={onOpenSignup} onOpenLogin={onOpenLogin} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800/60 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#060c21] border-b border-cyan-900/60 px-4 pt-3 pb-5 space-y-2 animate-fadeIn">
          {!isInDashboard && navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-cyan-950/40 hover:text-cyan-300"
            >
              {link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-cyan-950 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  setIsInDashboard(!isInDashboard);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{isInDashboard ? 'Back to Website' : 'Open User Dashboard'}</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
                  className="py-2.5 rounded-xl text-xs font-bold text-white bg-[#08122c] border border-cyan-900"
                >
                  Login
                </button>
                <button
                  onClick={() => { onOpenSignup(); setMobileMenuOpen(false); }}
                  className="py-2.5 rounded-xl text-xs font-bold text-white bg-cyan-500"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

