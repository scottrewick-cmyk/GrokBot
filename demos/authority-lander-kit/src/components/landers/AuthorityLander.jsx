import {
  DemoBanner,
  LanderFoot,
  ProductStill,
  Signature,
  SoftCta,
  splitGrafs,
} from "./shared.jsx";

export function AuthorityLander({ brief, onCta }) {
  const grafs = splitGrafs(brief.authorityOpen);

  return (
    <article className="lp lp-auth">
      <DemoBanner>Marketing demo · fictional product · not medical advice</DemoBanner>

      <header className="lp-auth__letterhead">
        <span>The {brief.lastName} Notes</span>
        <span>Issue 14 · {brief.year}</span>
        <span>{brief.location}</span>
      </header>

      <section className="lp-auth__hero">
        <div className="lp-auth__portrait" aria-hidden="true">
          <div className="lp-auth__face">
            <span>{brief.initials}</span>
          </div>
        </div>
        <div>
          <p className="lp-kicker">{brief.authorityEyebrow}</p>
          <h1 className="lp-auth__h">{brief.authorityHeadline}</h1>
          <p className="lp-dek">{brief.authorityDek}</p>
          <p className="lp-auth__by">
            {brief.expert}
            <small>{brief.expertTitle}</small>
          </p>
        </div>
      </section>

      <section className="lp-prose">
        {grafs.map((g, i) => (
          <p key={i} className={i === 0 ? "lp-drop" : undefined}>
            {g}
          </p>
        ))}
      </section>

      <section className="lp-auth__tried">
        <h2>Three I put back on the shelf</h2>
        <ol>
          {brief.authorityTried.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="lp-auth__keep">
        <div className="lp-auth__keep-copy">
          <h2>The one I did not put back</h2>
          <p>{brief.authorityTurn}</p>
          <p>{brief.authorityWhy}</p>
        </div>
        <figure className="lp-auth__figure">
          <ProductStill name={brief.product} />
          <figcaption>
            {brief.product}
            <em>as it first appeared: a dented tin, a date on tape</em>
          </figcaption>
        </figure>
      </section>

      <section className="lp-auth__proof">
        {brief.authorityProof.map((item) => (
          <div key={item.k}>
            <strong>{item.k}</strong>
            <span>{item.v}</span>
          </div>
        ))}
      </section>

      <section className="lp-auth__quotes">
        <h2>What I keep hearing in the hallway</h2>
        <p className="lp-auth__quotes-note">Composite notes for this demo. Not patient testimonials.</p>
        <div className="lp-auth__quote-grid">
          {brief.authorityQuotes.map((q) => (
            <blockquote key={q.name}>
              <p>“{q.quote}”</p>
              <footer>
                {q.name}
                <span>{q.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="lp-auth__close">
        <p>{brief.authorityCta}</p>
        <SoftCta brief={brief} onCta={onCta} />
        <p className="lp-auth__ps">{brief.authorityPs}</p>
        <Signature name={brief.expert} />
      </section>

      <LanderFoot brief={brief} />
    </article>
  );
}
