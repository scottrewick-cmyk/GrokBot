import type { Category } from "../types";

interface Props {
  previewMode: "mobile" | "desktop";
  onPreviewMode: (mode: "mobile" | "desktop") => void;
  onCopyHtml: () => void;
  onCopyMd: () => void;
  copied: string | null;
  category: Category;
}

export function ExportBar({
  previewMode,
  onPreviewMode,
  onCopyHtml,
  onCopyMd,
  copied,
  category,
}: Props) {
  return (
    <div className="export-bar">
      <div className="seg" role="group" aria-label="Preview size">
        <button
          type="button"
          name="previewMobile"
          className={previewMode === "mobile" ? "is-on" : ""}
          onClick={() => onPreviewMode("mobile")}
        >
          Mobile
        </button>
        <button
          type="button"
          name="previewDesktop"
          className={previewMode === "desktop" ? "is-on" : ""}
          onClick={() => onPreviewMode("desktop")}
        >
          Desktop
        </button>
      </div>
      <p className="export-meta">
        {category === "water" ? "Shower / identity-gap" : category === "wellness" ? "Knee / grandma angle" : "Generic DTC"}
      </p>
      <div className="export-actions">
        <button type="button" name="copyHtml" onClick={onCopyHtml}>
          {copied === "html" ? "Copied HTML" : "Copy HTML section"}
        </button>
        <button type="button" name="copyMarkdown" onClick={onCopyMd}>
          {copied === "md" ? "Copied Markdown" : "Copy Markdown brief"}
        </button>
      </div>
    </div>
  );
}
