'use client';

import { Navbar } from '@/components/Navbar';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESSES, VAULT_ABI, ERC20_ABI, ROUTER_ABI } from '@/lib/constants';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { TrendingUp, DollarSign, Heart, Activity, ArrowUpRight, ArrowDownRight, Zap, Coins, Network, Wallet, Sparkles, BarChart3 } from 'lucide-react';
import { useState } from 'react';
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

  const { writeContract: deposit, isPending: isDepositPending } = useWriteContract();
  const { writeContract: withdraw, isPending: isWithdrawPending } = useWriteContract();
  const { writeContract: harvest, isPending: isHarvestPending } = useWriteContract();
  const { writeContract: approve } = useWriteContract();

  // Read router data
  const { data: totalDonated } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELD_ROUTER,
    abi: ROUTER_ABI,
    functionName: 'totalDonated',
  });

  const handleDeposit = async () => {
    if (!address || !depositAmount) return;
    try {
      const amount = BigInt(parseFloat(depositAmount) * 1e6);
      // First approve USDC spending
      await approve({
        address: CONTRACT_ADDRESSES.USDC,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.KARMA_VAULT, amount],
      });
      // Then deposit
      deposit({
        address: CONTRACT_ADDRESSES.KARMA_VAULT,
        abi: VAULT_ABI,
        functionName: 'deposit',
        args: [amount, address],
      });
    } catch (error) {
      console.error('Deposit error:', error);
    }
  };

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
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="glass-strong rounded-3xl p-12 max-w-2xl mx-auto border-2 border-teal-500/30 backdrop-blur-xl"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block mb-6"
            >
              <Wallet className="w-20 h-20 text-teal-400" />
            </motion.div>
            <h1 className="text-4xl font-black gradient-text mb-4">Please Connect Your Wallet</h1>
            <p className="text-gray-400 text-lg">Connect your wallet to view your dashboard and start earning yield</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-gradient relative overflow-hidden">
      <GlowEffect />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-10 h-10 text-teal-400" />
            </motion.div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black gradient-text mb-2">Dashboard</h1>
              <p className="text-gray-400 text-xl">Monitor your yield and impact in real-time</p>
            </div>
          </div>
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
              <Card3D className="glass-strong rounded-3xl p-6 hover-lift group relative overflow-hidden border border-white/10 backdrop-blur-xl h-full">
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm font-semibold">{card.label}</span>
                    <motion.div
                      className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-2xl`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <card.icon className="h-6 w-6 text-white" />
                    </motion.div>
                  </div>
                  <div className={`text-4xl font-black bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mb-2`}>
                    <AnimatedCounter 
                      value={card.value} 
                      prefix={card.prefix || ''} 
                      suffix={card.suffix || ''}
                      decimals={card.suffix ? 1 : 0}
                    />
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: card.delay + 0.3 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-semibold">{card.change}</span>
                    <span className="text-gray-500">vs last week</span>
                  </motion.div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons with Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-strong rounded-3xl p-8 mb-10 backdrop-blur-xl border border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { id: 'deposit' as const, label: 'Deposit', icon: ArrowUpRight, gradient: 'from-teal-500 to-cyan-500', glow: 'btn-glow-teal' },
              { id: 'withdraw' as const, label: 'Withdraw', icon: ArrowDownRight, gradient: 'from-purple-500 to-pink-500', glow: 'btn-glow-purple' },
              { id: 'harvest' as const, label: 'Harvest', icon: Zap, gradient: 'from-yellow-500 to-orange-500', glow: 'btn-glow-teal' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative px-8 py-5 rounded-2xl font-black text-lg transition-all duration-300 btn-ripple overflow-hidden ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-2xl ${tab.glow}`
                    : 'btn-secondary text-gray-400 hover:text-white hover:border-teal-500/50'
                }`}
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <motion.div
                    animate={activeTab === tab.id ? { rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <tab.icon className="w-6 h-6" />
                  </motion.div>
                  <span className="tracking-wide">{tab.label}</span>
                </div>
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  />
                )}
              </motion.button>
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
                  className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg font-semibold"
                />
                <motion.button
                  onClick={handleDeposit}
                  disabled={isDepositPending || !depositAmount}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl font-black text-lg hover:from-teal-400 hover:to-cyan-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-primary btn-glow-teal btn-ripple shadow-2xl disabled:hover:scale-100 disabled:hover:y-0"
                >
                  <span className="flex items-center justify-center gap-3">
                    {isDepositPending ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <ArrowUpRight className="w-5 h-5" />
                        </motion.div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="w-6 h-6" />
                        Deposit Now
                      </>
                    )}
                  </span>
                </motion.button>
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
                  className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg font-semibold"
                />
                <motion.button
                  onClick={handleWithdraw}
                  disabled={isWithdrawPending || !withdrawAmount}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-black text-lg hover:from-purple-400 hover:to-pink-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-gradient btn-glow-purple btn-ripple shadow-2xl disabled:hover:scale-100 disabled:hover:y-0"
                >
                  <span className="flex items-center justify-center gap-3">
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
                        <ArrowDownRight className="w-6 h-6" />
                        Withdraw Now
                      </>
                    )}
                  </span>
                </motion.button>
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
                <div className="glass rounded-xl p-6 mb-4">
                  <p className="text-gray-300 mb-2 font-semibold">Harvest yield and automatically donate to public goods</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                      <span>80% to vault users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>20% to public goods</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={handleHarvest}
                  disabled={isHarvestPending}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-6 bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500 text-white rounded-2xl font-black text-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-glow-teal btn-ripple shadow-2xl relative overflow-hidden disabled:hover:scale-100 disabled:hover:y-0"
                >
                  <span className="relative z-10 flex items-center justify-center gap-4">
                    {isHarvestPending ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Zap className="w-7 h-7" />
                        </motion.div>
                        <span>Harvesting...</span>
                      </>
                    ) : (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Zap className="w-8 h-8" />
                        </motion.div>
                        <span className="tracking-wide">Harvest & Donate Now</span>
                      </>
                    )}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </motion.button>
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
            className="glass-strong rounded-3xl p-8 hover-lift border border-white/10 backdrop-blur-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <BarChart3 className="w-8 h-8 text-teal-400" />
              <h3 className="font-black text-white text-2xl">Yield Growth</h3>
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
            className="glass-strong rounded-3xl p-8 hover-lift border border-white/10 backdrop-blur-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <Heart className="w-8 h-8 text-red-400" />
              <h3 className="font-black text-white text-2xl">Donation Distribution</h3>
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
          className="glass-strong rounded-3xl p-8 hover-lift border border-white/10 backdrop-blur-xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <Network className="w-8 h-8 text-purple-400" />
            <h3 className="font-black text-white text-2xl">Adapter Allocation</h3>
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

