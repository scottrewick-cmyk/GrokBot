import { DemoBanner, LanderFoot, SoftCta } from "./shared.jsx";

export function ComparisonLander({ brief, onCta }) {
  const cols = brief.compareRows[0]?.cells.length ?? 4;

  return (
    <article className="lp lp-cmp">
      <DemoBanner>Marketing demo · fictional product · not medical advice</DemoBanner>
      <p className="lp-stubchip">Condensed outline · comparison family</p>

      <header className="lp-cmp__head">
        <p className="lp-kicker">A table for people who think in tables</p>
        <h1>{brief.compareHeadline}</h1>
        <p className="lp-dek">{brief.compareDek}</p>
      </header>

      <div className="lp-cmp__scroller">
        <table className="lp-cmp__table">
          <thead>
            <tr>
              <th> </th>
              {brief.compareRows[0].cells.map((cell, i) => (
                <th key={cell} className={i === brief.compareWinner ? "is-win" : undefined}>
                  {i === brief.compareWinner ? "House pick" : `Option ${i + 1}`}
                  <span>{cell}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {brief.compareRows.slice(1).map((row) => (
              <tr key={row.label}>
                <th>{row.label}</th>
                {row.cells.map((cell, i) => (
                  <td key={`${row.label}-${i}`} className={i === brief.compareWinner ? "is-win" : undefined}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="lp-cmp__cols-note">{cols} columns · swipe on a phone</p>

      <SoftCta brief={brief} onCta={onCta} />
      <LanderFoot brief={brief} />
    </article>
  );
}
