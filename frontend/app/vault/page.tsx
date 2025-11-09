'use client';

import { Navbar } from '@/components/Navbar';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, ADAPTERS, VAULT_ABI } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Activity } from 'lucide-react';

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

  const { data: adapterCount } = useReadContract({
    address: CONTRACT_ADDRESSES.KARMA_VAULT,
    abi: VAULT_ABI,
    functionName: 'getAdapterCount',
  });

  // Calculate average APY (weighted by allocation)
  const avgAPY = ADAPTERS.reduce((sum, adapter) => sum + (adapter.apy * adapter.allocation) / 100, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vault Management</h1>
          <p className="text-gray-600">
            View and manage adapter allocations across multiple DeFi protocols
          </p>
        </div>

        {/* Vault Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Assets</span>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {totalAssets ? formatCurrency(Number(totalAssets) / 1e6) : '$0'}
            </div>
            <div className="text-sm text-gray-500 mt-1">USDC</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Supply</span>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {totalSupply ? formatCurrency(Number(totalSupply) / 1e18) : '0'}
            </div>
            <div className="text-sm text-gray-500 mt-1">DKV tokens</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Average APY</span>
              <TrendingUp className="h-5 w-5 text-teal-400" />
            </div>
            <div className="text-2xl font-bold text-teal-600">{avgAPY.toFixed(2)}%</div>
            <div className="text-sm text-gray-500 mt-1">Weighted average</div>
          </div>
        </div>

        {/* Adapters */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Protocol Adapters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADAPTERS.map((adapter) => (
              <div
                key={adapter.name}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{adapter.name}</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 text-sm">Allocation</span>
                      <span className="font-semibold text-gray-900">{adapter.allocation}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${adapter.allocation}%`,
                          backgroundColor: adapter.color,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-gray-600 text-sm">APY</span>
                    <span className="font-semibold text-teal-600">{adapter.apy}%</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-500 text-xs font-mono block truncate">
                      {adapter.address.slice(0, 10)}...{adapter.address.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vault Details */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Vault Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Allocation</span>
                <span className="font-semibold text-gray-900">100%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Adapters</span>
                <span className="font-semibold text-gray-900">{adapterCount?.toString() || ADAPTERS.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average APY</span>
                <span className="font-semibold text-teal-600">{avgAPY.toFixed(2)}%</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Donation Ratio</span>
                <span className="font-semibold text-gray-900">20%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">User Share</span>
                <span className="font-semibold text-gray-900">80%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vault Standard</span>
                <span className="font-semibold text-gray-900">ERC-4626</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
