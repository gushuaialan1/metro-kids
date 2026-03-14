#!/usr/bin/env node
/**
 * MetroLineHub 地铁数据爬虫 - 修复版
 * 爬取城市地铁线路和站点数据
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const cities = [
  { name: '北京', slug: 'beijing' },
  { name: '上海', slug: 'shanghai' },
  { name: '广州', slug: 'guangzhou' },
  { name: '深圳', slug: 'shenzhen' },
  { name: '南京', slug: 'nanjing' },
  { name: '成都', slug: 'chengdu' },
  { name: '重庆', slug: 'chongqing' },
];

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.metrolinehub.com',
      path: url,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
      timeout: 30000,
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        fetchHTML(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.end();
  });
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function parseMetroData(html) {
  const lines = [];
  const allStations = [];
  
  // 按线路块解析：每个线路是一个 class="border rounded-lg overflow-hidden shadow-sm" 的容器
  // 结构：header (含h3线路名) -> stations container (flex flex-wrap gap-2)
  const lineBlockRegex = /<div class="border rounded-lg overflow-hidden shadow-sm"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;
  
  let blockMatch;
  while ((blockMatch = lineBlockRegex.exec(html)) !== null) {
    const blockHtml = blockMatch[1];
    
    // 提取线路名：在 header 的 h3 中
    const lineNameMatch = blockHtml.match(/<h3[^>]*>([^<]+)<\/h3>/);
    if (!lineNameMatch) continue;
    const lineName = lineNameMatch[1].trim();
    
    // 提取线路颜色
    const colorMatch = blockHtml.match(/background-color:(#[A-Fa-f0-9]{6})/);
    const lineColor = colorMatch ? colorMatch[1] : '#999999';
    
    // 提取该线路的所有站点：在 flex flex-wrap gap-2 容器内的 button
    const lineStations = [];
    const stationRegex = />(\d+)<!--[^>]*-->\.<!--[^>]*-->([^<]+)<\/button>/g;
    let stationMatch;
    
    // 只在这个 block 内查找站点
    while ((stationMatch = stationRegex.exec(blockHtml)) !== null) {
      const stationNum = parseInt(stationMatch[1]);
      const stationName = stationMatch[2].trim();
      if (stationName) {
        lineStations.push({ num: stationNum, name: stationName });
        // 添加到全局站点列表（去重）
        if (!allStations.find(s => s.name === stationName)) {
          allStations.push({ name: stationName });
        }
      }
    }
    
    // 按站点序号排序
    lineStations.sort((a, b) => a.num - b.num);
    
    lines.push({
      name: lineName,
      color: lineColor,
      stations: lineStations.map(s => s.name)
    });
  }
  
  return { lines, stations: allStations };
}

async function scrapeCity(city) {
  const url = `/zh/china/${city.slug}`;
  console.log(`📍 ${city.name}`);
  
  try {
    const html = await fetchHTML(url);
    const data = parseMetroData(html);
    
    console.log(`  ✅ 线路: ${data.lines.length} 条, 站点: ${data.stations.length} 个`);
    
    // 显示前几条线路及其站点数作为验证
    if (data.lines.length > 0) {
      data.lines.slice(0, 5).forEach(line => {
        console.log(`     - ${line.name}: ${line.stations.length} 站`);
      });
    }
    
    return data;
  } catch (err) {
    console.log(`  ❌ 失败: ${err.message}`);
    return { lines: [], stations: [] };
  }
}

async function main() {
  console.log('🚇 MetroLineHub 地铁数据爬虫\n');
  
  const results = {};
  let totalLines = 0;
  let totalStations = 0;
  
  for (const city of cities) {
    const data = await scrapeCity(city);
    results[city.name] = data;
    totalLines += data.lines.length;
    totalStations += data.stations.length;
    
    await delay(1000); // 礼貌延迟
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 数据统计');
  console.log('='.repeat(50));
  
  for (const city of cities) {
    const data = results[city.name];
    console.log(`${city.name}: ${data.lines.length} 条线路, ${data.stations.length} 个站点`);
  }
  
  console.log('-'.repeat(50));
  console.log(`总计: ${totalLines} 条线路, ${totalStations} 个站点`);
  
  // 保存数据
  const outputDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, 'metrolinehub_data.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n💾 数据已保存到: ${outputPath}`);
}

main().catch(console.error);
