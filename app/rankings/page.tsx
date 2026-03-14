'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Trophy, Medal, Train, Ruler, Clock } from 'lucide-react';
import { cities } from '@/data/subwayData';

export default function RankingsPage() {
  // 计算排名数据
  const byStations = [...cities].sort((a, b) => b.stationCount - a.stationCount).slice(0, 10);
  const byLines = [...cities].sort((a, b) => b.lineCount - a.lineCount).slice(0, 10);
  const byLength = [...cities].sort((a, b) => (b.totalLength || 0) - (a.totalLength || 0)).slice(0, 10);

  const sections = [
    {
      title: '🚉 站点数量 TOP 10',
      icon: Train,
      data: byStations,
      key: 'stationCount' as const,
      unit: '站',
      color: 'from-blue-400 to-blue-600',
    },
    {
      title: '🛤️ 线路数量 TOP 10',
      icon: Medal,
      data: byLines,
      key: 'lineCount' as const,
      unit: '条',
      color: 'from-green-400 to-green-600',
    },
    {
      title: '📏 运营里程 TOP 10',
      icon: Ruler,
      data: byLength,
      key: 'totalLength' as const,
      unit: '公里',
      color: 'from-purple-400 to-purple-600',
    },
  ];

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-4 mb-8"
      >
        <Link href="/">
          <button className="kids-button bg-gradient-to-r from-gray-400 to-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="kids-title">🏆 趣味排行榜</h1>
          <p className="text-gray-600">看看哪个城市的地铁最厉害！</p>
        </div>
      </motion.header>

      {/* Rankings */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="kids-card p-6"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${section.color} text-white font-bold mb-4`}>
              <section.icon className="w-5 h-5" />
              <span>{section.title}</span>
            </div>

            <div className="space-y-3">
              {section.data.map((city, index) => (
                <Link key={city.id} href={`/city/${city.id}`}>
                  <div className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-gray-50 cursor-pointer ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-800' :
                      index === 2 ? 'bg-orange-300 text-orange-900' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-2xl">{city.emoji}</span>
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">{city.name}</div>
                    </div>
                    <div className="font-bold text-gray-600">
                      {city[section.key] || 0}{section.unit}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
