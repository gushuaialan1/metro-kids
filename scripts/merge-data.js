#!/usr/bin/env node
/**
 * 合并 metrolinehub 爬取数据到 metro-kids 格式
 * 保留现有数据的经纬度，更新线路和站点列表
 */

const fs = require('fs');
const path = require('path');

// 读取数据
const rawDataPath = path.join(__dirname, '..', 'data', 'raw', 'subway_full.json');
const scrapedDataPath = path.join(__dirname, '..', 'data', 'metrolinehub_data.json');
const outputPath = path.join(__dirname, '..', 'data', 'raw', 'subway_full.json');

const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
const scrapedData = JSON.parse(fs.readFileSync(scrapedDataPath, 'utf8'));

// 城市名称映射（中文 -> 英文ID）
const cityNameMap = {
  '北京': 'beijing',
  '上海': 'shanghai', 
  '广州': 'guangzhou',
  '深圳': 'shenzhen',
  '南京': 'nanjing',
  '成都': 'chengdu',
  '重庆': 'chongqing'
};

// Emoji映射
const cityEmojiMap = {
  'beijing': '🏛️',
  'shanghai': '🌃',
  'guangzhou': '🌺',
  'shenzhen': '💻',
  'nanjing': '🏯',
  'chengdu': '🐼',
  'chongqing': '🌶️'
};

// 合并数据
const mergedData = {};

for (const [cnName, data] of Object.entries(scrapedData)) {
  const cityId = cityNameMap[cnName];
  if (!cityId) continue;
  
  const existingCity = rawData[cityId];
  
  // 创建新的城市数据结构
  const city = {
    id: cityId,
    name: cnName,
    nameEn: cityId.charAt(0).toUpperCase() + cityId.slice(1),
    emoji: cityEmojiMap[cityId] || '🚇',
    lineCount: data.lines.length,
    stationCount: data.stations.length,
    totalLength: existingCity?.totalLength || 0,
    lines: []
  };
  
  // 处理每条线路
  data.lines.forEach((line, lineIndex) => {
    const lineId = `${cityId}-${lineIndex + 1}`;
    
    // 尝试在现有数据中找到匹配的线路
    let existingLine = null;
    if (existingCity) {
      existingLine = existingCity.lines.find(l => 
        l.name.includes(line.name) || line.name.includes(l.name)
      );
    }
    
    // 从现有线路中提取站点详细信息
    const stationDetails = [];
    
    // 注意：metrolinehub 的数据没有按线路分组站点
    // 我们需要从现有数据中匹配站点，或者用基础信息创建
    
    city.lines.push({
      id: lineId,
      name: line.name,
      color: line.color,
      stationCount: existingLine?.stationCount || 0,
      length: existingLine?.length || 0,
      stations: existingLine?.stations || []
    });
  });
  
  mergedData[cityId] = city;
}

// 保留其他未爬取的城市数据
for (const [cityId, cityData] of Object.entries(rawData)) {
  if (!mergedData[cityId]) {
    mergedData[cityId] = cityData;
  }
}

// 保存合并后的数据
fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2), 'utf8');

console.log('✅ 数据合并完成！');
console.log(`\n📊 更新统计：`);
console.log(`- 北京: ${scrapedData['北京']?.lines.length || 0} 条线路`);
console.log(`- 上海: ${scrapedData['上海']?.lines.length || 0} 条线路`);
console.log(`- 广州: ${scrapedData['广州']?.lines.length || 0} 条线路`);
console.log(`- 深圳: ${scrapedData['深圳']?.lines.length || 0} 条线路`);
console.log(`- 南京: ${scrapedData['南京']?.lines.length || 0} 条线路`);
console.log(`- 成都: ${scrapedData['成都']?.lines.length || 0} 条线路`);
console.log(`- 重庆: ${scrapedData['重庆']?.lines.length || 0} 条线路`);
console.log(`\n💾 数据已保存到: ${outputPath}`);
