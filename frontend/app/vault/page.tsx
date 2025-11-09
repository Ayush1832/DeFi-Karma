'use client';

import { Navbar } from '@/components/Navbar';
import { ADAPTERS } from '@/lib/constants';

export default function VaultPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Vault Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {ADAPTERS.map((adapter) => (
            <div
              key={adapter.name}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{adapter.name}</h3>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Allocation</span>
                  <span className="font-semibold">{adapter.allocation}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${adapter.allocation}%`,
                      backgroundColor: adapter.color,
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">APY</span>
                <span className="font-semibold text-teal-600">{adapter.apy}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vault Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Allocation</span>
              <span className="font-semibold">100%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average APY</span>
              <span className="font-semibold text-teal-600">4.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Donation Ratio</span>
              <span className="font-semibold">20%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">User Share</span>
              <span className="font-semibold">80%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

