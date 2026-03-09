import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fuel Price Smart Compare',
  description: 'Compare effective fuel prices with Payback and Circle K discounts',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
