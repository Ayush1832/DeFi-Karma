'use client';

import { Navbar } from '@/components/Navbar';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, ADAPTERS, VAULT_ABI } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Activity, Network, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VaultPage() {
  // Read vault data
  const { data: totalAssets } = useReadContract({
    address: CONTRACT_ADDRESSES.KARMA_VAULT,
    abi: VAULT_ABI,
    functionName: 'totalAssets',
  });

  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESSES.KARMA_VAULT,
    abi: VAULT_ABI,
    functionName: 'totalSupply',
  });

  // Calculate average APY (weighted by allocation)
  const avgAPY = ADAPTERS.reduce((sum, adapter) => sum + (adapter.apy * adapter.allocation) / 100, 0);
  
  // Adapter count
  const adapterCount = ADAPTERS.length;

  return (
    <div className="min-h-screen animated-gradient">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Vault Management</h1>
          <p className="text-gray-400 text-lg">View and manage adapter allocations across multiple DeFi protocols</p>
        </motion.div>

        {/* Vault Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { 
              label: 'Total Assets', 
              value: totalAssets ? formatCurrency(Number(totalAssets) / 1e6) : '$0', 
              icon: TrendingUp, 
              gradient: 'from-teal-500 to-cyan-500',
              delay: 0.1
            },
            { 
              label: 'Total Supply', 
              value: totalSupply ? formatCurrency(Number(totalSupply) / 1e18) : '0', 
              icon: Activity, 
              gradient: 'from-purple-500 to-pink-500',
              delay: 0.2
            },
            { 
              label: 'Average APY', 
              value: `${avgAPY.toFixed(2)}%`, 
              icon: Zap, 
              gradient: 'from-blue-500 to-cyan-500',
              delay: 0.3
            },
          ].map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: card.delay, duration: 0.6 }}
              className="glass-strong rounded-2xl p-6 hover-lift group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-sm font-medium">{card.label}</span>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${card.gradient} opacity-80`}>
                    <card.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                  {card.value}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Adapters */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <h2 className="text-3xl font-bold gradient-text mb-2">Protocol Adapters</h2>
            <p className="text-gray-400">Multi-protocol yield aggregation</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADAPTERS.map((adapter, index) => (
              <motion.div
                key={adapter.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                className="glass-strong rounded-2xl p-6 hover-lift group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-purple-500/0 group-hover:from-teal-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{adapter.name}</h3>
                    <Network className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400 text-sm">Allocation</span>
                        <span className="font-semibold text-white">{adapter.allocation}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${adapter.allocation}%` }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 1 }}
                          className="h-2 rounded-full"
                          style={{ backgroundColor: adapter.color }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <span className="text-gray-400 text-sm">APY</span>
                      <span className="font-semibold text-teal-400">{adapter.apy}%</span>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <span className="text-gray-500 text-xs font-mono block truncate">
                        {adapter.address.slice(0, 10)}...{adapter.address.slice(-8)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vault Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-strong rounded-2xl p-6 lg:p-8 hover-lift"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Vault Configuration</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                { label: 'Total Allocation', value: '100%' },
                { label: 'Active Adapters', value: adapterCount.toString() },
                { label: 'Average APY', value: `${avgAPY.toFixed(2)}%` },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[
                { label: 'Donation Ratio', value: '20%' },
                { label: 'User Share', value: '80%' },
                { label: 'Vault Standard', value: 'ERC-4626' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
