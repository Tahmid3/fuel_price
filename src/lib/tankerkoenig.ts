import { SUPPORTED_BRANDS } from '@/lib/constants';
import type { FuelStation, FuelType } from '@/types/fuel';

interface TankerkoenigResponse {
  ok: boolean;
  stations: FuelStation[];
}

export async function fetchFuelStations(params: {
  lat: number;
  lng: number;
  type: FuelType;
  radius?: number;
}) {
  const apiKey = process.env.NEXT_PUBLIC_TANKERKOENIG_KEY;
  if (!apiKey) {
    throw new Error('Missing NEXT_PUBLIC_TANKERKOENIG_KEY environment variable.');
  }

  const { lat, lng, type, radius = 8 } = params;
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
