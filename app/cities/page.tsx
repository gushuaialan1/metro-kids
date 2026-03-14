'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, MapPin, Train } from 'lucide-react';
import { cities } from '@/data/subwayData';

export default function CitiesPage() {
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
        <h1 className="kids-title">🗺️ 选择城市</h1>
      </motion.header>

      {/* Cities Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cities.map((city, index) => (
          <motion.div
            key={city.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/city/${city.id}`}>
              <div className="kids-card p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{city.emoji}</span>
                  <div>
                    <h3 className="font-bold text-gray-800">{city.name}</h3>
                    <p className="text-xs text-gray-500">{city.nameEn}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Train className="w-4 h-4 text-blue-500" />
                    <span>{city.lineCount}条线路</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <span>{city.stationCount}站</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
