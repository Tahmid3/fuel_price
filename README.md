# Fuel Price Smart Compare

Mobile-first Next.js app that compares nearby station prices and calculates effective prices with:

- Aral Payback points + coupon multiplier + optional turbo
- Circle K per-liter discounts

## API-key free mode (default)

This project now works **without any API key**.

- If `NEXT_PUBLIC_TANKERKOENIG_KEY` is **not set**, the app uses realistic demo station data (all supported brands) and still performs full price calculations.
- If an API key is set later, it automatically switches to live nearby station prices.

## Tech stack

- Next.js (App Router)
- React + TypeScript
- TailwindCSS
- shadcn/ui-style components
- Framer Motion animations

## Setup (local)

```bash
npm install
npm run dev
```

Optional for live prices:

1. Copy `.env.local.example` to `.env.local`
2. Add your Tankerkoenig API key:
   - `NEXT_PUBLIC_TANKERKOENIG_KEY=...`

## Calculation logic

Reusable pricing logic lives in:

- `src/utils/fuelCalculator.ts`

Functions:

- `calculatePaybackPrice()`
- `calculateCircleKPrice()`
- `findBestOption()`

## Free always-online publish (no API key required)

This app is prepared for static deployment to GitHub Pages.

1. Push repository to GitHub (`main` branch)
2. In `Settings -> Pages`, set `Source` to **GitHub Actions**
3. Push to `main` and wait for workflow `.github/workflows/deploy-pages.yml`

Live URL:

```text
https://<github-username>.github.io/<repo-name>/
```

The website stays online for free as long as GitHub Pages is enabled.

### Optional live prices on published site

If you want the published GitHub Pages app to use live Tankerkoenig data:

1. Go to **Repository -> Settings -> Secrets and variables -> Actions**
2. Click **New repository secret**
3. Name: `NEXT_PUBLIC_TANKERKOENIG_KEY`
4. Value: your Tankerkoenig API key
5. Re-run the workflow (or push a new commit)

Without this secret, the published site stays in demo mode by design.
