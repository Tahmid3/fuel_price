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

## Setup (local)

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

## Kostenfrei & dauerhaft online: GitHub Pages

Diese App ist für **statisches Deployment** vorbereitet (`next export`) und kann kostenlos dauerhaft über GitHub Pages laufen.

### 1) Repository auf GitHub pushen

- Stelle sicher, dass dein Standard-Branch `main` ist.

### 2) Secret setzen

- In GitHub: `Settings -> Secrets and variables -> Actions -> New repository secret`
- Name: `NEXT_PUBLIC_TANKERKOENIG_KEY`
- Value: dein Tankerkoenig API Key

### 3) GitHub Pages aktivieren

- `Settings -> Pages`
- `Source`: **GitHub Actions**

### 4) Automatisches Deployment

- Beim Push auf `main` läuft `.github/workflows/deploy-pages.yml`
- Danach ist die App unter folgendem Link live:

```text
https://<github-username>.github.io/<repo-name>/
```

Diese URL bleibt dauerhaft erreichbar, solange das Repository existiert und GitHub Pages aktiv ist.

## Alternative: Vercel

- Import the repository to Vercel
- Set `NEXT_PUBLIC_TANKERKOENIG_KEY` in project environment variables
- Deploy
