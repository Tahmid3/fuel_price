'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, MapPin, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { fetchFuelStations } from '@/lib/tankerkoenig';
import { formatCurrency, formatPricePerLiter } from '@/lib/utils';
import type { CouponMultiplier, FuelStation, FuelType, StationCalculation } from '@/types/fuel';
import { buildStationCalculation } from '@/utils/fuelCalculator';
import { Badge } from './ui/badge';

const couponOptions: { label: string; value: CouponMultiplier }[] = [
  { label: 'none (1x)', value: 1 },
  { label: '3x', value: 3 },
  { label: '5x', value: 5 },
  { label: '7x', value: 7 },
];

export function FuelComparatorApp() {
  const [fuelType, setFuelType] = useState<FuelType>('e5');
  const [liters, setLiters] = useState(40);
  const [couponMultiplier, setCouponMultiplier] = useState<CouponMultiplier>(1);
  const [turboEnabled, setTurboEnabled] = useState(true);
  const [circleKEnabled, setCircleKEnabled] = useState(true);
  const [pointValue, setPointValue] = useState(0.01);
  const [stations, setStations] = useState<FuelStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingDemoData, setUsingDemoData] = useState(false);

  const calculations = useMemo(() => {
    return stations
      .map((station) => {
        const stationPrice = station[fuelType];
        if (!stationPrice) return null;
        return buildStationCalculation({
          station,
          stationPrice,
          liters,
          couponMultiplier,
          turboEnabled,
          pointValue,
          circleKEnabled,
        });
      })
      .filter(Boolean)
      .sort((a, b) => a!.bestOption.price - b!.bestOption.price) as StationCalculation[];
  }, [stations, fuelType, liters, couponMultiplier, turboEnabled, pointValue, circleKEnabled]);

  const absoluteBest = calculations[0];

  const loadStationsForCoordinates = async (lat: number, lng: number) => {
    setError(null);
    setLoading(true);

    try {
      const data = await fetchFuelStations({ lat, lng, type: fuelType });
      setStations(data);
      const hasApiKey = Boolean(process.env.NEXT_PUBLIC_TANKERKOENIG_KEY);
      setUsingDemoData(!hasApiKey);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown fetch error';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const loadStations = () => {
    if (!navigator.geolocation) {
      setUsingDemoData(true);
      void loadStationsForCoordinates(52.52, 13.405);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void loadStationsForCoordinates(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setUsingDemoData(true);
        void loadStationsForCoordinates(52.52, 13.405);
      }
    );
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl p-4 pb-12">
      <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 space-y-1">
        <h1 className="text-2xl font-bold">Fuel Price Smart Compare</h1>
        <p className="text-sm text-muted-foreground">Find your cheapest station in seconds with Payback + Circle K logic.</p>
      </motion.header>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Fuel settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Fuel type</Label>
              <Select value={fuelType} onValueChange={(value: FuelType) => setFuelType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="e5">E5</SelectItem>
                  <SelectItem value="e10">E10</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Liters</Label>
              <Input type="number" min={1} value={liters} onChange={(e) => setLiters(Number(e.target.value || 0))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Payback coupon</Label>
              <Select value={String(couponMultiplier)} onValueChange={(v) => setCouponMultiplier(Number(v) as CouponMultiplier)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {couponOptions.map((option) => (
                    <SelectItem key={option.value} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Point value (€)</Label>
              <Input type="number" step="0.001" min="0" value={pointValue} onChange={(e) => setPointValue(Number(e.target.value || 0.01))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="turbo">Payback Turbo</Label>
              <Switch id="turbo" checked={turboEnabled} onCheckedChange={setTurboEnabled} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="circlek">Circle K card</Label>
              <Switch id="circlek" checked={circleKEnabled} onCheckedChange={setCircleKEnabled} />
            </div>
          </div>

          <Button className="w-full" onClick={loadStations} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading station prices...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" /> Find cheapest nearby option
              </>
            )}
          </Button>
          {usingDemoData && <p className="text-xs text-amber-700">Demo mode active (no API key): showing realistic sample station prices.</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>

      <AnimatePresence>
        {calculations.map((entry, index) => {
          const isBest = absoluteBest?.station.id === entry.station.id;
          return (
            <motion.article
              key={entry.station.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: index * 0.04 }}
              className="mb-3"
            >
              <Card className={isBest ? 'border-primary ring-2 ring-primary/30' : ''}>
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-base">{entry.station.brand || entry.station.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {entry.station.street} {entry.station.houseNumber}, {entry.station.place} · {entry.station.dist.toFixed(1)} km
                    </p>
                  </div>
                  {isBest && (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                      <Badge className="gap-1">
                        <Trophy className="h-3 w-3" /> Cheapest
                      </Badge>
                    </motion.div>
                  )}
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p>
                    Listed: <strong>{formatPricePerLiter(entry.listedPrice)}</strong>
                  </p>
                  {entry.paybackPrice !== null && (
                    <p>
                      Payback effective: <strong>{formatPricePerLiter(entry.paybackPrice)}</strong>
                    </p>
                  )}
                  {entry.circleKPrice !== null && (
                    <p>
                      Circle K effective: <strong>{formatPricePerLiter(entry.circleKPrice)}</strong>
                    </p>
                  )}
                  <p className="pt-1 text-xs text-muted-foreground">
                    Best option: {entry.bestOption.label} ({formatPricePerLiter(entry.bestOption.price)})
                  </p>
                  {entry.breakEvenCents !== null && (
                    <p className="text-xs text-muted-foreground">
                      Break-even: Aral can be up to {entry.breakEvenCents.toFixed(2)} cents/L more expensive and still tie with Circle K.
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">Total for {liters}L at best price: {formatCurrency(entry.bestOption.price * liters)}</p>
                </CardContent>
              </Card>
            </motion.article>
          );
        })}
      </AnimatePresence>
    </main>
  );
}
