'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Train, MapPin, Ruler, Clock, ChevronRight } from 'lucide-react';
import { getCityById } from '@/data/subwayData';

export default function CityPage() {
  const params = useParams();
  const cityId = params.id as string;
  const city = getCityById(cityId);

  if (!city) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">城市未找到</h1>
          <Link href="/cities">
            <button className="kids-button bg-gradient-to-r from-blue-400 to-blue-500">
              返回城市列表
            </button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-4 mb-6"
      >
        <Link href="/cities">
          <button className="kids-button bg-gradient-to-r from-gray-400 to-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{city.emoji}</span>
            <h1 className="kids-title">{city.name}地铁</h1>
          </div>
          <p className="text-gray-600">{city.nameEn} Metro</p>
        </div>
      </motion.header>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="kids-card p-4 text-center">
          <Train className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold text-gray-800">{city.lineCount}</div>
          <div className="text-sm text-gray-600">条线路</div>
        </div>
        <div className="kids-card p-4 text-center">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold text-gray-800">{city.stationCount}</div>
          <div className="text-sm text-gray-600">个站点</div>
        </div>
        <div className="kids-card p-4 text-center">
          <Ruler className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <div className="text-2xl font-bold text-gray-800">{city.totalLength || '-'}</div>
          <div className="text-sm text-gray-600">公里</div>
        </div>
        <div className="kids-card p-4 text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <div className="text-2xl font-bold text-gray-800">2010</div>
          <div className="text-sm text-gray-600">首条开通</div>
        </div>
      </motion.div>

      {/* Lines List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">🚇 地铁线路</h2>
        
        {city.lines.length > 0 ? (
          <div className="space-y-3">
            {city.lines.map((line, index) => (
              <Link key={line.id} href={`/city/${cityId}/line/${line.id}`}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="kids-card p-4 hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                      style={{ backgroundColor: line.color }}
                    >
                      {line.name.replace(/[^\d]/g, '')}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-800 text-lg">{line.name}</div>
                      <div className="text-sm text-gray-600">
                        {line.stations[0]?.name} → {line.stations[line.stations.length - 1]?.name}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-600">{line.stationCount}站</div>
                      {line.length && <div className="text-xs text-gray-500">{line.length}公里</div>}
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="kids-card p-8 text-center text-gray-500">
            <div className="text-4xl mb-4">🚧</div>
            <p>该城市详细线路数据正在整理中...</p>
            <p className="text-sm mt-2">目前已收录 {city.lineCount} 条线路，共 {city.stationCount} 个站点</p>
          </div>
        )}
      </motion.div>
    </main>
  );
}
