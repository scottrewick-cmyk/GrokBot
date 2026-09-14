import type { BriefInput, GeneratedLander } from "../types";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function landerToMarkdown(form: BriefInput, lander: GeneratedLander): string {
  const reasons = lander.reasons
    .map(
      (reason) =>
        `### ${reason.number}. ${reason.title}\n\n**Image:** ${reason.imageLabel}\n_${reason.imageCaption}_\n\n${reason.body}${reason.callout ? `\n\n> ${reason.callout}` : ""}`,
    )
    .join("\n\n");

  const quotes = lander.testimonials
    .map((item) => `- **${item.name}** (${item.tag}): “${item.quote}”`)
    .join("\n");

  const faq = lander.faq.map((item) => `**${item.q}**\n${item.a}`).join("\n\n");

  return `# Listicle brief — ${form.productName}

_Fictional DTC demo. Not medical or scientific advice. Paste into a creative doc or Shopify page brief._

## Positioning
- **Audience:** ${form.audience}
- **Primary pain:** ${form.primaryPain}
- **Identity gap:** ${lander.identityGap}
- **CTA:** ${lander.cta.primary}
- **Price lockup:** ${lander.cta.price}

## Headline stack
- **Kicker:** ${lander.kicker}
- **Headline:** ${lander.headline}
- **Subhead:** ${lander.subhead}
- **Byline:** ${lander.byline} · ${lander.date} · ${lander.readTime}

## Pain buzzwords
${lander.painBuzzwords.map((word) => `- ${word}`).join("\n")}

## Social proof
- ${lander.socialProof.rating} stars · ${lander.socialProof.reviewCount} reviews
- ${lander.socialProof.buyersToday} in the last 24 hours
- Claim: ${lander.socialProof.claim}
- Outlets (fictional): ${lander.socialProof.outlets.join(", ")}

## Intro
${lander.intro.map((p) => p).join("\n\n")}

## Numbered reasons
${reasons}

## Mid-page CTA
${lander.midCta}

## Testimonials
${quotes}

## Guarantee
${lander.guarantee}

## Sticky bar
- Button: ${lander.cta.primary}
- Sub: ${lander.cta.sub}
- Urgency: ${lander.cta.urgency}

## FAQ
${faq}

## Shopify notes
- Bind the sticky button to \`{{ product.selected_or_first_available_variant.id }}\`
- Swap image placeholders for product media or UGC
- Do not run medical claims through ads review
`;
}

export function landerToHtmlSnippet(form: BriefInput, lander: GeneratedLander): string {
  const reasons = lander.reasons
    .map(
      (reason) => `  <article class="ll-reason" id="reason-${reason.number}">
    <div class="ll-reason-copy">
      <span class="ll-num">${reason.number}</span>
      <h2>${escapeHtml(reason.title)}</h2>
      <p>${escapeHtml(reason.body)}</p>
    </div>
    <figure class="ll-ph" data-label="${escapeHtml(reason.imageLabel)}">
      <div class="ll-ph-frame">{{ product.media[${reason.number}] | img_url: '900x' | img_tag: ${JSON.stringify(reason.imageLabel)} }}</div>
      <figcaption>${escapeHtml(reason.imageCaption)}</figcaption>
    </figure>
  </article>`,
    )
    .join("\n");

  const buzz = lander.painBuzzwords
    .map((word) => `<li>${escapeHtml(word)}</li>`)
    .join("");

  const quotes = lander.testimonials
    .map(
      (item) => `    <blockquote>
      <p>“${escapeHtml(item.quote)}”</p>
      <footer>${escapeHtml(item.name)} · ${escapeHtml(item.tag)}</footer>
    </blockquote>`,
    )
    .join("\n");

  return `{% comment %}
  Listicle Lab export for ${escapeHtml(form.productName)}
  Paste into a Shopify section (e.g. sections/listicle-lander.liquid)
  or a custom page template. Bind the forms to the product. No OAuth required.
{% endcomment %}
<section class="ll-lander" style="--ll-accent:${lander.accent};">
  <style>
    .ll-lander{--ll-ink:#1a140f;--ll-paper:#f6f1e8;--ll-muted:#6b5e52;font-family:Georgia,'Iowan Old Style',serif;color:var(--ll-ink);background:var(--ll-paper);max-width:720px;margin:0 auto;padding:24px 18px 96px;}
    .ll-kicker{letter-spacing:.16em;font-size:11px;font-family:system-ui,sans-serif;color:var(--ll-accent);}
    .ll-lander h1{font-size:clamp(28px,6vw,44px);line-height:1.15;margin:.4em 0;}
    .ll-sub{font-size:1.15rem;color:var(--ll-muted);}
    .ll-buzz{display:flex;flex-wrap:wrap;gap:8px;list-style:none;padding:0;}
    .ll-buzz li{font-family:system-ui,sans-serif;font-size:11px;letter-spacing:.08em;border:1px solid var(--ll-ink);padding:6px 10px;}
    .ll-reason{display:grid;gap:16px;margin:40px 0;}
    .ll-num{display:inline-flex;width:36px;height:36px;border-radius:50%;background:var(--ll-accent);color:#fff;align-items:center;justify-content:center;font-family:system-ui,sans-serif;}
    .ll-ph-frame{min-height:220px;background:#e4d9c8;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;font-size:12px;letter-spacing:.08em;}
    .ll-sticky{position:sticky;bottom:0;background:var(--ll-ink);color:#fff;display:flex;justify-content:space-between;gap:12px;padding:12px 16px;}
    .ll-sticky button{background:var(--ll-accent);color:#fff;border:0;padding:12px 18px;font-weight:700;cursor:pointer;}
    @media (max-width:640px){.ll-sticky{flex-direction:column;}}
  </style>
  <p class="ll-kicker">${escapeHtml(lander.kicker)}</p>
  <h1>${escapeHtml(lander.headline)}</h1>
  <p class="ll-sub">${escapeHtml(lander.subhead)}</p>
  <p>${escapeHtml(lander.byline)} · ${escapeHtml(lander.date)}</p>
  <ul class="ll-buzz">${buzz}</ul>
  ${lander.intro.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n  ")}
  <p><strong>${escapeHtml(lander.identityGap)}</strong></p>
  <p>${escapeHtml(lander.socialProof.rating)} ★ · ${escapeHtml(lander.socialProof.reviewCount)} reviews · ${escapeHtml(lander.socialProof.claim)}</p>
${reasons}
  <aside>
    ${quotes}
    <p>${escapeHtml(lander.guarantee)}</p>
  </aside>
  <form class="ll-sticky" action="/cart/add" method="post">
    <div>
      <strong>${escapeHtml(lander.cta.price)}</strong>
      <div>${escapeHtml(lander.cta.sub)}</div>
    </div>
    <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
    <input type="hidden" name="quantity" value="1">
    <button type="submit">${escapeHtml(lander.cta.primary)}</button>
  </form>
</section>
`;
}
