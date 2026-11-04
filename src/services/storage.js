// ROYALBIT Storage & Business Engine
// Implements complete business rules:
// - Entry Package: $5 USD Package (multiples of $5 supported)
// - Daily ROI: 2% daily payout for 80 days (160% return)
// - Direct Referral Income: 5% on direct sales ($0.25 per $5)
// - 15-Level Income: L1:10%, L2:4%, L3:3%, L4-L14:2%, L15:1%
// - 4X Capping: Total earnings capped at 400% of total investment
// - Withdrawal: Min $2, $1 increments, 5% deduction fee

const STORAGE_KEYS = {
  USERS: 'royalbit_users_v2',
  PACKAGES: 'royalbit_packages_v2',
  TRANSACTIONS: 'royalbit_transactions_v2',
  CURRENT_USER_ID: 'royalbit_current_user_id',
  SUPABASE_CONFIG: 'royalbit_supabase_config',
};

// Level Income percentages from Excel plan (as fractions of package amount)
export const LEVEL_PERCENTAGES = {
  1: 0.10, // 10% ($0.50 per $5)
  2: 0.04, // 4%  ($0.20 per $5)
  3: 0.03, // 3%  ($0.15 per $5)
  4: 0.02, // 2%  ($0.10 per $5)
  5: 0.02, // 2%
  6: 0.02, // 2%
  7: 0.02, // 2%
  8: 0.02, // 2%
  9: 0.02, // 2%
  10: 0.02, // 2%
  11: 0.02, // 2%
  12: 0.02, // 2%
  13: 0.02, // 2%
  14: 0.02, // 2%
  15: 0.01, // 1% ($0.05 per $5)
};

export const BUSINESS_RULES = {
  BASE_PACKAGE_PRICE: 5, // $5 USD Entry
  DAILY_ROI_PERCENT: 0.02, // 2% per day
  ROI_TENURE_DAYS: 80, // 80 Days
  MAX_ROI_RETURN_PERCENT: 1.60, // 160% (Max $8 on $5)
  DIRECT_COMMISSION_PERCENT: 0.05, // 5% direct commission
  CAPPING_MULTIPLIER: 4.0, // 4X max earnings cap
  MIN_WITHDRAWAL: 2, // $2 USD minimum withdrawal
  WITHDRAWAL_INCREMENT: 1, // $1 increments ($2, $3, $4...)
  WITHDRAWAL_FEE_PERCENT: 0.05, // 5% system deduction fee
};

// Seed Users for demo & testing
const INITIAL_USERS = [
  {
    id: 'user_jitendra',
    memberId: 'RB1004587',
    username: 'jitendrasingh',
    name: 'Jitendra Singh',
    email: 'jitendra@royalbit.io',
    password: 'password123',
    walletBalance: 245.50,
    totalInvestment: 1000.00,
    totalEarnings: 380.00,
    totalWithdrawn: 50.00,
    joinedAt: '03 Nov 2026',
    sponsorId: null,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    kycStatus: 'VERIFIED',
  },
  {
    id: 'user_sarah',
    memberId: 'RB1004588',
    username: 'sarah_crypto',
    name: 'Sarah Connor',
    email: 'sarah@royalbit.io',
    password: 'password123',
    walletBalance: 12.50,
    totalInvestment: 50.00,
    totalEarnings: 18.00,
    totalWithdrawn: 0.00,
    joinedAt: '03 Nov 2026',
    sponsorId: 'RB1004587', // Direct downline Level 1
    kycStatus: 'VERIFIED',
  },
  {
    id: 'user_alex',
    memberId: 'RB1004589',
    username: 'alexv',
    name: 'Alex Vance',
    email: 'alex@royalbit.io',
    password: 'password123',
    walletBalance: 8.00,
    totalInvestment: 25.00,
    totalEarnings: 7.50,
    totalWithdrawn: 0.00,
    joinedAt: '04 Nov 2026',
    sponsorId: 'RB1004587', // Direct downline Level 1
    kycStatus: 'PENDING',
  },
  {
    id: 'user_david',
    memberId: 'RB1004590',
    username: 'david_trader',
    name: 'David Kim',
    email: 'david@royalbit.io',
    password: 'password123',
    walletBalance: 4.20,
    totalInvestment: 15.00,
    totalEarnings: 3.20,
    totalWithdrawn: 0.00,
    joinedAt: '04 Nov 2026',
    sponsorId: 'RB1004588', // Level 2 of Jitendra
    kycStatus: 'UNVERIFIED',
  },
  {
    id: 'user_elena',
    memberId: 'RB1004591',
    username: 'elena_defi',
    name: 'Elena Rostova',
    email: 'elena@royalbit.io',
    password: 'password123',
    walletBalance: 6.80,
    totalInvestment: 20.00,
    totalEarnings: 4.80,
    totalWithdrawn: 0.00,
    joinedAt: '04 Nov 2026',
    sponsorId: 'RB1004590', // Level 3 of Jitendra
    kycStatus: 'VERIFIED',
  }
];

