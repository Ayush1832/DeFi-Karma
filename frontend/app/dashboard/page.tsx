'use client';

import { Navbar } from '@/components/Navbar';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, VAULT_ABI, ERC20_ABI, ROUTER_ABI } from '@/lib/constants';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { TrendingUp, DollarSign, Heart, Activity, ArrowUpRight, ArrowDownRight, Zap, Coins, Network, Wallet, Sparkles, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card3D } from '@/components/3DCard';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { GlowEffect } from '@/components/GlowEffect';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#00C2A8', '#6E45E2', '#B6509E', '#FF6B6B'];

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'harvest'>('deposit');

  // Mock data for charts (replace with real data from subgraph)
  const yieldData = [
    { date: 'Day 1', yield: 100 },
    { date: 'Day 2', yield: 150 },
    { date: 'Day 3', yield: 200 },
    { date: 'Day 4', yield: 250 },
    { date: 'Day 5', yield: 300 },
  ];

  const donationData = [
    { name: 'Gitcoin', value: 50 },
    { name: 'Protocol Guild', value: 50 },
  ];

  const adapterData = [
    { name: 'Aave', yield: 35 },
    { name: 'Morpho', yield: 42 },
    { name: 'Spark', yield: 38 },
    { name: 'Yearn', yield: 40 },
  ];

  // Read contract data
  const { data: totalAssets } = useReadContract({
    address: CONTRACT_ADDRESSES.KARMA_VAULT,
    abi: VAULT_ABI,
    functionName: 'totalAssets',
  });

  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESSES.KARMA_VAULT,
    abi: VAULT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { writeContract, data: depositHash, isPending: isDepositPending, error: depositError, reset: resetDeposit } = useWriteContract();
  const { writeContract: withdraw, isPending: isWithdrawPending } = useWriteContract();
  const { writeContract: harvest, isPending: isHarvestPending } = useWriteContract();
  const { writeContract: approve, data: approveHash, isPending: isApprovePending, error: approveError, reset: resetApprove } = useWriteContract();
  
  // Wait for approval transaction
  const { isLoading: isApproving, isSuccess: isApproved } = useWaitForTransactionReceipt({
    hash: approveHash,
    query: { enabled: !!approveHash },
  });
  
  // Wait for deposit transaction
  const { isLoading: isDepositing, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
    hash: depositHash,
    query: { enabled: !!depositHash },
  });
  
  // Track if we're waiting for approval to complete
  const [pendingDepositAmount, setPendingDepositAmount] = useState<string | null>(null);

  // Read router data
  const { data: totalDonated } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELD_ROUTER,
    abi: ROUTER_ABI,
    functionName: 'totalDonated',
  });

  // Check USDC allowance
  const { data: allowance } = useReadContract({
    address: CONTRACT_ADDRESSES.USDC,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACT_ADDRESSES.KARMA_VAULT] : undefined,
    query: { enabled: !!address },
  });

  // Check USDC balance
  const { data: usdcBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.USDC,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Reset form after successful deposit
  useEffect(() => {
    if (isDepositSuccess) {
      setDepositAmount('');
      setPendingDepositAmount(null);
      resetDeposit();
    }
  }, [isDepositSuccess, resetDeposit]);

  const handleDeposit = async () => {
    console.log('handleDeposit called', { address, depositAmount, usdcBalance, allowance });
    
    if (!address) {
      alert('Please connect your wallet');
      return;
    }
    
    if (!depositAmount || depositAmount.trim() === '') {
      alert('Please enter an amount');
      return;
    }

    try {
      const amountValue = parseFloat(depositAmount);
      
      // Validate amount
      if (isNaN(amountValue) || amountValue <= 0) {
        alert('Please enter a valid amount greater than 0');
        return;
      }

      const amount = BigInt(Math.floor(amountValue * 1e6));
      console.log('Deposit amount:', { amountValue, amount });

      // Check balance
      if (usdcBalance) {
        const balance = BigInt(usdcBalance.toString());
        console.log('Balance check:', { balance, amount, hasEnough: balance >= amount });
        if (amount > balance) {
          alert(`Insufficient USDC balance. You have ${formatCurrency(Number(balance) / 1e6)} USDC`);
          return;
        }
      }

      // Reset any previous errors
      resetDeposit();
      resetApprove();

      // Check if approval is needed
      const currentAllowance = allowance ? BigInt(allowance.toString()) : BigInt(0);
      console.log('Allowance check:', { currentAllowance, amount, needsApproval: currentAllowance < amount });
      
      if (currentAllowance < amount) {
        // Store the deposit amount to use after approval
        setPendingDepositAmount(depositAmount);
        
        console.log('Requesting approval...', {
          token: CONTRACT_ADDRESSES.USDC,
          spender: CONTRACT_ADDRESSES.KARMA_VAULT,
          amount: amount.toString(),
        });
        
        // First approve USDC spending
        approve({
          address: CONTRACT_ADDRESSES.USDC,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [CONTRACT_ADDRESSES.KARMA_VAULT, amount],
        });
      } else {
        // Already approved, proceed with deposit directly
        console.log('Depositing directly...', {
          vault: CONTRACT_ADDRESSES.KARMA_VAULT,
          amount: amount.toString(),
          receiver: address,
        });
        
        writeContract({
          address: CONTRACT_ADDRESSES.KARMA_VAULT,
          abi: VAULT_ABI,
          functionName: 'deposit',
          args: [amount, address],
        });
      }
    } catch (error: any) {
      console.error('Deposit error:', error);
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      alert(`Error: ${errorMessage}`);
    }
  };

  // Auto-deposit after approval is confirmed
  useEffect(() => {
    if (isApproved && pendingDepositAmount && address && !depositHash) {
      const amount = BigInt(Math.floor(parseFloat(pendingDepositAmount) * 1e6));
      if (amount > BigInt(0)) {
        writeContract({
          address: CONTRACT_ADDRESSES.KARMA_VAULT,
          abi: VAULT_ABI,
          functionName: 'deposit',
          args: [amount, address],
        });
        // Clear pending amount after initiating deposit
        setPendingDepositAmount(null);
      }
    }
  }, [isApproved, pendingDepositAmount, address, writeContract, depositHash]);

  const handleWithdraw = () => {
    if (!address || !withdrawAmount) return;
    withdraw({
      address: CONTRACT_ADDRESSES.KARMA_VAULT,
      abi: VAULT_ABI,
      functionName: 'withdraw',
      args: [BigInt(parseFloat(withdrawAmount) * 1e6), address, address],
    });
  };

  const handleHarvest = () => {
    harvest({
      address: CONTRACT_ADDRESSES.KARMA_VAULT,
      abi: VAULT_ABI,
      functionName: 'harvestAndDonate',
    });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen animated-gradient relative overflow-hidden">
        <GlowEffect />
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center min-h-screen flex items-center justify-center">
          <div className="card-dark p-12 max-w-2xl mx-auto text-center">
            <Wallet className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">Please Connect Your Wallet</h1>
            <p className="text-white/70 text-lg">Connect your wallet to view your dashboard and start earning yield</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-gradient relative overflow-hidden">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-white/70 text-lg">Monitor your yield and impact in real-time</p>
        </motion.div>

        {/* Portfolio Cards with 3D Effect */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { 
              label: 'Total Deposited', 
              value: balance ? Number(balance) / 1e6 : 0, 
              prefix: '$',
              icon: DollarSign, 
              gradient: 'from-teal-500 to-cyan-500',
              delay: 0.1,
              change: '+12.5%'
            },
            { 
              label: 'Vault Value', 
              value: totalAssets ? Number(totalAssets) / 1e6 : 0, 
              prefix: '$',
              icon: TrendingUp, 
              gradient: 'from-purple-500 to-pink-500',
              delay: 0.2,
              change: '+8.3%'
            },
            { 
              label: 'Total Donated', 
              value: totalDonated ? Number(totalDonated) / 1e6 : 0, 
              prefix: '$',
              icon: Heart, 
              gradient: 'from-red-500 to-orange-500',
              delay: 0.3,
              change: '+5.2%'
            },
            { 
              label: 'APY', 
              value: 4.2, 
              suffix: '%',
              icon: Activity, 
              gradient: 'from-blue-500 to-cyan-500',
              delay: 0.4,
              change: '+0.4%'
            },
          ].map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: card.delay, duration: 0.6, type: 'spring' }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="perspective"
            >
              <div className="card-dark group relative overflow-hidden h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/70 text-sm font-medium">{card.label}</span>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${card.gradient}`}>
                    <card.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className={`text-4xl font-bold text-blue-gradient mb-2`}>
                  <AnimatedCounter 
                    value={card.value} 
                    prefix={card.prefix || ''} 
                    suffix={card.suffix || ''}
                    decimals={card.suffix ? 1 : 0}
                  />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">{card.change}</span>
                  <span className="text-white/50">vs last week</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons with Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-dark p-8 mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { id: 'deposit' as const, label: 'Deposit', icon: ArrowUpRight },
              { id: 'withdraw' as const, label: 'Withdraw', icon: ArrowDownRight },
              { id: 'harvest' as const, label: 'Harvest', icon: Zap },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50'
                    : 'bg-[#1a2332] text-white/70 hover:text-white hover:bg-[#1f2a3a] border border-white/10 hover:border-white/20'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'deposit' && (
              <motion.div
                key="deposit"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <input
                  type="number"
                  placeholder="Amount (USDC)"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-6 py-4 bg-[#1a2332] border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium mb-4"
                />
                {(depositError || approveError) && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    Error: {(depositError || approveError)?.message || 'Transaction failed'}
                  </div>
                )}
                {usdcBalance && (
                  <div className="mb-2 text-sm text-white/60">
                    Your Balance: {formatCurrency(Number(usdcBalance) / 1e6)} USDC
                  </div>
                )}
                <div>
                  {(() => {
                    const amountValue = depositAmount ? parseFloat(depositAmount) : 0;
                    const amount = depositAmount ? BigInt(Math.floor(amountValue * 1e6)) : BigInt(0);
                    const isProcessing = isDepositPending || isApprovePending || isApproving || isDepositing;
                    const hasInsufficientBalance = usdcBalance && depositAmount && amountValue > 0
                      ? amount > BigInt(usdcBalance.toString())
                      : false;
                    const currentAllowance = allowance ? BigInt(allowance.toString()) : BigInt(0);
                    const needsApproval = depositAmount && amountValue > 0
                      ? currentAllowance < amount
                      : false;
                    const isDisabled = isProcessing || !depositAmount || amountValue <= 0 || hasInsufficientBalance;
                    
                    return (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Button clicked', { depositAmount, isDisabled, isProcessing });
                          handleDeposit();
                        }}
                        disabled={isDisabled}
                        className="w-full px-6 py-4 bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white rounded-xl font-semibold text-lg hover:from-[#00D4FF] hover:to-[#0080FF] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                              <ArrowUpRight className="w-5 h-5" />
                            </motion.div>
                            {isApprovePending || isApproving ? 'Approving...' : isDepositing ? 'Depositing...' : 'Processing...'}
                          </>
                        ) : (
                          <>
                            <ArrowUpRight className="w-5 h-5" />
                            {needsApproval ? 'Approve & Deposit' : 'Deposit Now'}
                          </>
                        )}
                      </button>
                    );
                  })()}
                </div>
              </motion.div>
            )}

            {activeTab === 'withdraw' && (
              <motion.div
                key="withdraw"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <input
                  type="number"
                  placeholder="Amount (USDC)"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-6 py-4 bg-[#1a2332] border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium mb-4"
                />
                <button
                  onClick={handleWithdraw}
                  disabled={isWithdrawPending || !withdrawAmount}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white rounded-xl font-semibold text-lg hover:from-[#00D4FF] hover:to-[#0080FF] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2"
                >
                  {isWithdrawPending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <ArrowDownRight className="w-5 h-5" />
                      </motion.div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="w-5 h-5" />
                      Withdraw Now
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {activeTab === 'harvest' && (
              <motion.div
                key="harvest"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="bg-[#1a2332] rounded-xl p-6 mb-4 border border-white/10">
                  <p className="text-white mb-3 font-medium">Harvest yield and automatically donate to public goods</p>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>80% to vault users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span>20% to public goods</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleHarvest}
                  disabled={isHarvestPending}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white rounded-xl font-semibold text-lg hover:from-[#00D4FF] hover:to-[#0080FF] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2"
                >
                  {isHarvestPending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Zap className="w-5 h-5" />
                      </motion.div>
                      Harvesting...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Harvest & Donate Now
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Charts with Animations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="card-dark p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h3 className="font-bold text-white text-xl">Yield Growth</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.9)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    padding: '12px'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="yield" 
                  stroke="#00C2A8" 
                  strokeWidth={4}
                  dot={{ fill: '#00C2A8', r: 6, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 3 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="card-dark p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <Heart className="w-6 h-6 text-blue-400" />
              <h3 className="font-bold text-white text-xl">Donation Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={donationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name} ${((entry.percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {donationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.9)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    padding: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Adapter Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="card-dark p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Network className="w-6 h-6 text-blue-400" />
            <h3 className="font-bold text-white text-xl">Adapter Allocation</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={adapterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.9)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  padding: '12px'
                }} 
              />
              <Legend />
              <Bar 
                dataKey="yield" 
                fill="#6E45E2" 
                radius={[12, 12, 0, 0]}
                animationDuration={1500}
              >
                {adapterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

