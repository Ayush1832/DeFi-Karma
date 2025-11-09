'use client';

import { Navbar } from '@/components/Navbar';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, PUBLIC_GOODS_RECIPIENTS, ROUTER_ABI, HOOK_ABI } from '@/lib/constants';
import { formatAddress, formatCurrency } from '@/lib/utils';
import { Heart, ExternalLink, TrendingUp } from 'lucide-react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Public Goods</h1>
          <p className="text-gray-600">
            A portion of all yield generated is automatically donated to support Ethereum ecosystem growth
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Donation Ratio</span>
              <Heart className="h-5 w-5 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{donationPercent}%</div>
            <div className="text-sm text-gray-500 mt-1">of all yield</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Donated</span>
              <TrendingUp className="h-5 w-5 text-teal-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {hookTotalDonated ? formatCurrency(Number(hookTotalDonated) / 1e6) : '$0'}
            </div>
            <div className="text-sm text-gray-500 mt-1">USDC donated</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Yield Routed</span>
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {totalYieldRouted ? formatCurrency(Number(totalYieldRouted) / 1e6) : '$0'}
            </div>
            <div className="text-sm text-gray-500 mt-1">USDC routed</div>
          </div>
        </div>

        {/* Recipients */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recipients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PUBLIC_GOODS_RECIPIENTS.map((recipient) => (
              <div
                key={recipient.address}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{recipient.name}</h3>
                    <p className="text-gray-600 text-sm">{recipient.description}</p>
                  </div>
                  <div className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {recipient.allocation}%
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Address</span>
                    <span className="font-mono text-gray-900">{formatAddress(recipient.address)}</span>
                  </div>
                  <Link
                    href={`https://sepolia.etherscan.io/address/${recipient.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium"
                  >
                    View on Etherscan
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-teal-600 to-purple-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Yield Generation</h3>
                <p className="text-white/90 text-sm">
                  Your deposits earn yield across multiple DeFi protocols (Aave, Morpho, Spark, Yearn)
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Automatic Allocation</h3>
                <p className="text-white/90 text-sm">
                  When yield is harvested, {donationPercent}% is allocated for donations, {100 - donationPercent}% goes back to vault users
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Donation Execution</h3>
                <p className="text-white/90 text-sm">
                  Donations are automatically distributed to public goods recipients via Uniswap v4 hooks
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Transparency</h3>
                <p className="text-white/90 text-sm">
                  All donations are recorded on-chain and can be verified on Etherscan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
