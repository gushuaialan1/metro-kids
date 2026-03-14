'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, MapPin, Repeat } from 'lucide-react';
import { City, Line } from '@/data/subwayData';
import dynamic from 'next/dynamic';

// 动态导入 AntV X6 组件（避免 SSR 问题）
const SubwayGraph = dynamic(() => import('@/app/components/SubwayGraph'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-xl border-2 border-gray-200">
      <div className="text-gray-400">加载可视化组件中...⏳</div>
    </div>
  ),
});

interface LineContentProps {
  city: City;
  line: Line;
}

export default function LineContent({ city, line }: LineContentProps) {
  const transferStations = line.stations.filter(s => s.isTransfer);

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-4 mb-6"
      >
        <Link href={`/city/${city.id}`}>
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

      {/* AntV X6 可视化图表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-5xl mx-auto mb-8"
      >
        <div className="kids-card p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            线路可视化
          </h2>
          <SubwayGraph line={line} width={760} height={280} />
          
          {/* 图例 */}
          <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-1 rounded"
                style={{ backgroundColor: line.color }}
              />
              <span>{line.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2"
                style={{ borderColor: line.color, backgroundColor: line.color }}
              />
              <span>普通站点</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full border-4 bg-white flex items-center justify-center"
                style={{ borderColor: line.color }}
              >
                <span style={{ color: line.color, fontSize: '10px' }}>⟲</span>
              </div>
              <span>换乘站点 ({transferStations.length}个)</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stations Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto kids-card p-6"
      >
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-500" />
          站点列表
        </h2>

        <div className="relative">
          <div
            className="absolute left-4 top-0 bottom-0 w-1 rounded-full"
            style={{ backgroundColor: line.color }}
          />

          <div className="space-y-0">
            {line.stations.map((station, index) => (
              <motion.div
                key={station.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center gap-4 py-3"
              >
                <div className="relative z-10">
                  {station.isTransfer ? (
                    <div
                      className="w-8 h-8 rounded-full bg-white border-4 flex items-center justify-center"
                      style={{ borderColor: line.color }}
                    >
                      <Repeat className="w-3 h-3" style={{ color: line.color }} />
                    </div>
                  ) : (
                    <div
                      className="w-4 h-4 rounded-full bg-white border-2 ml-2"
                      style={{ borderColor: line.color }}
                    />
                  )}
                </div>

                <div className="flex-1">
                  <div
                    className={`font-bold ${
                      station.isTransfer ? 'text-lg' : 'text-base'
                    } text-gray-800`}
                  >
                    {station.name}
                  </div>

                  {station.isTransfer && station.transfers && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-xs text-gray-500">换乘:</span>
                      {station.transfers.map((transfer) => (
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

                <div className="text-xs text-gray-400 font-mono">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

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
