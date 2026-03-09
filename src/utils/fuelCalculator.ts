import { CIRCLE_K_DISCOUNTS } from '@/lib/constants';
import type { CouponMultiplier, FuelStation, StationCalculation, StationOption } from '@/types/fuel';

interface PaybackInput {
  liters: number;
  pricePerLiter: number;
  couponMultiplier: CouponMultiplier;
  turboEnabled: boolean;
  pointValue: number;
}

export function calculatePaybackPrice({ liters, pricePerLiter, couponMultiplier, turboEnabled, pointValue }: PaybackInput) {
  if (liters <= 0) return pricePerLiter;
  const basePoints = Math.floor(liters / 2);
  const couponPoints = basePoints * couponMultiplier;
  const turboPoints = turboEnabled ? basePoints : 0;
  const totalPoints = couponPoints + turboPoints;
  const cashback = totalPoints * pointValue;
  const totalCost = liters * pricePerLiter;
  return (totalCost - cashback) / liters;
}

export function calculateCircleKPrice(brand: string, stationPrice: number) {
  const discount = CIRCLE_K_DISCOUNTS[brand.toUpperCase()] ?? 0;
  return Math.max(0, stationPrice - discount);
}

export function findBestOption(options: StationOption[]): StationOption {
  return options.reduce((best, current) => (current.price < best.price ? current : best));
}

export function buildStationCalculation(args: {
  station: FuelStation;
  stationPrice: number;
  liters: number;
  couponMultiplier: CouponMultiplier;
  turboEnabled: boolean;
  pointValue: number;
  circleKEnabled: boolean;
}): StationCalculation {
  const { station, stationPrice, liters, couponMultiplier, turboEnabled, pointValue, circleKEnabled } = args;
  const normal = stationPrice;

  const paybackPrice =
    station.brand.toUpperCase() === 'ARAL'
      ? calculatePaybackPrice({ liters, pricePerLiter: stationPrice, couponMultiplier, turboEnabled, pointValue })
      : null;

  const circleKPrice = circleKEnabled ? calculateCircleKPrice(station.brand, stationPrice) : null;

  const options: StationOption[] = [{ key: 'normal', label: 'Listed price', price: normal }];
  if (paybackPrice !== null) options.push({ key: 'payback', label: 'Payback effective', price: paybackPrice });
  if (circleKPrice !== null) options.push({ key: 'circlek', label: 'Circle K effective', price: circleKPrice });

  const bestOption = findBestOption(options);

  const aralCircleK = station.brand.toUpperCase() === 'ARAL' ? calculateCircleKPrice('ARAL', stationPrice) : null;
  const breakEvenCents =
    paybackPrice !== null && aralCircleK !== null ? Number(((aralCircleK - paybackPrice) * 100).toFixed(2)) : null;

  return {
    station,
    listedPrice: normal,
    paybackPrice,
    circleKPrice,
    bestOption,
    breakEvenCents,
  };
}
