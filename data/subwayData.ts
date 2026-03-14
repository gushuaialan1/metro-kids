import rawData from './raw/subway_full.json';

export interface Station {
  id: string;
  name: string;
  lat?: number;
  lng?: number;
  isTransfer?: boolean;
  transfers?: string[];
}

export interface Line {
  id: string;
  name: string;
  color: string;
  stationCount: number;
  length?: number;
  stations: Station[];
}

export interface City {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  lineCount: number;
  stationCount: number;
  totalLength?: number;
  lines: Line[];
}

// 从 JSON 加载城市数据
const cityData = rawData as Record<string, City>;

// 导出城市数组
export const cities: City[] = Object.values(cityData);

// 根据ID获取城市
export function getCityById(id: string): City | undefined {
  return cityData[id];
}

// 获取所有城市数量统计
export function getStats() {
  return {
    totalCities: cities.length,
    totalLines: cities.reduce((sum, c) => sum + c.lineCount, 0),
    totalStations: cities.reduce((sum, c) => sum + c.stationCount, 0),
  };
}

// 获取线路中的所有换乘站
export function getTransferStations(line: Line): Station[] {
  return line.stations.filter(s => s.isTransfer);
}

// 计算两个站点之间的距离（使用 Haversine 公式）
export function calculateDistance(station1: Station, station2: Station): number {
  if (!station1.lat || !station1.lng || !station2.lat || !station2.lng) {
    return 0;
  }
  
  const R = 6371; // 地球半径（公里）
  const dLat = (station2.lat - station1.lat) * Math.PI / 180;
  const dLng = (station2.lng - station1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(station1.lat * Math.PI / 180) * Math.cos(station2.lat * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
