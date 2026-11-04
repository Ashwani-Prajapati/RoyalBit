import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Users, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  PieChart, 
  Lock, 
  HelpCircle,
  Play,
  Layers,
  Sparkles,
  Calculator
} from 'lucide-react';
import { LEVEL_PERCENTAGES, BUSINESS_RULES } from '../../services/storage';

export const LandingPage = ({ onGetStarted, onOpenLogin }) => {
  // Calculator state
  const [calcPackages, setCalcPackages] = useState(20); // 20 packages = $100
  const [selectedFaq, setSelectedFaq] = useState(null);

  const calcAmount = calcPackages * BUSINESS_RULES.BASE_PACKAGE_PRICE;
  const calcDaily = calcAmount * BUSINESS_RULES.DAILY_ROI_PERCENT;
  const calcTotalRoi = calcAmount * BUSINESS_RULES.MAX_ROI_RETURN_PERCENT;
  const calcMaxCap = calcAmount * BUSINESS_RULES.CAPPING_MULTIPLIER;

  const faqs = [
    {
      q: 'What is the minimum entry package on RoyalBit?',
      a: 'The base entry package is just $5 USD. You can activate 1 package ($5) or any multiple (e.g., 2 packages for $10, 10 packages for $50, 20 packages for $100, 200 packages for $1,000).'
    },
    {
      q: 'How does the 2% Daily ROI work?',
      a: 'Every active package pays 2% daily return for a duration of 80 days. For example, a $5 package yields $0.10 daily, totaling $8.00 (160% return) over 80 days.'
    },
    {
      q: 'What is the 15-Level Income System?',
      a: 'RoyalBit features a generous 15-level team affiliate distribution: Level 1 pays 10% ($0.50 per $5), Level 2 pays 4% ($0.20), Level 3 pays 3% ($0.15), Levels 4 to 14 pay 2% ($0.10 each), and Level 15 pays 1% ($0.05).'
    },
    {
      q: 'What is the 4X Capping Rule?',
      a: 'To safeguard platform sustainability, total lifetime earnings (Daily ROI + Direct Referral + Level Income) cannot exceed 4 times (400%) of your total active investment. For a $5 package, the maximum cap is $20. You can re-invest anytime to increase your capping capacity.'
    },
    {
      q: 'What are the withdrawal conditions and fees?',
      a: 'The minimum withdrawal is $2 USD, processed in whole $1 increments ($2, $3, $4, $5, etc.). A standard 5% system deduction fee is applied upon payout.'
    },
    {
      q: 'How is user data privacy and account isolation handled?',
      a: 'Each user is assigned a unique Username and Member ID (e.g. RB1004587). The dashboard is strictly isolated: when you log in, you only see your own balances, investments, level tree, and transactions.'
    }
  ];

  return (
    <div className="bg-[#040814] text-slate-100 overflow-hidden">
      
      {/* 1. HERO SECTION (Matching image 2) */}
      <section id="home" className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-radial-grid">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/20 to-blue-600/10 rounded-full blur-[130px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Crypto Investment Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-['Outfit'] leading-[1.1]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
                  ROYALBIT
                </span>
                <br />
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-cyan-200">
                  Grow Your Wealth with Daily ROI & Referral Earnings
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                A smart and secure crypto investment platform built for consistent income and long-term growth. 
                Earn <strong className="text-cyan-400 font-semibold">2% Daily ROI for 80 Days</strong> with our <strong className="text-amber-400 font-semibold">$5 Base Entry Packages</strong> and a lucrative <strong className="text-cyan-300 font-semibold">15-Level Team Income</strong> system.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onGetStarted}
                  className="px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/30 flex items-center gap-2 text-sm transform hover:-translate-y-0.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#how-it-works"
                  className="px-6 py-3.5 rounded-xl font-semibold text-slate-200 hover:text-white bg-[#0a1636]/80 hover:bg-[#0e204d] border border-cyan-900/60 transition flex items-center gap-2 text-sm backdrop-blur-sm"
                >
                  <Play className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                  <span>How It Works</span>
                </a>
              </div>

              {/* 4 Feature Badges (Matching uploaded design) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-900/50 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <Clock className="w-5 h-5 text-cyan-400 mb-1" />
                  <span className="text-xs font-bold text-white">Daily ROI</span>
                  <span className="text-[10px] text-cyan-300/80">2% for 80 Days</span>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-900/50 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <Users className="w-5 h-5 text-cyan-400 mb-1" />
                  <span className="text-xs font-bold text-white">15-Level Team</span>
                  <span className="text-[10px] text-cyan-300/80">Earn up to 40%</span>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-900/50 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <ShieldCheck className="w-5 h-5 text-cyan-400 mb-1" />
                  <span className="text-xs font-bold text-white">4X Capping</span>
                  <span className="text-[10px] text-cyan-300/80">Safe & Stable</span>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-900/50 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <TrendingUp className="w-5 h-5 text-cyan-400 mb-1" />
                  <span className="text-xs font-bold text-white">Min $2 Payout</span>
                  <span className="text-[10px] text-cyan-300/80">Instant Crypto</span>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual from uploaded design */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Glow Ring */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 rounded-3xl blur-2xl"></div>

                {/* Card Container */}
                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-gradient-to-b from-[#091530] to-[#040919] p-2 shadow-2xl shadow-cyan-950/80">
                  <img
                    src="/images/landing-hero.jpg"
                    alt="RoyalBit Crypto Platform"
                    className="w-full h-auto rounded-xl object-cover hover:scale-[1.02] transition duration-500"
                  />
                  
                  {/* Floating live ROI pill */}
                  <div className="absolute bottom-6 left-6 right-6 p-3 rounded-xl bg-[#08122c]/90 border border-cyan-500/40 backdrop-blur-md flex items-center justify-between shadow-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                        <Coins className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-300 font-medium">Standard Daily Yield</div>
                        <div className="text-xs font-bold text-white font-mono">2.0% Payout / 80 Days</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-[10px]">
                      160% Max ROI
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. HOW ROYALBIT WORKS (Matching image 2 bottom section) */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-[#040814] via-[#061026] to-[#040814] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white font-['Outfit'] mb-3">
              How <span className="text-cyan-400">RoyalBit</span> Works?
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              A simple 3-step process to start your crypto earning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="relative glass-panel rounded-2xl p-6 border border-cyan-900/50 hover:border-cyan-500/40 transition group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-black text-lg font-['Outfit']">
                  1
                </div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-800">
                  Step One
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition">
                Sign Up
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Create your account in just a few minutes. Receive your unique Member ID (e.g., RB1004587) with full isolated data security.
              </p>
              <div className="text-[11px] text-cyan-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Instant Member ID Generation</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative glass-panel rounded-2xl p-6 border border-cyan-900/50 hover:border-cyan-500/40 transition group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 font-black text-lg font-['Outfit']">
                  2
                </div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-800">
                  Step Two
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition">
                Invest
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Choose the $5 USD entry package or activate multiple packages (e.g., $10, $25, $50, $100, $500, $1,000) using crypto USDT.
              </p>
              <div className="text-[11px] text-cyan-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>$5 Base Multiple Architecture</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative glass-panel rounded-2xl p-6 border border-cyan-900/50 hover:border-cyan-500/40 transition group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-black text-lg font-['Outfit']">
                  3
                </div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-800">
                  Step Three
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition">
                Earn Daily
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Get 2% daily ROI returns for 80 days directly to your wallet balance plus 15-level team commissions with 4X maximum earnings capping.
              </p>
              <div className="text-[11px] text-cyan-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Min $2 Withdrawal Anytime</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. BUSINESS PLAN & 15-LEVEL SYSTEM (From Excel Plan) */}
      <section id="plan" className="py-20 bg-[#030712] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-semibold border border-cyan-800 mb-3">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Business Model</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-['Outfit'] mb-3">
              Transparent & Sustainable <span className="text-cyan-400">Economics</span>
            </h2>
            <p className="text-sm text-slate-300">
              Mathematically balanced business logic designed for steady growth, daily liquidity, and capped risk.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            
            {/* Card 1: $5 Package & ROI */}
            <div className="glass-panel rounded-2xl p-6 border-t-2 border-t-cyan-400">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Package Engine</div>
              <h3 className="text-2xl font-black text-white mb-2">$5 Entry Package</h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Accessible to everyone globally. Every package operates as a standalone revenue contract.
              </p>
              <div className="space-y-2.5 pt-3 border-t border-cyan-900/40 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Daily Payout:</span>
                  <span className="font-bold text-cyan-300">2% / Day ($0.10)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Tenure Duration:</span>
                  <span className="font-bold text-white">80 Days</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Total ROI Return:</span>
                  <span className="font-bold text-emerald-400">160% ($8.00)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Multiples Allowed:</span>
                  <span className="font-bold text-white">Unlimited $5 Multiples</span>
                </div>
              </div>
            </div>

            {/* Card 2: 15-Level Income */}
            <div className="glass-panel rounded-2xl p-6 border-t-2 border-t-blue-500">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Affiliate Structure</div>
              <h3 className="text-2xl font-black text-white mb-2">15-Level Network</h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Earn deep referral commissions spanning 15 levels of downline team activations.
              </p>
              <div className="space-y-2.5 pt-3 border-t border-cyan-900/40 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Direct Referral Bonus:</span>
                  <span className="font-bold text-amber-400">5% ($0.25 per $5)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Level 1 Commission:</span>
                  <span className="font-bold text-cyan-300">10% ($0.50 per $5)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Level 2 & 3:</span>
                  <span className="font-bold text-white">4% ($0.20) & 3% ($0.15)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Level 4 to Level 14:</span>
                  <span className="font-bold text-white">2% ($0.10 each)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Level 15:</span>
                  <span className="font-bold text-white">1% ($0.05)</span>
                </div>
              </div>
            </div>

            {/* Card 3: 4X Capping & Withdrawals */}
            <div className="glass-panel rounded-2xl p-6 border-t-2 border-t-amber-400">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Platform Safeguard</div>
              <h3 className="text-2xl font-black text-white mb-2">4X Capping & Payout</h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Rigorous financial safeguards guarantee long-term stability and liquidity.
              </p>
              <div className="space-y-2.5 pt-3 border-t border-cyan-900/40 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Max Lifetime Cap:</span>
                  <span className="font-bold text-amber-400">4X of Total Investment</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Max Cap on $5:</span>
                  <span className="font-bold text-white">$20.00 USD</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Min Withdrawal:</span>
                  <span className="font-bold text-emerald-400">$2.00 USD</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Withdrawal Increment:</span>
                  <span className="font-bold text-white">$1.00 Steps</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>System Deduction Fee:</span>
                  <span className="font-bold text-rose-300">5% Admin Fee</span>
                </div>
              </div>
            </div>

          </div>

          {/* 15-Level Detailed Table */}
          <div id="levels" className="glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-900/50 mb-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <span>15-Level Income Commission Matrix</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Full 40% affiliate volume distribution across all 15 downline levels
                </p>
              </div>
              <div className="text-xs px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono">
                Standard $5 Unit
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-cyan-900/60 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Level</th>
                    <th className="py-3 px-3">Commission %</th>
                    <th className="py-3 px-3">Payout per $5 Package</th>
                    <th className="py-3 px-3">Payout per 100 Pkgs ($500)</th>
                    <th className="py-3 px-3">Distribution Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-950/60 font-medium">
                  {Object.entries(LEVEL_PERCENTAGES).map(([lvl, pct]) => (
                    <tr key={lvl} className="hover:bg-cyan-950/30 transition">
                      <td className="py-3 px-3 text-white font-bold">
                        Level {lvl}
                        {lvl === '1' && <span className="ml-2 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">Direct Sponsor</span>}
                      </td>
                      <td className="py-3 px-3 text-cyan-300 font-bold font-mono">
                        {(pct * 100).toFixed(0)}%
                      </td>
                      <td className="py-3 px-3 text-emerald-400 font-bold font-mono">
                        ${(5 * pct).toFixed(2)} USD
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-mono">
                        ${(500 * pct).toFixed(2)} USD
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Instant Credit</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. LIVE PROFIT CALCULATOR */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-semibold border border-cyan-800 mb-2">
                  <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Simulate Your Earnings</span>
                </div>
                <h3 className="text-2xl font-black text-white font-['Outfit']">
                  RoyalBit Profit & Capping Calculator
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Adjust the number of $5 packages to see your daily ROI, 80-day returns, and 4X capping limits.
                </p>
              </div>

              {/* Quick Select Buttons */}
              <div className="flex flex-wrap gap-2">
                {[1, 5, 10, 20, 50, 100, 200].map((count) => (
                  <button
                    key={count}
                    onClick={() => setCalcPackages(count)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      calcPackages === count
                        ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                        : 'bg-[#08122c] text-slate-300 hover:text-white border border-cyan-900'
                    }`}
                  >
                    {count} Pkg (${count * 5})
                  </button>
                ))}
              </div>
            </div>

            {/* Slider */}
            <div className="mb-8">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-400">Package Quantity:</span>
                <span className="font-bold text-cyan-400 font-mono text-sm">
                  {calcPackages} Packages (${calcAmount}.00 USD)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="200"
                value={calcPackages}
                onChange={(e) => setCalcPackages(Number(e.target.value))}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#08122c] border border-cyan-900/60">
                <div className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Total Investment</div>
                <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                  ${calcAmount.toFixed(2)}
                </div>
                <div className="text-[10px] text-cyan-400 mt-1">{calcPackages} units @ $5</div>
              </div>

              <div className="p-4 rounded-xl bg-[#08122c] border border-cyan-900/60">
                <div className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Daily ROI (2%)</div>
                <div className="text-xl sm:text-2xl font-extrabold text-cyan-400 font-mono">
                  ${calcDaily.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Paid each 24 hours</div>
              </div>

              <div className="p-4 rounded-xl bg-[#08122c] border border-cyan-900/60">
                <div className="text-[11px] text-slate-400 uppercase font-semibold mb-1">80 Days Total (160%)</div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
                  ${calcTotalRoi.toFixed(2)}
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">+60% pure profit</div>
              </div>

              <div className="p-4 rounded-xl bg-[#08122c] border border-cyan-900/60">
                <div className="text-[11px] text-slate-400 uppercase font-semibold mb-1">4X Max Earning Cap</div>
                <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">
                  ${calcMaxCap.toFixed(2)}
                </div>
                <div className="text-[10px] text-amber-400 mt-1">ROI + Level + Referral</div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/25 text-sm"
              >
                <span>Activate {calcPackages} Package(s) Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-20 bg-gradient-to-b from-[#030712] to-[#060c21] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white font-['Outfit'] mb-2">
              Frequently Asked <span className="text-cyan-400">Questions</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Clear answers to platform mechanics, 4X capping, and withdrawal rules.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = selectedFaq === index;
              return (
                <div 
                  key={index}
                  className="rounded-xl border border-cyan-900/50 bg-[#08122c]/60 overflow-hidden transition"
                >
                  <button
                    onClick={() => setSelectedFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-cyan-300 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-cyan-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-cyan-950 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-16 bg-gradient-to-r from-cyan-950 via-[#0a1842] to-blue-950 border-y border-cyan-500/20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black text-white font-['Outfit'] mb-3">
            Ready to Begin with <span className="text-cyan-400">RoyalBit</span>?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
            Join thousands of global investors growing their wealth through automated 2% daily payouts and transparent 15-level team commissions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/30 text-sm flex items-center gap-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenLogin}
              className="px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-[#08122c] hover:bg-cyan-950 border border-cyan-800 transition text-sm"
            >
              Sign In to Dashboard
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

