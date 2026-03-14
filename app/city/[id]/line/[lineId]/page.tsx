'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Circle, Repeat } from 'lucide-react';
import { getCityById } from '@/data/subwayData';

export default function LinePage() {
  const params = useParams();
  const cityId = params.id as string;
  const lineId = params.lineId as string;
  const city = getCityById(cityId);
  const line = city?.lines.find(l => l.id === lineId);

  if (!city || !line) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">线路未找到</h1>
          <Link href={`/city/${cityId}`}>
            <button className="kids-button bg-gradient-to-r from-blue-400 to-blue-500">
              返回城市页面
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
        <Link href={`/city/${cityId}`}>
          <button className="kids-button bg-gradient-to-r from-gray-400 to-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: line.color }}
          >
            {line.name.replace(/[^\d]/g, '')}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{city.name}{line.name}</h1>
            <p className="text-gray-600">共{line.stationCount}站 · {line.length || '-'}公里</p>
          </div>
        </div>
      </motion.header>

      {/* Stations Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto kids-card p-6"
      >
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-500" />
          站点列表
        </h2>

        <div className="relative">
          {/* Line */}
          <div
            className="absolute left-4 top-0 bottom-0 w-1 rounded-full"
            style={{ backgroundColor: line.color }}
          />

          {/* Stations */}
          <div className="space-y-0">
            {line.stations.map((station, index) => (
              <motion.div
                key={station.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center gap-4 py-3"
              >
                {/* Station Dot */}
                <div className="relative z-10"
                >
                  {station.isTransfer ? (
                    <div className="w-8 h-8 rounded-full bg-white border-4 flex items-center justify-center"
                         style={{ borderColor: line.color }} >
                      <Repeat className="w-3 h-3" style={{ color: line.color }} />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-white border-2 ml-2"
                         style={{ borderColor: line.color }} 
                    />
                  )}
                </div>

                {/* Station Info */}
                <div className="flex-1"
                >
                  <div className={`font-bold ${station.isTransfer ? 'text-lg' : 'text-base'} text-gray-800`}>
                    {station.name}
                  </div>
                  
                  {station.isTransfer && station.transfers && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-xs text-gray-500">换乘:</span>
                      {station.transfers.map(transfer => (
                        <span
                          key={transfer}
                          className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700"
                        >
                          {transfer}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Station Number */}
                <div className="text-xs text-gray-400 font-mono"
                >
                  {String(index + 1).padStart(2, '0')}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-400" />
            <span>普通站点</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white border-4 border-gray-400 flex items-center justify-center">
              <Repeat className="w-3 h-3 text-gray-400" />
            </div>
            <span>换乘站点</span>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
