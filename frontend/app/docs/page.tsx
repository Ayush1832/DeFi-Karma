'use client';

import { Navbar } from '@/components/Navbar';
import { CONTRACT_ADDRESSES } from '@/lib/constants';
import { formatAddress } from '@/lib/utils';
import { ExternalLink, Code, Book, Zap, Shield, Network, Lock, FileText, TrendingUp, GitPullRequest, DollarSign, Heart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DocsPage() {
  return (
    <div className="min-h-screen animated-gradient">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Documentation</h1>
          <p className="text-gray-400 text-lg">
            Learn how DeFi Karma works and how to interact with the protocol
          </p>
        </motion.div>

        {/* Architecture */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-2xl p-8 mb-8 hover-lift"
        >
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-8 h-8 text-teal-400" />
            <h2 className="text-2xl font-bold text-white">Architecture</h2>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-300 mb-4 leading-relaxed">
              DeFi Karma is built on a modular architecture that aggregates yield from multiple DeFi protocols
              and automatically routes a portion to public goods.
            </p>
            <div className="glass rounded-xl p-6 my-4">
              <h3 className="font-bold text-white mb-4">Core Components</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <Network className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">KarmaVault (ERC-4626):</strong> Main vault that manages deposits, withdrawals, and adapter allocation
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">YieldRouter:</strong> Routes harvested yield between users (80%) and donations (20%)
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">ImpactHook:</strong> Executes donations to public goods recipients via Uniswap v4 hooks
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Adapters:</strong> Protocol-specific integrations (Aave, Morpho, Spark, Yearn)
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Contract Addresses */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-strong rounded-2xl p-8 mb-8 hover-lift"
        >
          <div className="flex items-center gap-3 mb-6">
            <Book className="w-8 h-8 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Contract Addresses (Sepolia)</h2>
          </div>
          <div className="space-y-3">
            {Object.entries(CONTRACT_ADDRESSES).map(([name, address], index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-center justify-between p-4 glass rounded-xl hover-lift group"
              >
                <span className="font-medium text-gray-300 group-hover:text-white transition-colors">
                  {name.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-gray-400 group-hover:text-teal-400 transition-colors">
                    {formatAddress(address)}
                  </span>
                  <Link
                    href={`https://sepolia.etherscan.io/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-strong rounded-2xl p-8 mb-8 hover-lift"
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-8 h-8 text-orange-400" />
            <h2 className="text-2xl font-bold text-white">How It Works</h2>
          </div>
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: 'Deposit',
                description: 'Users deposit USDC into the KarmaVault. The vault automatically allocates funds across multiple adapters based on configured percentages (Aave 40%, Morpho 25%, Spark 20%, Yearn 15%).',
              },
              {
                step: 2,
                title: 'Yield Generation',
                description: 'Each adapter earns yield from its respective protocol. The vault tracks total assets across all adapters and calculates user share value.',
              },
              {
                step: 3,
                title: 'Yield Harvesting',
                description: 'When yield is harvested (manually or via automation), it\'s routed through the YieldRouter. The router splits yield: 80% goes back to vault users (increasing share value), 20% is allocated for donations.',
              },
              {
                step: 4,
                title: 'Donation Execution',
                description: 'The donation portion is sent to the ImpactHook, which distributes it to public goods recipients (Gitcoin 50%, Protocol Guild 50%) via Uniswap v4 hooks.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-start gap-4 p-4 glass rounded-xl"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center font-bold text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ERC-4626 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-strong rounded-2xl p-8 mb-8 hover-lift"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">ERC-4626 Standard</h2>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-300 mb-4 leading-relaxed">
              KarmaVault implements the ERC-4626 tokenized vault standard, ensuring maximum composability
              with other DeFi protocols.
            </p>
            <div className="glass rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Key Features</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0"></div>
                  <span>Standardized deposit/withdraw interface</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0"></div>
                  <span>Share-based accounting (1:1 with assets initially)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0"></div>
                  <span>Automatic yield accrual through share value increase</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0"></div>
                  <span>Compatible with all ERC-4626 supporting protocols</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Resources */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="glass-strong rounded-2xl p-8 hover-lift"
        >
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Resources</h2>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Octant v2 Documentation', url: 'https://docs.v2.octant.build' },
              { name: 'ERC-4626 Specification', url: 'https://eips.ethereum.org/EIPS/eip-4626' },
              { name: 'Aave Vault Documentation', url: 'https://github.com/aave/Aave-Vault' },
              { name: 'Morpho Vault Documentation', url: 'https://github.com/morpho-org/vault-v2' },
            ].map((resource, index) => (
              <motion.div
                key={resource.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + index * 0.05 }}
              >
                <Link
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 glass rounded-xl hover-lift group"
                >
                  <ExternalLink className="h-5 w-5 text-teal-400 group-hover:text-teal-300 transition-colors" />
                  <span className="text-gray-300 group-hover:text-white transition-colors">{resource.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
