import { notFound } from 'next/navigation';
import { cities, getCityById } from '@/data/subwayData';
import LineContent from './LineContent';

// 为静态导出生成所有城市线路参数
export function generateStaticParams() {
  const params: { id: string; lineId: string }[] = [];
  
  for (const city of cities) {
    for (const line of city.lines) {
      params.push({
        id: city.id,
        lineId: line.id,
      });
    }
  }
  
  return params;
}

interface PageProps {
  params: Promise<{
    id: string;
    lineId: string;
  }>;
}

export default async function LinePage({ params }: PageProps) {
  const { id, lineId } = await params;
  const city = getCityById(id);
  const line = city?.lines.find(l => l.id === lineId);

  if (!city || !line) {
    notFound();
  }

  return <LineContent city={city} line={line} />;
}
