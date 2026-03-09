import type { StationBrand } from '@/types/fuel';

export const SUPPORTED_BRANDS: StationBrand[] = [
  'ARAL',
  'TOTALENERGIES',
  'SHELL',
  'AVIA',
  'ENI',
  'WESTFALEN',
];

export const CIRCLE_K_DISCOUNTS: Record<string, number> = {
  TOTALENERGIES: 0.03,
  ARAL: 0.02,
  AVIA: 0.02,
  ENI: 0.02,
  WESTFALEN: 0.02,
};
