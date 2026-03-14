#!/usr/bin/env node
/**
 * 将 metrolinehub 数据转换为 metro-kids 应用格式
 */

const fs = require('fs');
const path = require('path');

const scrapedDataPath = path.join(__dirname, '..', 'data', 'metrolinehub_data.json');
const outputPath = path.join(__dirname, '..', 'data', 'raw', 'subway_full.json');

const scrapedData = JSON.parse(fs.readFileSync(scrapedDataPath, 'utf8'));

// 城市配置
const cityConfig = {
  '北京': { id: 'beijing', emoji: '🏛️', nameEn: 'Beijing' },
  '上海': { id: 'shanghai', emoji: '🌃', nameEn: 'Shanghai' },
  '广州': { id: 'guangzhou', emoji: '🌺', nameEn: 'Guangzhou' },
  '深圳': { id: 'shenzhen', emoji: '💻', nameEn: 'Shenzhen' },
  '南京': { id: 'nanjing', emoji: '🏯', nameEn: 'Nanjing' },
  '成都': { id: 'chengdu', emoji: '🐼', nameEn: 'Chengdu' },
  '重庆': { id: 'chongqing', emoji: '🌶️', nameEn: 'Chongqing' },
};

const formattedData = {};

for (const [cityName, data] of Object.entries(scrapedData)) {
  const config = cityConfig[cityName];
  if (!config) continue;
  
  const lines = data.lines.map((line, index) => {
    // 直接使用线路关联的站点（已由 scrape-metrolinehub.js 正确解析）
    const lineStations = line.stations || [];
    
    return {
      id: `${config.id}-${index + 1}`,
      name: line.name,
      color: line.color,
      stationCount: lineStations.length,
      length: 0, // 未知
      stations: lineStations.map((s, sIdx) => ({
        id: `${config.id}-${index + 1}-${String(sIdx + 1).padStart(2, '0')}`,
        name: s,
        // 经纬度未知，留空
      }))
    };
  });
  
  formattedData[config.id] = {
    id: config.id,
    name: cityName,
    nameEn: config.nameEn,
    emoji: config.emoji,
    lineCount: data.lines.length,
    stationCount: data.stations.length,
    totalLength: 0, // 未知
    lines
  };
}

// 保存数据
fs.writeFileSync(outputPath, JSON.stringify(formattedData, null, 2), 'utf8');

console.log('✅ 数据转换完成！');
console.log('\n📊 各城市统计：');
for (const [cityName, data] of Object.entries(scrapedData)) {
  console.log(`- ${cityName}: ${data.lines.length} 条线路, ${data.stations.length} 个站点`);
}
console.log(`\n💾 数据已保存到: ${outputPath}`);
console.log('\n⚠️ 注意：经纬度信息缺失（MetroLineHub 不提供地理坐标）');
