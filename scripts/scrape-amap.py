#!/usr/bin/env python3
"""
高德地图地铁数据爬虫 - 直接输出JSON
爬取中国大陆地铁线路和站点数据
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import os

class SubwayScraper(object):
    def __init__(self):
        self.url = "http://map.amap.com/subway/index.html?&1100"
        self.headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
        }
        self.results = {}

    def get_city_list(self):
        """获取城市列表"""
        response = requests.get(url=self.url, headers=self.headers)
        data = response.text.encode('ISO-8859-1').decode('utf-8')
        soup = BeautifulSoup(data, 'lxml')

        cities = []
        # 主要城市列表
        res1 = soup.find_all(class_="city-list fl")[0]
        for temp in res1.find_all('a'):
            cities.append({
                'id': temp['id'],
                'slug': temp['cityname'],
                'name': temp.get_text()
            })
        # 更多城市
        res2 = soup.find_all(class_="more-city-list")[0]
        for temp in res2.find_all('a'):
            cities.append({
                'id': temp['id'],
                'slug': temp['cityname'],
                'name': temp.get_text()
            })
        return cities

    def get_subway_data(self, city_id, city_slug):
        """获取指定城市的地铁数据"""
        timestamp = int(time.time() * 1000)
        url = f'http://map.amap.com/service/subway?_{timestamp}&srhdata={city_id}_drw_{city_slug}.json'

        try:
            response = requests.get(url=url, headers=self.headers, timeout=30)
            result = json.loads(response.text)
            return result
        except Exception as e:
            print(f"  获取失败: {e}")
            return None

    def parse_subway_data(self, data, city_name):
        """解析地铁数据为统一格式"""
        lines = []
        all_stations = []
        seen_stations = set()

        if 'l' not in data:
            return {'lines': [], 'stations': []}

        for node in data['l']:
            line_name = node.get('ln', '')
            line_alias = node.get('la', '')

            # 如果有分线，加上括号
            if line_alias:
                full_line_name = f"{line_name}({line_alias})"
            else:
                full_line_name = line_name

            # 提取颜色（cl字段是16进制颜色代码）
            line_color = node.get('cl', '')
            if line_color:
                line_color = f"#{line_color}"
            else:
                line_color = '#999999'

            # 提取站点
            line_stations = []
            for station in node.get('st', []):
                station_name = station.get('n', '')
                if station_name:
                    line_stations.append(station_name)
                    # 添加到全局站点列表（去重）
                    if station_name not in seen_stations:
                        seen_stations.add(station_name)
                        all_stations.append({'name': station_name})

            if line_stations:
                lines.append({
                    'name': full_line_name,
                    'color': line_color,
                    'stations': line_stations
                })

        return {
            'lines': lines,
            'stations': all_stations
        }

    def scrape_all(self):
        """爬取所有城市数据"""
        print('🚇 高德地图地铁数据爬虫\n')

        cities = self.get_city_list()
        print(f'发现 {len(cities)} 个城市\n')

        total_lines = 0
        total_stations = 0

        for i, city in enumerate(cities, 1):
            print(f'[{i}/{len(cities)}] 📍 {city["name"]}', end=' ')

            data = self.get_subway_data(city['id'], city['slug'])
            if data:
                parsed = self.parse_subway_data(data, city['name'])
                self.results[city['name']] = parsed
                total_lines += len(parsed['lines'])
                total_stations += len(parsed['stations'])
                print(f"✅ {len(parsed['lines'])}条线路, {len(parsed['stations'])}个站点")
            else:
                print("❌ 失败")

            # 礼貌延迟
            time.sleep(0.5)

        print('\n' + '=' * 50)
        print('📊 数据统计')
        print('=' * 50)
        print(f"总城市数: {len(self.results)}")
        print(f"总线路数: {total_lines}")
        print(f"总站点数: {total_stations}")

        return self.results

    def save(self, output_path):
        """保存数据到JSON文件"""
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w', encoding='utf8') as f:
            json.dump(self.results, f, ensure_ascii=False, indent=2)
        print(f"\n💾 数据已保存到: {output_path}")


def main():
    scraper = SubwayScraper()
    scraper.scrape_all()

    # 保存到项目目录
    output_path = os.path.join(
        os.path.dirname(__file__),
        '..', 'data', 'amap_subway_data.json'
    )
    scraper.save(output_path)


if __name__ == '__main__':
    main()
