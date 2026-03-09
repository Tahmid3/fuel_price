import { SUPPORTED_BRANDS } from '@/lib/constants';
import type { FuelStation, FuelType } from '@/types/fuel';

interface TankerkoenigResponse {
  ok: boolean;
  stations: FuelStation[];
}

const DEMO_STATIONS: FuelStation[] = [
  {
    id: 'demo-aral-1',
    name: 'Aral Demo Station',
    brand: 'ARAL',
    street: 'Hauptstraße',
    houseNumber: '12',
    place: 'Berlin',
    dist: 0.9,
    e5: 1.819,
    e10: 1.759,
    diesel: 1.699,
  },
  {
    id: 'demo-total-1',
    name: 'TotalEnergies Demo',
    brand: 'TOTALENERGIES',
    street: 'Ringallee',
    houseNumber: '45',
    place: 'Berlin',
    dist: 1.4,
    e5: 1.809,
    e10: 1.749,
    diesel: 1.689,
  },
  {
    id: 'demo-shell-1',
    name: 'Shell Demo Station',
    brand: 'SHELL',
    street: 'Musterweg',
    houseNumber: '5',
    place: 'Berlin',
    dist: 1.9,
    e5: 1.829,
    e10: 1.769,
    diesel: 1.709,
  },
  {
    id: 'demo-avia-1',
    name: 'AVIA Demo Station',
    brand: 'AVIA',
    street: 'Nordstraße',
    houseNumber: '88',
    place: 'Berlin',
    dist: 2.1,
    e5: 1.799,
    e10: 1.739,
    diesel: 1.679,
  },
  {
    id: 'demo-eni-1',
    name: 'ENI Demo Station',
    brand: 'ENI',
    street: 'Cityring',
    houseNumber: '3',
    place: 'Berlin',
    dist: 2.7,
    e5: 1.815,
    e10: 1.755,
    diesel: 1.695,
  },
  {
    id: 'demo-westfalen-1',
    name: 'Westfalen Demo Station',
    brand: 'WESTFALEN',
    street: 'Südallee',
    houseNumber: '29',
    place: 'Berlin',
    dist: 3.2,
    e5: 1.805,
    e10: 1.745,
    diesel: 1.685,
  },
];

function withLocalVariation(stations: FuelStation[], lat: number, lng: number) {
  const seed = Math.abs(Math.sin(lat * 11.73 + lng * 7.31));
  const shift = (seed - 0.5) * 0.03;

  return stations.map((station, index) => {
    const offset = shift + index * 0.001;
    return {
      ...station,
      dist: Number((station.dist + index * 0.2).toFixed(1)),
      e5: Number(((station.e5 ?? 0) + offset).toFixed(3)),
      e10: Number(((station.e10 ?? 0) + offset).toFixed(3)),
      diesel: Number(((station.diesel ?? 0) + offset).toFixed(3)),
    };
  });
}

async function fetchLiveFuelStations(params: { lat: number; lng: number; type: FuelType; radius?: number; apiKey: string }) {
  const { lat, lng, type, radius = 8, apiKey } = params;
  const search = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    rad: String(radius),
    sort: 'dist',
    type,
    apikey: apiKey,
  });

  const url = `https://creativecommons.tankerkoenig.de/json/list.php?${search.toString()}`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to fetch live fuel prices.');
  }

  const data = (await response.json()) as TankerkoenigResponse;
  const allowed = new Set(SUPPORTED_BRANDS);

  return (data.stations || [])
    .filter((station) => allowed.has(station.brand?.toUpperCase() as (typeof SUPPORTED_BRANDS)[number]))
    .filter((station) => Number.isFinite(station.e5) || Number.isFinite(station.e10) || Number.isFinite(station.diesel));
}

export async function fetchFuelStations(params: {
  lat: number;
  lng: number;
  type: FuelType;
  radius?: number;
}) {
  const apiKey = process.env.NEXT_PUBLIC_TANKERKOENIG_KEY;

  if (!apiKey) {
    return withLocalVariation(DEMO_STATIONS, params.lat, params.lng);
  }

  try {
    return await fetchLiveFuelStations({ ...params, apiKey });
  } catch {
    return withLocalVariation(DEMO_STATIONS, params.lat, params.lng);
  }
}
