# Authority Lander Kit

A polished **marketing-format demo** of Meta-native landing-page families for DTC health offers. Fictional product. Not a CMS. Not medical advice.

Default offer in the studio: **Old World Relief** — a kitchen-table *knee comfort cream* told through an expert letter.

## Run it

```bash
cd demos/authority-lander-kit
npm install
npm run dev
```

Then open the local URL Vite prints (typically `http://localhost:5173`).

```bash
npm run build    # production bundle
npm run preview  # serve the build
```

## What you can do

1. Browse a gallery of **six lander families**.
2. Pick a family and set **product name**, **category**, and **expert** (defaults are fictional).
3. Preview a full page in that style, toggling **desktop** vs **mobile**.
4. **Export HTML** of the current lander, or **copy sections** of the generated copy.

## The six families

| Family | In this kit | What it is |
| --- | --- | --- |
| **Authority** | Full page | Expert identity, “I tested everything,” one surviving recommendation, credibility stack, soft product transition. The workhorse. |
| **Listicle** | Full page | Numbered field guide. The product earns the last slot instead of interrupting. |
| **Story-driven** | Full page | First-person scene → stall → turn → quiet handoff to the tin. |
| **News mimic** | Condensed outline | Masthead, byline, reported tone. Product lives in a callout, not a countdown. |
| **Quiz / interactive** | Condensed outline | Three consult-style questions that resolve to one recommendation. |
| **Comparison** | Condensed outline | Usual options vs. the house pick. Winner is obvious without shouting. |

Authority, Listicle, and Story are fully rendered React landers. News, Quiz, and Comparison are intentionally shorter **format outlines** with finished UI — enough to walk a client through the family without pretending this kit is a page builder.

## Frame

This is a **client demo of lander architecture**, not a store and not a clinic.

- Product, quotes, and “desk” are fictional.
- Copy avoids miracle / cure / treat language.
- Every lander carries a disclaimer: not medical advice.

Built with Vite + React. Typography: Fraunces, Newsreader, Outfit, Caveat.
