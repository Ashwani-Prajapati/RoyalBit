import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { Footer } from './components/Footer';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { LoginModal } from './components/auth/LoginModal';
import { SignUpModal } from './components/auth/SignUpModal';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';

const AppContent = () => {
  const { user } = useAuth();
  const [isInDashboard, setIsInDashboard] = useState(true); // Default to dashboard if user exists, otherwise landing
  const [currentTab, setCurrentTab] = useState('home');

  // Modal states
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  // If user is logged in and isInDashboard is true, show isolated dashboard
  const showDashboard = user && isInDashboard;

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      
      {showDashboard ? (
        <DashboardLayout onExitDashboard={() => setIsInDashboard(false)} />
      ) : (
        <>
          <Navbar 
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            onOpenLogin={() => setLoginOpen(true)}
            onOpenSignup={() => setSignupOpen(true)}
            isInDashboard={false}
            setIsInDashboard={() => setIsInDashboard(true)}
          />

          <main className="flex-1">
            <LandingPage 
              onGetStarted={() => {
                if (user) {
                  setIsInDashboard(true);
                } else {
                  setSignupOpen(true);
                }
              }}
              onOpenLogin={() => setLoginOpen(true)}
            />
          </main>

          <Footer />
        </>
      )}

      {/* Auth Modals */}
      <LoginModal 
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToSignup={() => setSignupOpen(true)}
        onSwitchToForgot={() => setForgotOpen(true)}
      />

      <SignUpModal 
        isOpen={signupOpen}
        onClose={() => setSignupOpen(false)}
        onSwitchToLogin={() => setLoginOpen(true)}
      />

      <ForgotPasswordModal 
        isOpen={forgotOpen}
        onClose={() => setForgotOpen(false)}
        onSwitchToLogin={() => setLoginOpen(true)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
