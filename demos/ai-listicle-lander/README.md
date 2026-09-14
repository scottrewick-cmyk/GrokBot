# Listicle Lab

Shopify-style **DTC listicle landing pages** — structure, copy, and image placeholders — generated in the browser in seconds. Built as a runnable demo: no page builder, no Shopify OAuth.

Template mode is fully offline. An OpenAI key is optional if you want the copy rewritten.

## Run

From this folder:

```bash
cd demos/ai-listicle-lander
npm install
npm run dev
```

Open the printed local URL (default [http://localhost:5173](http://localhost:5173)).

Production build:

```bash
npm run build
npm run preview
```

## What you get

1. **Brief form** — product name, audience, primary pain, 5–7 listicle points, CTA, price lockup.
2. **Auto-suggest** — fills seven reason titles from the brief when you do not want to write them.
3. **Instant generate** — local templates, no network.
4. **Live preview** — identity-gap headline, pain buzzwords, social proof, numbered reasons with labeled image slots, mid-page CTA, comments-style quotes, sticky buy bar. Toggle mobile / desktop.
5. **One-click export**
   - **HTML section** — Liquid-ish Shopify snippet (`sections/listicle-lander.liquid` style) with `{{ product.selected_or_first_available_variant.id }}` on the cart form. Not a live store connection.
   - **Markdown brief** — creative/doc handoff.

Canned examples (fictional brands):

- **Filtered shower / smart people switching** — AquaLume. Chlorine, hard water, the pitcher-but-not-the-shower identity gap.
- **Knee relief / grandma angle** — Kinora. Stairs, Sunday sauce, daughters buying, grandmas pretending they did not need it.

## Optional AI upgrade

Template copy is the default and is enough for the demo.

1. Copy `.env.example` to `.env`.
2. Set `OPENAI_API_KEY`.
3. Restart `npm run dev`.
4. Check **Rewrite with OpenAI** and hit **Generate lander**.

The key stays on the Vite dev server (`/api/rewrite`). If the request fails, the UI keeps the local template copy.

Optional: `OPENAI_MODEL` (default `gpt-4o-mini`).

Do not commit `.env`.

## Notes

- Preview is a Meta-bound listicle *pattern* (sponsored briefing, numbered reasons, sticky CTA). It is not an ads manager.
- All products, reviews, and “as seen in” outlets are fictional.
- No medical claims should ship to a real ad account as-is.
