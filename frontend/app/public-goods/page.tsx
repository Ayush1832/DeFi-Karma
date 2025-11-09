'use client';

import { Navbar } from '@/components/Navbar';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, PUBLIC_GOODS_RECIPIENTS, ROUTER_ABI, HOOK_ABI } from '@/lib/constants';
import { formatAddress, formatCurrency } from '@/lib/utils';
import { Heart, ExternalLink, TrendingUp, Gift, Globe, Users } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PublicGoodsPage() {
  // Read router data
  const { data: totalDonated } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELD_ROUTER,
    abi: ROUTER_ABI,
    functionName: 'totalDonated',
  });

  const { data: donationRatio } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELD_ROUTER,
    abi: ROUTER_ABI,
    functionName: 'donationRatio',
  });

  const { data: totalYieldRouted } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELD_ROUTER,
    abi: ROUTER_ABI,
    functionName: 'totalYieldRouted',
  });

  const { data: hookTotalDonated } = useReadContract({
    address: CONTRACT_ADDRESSES.IMPACT_HOOK,
    abi: HOOK_ABI,
    functionName: 'totalDonated',
  });

  const donationPercent = donationRatio ? Number(donationRatio) / 100 : 20;

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
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Public Goods</h1>
          <p className="text-gray-400 text-lg">
            A portion of all yield generated is automatically donated to support Ethereum ecosystem growth
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { 
              label: 'Donation Ratio', 
              value: `${donationPercent}%`, 
              subtext: 'of all yield',
              icon: Heart, 
              gradient: 'from-red-500 to-pink-500',
              delay: 0.1
            },
            { 
              label: 'Total Donated', 
              value: hookTotalDonated ? formatCurrency(Number(hookTotalDonated) / 1e6) : '$0', 
              subtext: 'USDC donated',
              icon: TrendingUp, 
              gradient: 'from-teal-500 to-cyan-500',
              delay: 0.2
            },
            { 
              label: 'Total Yield Routed', 
              value: totalYieldRouted ? formatCurrency(Number(totalYieldRouted) / 1e6) : '$0', 
              subtext: 'USDC routed',
              icon: Gift, 
              gradient: 'from-purple-500 to-pink-500',
              delay: 0.3
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay, duration: 0.6 }}
              className="glass-strong rounded-2xl p-6 hover-lift group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-sm font-medium">{stat.label}</span>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} opacity-80`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.subtext}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recipients */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <h2 className="text-3xl font-bold gradient-text mb-2">Recipients</h2>
            <p className="text-gray-400">Public goods organizations receiving donations</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PUBLIC_GOODS_RECIPIENTS.map((recipient, index) => (
              <motion.div
                key={recipient.address}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                className="glass-strong rounded-2xl p-6 hover-lift group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-purple-500/0 group-hover:from-teal-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-6 h-6 text-teal-400" />
                        <h3 className="text-2xl font-bold text-white">{recipient.name}</h3>
                      </div>
                      <p className="text-gray-400">{recipient.description}</p>
                    </div>
                    <div className="bg-teal-500/20 text-teal-400 px-4 py-2 rounded-full text-sm font-semibold border border-teal-500/30">
                      {recipient.allocation}%
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Address</span>
                      <span className="font-mono text-gray-300">{formatAddress(recipient.address as `0x${string}`)}</span>
                    </div>
                    <Link
                      href={`https://sepolia.etherscan.io/address/${recipient.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors"
                    >
                      View on Etherscan
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="relative glass-strong rounded-3xl p-8 lg:p-12 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <Users className="w-8 h-8 text-teal-400" />
              <h2 className="text-3xl font-bold gradient-text">How It Works</h2>
            </div>
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: 'Yield Generation',
                  description: 'Your deposits earn yield across multiple DeFi protocols (Aave, Morpho, Spark, Yearn)',
                },
                {
                  step: 2,
                  title: 'Automatic Allocation',
                  description: `When yield is harvested, ${donationPercent}% is allocated for donations, ${100 - donationPercent}% goes back to vault users`,
                },
                {
                  step: 3,
                  title: 'Donation Execution',
                  description: 'Donations are automatically distributed to public goods recipients via Uniswap v4 hooks',
                },
                {
                  step: 4,
                  title: 'Transparency',
                  description: 'All donations are recorded on-chain and can be verified on Etherscan',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center font-bold text-white neon-glow">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
