import { useEffect, useMemo, useState } from "react";
import { EXAMPLES, SHOWER_FORM } from "./data/examples";
import { generateLander, suggestPoints } from "./lib/generate";
import { landerToHtmlSnippet, landerToMarkdown } from "./lib/export";
import type { BriefInput, GeneratedLander } from "./types";
import { BuilderForm } from "./components/BuilderForm";
import { ExportBar } from "./components/ExportBar";
import { LivePreview } from "./components/LivePreview";

const emptyForm = (): BriefInput => ({
  productName: "",
  audience: "",
  primaryPain: "",
  points: ["", "", "", "", ""],
  cta: "",
  price: "$49",
});

export default function App() {
  const [form, setForm] = useState<BriefInput>(SHOWER_FORM);
  const [lander, setLander] = useState<GeneratedLander>(() => generateLander(SHOWER_FORM));
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  const [openai, setOpenai] = useState(false);
  const [useAi, setUseAi] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Template mode · works offline");
  const [copied, setCopied] = useState<string | null>(null);
  const [flash, setFlash] = useState(0);

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data: { openai?: boolean }) => {
        setOpenai(Boolean(data.openai));
        if (data.openai) setStatus("OpenAI key detected · optional rewrite available");
      })
      .catch(() => {
        setOpenai(false);
      });
  }, []);

  const canGenerate = useMemo(() => {
    return Boolean(form.productName.trim() && form.audience.trim() && form.primaryPain.trim() && form.cta.trim());
  }, [form]);

  async function handleGenerate() {
    if (!canGenerate) {
      setStatus("Need product, audience, pain, and CTA.");
      return;
    }
    setBusy(true);
    const next = generateLander(form);
    setLander(next);
    setFlash((n) => n + 1);

    if (useAi && openai) {
      setStatus("Rewriting copy with OpenAI…");
      try {
        const res = await fetch("/api/rewrite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ form, lander: next }),
        });
        const data = (await res.json()) as { lander?: GeneratedLander; error?: string };
        if (!res.ok || !data.lander) {
          setStatus(data.error || "AI rewrite skipped · template copy kept");
        } else {
          setLander({ ...next, ...data.lander, reasons: data.lander.reasons ?? next.reasons });
          setStatus("AI rewrite applied · still fictional demo copy");
        }
      } catch {
        setStatus("AI unreachable · template copy kept");
      }
    } else {
      setStatus("Generated from local templates · no API used");
    }
    setBusy(false);
  }

  function loadExample(id: string) {
    const example = EXAMPLES.find((item) => item.id === id);
    if (!example) return;
    setForm(example.form);
    const next = generateLander(example.form);
    setLander(next);
    setFlash((n) => n + 1);
    setStatus(`Loaded “${example.label}” example · fictional brand`);
  }

  function autoSuggest() {
    const points = suggestPoints(form);
    setForm({ ...form, points });
    setStatus("Auto-suggested 7 listicle points from product / pain / audience");
  }

  async function copy(kind: "html" | "md") {
    const text =
      kind === "html" ? landerToHtmlSnippet(form, lander) : landerToMarkdown(form, lander);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setStatus(kind === "html" ? "Copied Liquid-ish HTML section" : "Copied Markdown brief");
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setStatus("Clipboard blocked — select the export from a secure origin");
    }
  }

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            1
          </span>
          <div>
            <p className="brand-kicker">Listicle Lab</p>
            <h1>AI listicle lander for Shopify-style DTC</h1>
          </div>
        </div>
        <p className="topbar-status" role="status">
          {status}
        </p>
      </header>

      <div className="workspace">
        <BuilderForm
          form={form}
          onChange={setForm}
          onGenerate={handleGenerate}
          onSuggest={autoSuggest}
          onLoadExample={loadExample}
          onReset={() => setForm(emptyForm())}
          canGenerate={canGenerate}
          busy={busy}
          openai={openai}
          useAi={useAi}
          onToggleAi={setUseAi}
        />

        <section className="stage" aria-label="Live preview">
          <ExportBar
            previewMode={previewMode}
            onPreviewMode={setPreviewMode}
            onCopyHtml={() => copy("html")}
            onCopyMd={() => copy("md")}
            copied={copied}
            category={lander.category}
          />
          <LivePreview lander={lander} mode={previewMode} flash={flash} />
        </section>
      </div>
    </div>
  );
}
