import { FAMILIES } from "../data/families.js";

function Cover({ id }) {
  return (
    <div className={`cover cover--${id}`} aria-hidden="true">
      {id === "authority" && (
        <>
          <span className="cover__seal">MH</span>
          <i />
          <i />
          <i />
        </>
      )}
      {id === "listicle" && (
        <>
          <b>01</b>
          <b>02</b>
          <b>07</b>
        </>
      )}
      {id === "story" && <em>“Don’t make it a religion.”</em>}
      {id === "news" && <strong>THE DESK</strong>}
      {id === "quiz" && (
        <>
          <span />
          <span />
          <span />
        </>
      )}
      {id === "comparison" && (
        <>
          <u />
          <u />
          <u />
          <u className="is-win" />
        </>
      )}
    </div>
  );
}

function FamilyCard({ family, onPick }) {
  return (
    <button type="button" className="family" onClick={() => onPick(family.id)}>
      <Cover id={family.id} />
      <div className="family__body">
        <p className="family__kicker">{family.kicker}</p>
        <h2>{family.name}</h2>
        <p className="family__tag">{family.tagline}</p>
        <p>{family.description}</p>
        <span className="family__go">Open studio</span>
      </div>
    </button>
  );
}

export function Gallery({ onPick }) {
  const featured = FAMILIES[0];
  const full = FAMILIES.slice(1, 3);
  const stubs = FAMILIES.slice(3);

  return (
    <div className="gallery">
      <header className="gallery__hero">
        <p className="gallery__eyebrow">DTC health · Meta-native formats</p>
        <h1>
          Authority
          <span> Lander Kit</span>
        </h1>
        <p className="gallery__lede">
          Six landing-page families used to sell a tin without looking like an aisle. Pick a format,
          name a fictional offer, and preview the page. This is a client demo — not a clinic, not a CMS.
        </p>
      </header>

      <button type="button" className="family family--feature" onClick={() => onPick(featured.id)}>
        <Cover id={featured.id} />
        <div className="family__body">
          <p className="family__kicker">{featured.kicker}</p>
          <h2>{featured.name}</h2>
          <p className="family__tag">{featured.tagline}</p>
          <p>{featured.description}</p>
          <ul>
            {featured.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <span className="family__go">Open studio</span>
        </div>
      </button>

      <div className="gallery__grid">
        {full.map((family) => (
          <FamilyCard key={family.id} family={family} onPick={onPick} />
        ))}
      </div>
      <div className="gallery__grid gallery__grid--three">
        {stubs.map((family) => (
          <FamilyCard key={family.id} family={family} onPick={onPick} />
        ))}
      </div>
    </div>
  );
}
