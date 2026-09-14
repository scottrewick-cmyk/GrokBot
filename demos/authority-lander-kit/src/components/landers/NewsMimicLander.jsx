import { DemoBanner, LanderFoot, SoftCta } from "./shared.jsx";

export function NewsMimicLander({ brief, onCta }) {
  return (
    <article className="lp lp-news">
      <DemoBanner>Marketing demo · fictional desk · not medical advice</DemoBanner>
      <p className="lp-stubchip">Condensed outline · news-mimic family</p>

      <header className="lp-news__mast">
        <p className="lp-news__desk">{brief.newsDesk}</p>
        <p className="lp-news__meta">Vol. II · Morning edition · Fictional</p>
      </header>

      <p className="lp-kicker">{brief.newsKicker}</p>
      <h1 className="lp-news__h">{brief.newsHeadline}</h1>
      <p className="lp-news__by">{brief.newsByline}</p>

      <p className="lp-news__lead">{brief.newsLead}</p>
      <p className="lp-prose-inline">{brief.newsBody}</p>

      <aside className="lp-news__box">
        <p className="lp-news__box-k">In the tin</p>
        <p>{brief.newsBox}</p>
      </aside>

      <SoftCta brief={brief} onCta={onCta} />
      <LanderFoot brief={brief} />
    </article>
  );
}
