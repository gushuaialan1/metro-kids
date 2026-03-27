'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface SubwayMapViewerProps {
  cityId: string;
  cityName: string;
}

const cityMapAvailable: Record<string, string> = {
  'beijing': '北京',
  'shanghai': '上海',
  'guangzhou': '广州',
  'shenzhen': '深圳',
};

export default function SubwayMapViewer({ cityId, cityName }: SubwayMapViewerProps) {
  const [scale, setScale] = useState(1);
  const [panning, setPanning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const svgUrl = `/subway-svg/${cityId}.svg`;
  const hasMap = cityId in cityMapAvailable;

  const handleZoomIn = () => setScale(s => Math.min(s * 1.2, 3));
  const handleZoomOut = () => setScale(s => Math.max(s / 1.2, 0.5));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setPanning(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!panning) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  const handleMouseUp = () => setPanning(false);

  if (!hasMap) {
    return (
      <div className="kids-card p-8 text-center text-gray-500">
        <div className="text-4xl mb-4">🗺️</div>
        <p>{cityName}地铁图正在生成中...</p>
        <p className="text-sm mt-2 text-gray-400">目前已有：北京、上海、广州、深圳</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="kids-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">🗺️</span>
          {cityName}地铁线路图
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="缩小"
          >
            <ZoomOut className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm text-gray-500 min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="放大"
          >
            <ZoomIn className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="重置"
          >
            <Maximize2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div
        className="relative h-[500px] overflow-hidden bg-gray-50 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: panning ? 'none' : 'transform 0.2s ease-out',
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <img
            src={svgUrl}
            alt={`${cityName}地铁线路图`}
            className="max-w-none shadow-lg"
            draggable={false}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-100 flex flex-wrap items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-400" />
          <span>普通站点</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-white border-4 border-gray-400 flex items-center justify-center">
            <span className="text-[8px]">⟲</span>
          </div>
          <span>换乘站点</span>
        </div>
        <div className="text-gray-400 text-xs ml-auto">
          数据来源：高德地图
        </div>
      </div>
    </motion.div>
  );
}
