import { useEffect, useMemo, useState } from "react";
import { Gallery } from "./components/Gallery.jsx";
import { Studio } from "./components/Studio.jsx";
import { DEFAULT_BRIEF, FAMILIES } from "./data/families.js";
import { createBrief } from "./data/copy.js";

function familyFromHash() {
  const id = window.location.hash.replace(/^#/, "");
  return FAMILIES.some((f) => f.id === id) ? id : null;
}

export default function App() {
  const [familyId, setFamilyId] = useState(familyFromHash);
  const [productName, setProductName] = useState(DEFAULT_BRIEF.productName);
  const [category, setCategory] = useState(DEFAULT_BRIEF.category);
  const [expertName, setExpertName] = useState(DEFAULT_BRIEF.expertName);
  const [viewport, setViewport] = useState("desktop");
  const [toast, setToast] = useState(null);

  const brief = useMemo(
    () => createBrief({ productName, category, expertName }),
    [productName, category, expertName],
  );

  useEffect(() => {
    const onHash = () => setFamilyId(familyFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(t);
  }, [toast]);

  function pickFamily(id) {
    window.location.hash = id;
    setFamilyId(id);
  }

  function backToGallery() {
    history.pushState("", document.title, window.location.pathname + window.location.search);
    setFamilyId(null);
  }

  return (
    <div className="kit">
      <header className="topbar">
        <button type="button" className="topbar__mark" onClick={backToGallery}>
          <span>ALK</span>
          Authority Lander Kit
        </button>
        <p className="topbar__note">Fictional marketing demo · not medical advice</p>
      </header>

      {familyId ? (
        <Studio
          familyId={familyId}
          onFamily={pickFamily}
          onBack={backToGallery}
          productName={productName}
          category={category}
          expertName={expertName}
          onProductName={setProductName}
          onCategory={setCategory}
          onExpertName={setExpertName}
          viewport={viewport}
          onViewport={setViewport}
          brief={brief}
          toast={setToast}
        />
      ) : (
        <Gallery onPick={pickFamily} />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
