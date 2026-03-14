'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Train, Map, Trophy, Search } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Map,
      title: '🗺️ 探索地图',
      desc: '查看各个城市的地铁线路图',
      href: '/cities',
      color: 'from-blue-400 to-cyan-400',
    },
    {
      icon: Train,
      title: '🚇 线路详情',
      desc: '了解每条线路的站点信息',
      href: '/lines',
      color: 'from-green-400 to-emerald-400',
    },
    {
      icon: Trophy,
      title: '🏆 趣味排行',
      desc: '看看哪个城市的地铁最厉害',
      href: '/rankings',
      color: 'from-orange-400 to-red-400',
    },
  ];

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl mb-4"
        >
          🚇
        </motion.div>
        <h1 className="kids-title mb-4">地铁小侦探</h1>
        <p className="text-gray-600 text-lg">探索中国城市的地下铁路世界 🌟</p>
      </motion.header>

      {/* Features Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={feature.href}>
              <div className="kids-card p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-2xl mx-auto kids-card p-6"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">📊 数据概览</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-500">50+</div>
            <div className="text-gray-600 text-sm">开通城市</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-500">300+</div>
            <div className="text-gray-600 text-sm">地铁线路</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-500">10000+</div>
            <div className="text-gray-600 text-sm">站点数量</div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="text-center mt-12 text-gray-500 text-sm">
        <p>🌈 专为小朋友设计的地铁探索网站</p>
      </footer>
    </main>
  );
}
