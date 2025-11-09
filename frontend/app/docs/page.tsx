import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Documentation</h1>

        <div className="space-y-8">
          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What is DeFi Karma?</h2>
            <p className="text-gray-600 mb-4">
              DeFi Karma is a fully on-chain DeFi yield orchestration protocol built on Octant v2.
              It aggregates yield from multiple DeFi protocols (Aave v3, Morpho v2, Spark, Kalani)
              into an ERC-4626-compatible vault.
            </p>
            <p className="text-gray-600">
              A share of the yield is programmatically donated to public goods via Uniswap v4 Hooks,
              demonstrating how idle capital can be used to earn optimized yield while automatically
              funding Ethereum ecosystem growth.
            </p>
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">ERC-4626 Standard</h2>
            <p className="text-gray-600 mb-4">
              ERC-4626 is a standard for tokenized yield-bearing vaults. It provides a unified interface
              for deposits, withdrawals, and share accounting, ensuring compatibility and composability
              across DeFi protocols.
            </p>
            <p className="text-gray-600">
              The KarmaVault implements the ERC-4626 standard, making it compatible with any protocol
              that supports the standard, including Octant v2.
            </p>
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Users deposit USDC into the KarmaVault and receive ERC-4626 shares</li>
              <li>The vault allocates funds across multiple adapters (Aave, Morpho, Spark) based on configured ratios</li>
              <li>Each adapter earns yield from its underlying protocol</li>
              <li>Yield is periodically harvested and routed through the YieldRouter</li>
              <li>The YieldRouter splits yield: 80% to users (increased share value), 20% to donations</li>
              <li>Donations are executed via the ImpactHook, which swaps tokens and distributes to public goods recipients</li>
            </ol>
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Security</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Reentrancy guards on all deposit/withdraw functions</li>
              <li>Access control for admin functions</li>
              <li>Protocol whitelisting for safe adapters</li>
              <li>Safe math and checked transfers (OpenZeppelin)</li>
              <li>Emergency pause functionality</li>
              <li>Comprehensive unit and integration tests</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Resources</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://docs.v2.octant.build"
                  className="text-teal-600 hover:text-teal-700"
                  target="_blank"
                >
                  Octant v2 Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://eips.ethereum.org/EIPS/eip-4626"
                  className="text-teal-600 hover:text-teal-700"
                  target="_blank"
                >
                  ERC-4626 Specification
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/your-repo/defi-karma"
                  className="text-teal-600 hover:text-teal-700"
                  target="_blank"
                >
                  GitHub Repository
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