// Seed Investment Packages
const INITIAL_PACKAGES = [
  {
    id: 'pkg_1',
    userId: 'user_jitendra',
    packageAmount: 1000.00,
    units: 200, // 200 * $5
    dailyRoiPercent: 0.02,
    dailyRoiAmount: 20.00,
    daysTotal: 80,
    daysElapsed: 14,
    totalRoiEarned: 280.00,
    maxReturn: 1600.00,
    startDate: '20 Oct 2026',
    lastClaimDate: '03 Nov 2026',
    status: 'ACTIVE',
  },
  {
    id: 'pkg_2',
    userId: 'user_sarah',
    packageAmount: 50.00,
    units: 10, // 10 * $5
    dailyRoiPercent: 0.02,
    dailyRoiAmount: 1.00,
    daysTotal: 80,
    daysElapsed: 8,
    totalRoiEarned: 8.00,
    maxReturn: 80.00,
    startDate: '26 Oct 2026',
    lastClaimDate: '03 Nov 2026',
    status: 'ACTIVE',
  },
  {
    id: 'pkg_3',
    userId: 'user_alex',
    packageAmount: 25.00,
    units: 5,
    dailyRoiPercent: 0.02,
    dailyRoiAmount: 0.50,
    daysTotal: 80,
    daysElapsed: 3,
    totalRoiEarned: 1.50,
    maxReturn: 40.00,
    startDate: '01 Nov 2026',
    lastClaimDate: '03 Nov 2026',
    status: 'ACTIVE',
  }
];

// Seed Transactions
const INITIAL_TRANSACTIONS = [
  {
    id: 'tx_101',
    userId: 'user_jitendra',
    type: 'ROI_CREDIT',
    amount: 20.00,
    fee: 0,
    netAmount: 20.00,
    status: 'COMPLETED',
    description: 'Daily ROI Payout (2.0% on $1,000)',
    txHash: '0x8f2a...4b91',
    date: '03 Nov 2026, 08:00 AM',
  },
  {
    id: 'tx_102',
    userId: 'user_jitendra',
    type: 'LEVEL_INCOME',
    amount: 5.00,
    fee: 0,
    netAmount: 5.00,
    level: 1,
    fromMemberId: 'RB1004588',
    status: 'COMPLETED',
    description: 'Level 1 Commission (10%) from Sarah Connor',
    txHash: '0x3c71...99ef',
    date: '02 Nov 2026, 04:15 PM',
  },
  {
    id: 'tx_103',
    userId: 'user_jitendra',
    type: 'DIRECT_REFERRAL',
    amount: 2.50,
    fee: 0,
    netAmount: 2.50,
    fromMemberId: 'RB1004588',
    status: 'COMPLETED',
    description: 'Direct Referral Bonus (5%) from Sarah Connor',
    txHash: '0x12b0...e45a',
    date: '02 Nov 2026, 04:15 PM',
  },
  {
    id: 'tx_104',
    userId: 'user_jitendra',
    type: 'WITHDRAWAL',
    amount: 50.00,
    fee: 2.50,
    netAmount: 47.50,
    status: 'COMPLETED',
    description: 'USDT (TRC20) Withdrawal to TX...774',
    txHash: '0x99a4...6871',
    date: '01 Nov 2026, 11:30 AM',
  },
  {
    id: 'tx_105',
    userId: 'user_jitendra',
    type: 'INVESTMENT',
    amount: 1000.00,
    fee: 0,
    netAmount: 1000.00,
    status: 'COMPLETED',
    description: 'Package Activation: 200x $5.00 Packages',
    txHash: '0x44d1...21a3',
    date: '20 Oct 2026, 10:00 AM',
  }
];

