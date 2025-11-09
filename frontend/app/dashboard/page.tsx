'use client';

import { Navbar } from '@/components/Navbar';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESSES, VAULT_ABI, ERC20_ABI, ROUTER_ABI } from '@/lib/constants';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { TrendingUp, DollarSign, Heart, Activity } from 'lucide-react';
import { useState } from 'react';
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Connect Your Wallet</h1>
          <p className="text-gray-600">Connect your wallet to view your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Portfolio Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Deposited</span>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {balance ? formatCurrency(Number(balance) / 1e6) : '$0'}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Vault Value</span>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {totalAssets ? formatCurrency(Number(totalAssets) / 1e6) : '$0'}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Donated</span>
              <Heart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {totalDonated ? formatCurrency(Number(totalDonated) / 1e6) : '$0'}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">APY</span>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">4.2%</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Deposit</h3>
            <input
              type="number"
              placeholder="Amount (USDC)"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <button
              onClick={handleDeposit}
              disabled={isDepositPending || !depositAmount}
              className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDepositPending ? 'Processing...' : 'Deposit'}
            </button>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Withdraw</h3>
            <input
              type="number"
              placeholder="Amount (USDC)"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <button
              onClick={handleWithdraw}
              disabled={isWithdrawPending || !withdrawAmount}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isWithdrawPending ? 'Processing...' : 'Withdraw'}
            </button>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Harvest & Donate</h3>
            <p className="text-sm text-gray-600 mb-4">
              Harvest yield and automatically donate to public goods
            </p>
            <button
              onClick={handleHarvest}
              disabled={isHarvestPending}
              className="w-full px-4 py-2 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isHarvestPending ? 'Processing...' : 'Harvest Now'}
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Yield Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="yield" stroke="#00C2A8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Donation Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={donationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name} ${((entry.percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {donationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Adapter Allocation */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Adapter Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={adapterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="yield" fill="#6E45E2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

