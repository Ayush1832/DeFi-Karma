'use client';

import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Heart, Shield, Zap, Sparkles, Network, Coins, Wallet, BarChart3, Lock, Users, Rocket, Star, Award, CheckCircle2, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { ParticleBackground } from '@/components/ParticleBackground';
import { GlowEffect } from '@/components/GlowEffect';
import { Card3D } from '@/components/3DCard';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { BlockchainIllustration } from '@/components/BlockchainIllustration';

export default function Home() {
  return (
    <div className="min-h-screen animated-gradient relative overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center relative z-10"
        >
          {/* Powered by Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#141923] border border-white/10 mb-8"
          >
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-white/80">Powered by Octant v2 • ERC-4626 Standard</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="text-blue-gradient block mb-2">Earn Yield.</span>
            <span className="text-white block">Grow Ecosystems.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            DeFi Karma aggregates yield from multiple DeFi protocols and automatically 
            donates a portion to public goods. Every yield matters—for you and for the ecosystem.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
          >
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-[#00C6FF] to-[#0072FF] hover:from-[#00D4FF] hover:to-[#0080FF] transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-100"
            >
              <Rocket className="w-5 h-5 mr-2.5 group-hover:translate-x-1 transition-transform" />
              <span className="font-semibold tracking-wide">Launch App</span>
            </Link>
            <Link
              href="/docs"
              className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-xl text-white bg-[#141923] border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:bg-[#1a2332] hover:scale-105 active:scale-100"
            >
              <BookOpen className="w-5 h-5 mr-2.5" />
              <span className="font-semibold tracking-wide">Learn More</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { 
              label: 'Protocols Integrated', 
              value: 4, 
              icon: Network,
              delay: 0.1
            },
            { 
              label: 'Public Goods Supported', 
              value: 2, 
              icon: Heart,
              delay: 0.2
            },
            { 
              label: 'APY Average', 
              value: 4.1, 
              suffix: '%',
              icon: TrendingUp,
              delay: 0.3
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: stat.delay, duration: 0.6 }}
              className="card-dark text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-lg bg-white/5">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-5xl font-bold text-blue-gradient mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix || ''} decimals={stat.suffix ? 1 : 0} />
              </div>
              <div className="text-sm text-white/70 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why DeFi Karma?
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Built for the future of decentralized finance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              icon: TrendingUp, 
              title: 'Optimized Yield', 
              description: 'Aggregate yield from Aave, Morpho, Spark, and more for maximum returns',
            },
            { 
              icon: Heart, 
              title: 'Public Goods', 
              description: 'Automatically donate a portion of yield to support Ethereum ecosystem growth',
            },
            { 
              icon: Shield, 
              title: 'Fully On-Chain', 
              description: 'Transparent, verifiable, and trustless—every transaction is on-chain',
            },
            { 
              icon: Zap, 
              title: 'ERC-4626', 
              description: 'Standardized vault interface for maximum composability',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="card-dark"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-lg bg-gradient-blue">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">{feature.title}</h3>
              <p className="text-white/70 text-center leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Partners Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powered by Leading Protocols
          </h2>
          <p className="text-xl text-white/70">Trusted by the best in DeFi</p>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-6">
          {['Aave', 'Morpho', 'Spark', 'Octant', 'Uniswap', 'Yearn'].map((protocol, index) => (
            <motion.div
              key={protocol}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 card-dark"
            >
              <div className="text-xl font-bold text-white">{protocol}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative card-dark text-center p-12 lg:p-16"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-6"
          >
            <Award className="w-16 h-16 text-blue-400" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl lg:text-2xl mb-10 text-white/70 max-w-2xl mx-auto">
            Start earning yield while supporting public goods today
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-[#00C6FF] to-[#0072FF] hover:from-[#00D4FF] hover:to-[#0080FF] transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-100"
          >
            <Rocket className="w-5 h-5 mr-2" />
            <span className="font-semibold tracking-wide">Explore Vault</span>
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-white/60 mb-6">
              © 2025 DeFi Karma. Built for Octant Hackathon.
            </p>
            <div className="flex justify-center gap-8">
              {[
                { name: 'GitHub', icon: '📦', href: '#' },
                { name: 'Twitter', icon: '🐦', href: '#' },
                { name: 'Discord', icon: '💬', href: '#' },
              ].map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  className="text-white/60 hover:text-white transition-colors text-lg font-semibold"
                >
                  {social.icon} {social.name}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
