'use client';

import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Heart, Shield, Zap, Sparkles, Network, Coins, Wallet, BarChart3, Lock, Users, Rocket, Star, Award, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ParticleBackground } from '@/components/ParticleBackground';
import { GlowEffect } from '@/components/GlowEffect';
import { Card3D } from '@/components/3DCard';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { BlockchainIllustration } from '@/components/BlockchainIllustration';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="min-h-screen animated-gradient relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Glow Effects */}
      <GlowEffect />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <Navbar />
      
      {/* Hero Section with Parallax */}
      <motion.section
        ref={heroRef}
        style={{ y, opacity }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 min-h-screen flex items-center"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center relative z-10 w-full"
        >
          {/* Badge */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass mb-8 backdrop-blur-xl border border-teal-500/30"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-5 h-5 text-teal-400" />
            </motion.div>
            <span className="text-sm font-semibold text-teal-400">Powered by Octant v2 • ERC-4626 Standard</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-teal-400 rounded-full"
            />
          </motion.div>

          {/* Main Heading with Glitch Effect */}
          <motion.h1
            variants={itemVariants}
            className="text-7xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight"
          >
            <motion.span
              className="gradient-text text-glow block mb-4"
              animate={{
                textShadow: [
                  '0 0 20px rgba(0, 194, 168, 0.5)',
                  '0 0 40px rgba(110, 69, 226, 0.5)',
                  '0 0 20px rgba(0, 194, 168, 0.5)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Earn Yield.
            </motion.span>
            <motion.span
              className="gradient-text-purple text-glow-purple block"
              animate={{
                textShadow: [
                  '0 0 20px rgba(110, 69, 226, 0.5)',
                  '0 0 40px rgba(182, 80, 158, 0.5)',
                  '0 0 20px rgba(110, 69, 226, 0.5)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            >
              Grow Ecosystems.
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
          >
            DeFi Karma aggregates yield from multiple DeFi protocols and automatically 
            <span className="text-teal-400 font-semibold"> donates a portion to public goods</span>.
            <br />
            <span className="text-lg text-gray-400 mt-4 block">
              Every yield matters—for you and for the ecosystem.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center justify-center px-12 py-6 text-xl font-black rounded-2xl text-white btn-primary btn-glow-teal btn-ripple overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <Rocket className="w-7 h-7" />
                  </motion.div>
                  <span className="tracking-wide">Launch App</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link
                href="/docs"
                className="group inline-flex items-center justify-center px-12 py-6 text-xl font-bold rounded-2xl btn-secondary btn-ripple backdrop-blur-xl"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <BarChart3 className="w-6 h-6 mr-3" />
                </motion.div>
                <span className="tracking-wide">Learn More</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { label: 'Protocols Integrated', value: 4, icon: Network },
              { label: 'Public Goods Supported', value: 2, icon: Heart },
              { label: 'APY Average', value: 4.1, suffix: '%', icon: TrendingUp },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-strong rounded-2xl p-6 backdrop-blur-xl border border-white/10"
              >
                <stat.icon className="w-8 h-8 text-teal-400 mb-3 mx-auto" />
                <div className="text-4xl font-black gradient-text mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix || ''} />
                </div>
                <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats Section with 3D Cards */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black gradient-text mb-4"
          >
            Real-Time Metrics
          </motion.h2>
          <p className="text-xl text-gray-400">Live on-chain data</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {[
            { 
              label: 'Total Value Locked', 
              value: 0, 
              prefix: '$',
              icon: Coins, 
              gradient: 'from-teal-500 to-cyan-500',
              delay: 0.1,
              illustration: '📊'
            },
            { 
              label: 'Total Donated', 
              value: 0, 
              prefix: '$',
              icon: Heart, 
              gradient: 'from-purple-500 to-pink-500',
              delay: 0.2,
              illustration: '💝'
            },
            { 
              label: 'Active Users', 
              value: 0,
              icon: Users, 
              gradient: 'from-blue-500 to-cyan-500',
              delay: 0.3,
              illustration: '👥'
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: stat.delay, duration: 0.8, type: 'spring', stiffness: 100 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="perspective"
            >
              <Card3D className="glass-strong rounded-3xl p-8 hover-lift relative overflow-hidden group h-full border border-white/10 backdrop-blur-xl">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-2xl`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      className="text-4xl"
                    >
                      {stat.illustration}
                    </motion.div>
                  </div>
                  <div className={`text-5xl lg:text-6xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-3`}>
                    <AnimatedCounter value={stat.value} prefix={stat.prefix || ''} />
                  </div>
                  <div className="text-gray-400 font-semibold text-lg">{stat.label}</div>
                  <motion.div
                    className="mt-4 h-1 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ delay: stat.delay + 0.3, duration: 1 }}
                  />
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section with Blockchain Illustration */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="inline-block mb-6"
          >
            <Star className="w-16 h-16 text-yellow-400 fill-yellow-400" />
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black gradient-text mb-6">
            Why DeFi Karma?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Built for the future of decentralized finance with cutting-edge technology
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Blockchain Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-64 lg:h-96"
          >
            <BlockchainIllustration />
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {[
              { icon: TrendingUp, title: 'Optimized Yield', desc: 'Aggregate yield from Aave, Morpho, Spark, and Yearn for maximum returns', color: 'teal' },
              { icon: Heart, title: 'Public Goods', desc: 'Automatically donate 20% of yield to support Ethereum ecosystem growth', color: 'purple' },
              { icon: Shield, title: 'Fully On-Chain', desc: 'Transparent, verifiable, and trustless—every transaction is on-chain', color: 'blue' },
              { icon: Zap, title: 'ERC-4626', desc: 'Standardized vault interface for maximum composability with DeFi protocols', color: 'orange' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 10, scale: 1.02 }}
                className="glass-strong rounded-2xl p-6 flex items-start gap-4 group border border-white/10 backdrop-blur-xl"
              >
                <motion.div
                  className={`p-3 rounded-xl bg-gradient-to-br from-${feature.color}-500/20 to-${feature.color}-600/20 group-hover:scale-110 transition-transform`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    {feature.title}
                    <CheckCircle2 className="w-5 h-5 text-teal-400" />
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {[
            { 
              icon: TrendingUp, 
              title: 'Optimized Yield', 
              description: 'Aggregate yield from Aave, Morpho, Spark, and more for maximum returns',
              gradient: 'from-teal-500 to-cyan-500',
              delay: 0.1,
              stats: '4.1% APY'
            },
            { 
              icon: Heart, 
              title: 'Public Goods', 
              description: 'Automatically donate a portion of yield to support Ethereum ecosystem growth',
              gradient: 'from-purple-500 to-pink-500',
              delay: 0.2,
              stats: '20% Donated'
            },
            { 
              icon: Shield, 
              title: 'Fully On-Chain', 
              description: 'Transparent, verifiable, and trustless—every transaction is on-chain',
              gradient: 'from-blue-500 to-cyan-500',
              delay: 0.3,
              stats: '100% Transparent'
            },
            { 
              icon: Zap, 
              title: 'ERC-4626', 
              description: 'Standardized vault interface for maximum composability',
              gradient: 'from-orange-500 to-red-500',
              delay: 0.4,
              stats: 'Fully Compatible'
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: feature.delay, duration: 0.6, type: 'spring' }}
              whileHover={{ y: -15, rotateY: 5, rotateX: 5 }}
              className="perspective"
            >
              <Card3D className="glass-strong rounded-3xl p-8 hover-lift group relative overflow-hidden h-full border border-white/10 backdrop-blur-xl">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <motion.div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-2xl`}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-black text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">{feature.description}</p>
                  <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${feature.gradient} text-white text-sm font-bold`}>
                    {feature.stats}
                  </div>
                </div>
              </Card3D>
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
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black gradient-text mb-6"
          >
            Powered by Leading Protocols
          </motion.h2>
          <p className="text-xl text-gray-400">Trusted by the best in DeFi</p>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
          {['Aave', 'Morpho', 'Spark', 'Octant', 'Uniswap', 'Yearn'].map((protocol, index) => (
            <motion.div
              key={protocol}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.6,
                type: 'spring',
                stiffness: 200
              }}
              whileHover={{ scale: 1.15, rotate: 5, y: -10 }}
              className="glass-strong rounded-2xl px-10 py-6 hover-lift cursor-pointer border border-white/10 backdrop-blur-xl"
            >
              <div className="text-3xl font-black gradient-text">{protocol}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative glass-strong rounded-3xl p-12 lg:p-20 text-center overflow-hidden border-2 border-teal-500/30 backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-purple-500/10 to-cyan-500/10">
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              style={{ backgroundSize: '200% 200%' }}
            />
          </div>
          <div className="relative z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-6"
            >
              <Award className="w-16 h-16 text-yellow-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-black mb-6 gradient-text"
            >
              Ready to Make an Impact?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-2xl lg:text-3xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Start earning yield while supporting public goods today
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Link
                  href="/dashboard"
                  className="group relative inline-flex items-center justify-center px-16 py-8 text-2xl font-black rounded-3xl text-gray-900 bg-gradient-to-r from-white via-gray-50 to-white hover:from-gray-50 hover:via-white hover:to-gray-50 transition-all duration-500 shadow-2xl btn-ripple overflow-hidden"
                  style={{
                    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.4), 0 0 50px rgba(255, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <span className="relative z-10 flex items-center gap-5">
                    <motion.div
                      animate={{ 
                        rotate: [0, 15, -15, 0], 
                        scale: [1, 1.15, 1],
                        y: [0, -3, 0]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <Rocket className="w-9 h-9" />
                    </motion.div>
                    <span className="tracking-widest font-extrabold">Explore Vault</span>
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <ArrowRight className="w-8 h-8" />
                    </motion.div>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-purple-500/10 to-pink-500/10"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'linear',
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 mt-20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-400 mb-6"
            >
              © 2025 DeFi Karma. Built for Octant Hackathon.
            </motion.p>
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
                  whileHover={{ scale: 1.2, y: -5 }}
                  className="text-gray-400 hover:text-teal-400 transition-colors text-lg font-semibold"
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
