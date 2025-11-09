'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sparkles, Wallet2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/vault', label: 'Vault' },
  { href: '/public-goods', label: 'Public Goods' },
  { href: '/docs', label: 'Docs' },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.1)']
  );

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.nav
      style={{ backgroundColor }}
      className="border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl transition-all duration-300"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="relative"
              >
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-teal-500 to-purple-600 rounded-xl flex items-center justify-center neon-glow shadow-2xl"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(0, 194, 168, 0.5)',
                      '0 0 40px rgba(110, 69, 226, 0.5)',
                      '0 0 20px rgba(0, 194, 168, 0.5)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-7 h-7 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-teal-400 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <motion.span
                className="font-black text-2xl gradient-text"
                whileHover={{ scale: 1.05 }}
              >
                DeFi Karma
              </motion.span>
            </Link>
            <div className="hidden md:flex space-x-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'relative px-5 py-2.5 text-sm font-semibold transition-all duration-300 rounded-xl group',
                      pathname === item.href
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    )}
                  >
                    <motion.span
                      className="relative z-10"
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.label}
                    </motion.span>
                    {pathname === item.href ? (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-purple-500/30 rounded-xl border border-teal-500/50"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    ) : (
                      <motion.div
                        className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.05 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ConnectButton />
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}