class StorageEngine {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PACKAGES)) {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(INITIAL_PACKAGES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user_jitendra');
    }
  }

  // --- Users ---
  getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  }

  saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  getUserById(id) {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  }

  getUserByUsername(username) {
    const users = this.getUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase().trim()) || null;
  }

  getUserByMemberId(memberId) {
    if (!memberId) return null;
    const users = this.getUsers();
    return users.find(u => u.memberId.toUpperCase() === memberId.toUpperCase().trim()) || null;
  }

  getCurrentUser() {
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (!currentId) return null;
    return this.getUserById(currentId);
  }

  setCurrentUser(userId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  }

  // Generate Unique Member ID: RB + 7 digits (e.g., RB1004587)
  generateUniqueMemberId() {
    const users = this.getUsers();
    const existingIds = new Set(users.map(u => u.memberId));

    let newId;
    let attempts = 0;
    do {
      const randomNum = Math.floor(1000000 + Math.random() * 9000000);
      newId = `RB${randomNum}`;
      attempts++;
    } while (existingIds.has(newId) && attempts < 100);

    return newId;
  }

  // Register New User
  registerUser({ name, username, email, password, sponsorMemberId }) {
    const users = this.getUsers();

    // Check duplicate email
    if (this.getUserByEmail(email)) {
      throw new Error('Email is already registered. Please login or use another email.');
    }

    // Check duplicate username
    if (this.getUserByUsername(username)) {
      throw new Error('Username is already taken. Please choose another username.');
    }

    // Validate sponsor if provided
    let sponsor = null;
    if (sponsorMemberId && sponsorMemberId.trim()) {
      sponsor = this.getUserByMemberId(sponsorMemberId.trim());
      if (!sponsor) {
        throw new Error(`Sponsor Member ID "${sponsorMemberId}" does not exist in the system.`);
      }
    }

    const memberId = this.generateUniqueMemberId();
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      memberId,
      username: username.toLowerCase().trim(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // In production, hashed via auth provider
      walletBalance: 0.00,
      totalInvestment: 0.00,
      totalEarnings: 0.00,
      totalWithdrawn: 0.00,
      joinedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      sponsorId: sponsor ? sponsor.memberId : null,
      kycStatus: 'UNVERIFIED',
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser.id);
    return newUser;
  }

  // Login User
  loginUser(identifier, password) {
    const trimmed = identifier.trim();
    const user = this.getUserByEmail(trimmed) || this.getUserByUsername(trimmed) || this.getUserByMemberId(trimmed);

    if (!user) {
      throw new Error('No account found with this Email, Username, or Member ID.');
    }

    if (user.password !== password) {
      throw new Error('Incorrect password. Please verify and try again.');
    }

    this.setCurrentUser(user.id);
    return user;
  }

  // Update User Profile
  updateUser(userId, updates) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updates };
    this.saveUsers(users);
    return users[index];
  }

  // Reset Password Flow
  resetPassword(email, newPassword) {
    const user = this.getUserByEmail(email);
    if (!user) {
      throw new Error('No account found associated with this email address.');
    }
    return this.updateUser(user.id, { password: newPassword });
  }

  // --- Investment Packages ---
  getPackages() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      return data ? JSON.parse(data) : INITIAL_PACKAGES;
    } catch {
      return INITIAL_PACKAGES;
    }
  }

  savePackages(packages) {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
  }

  getUserPackages(userId) {
    const pkgs = this.getPackages();
    return pkgs.filter(p => p.userId === userId);
  }

  // --- Transactions ---
  getTransactions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  }

  saveTransactions(transactions) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  getUserTransactions(userId) {
    const txs = this.getTransactions();
    return txs.filter(t => t.userId === userId).sort((a, b) => (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0));
  }

  addTransaction(tx) {
    const transactions = this.getTransactions();
    const newTx = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      txHash: '0x' + Math.random().toString(16).substr(2, 4) + '...' + Math.random().toString(16).substr(2, 4),
      status: 'COMPLETED',
      fee: 0,
      ...tx,
    };
    transactions.unshift(newTx);
    this.saveTransactions(transactions);
    return newTx;
  }

  // --- Business Logic: 4X Capping Checker ---
  checkAndApplyCapping(user, incomingAmount) {
    const maxCap = user.totalInvestment * BUSINESS_RULES.CAPPING_MULTIPLIER;
    const currentEarnings = user.totalEarnings;

    if (maxCap <= 0) {
      // If user has 0 investment, they cannot earn beyond 0
      return 0;
    }

    const availableCappingRoom = Math.max(0, maxCap - currentEarnings);
    const creditedAmount = Math.min(incomingAmount, availableCappingRoom);
    return creditedAmount;
  }

  // --- Business Logic: Package Investment ($5 Base Multiple) ---
  investInPackage(userId, packageAmount, paymentMethod = 'Crypto USDT') {
    if (packageAmount < BUSINESS_RULES.BASE_PACKAGE_PRICE) {
      throw new Error(`Minimum investment is $${BUSINESS_RULES.BASE_PACKAGE_PRICE} USD.`);
    }

    if (packageAmount % BUSINESS_RULES.BASE_PACKAGE_PRICE !== 0) {
      throw new Error(`Investment amount must be a multiple of $${BUSINESS_RULES.BASE_PACKAGE_PRICE} (e.g. $5, $10, $25, $50, $100).`);
    }

    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found.');

    const units = Math.floor(packageAmount / BUSINESS_RULES.BASE_PACKAGE_PRICE);
    const dailyRoiAmount = packageAmount * BUSINESS_RULES.DAILY_ROI_PERCENT; // 2% per day
    const maxReturn = packageAmount * BUSINESS_RULES.MAX_ROI_RETURN_PERCENT; // 160% ($8 per $5)

    const newPkg = {
      id: `pkg_${Date.now()}`,
      userId,
      packageAmount: Number(packageAmount),
      units,
      dailyRoiPercent: BUSINESS_RULES.DAILY_ROI_PERCENT,
      dailyRoiAmount,
      daysTotal: BUSINESS_RULES.ROI_TENURE_DAYS,
      daysElapsed: 0,
      totalRoiEarned: 0,
      maxReturn,
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastClaimDate: null,
      status: 'ACTIVE',
    };

    // Save package
    const pkgs = this.getPackages();
    pkgs.unshift(newPkg);
    this.savePackages(pkgs);

    // Update user's total investment
    const updatedUser = this.updateUser(userId, {
      totalInvestment: user.totalInvestment + packageAmount,
    });

    // Record Investment Transaction
    this.addTransaction({
      userId,
      type: 'INVESTMENT',
      amount: packageAmount,
      netAmount: packageAmount,
      description: `Package Activation: ${units}x $${BUSINESS_RULES.BASE_PACKAGE_PRICE}.00 Packages (${paymentMethod})`,
    });

    // Distribute Direct Commission & 15-Level Incomes to uplines!
    this.distributeLevelCommissions(user, packageAmount);

    return { package: newPkg, user: updatedUser };
  }

  // --- Business Logic: Direct Referral (5%) & 15-Level Incomes ---
  distributeLevelCommissions(buyerUser, packageAmount) {
    if (!buyerUser.sponsorId) return;

    let currentSponsorMemberId = buyerUser.sponsorId;
    let currentLevel = 1;

    while (currentSponsorMemberId && currentLevel <= 15) {
      const uplineUser = this.getUserByMemberId(currentSponsorMemberId);
      if (!uplineUser) break;

      // 1. Direct Referral Bonus (5%) on Level 1
      if (currentLevel === 1) {
        const directAmountRaw = packageAmount * BUSINESS_RULES.DIRECT_COMMISSION_PERCENT; // 5%
        const directAmountCredited = this.checkAndApplyCapping(uplineUser, directAmountRaw);

        if (directAmountCredited > 0) {
          this.updateUser(uplineUser.id, {
            walletBalance: uplineUser.walletBalance + directAmountCredited,
            totalEarnings: uplineUser.totalEarnings + directAmountCredited,
          });

          this.addTransaction({
            userId: uplineUser.id,
            type: 'DIRECT_REFERRAL',
            amount: directAmountCredited,
            netAmount: directAmountCredited,
            fromMemberId: buyerUser.memberId,
            description: `Direct Referral Commission (5%) from ${buyerUser.name} (${buyerUser.memberId})`,
          });
        }
      }

      // 2. Level Income System for Levels 1 to 15
      const levelPercent = LEVEL_PERCENTAGES[currentLevel] || 0.02;
      const levelAmountRaw = packageAmount * levelPercent;
      const levelAmountCredited = this.checkAndApplyCapping(uplineUser, levelAmountRaw);

      if (levelAmountCredited > 0) {
        const refreshedUpline = this.getUserById(uplineUser.id);
        this.updateUser(uplineUser.id, {
          walletBalance: refreshedUpline.walletBalance + levelAmountCredited,
          totalEarnings: refreshedUpline.totalEarnings + levelAmountCredited,
        });

        this.addTransaction({
          userId: uplineUser.id,
          type: 'LEVEL_INCOME',
          amount: levelAmountCredited,
          netAmount: levelAmountCredited,
          level: currentLevel,
          fromMemberId: buyerUser.memberId,
          description: `Level ${currentLevel} Commission (${(levelPercent * 100).toFixed(0)}%) from ${buyerUser.name} (${buyerUser.memberId})`,
        });
      }

      // Move up to the next sponsor in tree
      currentSponsorMemberId = uplineUser.sponsorId;
      currentLevel++;
    }
  }

  // --- Business Logic: Claim / Simulate Daily 2% ROI ---
  claimDailyRoi(userId) {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');

    const pkgs = this.getPackages();
    const userPkgs = pkgs.filter(p => p.userId === userId && p.status === 'ACTIVE');

    if (userPkgs.length === 0) {
      throw new Error('No active investment packages found to claim ROI.');
    }

    let totalRoiToCredit = 0;
    let packagesUpdated = 0;

    userPkgs.forEach(pkg => {
      if (pkg.daysElapsed < pkg.daysTotal) {
        pkg.daysElapsed += 1;
        const dailyAmt = pkg.dailyRoiAmount;
        pkg.totalRoiEarned += dailyAmt;
        totalRoiToCredit += dailyAmt;
        packagesUpdated++;

        if (pkg.daysElapsed >= pkg.daysTotal || pkg.totalRoiEarned >= pkg.maxReturn) {
          pkg.status = 'COMPLETED';
        }
      }
    });

    if (totalRoiToCredit <= 0) {
      throw new Error('All investment packages have reached the 80-day maturity limit.');
    }

    // Apply 4X capping rule
    const cappedCredit = this.checkAndApplyCapping(user, totalRoiToCredit);

    if (cappedCredit <= 0) {
      throw new Error('4X Capping Limit Reached! Re-invest in packages to expand your earning limit.');
    }

    this.savePackages(pkgs);

    this.updateUser(userId, {
      walletBalance: user.walletBalance + cappedCredit,
      totalEarnings: user.totalEarnings + cappedCredit,
    });

    this.addTransaction({
      userId,
      type: 'ROI_CREDIT',
      amount: cappedCredit,
      netAmount: cappedCredit,
      description: `Daily ROI Payout (2.0% for day cycle across ${packagesUpdated} package(s))`,
    });

    return {
      creditedAmount: cappedCredit,
      packagesUpdated,
      isCapped: cappedCredit < totalRoiToCredit,
    };
  }

  // --- Business Logic: Withdrawal Rule ($2 Min, $1 Inc, 5% Fee) ---
  requestWithdrawal(userId, amount, address, network = 'USDT (TRC20)') {
    const numAmount = Number(amount);

    if (isNaN(numAmount) || numAmount < BUSINESS_RULES.MIN_WITHDRAWAL) {
      throw new Error(`Minimum withdrawal amount is $${BUSINESS_RULES.MIN_WITHDRAWAL}.00 USD.`);
    }

    if (numAmount % BUSINESS_RULES.WITHDRAWAL_INCREMENT !== 0) {
      throw new Error(`Withdrawal amount must be in whole $${BUSINESS_RULES.WITHDRAWAL_INCREMENT} increments (e.g. $2, $3, $4, $10). No decimal amounts allowed.`);
    }

    if (!address || address.trim().length < 8) {
      throw new Error('Please enter a valid Crypto Wallet address.');
    }

    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');

    if (user.walletBalance < numAmount) {
      throw new Error(`Insufficient wallet balance. Available balance: $${user.walletBalance.toFixed(2)}`);
    }

    // Calculate 5% fee
    const fee = numAmount * BUSINESS_RULES.WITHDRAWAL_FEE_PERCENT;
    const netAmount = numAmount - fee;

    // Deduct balance and update withdrawn total
    const updatedUser = this.updateUser(userId, {
      walletBalance: user.walletBalance - numAmount,
      totalWithdrawn: (user.totalWithdrawn || 0) + netAmount,
    });

    // Record Transaction
    const tx = this.addTransaction({
      userId,
      type: 'WITHDRAWAL',
      amount: numAmount,
      fee,
      netAmount,
      status: 'COMPLETED',
      description: `Withdrawal of $${numAmount.toFixed(2)} to ${address.slice(0, 6)}...${address.slice(-4)} (${network})`,
    });

    return { transaction: tx, user: updatedUser, fee, netAmount };
  }

  // --- Level Team Hierarchy (Levels 1 to 15) ---
  getLevelTeamHierarchy(userId) {
    const user = this.getUserById(userId);
    if (!user) return { levels: {}, totalMembers: 0, totalTeamInvestment: 0 };

    const allUsers = this.getUsers();
    const levels = {};
    for (let i = 1; i <= 15; i++) {
      levels[i] = [];
    }

    // BFS through upline-downline graph
    let currentLevelSponsorIds = [user.memberId];
    let totalMembers = 0;
    let totalTeamInvestment = 0;

    for (let lvl = 1; lvl <= 15; lvl++) {
      if (currentLevelSponsorIds.length === 0) break;

      const downlineThisLevel = allUsers.filter(u => currentLevelSponsorIds.includes(u.sponsorId));
      levels[lvl] = downlineThisLevel.map(u => {
        totalMembers++;
        totalTeamInvestment += u.totalInvestment || 0;
        return {
          id: u.id,
          memberId: u.memberId,
          name: u.name,
          username: u.username,
          email: u.email,
          totalInvestment: u.totalInvestment || 0,
          joinedAt: u.joinedAt,
          kycStatus: u.kycStatus,
          levelPercentage: (LEVEL_PERCENTAGES[lvl] * 100).toFixed(0) + '%',
        };
      });

      currentLevelSponsorIds = downlineThisLevel.map(u => u.memberId);
    }

    return { levels, totalMembers, totalTeamInvestment };
  }

  // Supabase / External DB Bridge Config
  getSupabaseConfig() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
      return data ? JSON.parse(data) : { url: '', anonKey: '', isConnected: false };
    } catch {
      return { url: '', anonKey: '', isConnected: false };
    }
  }

  saveSupabaseConfig(config) {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(config));
  }
}

export const storage = new StorageEngine();

