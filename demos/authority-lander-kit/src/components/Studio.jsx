import { useEffect, useMemo, useRef, useState } from "react";
import { FAMILIES } from "../data/families.js";
import { getCopySections } from "../data/copy.js";
import {
  collectDocumentCss,
  copyText,
  downloadText,
  slugify,
  wrapLanderHtml,
} from "../lib/export.js";
import { LanderSwitch } from "./landers/LanderSwitch.jsx";

export function Studio({
  familyId,
  onFamily,
  onBack,
  productName,
  category,
  expertName,
  onProductName,
  onCategory,
  onExpertName,
  viewport,
  onViewport,
  brief,
  toast,
}) {
  const previewRef = useRef(null);
  const scrollRef = useRef(null);
  const [openSections, setOpenSections] = useState(true);
  const family = FAMILIES.find((f) => f.id === familyId) ?? FAMILIES[0];
  const sections = useMemo(() => getCopySections(family.id, brief), [family.id, brief]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [family.id, viewport]);

  async function exportHtml() {
    const root = previewRef.current;
    if (!root) return;
    const html = wrapLanderHtml({
      title: `${brief.product} · ${family.name}`,
      innerHtml: root.innerHTML,
      css: collectDocumentCss(),
    });
    downloadText(`${slugify(brief.product)}-${family.id}.html`, html);
    toast("HTML downloaded");
  }

  async function copySection(text, label) {
    await copyText(text);
    toast(`Copied ${label}`);
  }

  async function copyAll() {
    const text = sections.map((s) => `## ${s.label}\n${s.text}`).join("\n\n");
    await copyText(text);
    toast("All sections copied");
  }

  return (
    <div className="studio">
      <aside className="rail">
        <button type="button" className="rail__back" onClick={onBack}>
          ← Gallery
        </button>

        <p className="rail__label">Family</p>
        <div className="rail__pills">
          {FAMILIES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === family.id ? "is-on" : undefined}
              onClick={() => onFamily(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>

        <p className="rail__desc">{family.description}</p>

        <label className="field">
          <span>Product name</span>
          <input value={productName} onChange={(e) => onProductName(e.target.value)} />
        </label>
        <label className="field">
          <span>Category</span>
          <input value={category} onChange={(e) => onCategory(e.target.value)} />
        </label>
        <label className="field">
          <span>Expert</span>
          <input value={expertName} onChange={(e) => onExpertName(e.target.value)} />
        </label>

        <p className="rail__label">Preview</p>
        <div className="rail__seg">
          <button type="button" className={viewport === "desktop" ? "is-on" : undefined} onClick={() => onViewport("desktop")}>
            Desktop
          </button>
          <button type="button" className={viewport === "mobile" ? "is-on" : undefined} onClick={() => onViewport("mobile")}>
            Mobile
          </button>
        </div>

        <div className="rail__actions">
          <button type="button" className="btn btn--solid" onClick={exportHtml}>
            Export HTML
          </button>
          <button type="button" className="btn" onClick={copyAll}>
            Copy all copy
          </button>
        </div>

        <button
          type="button"
          className="rail__sections-toggle"
          onClick={() => setOpenSections((v) => !v)}
        >
          {openSections ? "Hide" : "Show"} copy sections
        </button>
        {openSections && (
          <ul className="rail__sections">
            {sections.map((section) => (
              <li key={section.id}>
                <span>{section.label}</span>
                <button type="button" onClick={() => copySection(section.text, section.label)}>
                  Copy
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <section className="stage">
        <div className="stage__bar">
          <strong>{family.name}</strong>
          <span>{family.kicker}</span>
          <span className="stage__dot" />
          <span>
            {viewport === "mobile" ? "390px device" : "Editorial column on desktop canvas"}
          </span>
        </div>
        <div className={`device device--${viewport}`}>
          <div className="device__chrome" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="device__scroll" ref={scrollRef}>
            <div ref={previewRef} className="device__page">
              <LanderSwitch
                familyId={family.id}
                brief={brief}
                onCta={() => toast("Demo checkout is not connected")}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
