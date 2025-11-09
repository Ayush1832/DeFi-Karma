'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/vault', label: 'Vault' },
  { href: '/public-goods', label: 'Public Goods' },
  { href: '/docs', label: 'Docs' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DK</span>
              </div>
              <span className="font-bold text-xl text-gray-900">DeFi Karma</span>
            </Link>
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'text-teal-600'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}

