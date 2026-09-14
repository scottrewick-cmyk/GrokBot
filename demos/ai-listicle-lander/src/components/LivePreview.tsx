import type { GeneratedLander } from "../types";
import { ImagePlaceholder } from "./ImagePlaceholder";

interface Props {
  lander: GeneratedLander;
  mode: "mobile" | "desktop";
  flash: number;
}

function Stars({ value }: { value: string | number }) {
  const n = Math.round(typeof value === "string" ? Number(value) : value);
  return <span className="stars">{Array.from({ length: 5 }, (_, i) => (i < n ? "★" : "☆")).join("")}</span>;
}

export function LivePreview({ lander, mode, flash }: Props) {
  return (
    <div className={`stage-canvas is-${mode}`}>
      <div className={`device is-${mode}`} key={flash} style={{ ["--ll-accent" as string]: lander.accent }}>
        <div className="device-chrome">
          <span className="notch" />
          <span className="chrome-url">lister.lab / sponsored-brief</span>
        </div>
        <div className="lander-scroll">
          <article className="lander">
            <header className="masthead">
              <span className="pub">{lander.kicker.split("·")[0].trim()}</span>
              <span className="sponsored">Sponsored briefing</span>
            </header>

            <p className="kicker">{lander.kicker}</p>
            <h1>{lander.headline}</h1>
            <p className="subhead">{lander.subhead}</p>
            <div className="byline">
              <span>{lander.byline}</span>
              <span>
                {lander.date} · {lander.readTime}
              </span>
            </div>

            <ul className="buzz" aria-label="Pain buzzwords">
              {lander.painBuzzwords.map((word) => (
                <li key={word}>{word}</li>
              ))}
            </ul>

            <section className="proof-bar" aria-label="Social proof">
              <div>
                <Stars value={lander.socialProof.rating} />
                <strong>{lander.socialProof.rating}</strong>
                <span>{lander.socialProof.reviewCount} reviews</span>
              </div>
              <div>
                <strong>{lander.socialProof.buyersToday}</strong>
                <span>in the last 24 hours</span>
              </div>
              <div className="outlets">
                <span>As seen in</span>
                <em>{lander.socialProof.outlets.join("  ·  ")}</em>
              </div>
            </section>

            {lander.intro.map((p) => (
              <p className="intro" key={p.slice(0, 24)}>
                {p}
              </p>
            ))}

            <blockquote className="identity">
              <p>{lander.identityGap}</p>
            </blockquote>

            {lander.reasons.map((reason) => (
              <section
                className={`reason ${reason.number % 2 === 0 ? "is-flip" : ""}`}
                key={reason.number}
                id={`preview-reason-${reason.number}`}
              >
                <div className="reason-copy">
                  <span className="num">{reason.number}</span>
                  <h2>{reason.title}</h2>
                  <p>{reason.body}</p>
                  {reason.callout ? <p className="callout">{reason.callout}</p> : null}
                </div>
                <ImagePlaceholder category={lander.category} reason={reason} />
              </section>
            ))}

            <aside className="mid-cta">
              <p>Skip the rest if you already know.</p>
              <strong>{lander.midCta}</strong>
              <span>
                {lander.cta.price} · {lander.cta.sub}
              </span>
            </aside>

            <section className="quotes">
              <h2>What buyers actually wrote</h2>
              {lander.testimonials.map((item) => (
                <blockquote key={item.name}>
                  <Stars value={item.stars} />
                  <p>“{item.quote}”</p>
                  <footer>
                    {item.name} · {item.tag}
                  </footer>
                </blockquote>
              ))}
            </section>

            <section className="guarantee">
              <h2>The fine print that should not be fine print</h2>
              <p>{lander.guarantee}</p>
            </section>

            <section className="faq">
              <h2>Before you argue with the ad</h2>
              {lander.faq.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </section>

            <footer className="disclaimer">
              Fictional product and publications for demo use. Not medical advice. Not a live Shopify store.
            </footer>
          </article>
        </div>
        <div className="sticky-cta">
          <div className="sticky-copy">
            <strong>
              {lander.cta.price} · {lander.socialProof.rating} ★
            </strong>
            <span>{lander.cta.urgency}</span>
          </div>
          <button type="button">{lander.cta.primary}</button>
        </div>
      </div>
    </div>
  );
}
