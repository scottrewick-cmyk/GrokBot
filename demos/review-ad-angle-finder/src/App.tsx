import { useMemo, useState } from "react";
import { SAMPLE_PRODUCT_NAME, SAMPLE_REVIEWS } from "./data/sampleReviews";
import { analyzeReviews } from "./lib/analyze";
import { downloadFile, slugify, toMarkdown } from "./lib/export";
import { maybeRefineWithOpenAI } from "./lib/openai";
import { estimateReviewCount, wordCount } from "./lib/parseReviews";
import { AngleCard, InsightStrip, Scanner } from "./components/AngleCard";
import type { AnalysisResult, ScanStage } from "./types";

const STAGE_MS: Array<[ScanStage, number]> = [
  ["parsing", 420],
  ["clustering", 480],
  ["scoring", 460],
  ["writing", 520],
];

function Mark() {
  return (
    <svg className="mark" viewBox="0 0 42 42" aria-hidden="true">
      <rect width="42" height="42" rx="14" fill="#1a1612" />
      <path
        d="M10 28c5-12 17-12 22 0"
        fill="none"
        stroke="#e0b07a"
        strokeWidth="2.2"
      />
      <circle cx="21" cy="14" r="3.2" fill="#e08a68" />
    </svg>
  );
}

export default function App() {
  const [productName, setProductName] = useState("");
  const [reviews, setReviews] = useState("");
  const [clientKey, setClientKey] = useState("");
  const [stage, setStage] = useState<ScanStage>("idle");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const stats = useMemo(
    () => ({
      reviews: estimateReviewCount(reviews),
      words: wordCount(reviews),
    }),
    [reviews],
  );

  const busy = stage !== "idle" && stage !== "done";

  function ping(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  }

  function loadSample() {
    setProductName(SAMPLE_PRODUCT_NAME);
    setReviews(SAMPLE_REVIEWS.trim());
    setAnalysis(null);
    setNotice(null);
    ping("Loaded fictional OWH-style sample");
  }

  async function runAnalysis() {
    if (!reviews.trim()) {
      ping("Paste reviews first");
      return;
    }

    setAnalysis(null);
    setNotice(null);

    for (const [next, wait] of STAGE_MS) {
      setStage(next);
      await sleep(wait);
    }

    const heuristic = analyzeReviews(productName, reviews);
    setAnalysis(heuristic);
    setStage("done");

    const upgraded = await maybeRefineWithOpenAI(
      heuristic,
      reviews,
      clientKey || import.meta.env.VITE_OPENAI_API_KEY || "",
    );
    setAnalysis(upgraded.analysis);
    if (upgraded.notice) setNotice(upgraded.notice);
  }

  function exportMarkdown() {
    if (!analysis) return;
    downloadFile(
      `${slugify(analysis.productName)}-ad-angles.md`,
      toMarkdown(analysis),
      "text/markdown;charset=utf-8",
    );
  }

  function exportJson() {
    if (!analysis) return;
    downloadFile(
      `${slugify(analysis.productName)}-ad-angles.json`,
      JSON.stringify(analysis, null, 2),
      "application/json",
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <Mark />
          <div>
            <h1>Anglefinder</h1>
            <p>Review → Ad Angle Finder</p>
          </div>
        </div>
        <div className="top-actions">
          {analysis && (
            <>
              <span className="engine">
                {analysis.source === "heuristic"
                  ? "Offline intelligence"
                  : "OpenAI-polished"}
              </span>
              <button className="btn" type="button" onClick={exportMarkdown}>
                Export Markdown
              </button>
              <button className="btn" type="button" onClick={exportJson}>
                Export JSON
              </button>
            </>
          )}
        </div>
      </header>

      {!analysis && stage === "idle" && (
        <section className="hero">
          <div>
            <h2>
              The winning angle is already <em>in the reviews.</em>
            </h2>
            <p className="lede">
              Built for DTC supplement operators who are done guessing. Paste
              reviews (or load the fictional OWH-style knee + nerve sample) and
              get ranked Meta angles: pain insight, who it’s for, primary text,
              headlines, and advertorial hooks. No scrapers. Works fully
              offline.
            </p>
            <div className="pills">
              <span className="pill">Theme clusters</span>
              <span className="pill">Pain vocabulary</span>
              <span className="pill">Urgency</span>
              <span className="pill">Who it’s for</span>
              <span className="pill">3 Meta variants each</span>
            </div>
          </div>
          <Composer
            productName={productName}
            reviews={reviews}
            stats={stats}
            clientKey={clientKey}
            busy={busy}
            onProduct={setProductName}
            onReviews={setReviews}
            onKey={setClientKey}
            onSample={loadSample}
            onRun={runAnalysis}
          />
        </section>
      )}

      {(analysis || busy) && (
        <section className="workspace">
          <Composer
            compact
            productName={productName}
            reviews={reviews}
            stats={stats}
            clientKey={clientKey}
            busy={busy}
            onProduct={setProductName}
            onReviews={setReviews}
            onKey={setClientKey}
            onSample={loadSample}
            onRun={runAnalysis}
          />
          <div>
            {notice && (
              <p className={notice.includes("failed") ? "notice warn" : "notice"}>
                {notice}
              </p>
            )}
            {busy && <Scanner stage={stage} />}
            {analysis && (
              <>
                <InsightStrip analysis={analysis} />
                {analysis.angles.map((angle) => (
                  <AngleCard key={angle.id} angle={angle} onCopied={ping} />
                ))}
              </>
            )}
          </div>
        </section>
      )}

      <p className="footer-note">
        Demo creative only — not medical advice. The OWH-style sample is
        fictional. Optional OpenAI polish degrades gracefully when no key is
        present.
      </p>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function Composer({
  compact,
  productName,
  reviews,
  stats,
  clientKey,
  busy,
  onProduct,
  onReviews,
  onKey,
  onSample,
  onRun,
}: {
  compact?: boolean;
  productName: string;
  reviews: string;
  stats: { reviews: number; words: number };
  clientKey: string;
  busy: boolean;
  onProduct: (value: string) => void;
  onReviews: (value: string) => void;
  onKey: (value: string) => void;
  onSample: () => void;
  onRun: () => void;
}) {
  return (
    <form
      className="panel"
      onSubmit={(event) => {
        event.preventDefault();
        onRun();
      }}
    >
      <label className="field">
        <span>Product name</span>
        <input
          type="text"
          placeholder="e.g. Helix Joint & Nerve"
          value={productName}
          onChange={(event) => onProduct(event.target.value)}
        />
      </label>
      <label className="field">
        <span>Reviews, Reddit notes, TikTok comments</span>
        <textarea
          placeholder="Paste customer language. Blank lines separate reviews."
          value={reviews}
          onChange={(event) => onReviews(event.target.value)}
          style={compact ? { minHeight: 180 } : undefined}
        />
        <div className="meta-row">
          <span>
            {stats.reviews} parsed · {stats.words} words
          </span>
        </div>
      </label>
      <div className="row-actions">
        <button className="btn" type="button" onClick={onSample}>
          Load OWH-style sample
        </button>
        <button className="btn primary" type="submit" disabled={busy}>
          {busy ? "Mining angles…" : "Find ad angles"}
        </button>
      </div>
      <details className="advanced">
        <summary>Optional OpenAI upgrade</summary>
        <p className="lede" style={{ fontSize: "0.85rem", margin: "10px 0" }}>
          Offline heuristics always run. Add a key to polish copy. Never
          required. You can also set <code>OPENAI_API_KEY</code> in{" "}
          <code>.env.local</code> for the Vite dev server.
        </p>
        <input
          type="password"
          autoComplete="off"
          placeholder="sk-… (stays in this browser)"
          value={clientKey}
          onChange={(event) => onKey(event.target.value)}
        />
      </details>
    </form>
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
