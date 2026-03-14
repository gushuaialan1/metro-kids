// 城市数据
export interface City {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  lineCount: number;
  stationCount: number;
  totalLength?: number; // 公里
  lines: Line[];
}

export interface Line {
  id: string;
  name: string;
  color: string;
  stationCount: number;
  length?: number;
  stations: Station[];
}

export interface Station {
  id: string;
  name: string;
  isTransfer?: boolean;
  transfers?: string[];
}

// 主要城市地铁数据（示例数据，可扩展）
export const cities: City[] = [
  {
    id: 'beijing',
    name: '北京',
    nameEn: 'Beijing',
    emoji: '🏛️',
    lineCount: 27,
    stationCount: 459,
    totalLength: 836,
    lines: [
      {
        id: 'bj-1',
        name: '1号线',
        color: '#A4343A',
        stationCount: 23,
        length: 31,
        stations: [
          { id: 'bj-1-01', name: '苹果园' },
          { id: 'bj-1-02', name: '古城' },
          { id: 'bj-1-03', name: '八角游乐园' },
          { id: 'bj-1-04', name: '八宝山' },
          { id: 'bj-1-05', name: '玉泉路' },
          { id: 'bj-1-06', name: '五棵松' },
          { id: 'bj-1-07', name: '万寿路' },
          { id: 'bj-1-08', name: '公主坟', isTransfer: true, transfers: ['10号线'] },
          { id: 'bj-1-09', name: '军事博物馆', isTransfer: true, transfers: ['9号线'] },
          { id: 'bj-1-10', name: '木樨地' },
          { id: 'bj-1-11', name: '南礼士路' },
          { id: 'bj-1-12', name: '复兴门', isTransfer: true, transfers: ['2号线'] },
          { id: 'bj-1-13', name: '西单', isTransfer: true, transfers: ['4号线'] },
          { id: 'bj-1-14', name: '天安门西' },
          { id: 'bj-1-15', name: '天安门东' },
          { id: 'bj-1-16', name: '王府井', isTransfer: true, transfers: ['8号线'] },
          { id: 'bj-1-17', name: '东单', isTransfer: true, transfers: ['5号线'] },
          { id: 'bj-1-18', name: '建国门', isTransfer: true, transfers: ['2号线'] },
          { id: 'bj-1-19', name: '永安里' },
          { id: 'bj-1-20', name: '国贸', isTransfer: true, transfers: ['10号线'] },
          { id: 'bj-1-21', name: '大望路', isTransfer: true, transfers: ['14号线'] },
          { id: 'bj-1-22', name: '四惠', isTransfer: true, transfers: ['八通线'] },
          { id: 'bj-1-23', name: '四惠东', isTransfer: true, transfers: ['八通线'] },
        ],
      },
      {
        id: 'bj-2',
        name: '2号线',
        color: '#004B87',
        stationCount: 18,
        length: 23,
        stations: [
          { id: 'bj-2-01', name: '西直门', isTransfer: true, transfers: ['4号线', '13号线'] },
          { id: 'bj-2-02', name: '积水潭' },
          { id: 'bj-2-03', name: '鼓楼大街', isTransfer: true, transfers: ['8号线'] },
          { id: 'bj-2-04', name: '安定门' },
          { id: 'bj-2-05', name: '雍和宫', isTransfer: true, transfers: ['5号线'] },
          { id: 'bj-2-06', name: '东直门', isTransfer: true, transfers: ['13号线', '机场线'] },
          { id: 'bj-2-07', name: '东四十条' },
          { id: 'bj-2-08', name: '朝阳门', isTransfer: true, transfers: ['6号线'] },
          { id: 'bj-2-09', name: '建国门', isTransfer: true, transfers: ['1号线'] },
          { id: 'bj-2-10', name: '北京站' },
          { id: 'bj-2-11', name: '崇文门', isTransfer: true, transfers: ['5号线'] },
          { id: 'bj-2-12', name: '前门' },
          { id: 'bj-2-13', name: '和平门' },
          { id: 'bj-2-14', name: '宣武门', isTransfer: true, transfers: ['4号线'] },
          { id: 'bj-2-15', name: '长椿街' },
          { id: 'bj-2-16', name: '复兴门', isTransfer: true, transfers: ['1号线'] },
          { id: 'bj-2-17', name: '阜成门' },
          { id: 'bj-2-18', name: '车公庄', isTransfer: true, transfers: ['6号线'] },
        ],
      },
    ],
  },
  {
    id: 'shanghai',
    name: '上海',
    nameEn: 'Shanghai',
    emoji: '🏙️',
    lineCount: 20,
    stationCount: 508,
    totalLength: 831,
    lines: [
      {
        id: 'sh-1',
        name: '1号线',
        color: '#E3002B',
        stationCount: 28,
        length: 37,
        stations: [
          { id: 'sh-1-01', name: '富锦路' },
          { id: 'sh-1-02', name: '友谊西路' },
          { id: 'sh-1-03', name: '宝安公路' },
          { id: 'sh-1-04', name: '共富新村' },
          { id: 'sh-1-05', name: '呼兰路' },
          { id: 'sh-1-06', name: '通河新村' },
          { id: 'sh-1-07', name: '共康路' },
          { id: 'sh-1-08', name: '彭浦新村' },
          { id: 'sh-1-09', name: '汶水路' },
          { id: 'sh-1-10', name: '上海马戏城' },
          { id: 'sh-1-11', name: '延长路' },
          { id: 'sh-1-12', name: '中山北路' },
          { id: 'sh-1-13', name: '上海火车站', isTransfer: true, transfers: ['3号线', '4号线'] },
          { id: 'sh-1-14', name: '汉中路', isTransfer: true, transfers: ['12号线', '13号线'] },
          { id: 'sh-1-15', name: '新闸路' },
          { id: 'sh-1-16', name: '人民广场', isTransfer: true, transfers: ['2号线', '8号线'] },
          { id: 'sh-1-17', name: '黄陂南路', isTransfer: true, transfers: ['14号线'] },
          { id: 'sh-1-18', name: '陕西南路', isTransfer: true, transfers: ['10号线', '12号线'] },
          { id: 'sh-1-19', name: '常熟路', isTransfer: true, transfers: ['7号线'] },
          { id: 'sh-1-20', name: '衡山路' },
          { id: 'sh-1-21', name: '徐家汇', isTransfer: true, transfers: ['9号线', '11号线'] },
          { id: 'sh-1-22', name: '上海体育馆', isTransfer: true, transfers: ['4号线'] },
          { id: 'sh-1-23', name: '漕宝路', isTransfer: true, transfers: ['12号线'] },
          { id: 'sh-1-24', name: '上海南站', isTransfer: true, transfers: ['3号线', '15号线'] },
          { id: 'sh-1-25', name: '锦江乐园' },
          { id: 'sh-1-26', name: '莲花路' },
          { id: 'sh-1-27', name: '外环路' },
          { id: 'sh-1-28', name: '莘庄', isTransfer: true, transfers: ['5号线'] },
        ],
      },
    ],
  },
  {
    id: 'guangzhou',
    name: '广州',
    nameEn: 'Guangzhou',
    emoji: '🌸',
    lineCount: 16,
    stationCount: 302,
    totalLength: 621,
    lines: [
      {
        id: 'gz-1',
        name: '1号线',
        color: '#F3D03E',
        stationCount: 16,
        length: 19,
        stations: [
          { id: 'gz-1-01', name: '西塱', isTransfer: true, transfers: ['广佛线'] },
          { id: 'gz-1-02', name: '坑口' },
          { id: 'gz-1-03', name: '花地湾' },
          { id: 'gz-1-04', name: '芳村' },
          { id: 'gz-1-05', name: '黄沙', isTransfer: true, transfers: ['6号线'] },
          { id: 'gz-1-06', name: '长寿路' },
          { id: 'gz-1-07', name: '陈家祠', isTransfer: true, transfers: ['8号线'] },
          { id: 'gz-1-08', name: '西门口' },
          { id: 'gz-1-09', name: '公园前', isTransfer: true, transfers: ['2号线'] },
          { id: 'gz-1-10', name: '农讲所' },
          { id: 'gz-1-11', name: '烈士陵园' },
          { id: 'gz-1-12', name: '东山口', isTransfer: true, transfers: ['6号线'] },
          { id: 'gz-1-13', name: '杨箕', isTransfer: true, transfers: ['5号线'] },
          { id: 'gz-1-14', name: '体育西路', isTransfer: true, transfers: ['3号线'] },
          { id: 'gz-1-15', name: '体育中心' },
          { id: 'gz-1-16', name: '广州东站', isTransfer: true, transfers: ['3号线'] },
        ],
      },
    ],
  },
  {
    id: 'shenzhen',
    name: '深圳',
    nameEn: 'Shenzhen',
    emoji: '💰',
    lineCount: 16,
    stationCount: 309,
    totalLength: 595,
    lines: [],
  },
  {
    id: 'chengdu',
    name: '成都',
    nameEn: 'Chengdu',
    emoji: '🐼',
    lineCount: 13,
    stationCount: 373,
    totalLength: 562,
    lines: [],
  },
  {
    id: 'hangzhou',
    name: '杭州',
    nameEn: 'Hangzhou',
    emoji: '🌊',
    lineCount: 12,
    stationCount: 254,
    totalLength: 516,
    lines: [],
  },
  {
    id: 'wuhan',
    name: '武汉',
    nameEn: 'Wuhan',
    emoji: '🌉',
    lineCount: 11,
    stationCount: 282,
    totalLength: 460,
    lines: [],
  },
  {
    id: 'chongqing',
    name: '重庆',
    nameEn: 'Chongqing',
    emoji: '🌶️',
    lineCount: 11,
    stationCount: 237,
    totalLength: 494,
    lines: [],
  },
  {
    id: 'nanjing',
    name: '南京',
    nameEn: 'Nanjing',
    emoji: '🏛️',
    lineCount: 13,
    stationCount: 217,
    totalLength: 484,
    lines: [],
  },
  {
    id: 'xian',
    name: '西安',
    nameEn: "Xi'an",
    emoji: '🏺',
    lineCount: 9,
    stationCount: 199,
    totalLength: 311,
    lines: [],
  },
  {
    id: 'suzhou',
    name: '苏州',
    nameEn: 'Suzhou',
    emoji: '🌸',
    lineCount: 9,
    stationCount: 181,
    totalLength: 352,
    lines: [],
  },
  {
    id: 'tianjin',
    name: '天津',
    nameEn: 'Tianjin',
    emoji: '🎡',
    lineCount: 9,
    stationCount: 181,
    totalLength: 310,
    lines: [],
  },
];

// 根据ID获取城市
export function getCityById(id: string): City | undefined {
  return cities.find(city => city.id === id);
}

// 获取所有城市数量统计
export function getStats() {
  return {
    totalCities: cities.length,
    totalLines: cities.reduce((sum, c) => sum + c.lineCount, 0),
    totalStations: cities.reduce((sum, c) => sum + c.stationCount, 0),
  };
}
