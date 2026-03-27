'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AMapSubwayProps {
  cityId: string;
  cityName: string;
  apiKey: string;
}

// 城市ID映射（高德地图的城市编码）
const cityCodeMap: Record<string, string> = {
  'beijing': '110000',
  'shanghai': '310000',
  'guangzhou': '440100',
  'shenzhen': '440300',
  'hangzhou': '330100',
  'nanjing': '320100',
  'chengdu': '510100',
  'wuhan': '420100',
  'tianjin': '120000',
  'xian': '610100',
  'chongqing': '500000',
  'suzhou': '320500',
  'zhengzhou': '410100',
  'changsha': '430100',
  'dalian': '210200',
  'shenyang': '210100',
  'qingdao': '370200',
  'xiamen': '350200',
  'ningbo': '330200',
  'wuxi': '320200',
  'foshan': '440600',
  'dongguan': '441900',
  'jinan': '370100',
  'hefei': '340100',
  'nanchang': '360100',
  'kunming': '530100',
  'fuzhou': '350100',
  'nanning': '450100',
  'guiyang': '520100',
  'haerbin': '230100',
  'changchun': '220100',
  'shijiazhuang': '130100',
  'taiyuan': '140100',
  'wulumuqi': '650100',
  'lanzhou': '620100',
  'huhehaote': '150100',
  'xining': '630100',
  'yinchuan': '640100',
  'lasa': '540100',
  'haikou': '460100',
  'sanya': '460200',
  'hongkong': '810000',
  'macau': '820000',
  'taipei': '710000',
};

export default function AMapSubway({ cityId, cityName, apiKey }: AMapSubwayProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined') return;

    // 检查容器是否存在
    if (!mapContainerRef.current) return;

    // 检查城市是否支持
    const adcode = cityCodeMap[cityId];
    if (!adcode) {
      console.warn(`城市 ${cityId} 暂不支持地铁图`);
      return;
    }

    // 加载高德地图脚本
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${apiKey}&callback=initAMap`;
    script.async = true;

    // 全局回调函数
    (window as any).initAMap = () => {
      if (!mapContainerRef.current) return;

      // 创建地图实例
      const AMap = (window as any).AMap;
      
      mapRef.current = new AMap.Map(mapContainerRef.current, {
        zoom: 12,
        center: getCityCenter(adcode),
        mapStyle: 'amap://styles/light', // 浅色主题，更干净
      });

      // 加载地铁图层插件
      AMap.plugin(['AMap.StationSearch'], () => {
        // 使用地铁图插件
        loadSubwayMap(AMap, adcode);
      });
    };

    document.head.appendChild(script);

    // 清理函数
    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
      delete (window as any).initAMap;
      const scripts = document.querySelectorAll('script[src*="webapi.amap.com"]');
      scripts.forEach(s => s.remove());
    };
  }, [cityId, apiKey]);

  // 加载地铁图
  const loadSubwayMap = (AMap: any, adcode: string) => {
    // 创建地铁图覆盖物
    const subwayUrl = `https://lbs.amap.com/api/subway-map/subway?adcode=${adcode}`;
    
    // 使用 Subway 插件
    AMap.plugin(['AMap.Subway'], () => {
      const subway = new AMap.Subway(mapRef.current, {
        adcode: adcode,
        theme: 'colorful', // colorful 或 simple
        offset: [0, 0],
      });

      subway.show();

      // 绑定事件
      subway.on('complete', () => {
        console.log('地铁图加载完成');
      });

      subway.on('stationClick', (e: any) => {
        console.log('点击站点:', e.target.name);
      });
    });
  };

  // 获取城市中心坐标
  const getCityCenter = (adcode: string): [number, number] => {
    const centers: Record<string, [number, number]> = {
      '110000': [116.407526, 39.90403], // 北京
      '310000': [121.473701, 31.230416], // 上海
      '440100': [113.264434, 23.129162], // 广州
      '440300': [114.057868, 22.543099], // 深圳
      '330100': [120.15507, 30.274085], // 杭州
      '320100': [118.796877, 32.060255], // 南京
      '510100': [104.066541, 30.572269], // 成都
      '420100': [114.305393, 30.593099], // 武汉
      '120000': [117.200983, 39.084158], // 天津
      '610100': [108.93977, 34.341574], // 西安
      '500000': [106.551556, 29.563009], // 重庆
    };
    return centers[adcode] || [116.407526, 39.90403];
  };

  const adcode = cityCodeMap[cityId];

  if (!adcode) {
    return (
      <div className="kids-card p-8 text-center text-gray-500">
        <div className="text-4xl mb-4">🗺️</div>
        <p>{cityName}地铁图正在建设中...</p>
        <p className="text-sm mt-2 text-gray-400">
          目前已支持：北京、上海、广州、深圳等30+城市
        </p>
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
          <span className="text-2xl">🚇</span>
          {cityName}地铁线路图
        </h2>
        <div className="text-xs text-gray-400">数据来源：高德地图</div>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-[500px] bg-gray-50"
        style={{ minHeight: '500px' }}
      />

      {/* Legend */}
      <div className="p-4 border-t border-gray-100 flex flex-wrap items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-400" />
          <span>普通站点</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center">
            <span className="text-[6px]">⟲</span>
          </div>
          <span>换乘站点</span>
        </div>
        <div className="text-gray-400 text-xs ml-auto">
          点击站点查看详情 · 滚轮缩放 · 拖拽移动
        </div>
      </div>
    </motion.div>
  );
}
