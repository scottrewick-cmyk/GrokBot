import { useState } from "react";
import type { AdAngle, AnalysisResult, ScanStage } from "../types";

function CopyButton({
  label,
  text,
  onCopied,
}: {
  label: string;
  text: string;
  onCopied: (msg: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      try {
        const area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.left = "-9999px";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        area.remove();
      } catch {
        // Clipboard can be blocked in embedded browsers; still show local feedback.
      }
    }
    setCopied(true);
    onCopied(`${label} copied`);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button className="btn ghost" type="button" onClick={copy}>
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function AngleCard({
  angle,
  onCopied,
}: {
  angle: AdAngle;
  onCopied: (msg: string) => void;
}) {
  const [tab, setTab] = useState(0);
  const variants = ["A · Story", "B · Interrupt", "C · Checklist"];

  return (
    <article className="angle">
      <div className="angle-head">
        <div>
          <div className="rank">Angle {String(angle.rank).padStart(2, "0")}</div>
          <h3>{angle.title}</h3>
          <div className="pills">
            {angle.tags.map((tag) => (
              <span className="pill" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="score">
          <strong>{angle.score.toFixed(1)}</strong>
          {angle.evidence.mentionCount} supporting reviews
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <div className="insight">
          <h4>Pain insight</h4>
          <p>{angle.painInsight}</p>
        </div>
        <div className="insight">
          <h4>Why it might convert</h4>
          <p>{angle.whyItMightConvert}</p>
        </div>
      </div>

      {angle.evidence.sampleQuotes.length > 0 && (
        <ul className="quotes">
          {angle.evidence.sampleQuotes.map((quote) => (
            <li key={quote}>“{quote}”</li>
          ))}
        </ul>
      )}

      <div className="copy-row">
        <h4 className="insight" style={{ background: "none", padding: 0, margin: 0 }}>
          <span style={{ color: "var(--gold)", letterSpacing: "0.08em", fontSize: "0.72rem" }}>
            META PRIMARY TEXT
          </span>
        </h4>
        <CopyButton
          label="Primary text"
          text={angle.primaryTexts[tab]}
          onCopied={onCopied}
        />
      </div>
      <div className="tabs">
        {variants.map((name, index) => (
          <button
            key={name}
            type="button"
            className={tab === index ? "tab active" : "tab"}
            onClick={() => setTab(index)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="copy-block">{angle.primaryTexts[tab]}</div>

      <div className="grid-2" style={{ marginTop: 12 }}>
        <div className="insight">
          <h4>Headline</h4>
          <p>{angle.headline}</p>
          <div style={{ marginTop: 8 }}>
            <CopyButton label="Headline" text={angle.headline} onCopied={onCopied} />
          </div>
        </div>
        <div className="hook">
          <strong>Advertorial hook</strong>
          <p style={{ margin: 0, lineHeight: 1.5 }}>{angle.advertorialHook}</p>
          <div style={{ marginTop: 8 }}>
            <CopyButton
              label="Hook"
              text={angle.advertorialHook}
              onCopied={onCopied}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export function InsightStrip({ analysis }: { analysis: AnalysisResult }) {
  const maxTheme = analysis.themes[0]?.score || 1;
  return (
    <>
      <div className="strip">
        <div className="stat">
          <b>{analysis.angles.length}</b>
          <span>Ranked ad angles</span>
        </div>
        <div className="stat">
          <b>{analysis.reviewCount}</b>
          <span>Reviews clustered</span>
        </div>
        <div className="stat">
          <b>{analysis.painLanguage.length}</b>
          <span>Pain phrases</span>
        </div>
        <div className="stat">
          <b>{analysis.whoItsFor[0]?.label.split(" ")[0] ?? "—"}</b>
          <span>Lead persona</span>
        </div>
      </div>

      <p className="section-label">Theme clusters</p>
      <div className="clusters">
        {analysis.themes.slice(0, 6).map((theme) => (
          <div className="cluster" key={theme.id}>
            <strong>{theme.label}</strong>
            <div className="bar">
              <i style={{ width: `${Math.max(12, (theme.score / maxTheme) * 100)}%` }} />
            </div>
            <small>
              {theme.reviewIds.length} reviews · intensity {theme.intensity}
            </small>
          </div>
        ))}
      </div>

      <p className="section-label">Who it&apos;s for</p>
      <div className="who">
        {analysis.whoItsFor.map((persona) => (
          <span className="pill" key={persona.label}>
            {persona.label} · {persona.count}
          </span>
        ))}
      </div>
      <p className="section-label">Urgency</p>
      <div className="who">
        {analysis.urgency.map((item) => (
          <span className="pill" key={item.label}>
            {item.label} · {item.count}
          </span>
        ))}
      </div>
      <p className="section-label">Failed alternatives</p>
      <div className="who">
        {analysis.failedSolutions.map((item) => (
          <span className="pill" key={item.name}>
            {item.name} · {item.count}
          </span>
        ))}
        {analysis.painLanguage.slice(0, 8).map((item) => (
          <span className="pill" key={item.phrase}>
            {item.category}: {item.phrase}
          </span>
        ))}
      </div>
    </>
  );
}

const STAGES: { id: ScanStage; label: string }[] = [
  { id: "parsing", label: "Parsing review voice" },
  { id: "clustering", label: "Clustering pain language" },
  { id: "scoring", label: "Scoring urgency & who it's for" },
  { id: "writing", label: "Writing ranked Meta angles" },
];

export function Scanner({ stage }: { stage: ScanStage }) {
  const activeIndex = STAGES.findIndex((s) => s.id === stage);
  return (
    <div className="panel scan">
      <ol>
        {STAGES.map((item, index) => (
          <li key={item.id} className={index <= activeIndex ? "on" : ""}>
            <span className="dot" />
            {item.label}
          </li>
        ))}
      </ol>
    </div>
  );
}
