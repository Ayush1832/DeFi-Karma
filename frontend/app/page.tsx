import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Heart, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Earn Yield.
            <br />
            Grow Ecosystems.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            DeFi Karma aggregates yield from multiple DeFi protocols and automatically 
            donates a portion to public goods. Every yield matters—for you and for the ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-teal-600 hover:bg-teal-700 transition-colors"
            >
              Launch App
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-gray-900 mb-2">$0</div>
            <div className="text-gray-600">Total Value Locked</div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-gray-900 mb-2">$0</div>
            <div className="text-gray-600">Total Donated</div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
            <div className="text-gray-600">Active Users</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why DeFi Karma?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Optimized Yield</h3>
            <p className="text-gray-600">
              Aggregate yield from Aave, Morpho, Spark, and more for maximum returns
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Public Goods</h3>
            <p className="text-gray-600">
              Automatically donate a portion of yield to support Ethereum ecosystem growth
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fully On-Chain</h3>
            <p className="text-gray-600">
              Transparent, verifiable, and trustless—every transaction is on-chain
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">ERC-4626</h3>
            <p className="text-gray-600">
              Standardized vault interface for maximum composability
            </p>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Powered by Leading Protocols
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="text-2xl font-bold text-gray-700">Aave</div>
          <div className="text-2xl font-bold text-gray-700">Morpho</div>
          <div className="text-2xl font-bold text-gray-700">Spark</div>
          <div className="text-2xl font-bold text-gray-700">Octant</div>
          <div className="text-2xl font-bold text-gray-700">Uniswap</div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-teal-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start earning yield while supporting public goods today
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-xl text-teal-600 bg-white hover:bg-gray-100 transition-colors"
          >
            Explore Vault
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-600">
            <p>© 2025 DeFi Karma. Built for Octant Hackathon.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
