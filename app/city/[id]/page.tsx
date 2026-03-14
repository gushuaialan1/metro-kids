import { notFound } from 'next/navigation';
import { cities, getCityById } from '@/data/subwayData';
import CityContent from './CityContent';

export function generateStaticParams() {
  return cities.map((city) => ({
    id: city.id,
  }));
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CityPage({ params }: PageProps) {
  const { id } = await params;
  const city = getCityById(id);

  if (!city) {
    notFound();
  }

  return <CityContent city={city} />;
}
