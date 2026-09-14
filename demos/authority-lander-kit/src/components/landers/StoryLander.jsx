import { DemoBanner, LanderFoot, Signature, SoftCta } from "./shared.jsx";

export function StoryLander({ brief, onCta }) {
  const grafs = brief.storyGrafs;
  const mid = Math.ceil(grafs.length / 2);

  return (
    <article className="lp lp-story">
      <DemoBanner>Marketing demo · fictional product · not medical advice</DemoBanner>

      <header className="lp-story__head">
        <p className="lp-kicker">{brief.storyKicker}</p>
        <h1>{brief.storyHeadline}</h1>
        <p className="lp-dek">{brief.storyDek}</p>
      </header>

      <div className="lp-story__rule" aria-hidden="true" />

      <section className="lp-prose lp-story__prose">
        {grafs.slice(0, mid).map((g, i) => (
          <p key={i} className={i === 0 ? "lp-drop" : undefined}>
            {g}
          </p>
        ))}
      </section>

      <blockquote className="lp-story__pull">
        <p>{brief.storyPull}</p>
      </blockquote>

      <section className="lp-prose lp-story__prose">
        {grafs.slice(mid).map((g, i) => (
          <p key={i}>{g}</p>
        ))}
      </section>

      <SoftCta brief={brief} onCta={onCta} />
      <Signature name={brief.expert} />
      <LanderFoot brief={brief} />
    </article>
  );
}
