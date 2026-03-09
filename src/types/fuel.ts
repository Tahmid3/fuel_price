export type FuelType = 'e5' | 'e10' | 'diesel';

export type CouponMultiplier = 1 | 3 | 5 | 7;

export type StationBrand = 'ARAL' | 'TOTALENERGIES' | 'SHELL' | 'AVIA' | 'ENI' | 'WESTFALEN';

export interface FuelStation {
  id: string;
  name: string;
  brand: string;
  street: string;
  houseNumber: string;
  place: string;
  dist: number;
  e5?: number;
  e10?: number;
  diesel?: number;
}

export interface StationOption {
  key: 'normal' | 'payback' | 'circlek';
  label: string;
  price: number;
}

export interface StationCalculation {
  station: FuelStation;
  listedPrice: number;
  paybackPrice: number | null;
  circleKPrice: number | null;
  bestOption: StationOption;
  breakEvenCents: number | null;
}
