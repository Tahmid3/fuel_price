# Fuel Price Smart Compare

Mobile-first Next.js app that compares nearby station prices and calculates effective prices with:

- Aral Payback points + coupon multiplier + optional turbo
- Circle K per-liter discounts

## Tech stack

- Next.js (App Router)
- React + TypeScript
- TailwindCSS
- shadcn/ui-style components
- Framer Motion animations

## Setup

1. Copy `.env.local.example` to `.env.local`
2. Add your Tankerkoenig API key:
   - `NEXT_PUBLIC_TANKERKOENIG_KEY=...`
3. Install dependencies and run:

```bash
npm install
npm run dev
```

## Calculation logic

Reusable pricing logic lives in:

- `src/utils/fuelCalculator.ts`

Functions:

- `calculatePaybackPrice()`
- `calculateCircleKPrice()`
- `findBestOption()`

## Deploy to Vercel

- Import the repository to Vercel
- Set `NEXT_PUBLIC_TANKERKOENIG_KEY` in project environment variables
- Deploy
