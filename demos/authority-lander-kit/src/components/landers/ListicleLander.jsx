import { DemoBanner, LanderFoot, SoftCta } from "./shared.jsx";

export function ListicleLander({ brief, onCta }) {
  const last = brief.listItems[brief.listItems.length - 1];
  const rest = brief.listItems.slice(0, -1);

  return (
    <article className="lp lp-list">
      <DemoBanner>Marketing demo · fictional product · not medical advice</DemoBanner>

      <header className="lp-list__head">
        <p className="lp-kicker">A numbered field guide</p>
        <h1>{brief.listHeadline}</h1>
        <p className="lp-dek">{brief.listDek}</p>
        <p className="lp-list__by">
          {brief.expert}
          <span>{brief.expertTitle}</span>
        </p>
      </header>

      <ol className="lp-list__items">
        {rest.map((item) => (
          <li key={item.n}>
            <span className="lp-list__n">{item.n}</span>
            <div>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="lp-list__last">
        <span className="lp-list__n">{last.n}</span>
        <div>
          <p className="lp-kicker">The conclusion, not an interruption</p>
          <h2>{last.title}</h2>
          <p>{last.body}</p>
          <SoftCta brief={brief} onCta={onCta} />
        </div>
      </section>

      <LanderFoot brief={brief} />
    </article>
  );
}
