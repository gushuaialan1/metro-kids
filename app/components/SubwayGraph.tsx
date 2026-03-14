'use client';

import { useEffect, useRef } from 'react';
import { Graph } from '@antv/x6';
import { Station, Line } from '@/data/subwayData';

interface SubwayGraphProps {
  line: Line;
  width?: number;
  height?: number;
}

export default function SubwayGraph({ line, width = 800, height = 400 }: SubwayGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 销毁之前的图实例
    if (graphRef.current) {
      graphRef.current.dispose();
    }

    // 创建新图实例
    const graph = new Graph({
      container: containerRef.current,
      width,
      height,
      background: {
        color: '#f8f9fa',
      },
      grid: {
        size: 10,
        visible: true,
        type: 'dot',
        args: {
          color: '#e0e0e0',
          thickness: 1,
        },
      },
      panning: true,
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
    });

    graphRef.current = graph;

    // 计算站点坐标（简化版：按顺序水平排列）
    const stationSpacing = Math.min(120, (width - 100) / (line.stations.length - 1));
    const startX = 50;
    const centerY = height / 2;

    const nodes: Record<string, any>[] = [];
    const edges: Record<string, any>[] = [];

    line.stations.forEach((station, index) => {
      const x = startX + index * stationSpacing;
      const y = centerY + (station.isTransfer ? -20 : 0); // 换乘站稍微上浮

      if (station.isTransfer) {
        // 换乘站：使用自定义 markup
        const transferNode: Record<string, any> = {
          id: station.id,
          x,
          y,
          width: 40,
          height: 40,
          shape: 'circle',
          markup: [
            {
              tagName: 'circle',
              selector: 'body',
            },
            {
              tagName: 'text',
              selector: 'transferIcon',
            },
            {
              tagName: 'text',
              selector: 'label',
            },
          ],
          attrs: {
            body: {
              fill: '#fff',
              stroke: line.color,
              strokeWidth: 4,
            },
            transferIcon: {
              text: '⟲',
              fill: line.color,
              fontSize: 16,
              refX: 0.5,
              refY: 0.5,
              textAnchor: 'middle',
              textVerticalAnchor: 'middle',
            },
            label: {
              text: station.name,
              fill: '#333',
              fontSize: 12,
              fontWeight: 'bold',
              refY: 28,
            },
          },
          data: {
            station,
            isTransfer: true,
          },
        };
        nodes.push(transferNode);
      } else {
        // 普通站点
        const normalNode: Record<string, any> = {
          id: station.id,
          x,
          y,
          width: 24,
          height: 24,
          shape: 'circle',
          attrs: {
            body: {
              fill: line.color,
              stroke: line.color,
              strokeWidth: 2,
            },
            label: {
              text: station.name,
              fill: '#333',
              fontSize: 12,
              fontWeight: 'normal',
              refY: 25,
            },
          },
          data: {
            station,
            isTransfer: false,
          },
        };
        nodes.push(normalNode);
      }

      // 创建与前一个站点的连线
      if (index > 0) {
        const prevStation = line.stations[index - 1];
        edges.push({
          source: prevStation.id,
          target: station.id,
          attrs: {
            line: {
              stroke: line.color,
              strokeWidth: 4,
              targetMarker: null,
            },
          },
        });
      }
    });

    // 添加节点和边到图中
    graph.addNodes(nodes);
    graph.addEdges(edges);

    // 居中显示
    graph.centerContent();

    // 添加点击事件
    graph.on('node:click', ({ node }) => {
      const station = node.getData()?.station;
      if (station) {
        console.log('点击站点:', station.name);
      }
    });

    // 添加悬停效果
    graph.on('node:mouseenter', ({ node }) => {
      node.attr('body/strokeWidth', 6);
    });

    graph.on('node:mouseleave', ({ node }) => {
      const isTransfer = node.getData()?.isTransfer;
      node.attr('body/strokeWidth', isTransfer ? 4 : 2);
    });

    return () => {
      graph.dispose();
    };
  }, [line, width, height]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-inner"
        style={{ width, height }}
      />
      <div className="mt-2 text-sm text-gray-500 text-center">
        💡 按住 Ctrl/⌘ 滚动可缩放，拖拽可平移
      </div>
    </div>
  );
}
