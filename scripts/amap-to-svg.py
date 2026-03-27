#!/usr/bin/env python3
"""
将高德地铁数据转换为SVG
"""

import json
import os

def parse_point(p):
    """解析坐标点 '861 845' -> (861, 845)"""
    parts = p.split(' ')
    return int(parts[0]), int(parts[1])

def subway_to_svg(data, city_name, output_path):
    """将高德地铁数据转换为SVG文件"""
    
    # 获取画布尺寸
    canvas = data.get('o', '1500,1500').split(',')
    canvas_width = int(canvas[0]) + 2000  # 增加边距
    canvas_height = int(canvas[1]) + 1000
    
    # 计算所有坐标点来确定viewBox
    all_x = []
    all_y = []
    
    for line in data.get('l', []):
        for c in line.get('c', []):
            if ' ' in str(c):
                x, y = parse_point(c)
                all_x.append(x)
                all_y.append(y)
        for station in line.get('st', []):
            p = station.get('p', '')
            if ' ' in p:
                x, y = parse_point(p)
                all_x.append(x)
                all_y.append(y)
    
    if not all_x or not all_y:
        print(f"⚠️ {city_name}: 没有坐标数据")
        return
    
    min_x, max_x = min(all_x) - 50, max(all_x) + 50
    min_y, max_y = min(all_y) - 50, max(all_y) + 50
    
    width = max_x - min_x
    height = max_y - min_y
    
    # 开始构建SVG
    svg_parts = [
        f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="{min_x} {min_y} {width} {height}" width="{width}" height="{height}">
  <rect x="{min_x}" y="{min_y}" width="{width}" height="{height}" fill="#f8f9fa"/>
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.1"/>
    </filter>
  </defs>
  <g id="lines">'''
    ]
    
    # 绘制线路
    for line in data.get('l', []):
        line_name = line.get('ln', '')
        line_color = line.get('cl', '999999')
        
        # 获取线路坐标点
        points = line.get('c', [])
        if not points:
            continue
        
        # 构建路径
        path_d = ""
        for i, p in enumerate(points):
            if ' ' not in str(p):
                continue
            x, y = parse_point(p)
            cmd = 'M' if i == 0 else 'L'
            path_d += f"{cmd}{x},{y} "
        
        if path_d:
            svg_parts.append(f'    <path d="{path_d.strip()}" stroke="#{line_color}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')
    
    svg_parts.append('  </g>')
    svg_parts.append('  <g id="stations">')
    
    # 绘制站点
    for line in data.get('l', []):
        line_color = line.get('cl', '999999')
        
        for station in line.get('st', []):
            station_name = station.get('n', '')
            p = station.get('p', '')
            
            if ' ' not in p:
                continue
            
            x, y = parse_point(p)
            is_transfer = station.get('t') == '1' or station.get('su') == '1'
            
            if is_transfer:
                # 换乘站：白色圆圈带边框
                svg_parts.append(f'    <circle cx="{x}" cy="{y}" r="8" fill="white" stroke="#{line_color}" stroke-width="4" filter="url(#shadow)"/>')
            else:
                # 普通站：白色小圆点
                svg_parts.append(f'    <circle cx="{x}" cy="{y}" r="5" fill="white" stroke="#{line_color}" stroke-width="2"/>')
    
    svg_parts.append('  </g>')
    svg_parts.append('  <g id="labels">')
    
    # 绘制站点名称
    for line in data.get('l', []):
        for station in line.get('st', []):
            station_name = station.get('n', '')
            p = station.get('p', '')
            lg = station.get('lg', '0')  # 标签位置 0-7
            
            if ' ' not in p:
                continue
            
            x, y = parse_point(p)
            
            # 根据lg字段决定标签位置
            # 0=右, 1=左, 2=上, 3=下, 4=右上, 5=右下, 6=左上, 7=左下
            offsets = {
                '0': (12, 5),   # 右
                '1': (-12, 5),  # 左
                '2': (0, -15),  # 上
                '3': (0, 20),   # 下
                '4': (10, -10), # 右上
                '5': (10, 20),  # 右下
                '6': (-10, -10), # 左上
                '7': (-10, 20), # 左下
            }
            
            dx, dy = offsets.get(str(lg), (12, 5))
            
            # 文字对齐
            text_anchor = 'start' if lg in ['0', '4', '5'] else 'end' if lg in ['1', '6', '7'] else 'middle'
            
            svg_parts.append(f'    <text x="{x + dx}" y="{y + dy}" font-size="11" font-family="Arial, sans-serif" fill="#333" text-anchor="{text_anchor}" font-weight="500">{station_name}</text>')
    
    svg_parts.append('  </g>')
    svg_parts.append('</svg>')
    
    # 保存SVG
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf8') as f:
        f.write('\n'.join(svg_parts))
    
    print(f"✅ {city_name}: SVG已保存 ({width}x{height})")


def main():
    # 读取高德数据
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'amap_subway_data.json')
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'subway-svg')
    
    with open(data_path, 'r', encoding='utf8') as f:
        all_data = json.load(f)
    
    print('🎨 生成地铁SVG图\n')
    
    # 为每个城市生成SVG（先测试几个主要城市）
    test_cities = ['北京', '上海', '广州', '深圳']
    
    for city in test_cities:
        if city not in all_data:
            continue
        
        # 读取原始API数据
        city_slug = {
            '北京': 'beijing', '上海': 'shanghai', '广州': 'guangzhou', '深圳': 'shenzhen'
        }.get(city)
        
        if not city_slug:
            continue
        
        # 重新获取原始API数据（因为amap_subway_data.json已经被简化处理过）
        import requests
        import time
        
        city_ids = {
            '北京': '1100', '上海': '3100', '广州': '4401', '深圳': '4403'
        }
        
        timestamp = int(time.time() * 1000)
        url = f'http://map.amap.com/service/subway?_{timestamp}&srhdata={city_ids[city]}_drw_{city_slug}.json'
        
        try:
            response = requests.get(url, headers={
                'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36'
            }, timeout=30)
            raw_data = json.loads(response.text)
            
            output_path = os.path.join(output_dir, f'{city_slug}.svg')
            subway_to_svg(raw_data, city, output_path)
            
            time.sleep(0.5)
        except Exception as e:
            print(f"❌ {city}: {e}")
    
    print(f"\n💾 SVG文件保存在: {output_dir}")


if __name__ == '__main__':
    main()
