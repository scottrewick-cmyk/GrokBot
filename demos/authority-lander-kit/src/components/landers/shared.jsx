export function ProductStill({ name, className = "" }) {
  return (
    <div className={`still ${className}`} aria-hidden="true">
      <div className="still__shadow" />
      <div className="still__lid" />
      <div className="still__body">
        <span className="still__brand">{name}</span>
        <span className="still__sub">kitchen-table tin</span>
      </div>
    </div>
  );
}

export function DemoBanner({ children }) {
  return <p className="lp-banner">{children}</p>;
}

export function Signature({ name }) {
  return (
    <p className="lp-sign">
      <span className="lp-sign__hand">{name.split(",")[0]}</span>
      <span className="lp-sign__meta">{name}</span>
    </p>
  );
}

export function SoftCta({ brief, onCta }) {
  return (
    <div className="lp-cta">
      <ProductStill name={brief.product} />
      <div className="lp-cta__copy">
        <p className="lp-cta__kicker">The tin</p>
        <h2 className="lp-cta__name">{brief.product}</h2>
        <p className="lp-cta__cat">{brief.cat}</p>
        <button type="button" className="lp-cta__btn" onClick={onCta}>
          {brief.ctaLabel}
        </button>
        <p className="lp-cta__sub">{brief.ctaSub}</p>
      </div>
    </div>
  );
}

export function LanderFoot({ brief }) {
  return (
    <footer className="lp-foot">
      <p>{brief.disclaimer}</p>
    </footer>
  );
}

export function splitGrafs(text) {
  return text.split(/\n\n+/).filter(Boolean);
}
