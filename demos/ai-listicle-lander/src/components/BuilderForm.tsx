import { EXAMPLES } from "../data/examples";
import type { BriefInput } from "../types";

interface Props {
  form: BriefInput;
  onChange: (form: BriefInput) => void;
  onGenerate: () => void;
  onSuggest: () => void;
  onLoadExample: (id: string) => void;
  onReset: () => void;
  canGenerate: boolean;
  busy: boolean;
  openai: boolean;
  useAi: boolean;
  onToggleAi: (value: boolean) => void;
}

export function BuilderForm({
  form,
  onChange,
  onGenerate,
  onSuggest,
  onLoadExample,
  onReset,
  canGenerate,
  busy,
  openai,
  useAi,
  onToggleAi,
}: Props) {
  function update<K extends keyof BriefInput>(key: K, value: BriefInput[K]) {
    onChange({ ...form, [key]: value });
  }

  function updatePoint(index: number, value: string) {
    const points = form.points.slice();
    points[index] = value;
    update("points", points);
  }

  function addPoint() {
    if (form.points.length >= 7) return;
    update("points", [...form.points, ""]);
  }

  function removePoint(index: number) {
    if (form.points.length <= 5) return;
    update(
      "points",
      form.points.filter((_, i) => i !== index),
    );
  }

  return (
    <form
      className="builder"
      onSubmit={(event) => {
        event.preventDefault();
        onGenerate();
      }}
    >
      <div className="builder-head">
        <h2>Brief</h2>
        <p>Five fields. Generate instantly. Preview is the Meta-bound lander.</p>
      </div>

      <div className="example-row">
        {EXAMPLES.map((example) => (
          <button
            key={example.id}
            type="button"
            name="loadExample"
            className="example-chip"
            onClick={() => onLoadExample(example.id)}
          >
            <strong>{example.label}</strong>
            <span>{example.blurb}</span>
          </button>
        ))}
      </div>

      <label htmlFor="productName">
        Product name
        <input
          id="productName"
          name="productName"
          value={form.productName}
          onChange={(e) => update("productName", e.target.value)}
          placeholder="AquaLume Filtered Shower Head"
          required
        />
      </label>

      <label htmlFor="audience">
        Audience
        <input
          id="audience"
          name="audience"
          value={form.audience}
          onChange={(e) => update("audience", e.target.value)}
          placeholder="Smart people who already buy organic"
          required
        />
      </label>

      <label htmlFor="primaryPain">
        Primary pain
        <textarea
          id="primaryPain"
          name="primaryPain"
          rows={3}
          value={form.primaryPain}
          onChange={(e) => update("primaryPain", e.target.value)}
          placeholder="Chlorine and hard water wrecking hair and skin"
          required
        />
      </label>

      <div className="points-head">
        <label>Listicle points (5–7)</label>
        <div className="points-actions">
          <button type="button" name="autoSuggest" className="text-btn" onClick={onSuggest}>
            Auto-suggest
          </button>
          <button type="button" name="addPoint" className="text-btn" onClick={addPoint} disabled={form.points.length >= 7}>
            Add
          </button>
        </div>
      </div>
      <ol className="points">
        {form.points.map((point, index) => (
          <li key={index}>
            <input
              id={`point-${index}`}
              name={`point-${index}`}
              aria-label={`Listicle point ${index + 1}`}
              value={point}
              onChange={(e) => updatePoint(index, e.target.value)}
              placeholder={`Reason ${index + 1}`}
            />
            {form.points.length > 5 ? (
              <button
                type="button"
                name={`removePoint-${index}`}
                className="icon-btn"
                onClick={() => removePoint(index)}
                aria-label={`Remove point ${index + 1}`}
              >
                ×
              </button>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="split-fields">
        <label htmlFor="cta">
          CTA
          <input
            id="cta"
            name="cta"
            value={form.cta}
            onChange={(e) => update("cta", e.target.value)}
            placeholder="Switch my shower — 30-second install"
            required
          />
        </label>
        <label htmlFor="price">
          Price lockup
          <input
            id="price"
            name="price"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            placeholder="$47"
          />
        </label>
      </div>

      <label htmlFor="useAi" className={`ai-toggle ${openai ? "" : "is-off"}`}>
        <input
          type="checkbox"
          name="useAi"
          id="useAi"
          checked={useAi && openai}
          disabled={!openai}
          onChange={(e) => onToggleAi(e.target.checked)}
        />
        <span>
          Rewrite with OpenAI
          <small>
            {openai
              ? "Uses OPENAI_API_KEY on Generate. Template copy is the fallback."
              : "Optional. Add OPENAI_API_KEY to .env and restart — not required."}
          </small>
        </span>
      </label>

      <div className="builder-footer">
        <button type="submit" name="generate" className="generate" disabled={!canGenerate || busy}>
          {busy ? "Generating…" : "Generate lander"}
        </button>
        <button type="button" name="clear" className="ghost" onClick={onReset}>
          Clear
        </button>
      </div>
    </form>
  );
}
