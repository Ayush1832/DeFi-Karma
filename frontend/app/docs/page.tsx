'use client';

import { Navbar } from '@/components/Navbar';
import { CONTRACT_ADDRESSES } from '@/lib/constants';
import { formatAddress } from '@/lib/utils';
import { ExternalLink, Code, Book, Zap, Shield } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentation</h1>
          <p className="text-gray-600">
            Learn how DeFi Karma works and how to interact with the protocol
          </p>
        </div>

        {/* Architecture */}
        <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Code className="h-6 w-6 mr-2 text-teal-600" />
            Architecture
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              DeFi Karma is built on a modular architecture that aggregates yield from multiple DeFi protocols
              and automatically routes a portion to public goods.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 my-4">
              <h3 className="font-semibold text-gray-900 mb-3">Core Components</h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <strong>KarmaVault (ERC-4626):</strong> Main vault that manages deposits, withdrawals, and adapter allocation
                </li>
                <li>
                  <strong>YieldRouter:</strong> Routes harvested yield between users (80%) and donations (20%)
                </li>
                <li>
                  <strong>ImpactHook:</strong> Executes donations to public goods recipients via Uniswap v4 hooks
                </li>
                <li>
                  <strong>Adapters:</strong> Protocol-specific integrations (Aave, Morpho, Spark, Yearn)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contract Addresses */}
        <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Book className="h-6 w-6 mr-2 text-purple-600" />
            Contract Addresses (Sepolia)
          </h2>
          <div className="space-y-3">
            {Object.entries(CONTRACT_ADDRESSES).map(([name, address]) => (
              <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{name.replace(/_/g, ' ')}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm text-gray-900">{formatAddress(address)}</span>
                  <Link
                    href={`https://sepolia.etherscan.io/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Zap className="h-6 w-6 mr-2 text-orange-600" />
            How It Works
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Deposit</h3>
              <p className="text-gray-700">
                Users deposit USDC into the KarmaVault. The vault automatically allocates funds across
                multiple adapters based on configured percentages (Aave 40%, Morpho 25%, Spark 20%, Yearn 15%).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Yield Generation</h3>
              <p className="text-gray-700">
                Each adapter earns yield from its respective protocol. The vault tracks total assets
                across all adapters and calculates user share value.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Yield Harvesting</h3>
              <p className="text-gray-700">
                When yield is harvested (manually or via automation), it's routed through the YieldRouter.
                The router splits yield: 80% goes back to vault users (increasing share value), 20% is
                allocated for donations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4. Donation Execution</h3>
              <p className="text-gray-700">
                The donation portion is sent to the ImpactHook, which distributes it to public goods
                recipients (Gitcoin 50%, Protocol Guild 50%) via Uniswap v4 hooks.
              </p>
            </div>
          </div>
        </section>

        {/* ERC-4626 */}
        <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Shield className="h-6 w-6 mr-2 text-blue-600" />
            ERC-4626 Standard
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              KarmaVault implements the ERC-4626 tokenized vault standard, ensuring maximum composability
              with other DeFi protocols.
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2 text-gray-700">
                <li>Standardized deposit/withdraw interface</li>
                <li>Share-based accounting (1:1 with assets initially)</li>
                <li>Automatic yield accrual through share value increase</li>
                <li>Compatible with all ERC-4626 supporting protocols</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Resources</h2>
          <div className="space-y-3">
            <Link
              href="https://docs.v2.octant.build"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-teal-600 hover:text-teal-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Octant v2 Documentation
            </Link>
            <Link
              href="https://eips.ethereum.org/EIPS/eip-4626"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-teal-600 hover:text-teal-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              ERC-4626 Specification
            </Link>
            <Link
              href="https://github.com/aave/Aave-Vault"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-teal-600 hover:text-teal-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Aave Vault Documentation
            </Link>
            <Link
              href="https://github.com/morpho-org/vault-v2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-teal-600 hover:text-teal-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Morpho Vault Documentation
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
