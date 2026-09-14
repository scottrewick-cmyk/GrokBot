# Review → Ad Angle Finder

A polished demo for DTC supplement operators: paste product reviews (or Reddit/TikTok comments) and get **ranked Meta ad angles** — theme clusters, pain language, urgency, who it’s for, plus copy.

Works **fully offline**. Optional OpenAI polish if a key is present.

## Run

```bash
cd demos/review-ad-angle-finder
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build    # production bundle
npm run preview  # serve the build
```

## Try it in 15 seconds

1. Click **Load OWH-style sample** (fictional knee + nerve pain supplement reviews).
2. Click **Find ad angles**.
3. Ranked cards include:
   - Pain insight
   - Why it might convert
   - 3 Meta primary-text variants
   - Headline
   - Advertorial hook
4. **Export Markdown** or **Export JSON**.

## How analysis works

The default engine is heuristic (no API, no scrapers):

- Splits pasted text into reviews
- Clusters themes (night nerve buzzing, dignity/socks/stairs, grandkids/identity, “just aging,” failed meds, occupational standing, weather flares, nerve-vs-joint)
- Extracts pain vocabulary, urgency, personas, and failed alternatives
- Scores angles by support × intensity × uniqueness
- Writes copy from **customer language** in the corpus

This is a convincing interactive demo, not a production medical or compliance tool.

## Optional OpenAI upgrade

Offline results always render first. If a key exists, copy can be polished.

**Dev server env (never exposed to the browser):**

```bash
cp .env.example .env.local
# set OPENAI_API_KEY=sk-...
npm run dev
```

**Or** paste a key in **Optional OpenAI upgrade** in the UI (browser-only, not required).

If the key is missing or the request fails, the app keeps the heuristic brief.

## Scope

- No social scrapers
- Sample reviews are fictional OWH-style knee/nerve language
- Creative is for demonstration — not medical advice
