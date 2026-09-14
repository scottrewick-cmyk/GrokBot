import type {
  AnalysisResult,
  PainPhrase,
  PersonaSignal,
  ReviewItem,
  ThemeHit,
  UrgencySignal,
} from "../types";
import { parseReviews, wordCount } from "./parseReviews";
import { buildAngles } from "./generateCopy";

interface ThemeDef {
  id: string;
  label: string;
  uniqueness: number;
  keywords: string[];
}

const THEMES: ThemeDef[] = [
  {
    id: "night-nerve",
    label: "Night nerve buzzing",
    uniqueness: 1.35,
    keywords: [
      "sleep",
      "night",
      "2am",
      "3am",
      "buzz",
      "buzzing",
      "tingle",
      "tingling",
      "electric",
      "crawling",
      "sheets",
      "insomnia",
      "wake",
      "twitch",
      "moan",
      "heating pad",
      "side sleeper",
      "ants",
    ],
  },
  {
    id: "dignity",
    label: "Small-task dignity",
    uniqueness: 1.42,
    keywords: [
      "socks",
      "shoes",
      "stairs",
      "get up",
      "getting up",
      "floor",
      "husband had to",
      "help me",
      "burden",
      "independent",
      "dignity",
      "put my own",
      "couldn't get up",
      "could not get up",
      "laundry",
      "bedroom downstairs",
    ],
  },
  {
    id: "identity",
    label: "Grandkids / lost identity",
    uniqueness: 1.38,
    keywords: [
      "grand",
      "granddaughter",
      "grandma",
      "tea party",
      "hiking",
      "used to be",
      "personality",
      "pickleball",
      "golf",
      "social",
      "canceled",
      "there she is",
      "who i am",
      "pew",
      "tulips",
      "gardening",
    ],
  },
  {
    id: "dismissed",
    label: "Told it's 'just aging'",
    uniqueness: 1.32,
    keywords: [
      "aging",
      "getting old",
      "just old",
      "doctor",
      "orthoped",
      "dismiss",
      "patted",
      "stupid",
      "dramatic",
      "crazy",
      "6 minutes",
      "that's aging",
      "lose weight",
    ],
  },
  {
    id: "failed-meds",
    label: "Failed pills, shots, creams",
    uniqueness: 1.22,
    keywords: [
      "aleve",
      "ibuprofen",
      "nsaid",
      "stomach",
      "cortisone",
      "injection",
      "shot",
      "cream",
      "brace",
      "pt",
      "physical therapy",
      "fog",
      "painkiller",
      "painkillers",
      "pharmacist",
    ],
  },
  {
    id: "occupational",
    label: "On-your-feet work",
    uniqueness: 1.18,
    keywords: [
      "shift",
      "concrete",
      "warehouse",
      "nurse",
      "12-hour",
      "10-hour",
      "stand",
      "standing",
      "time clock",
      "parking garage",
      "supply closet",
      "on your feet",
      "on my feet",
    ],
  },
  {
    id: "weather",
    label: "Weather / barometer flares",
    uniqueness: 1.15,
    keywords: [
      "rain",
      "barometric",
      "pressure",
      "weather",
      "storm",
      "swell",
      "flare",
      "predict",
    ],
  },
  {
    id: "nerve-vs-joint",
    label: "Nerve, not 'just joints'",
    uniqueness: 1.4,
    keywords: [
      "nerve",
      "electric",
      "burning",
      "wires",
      "crawling",
      "not arthritis",
      "doesn't feel like",
      "does not feel",
      "ants",
      "pins-and-needles",
      "pins and needles",
      "buzzing",
    ],
  },
  {
    id: "mobility-trap",
    label: "Locks, cars, standing-sitting",
    uniqueness: 1.12,
    keywords: [
      "car",
      "locked",
      "locks",
      "rest stop",
      "drive",
      "church",
      "hymn",
      "standing, sitting",
      "communion",
      "catch",
      "rusty",
      "backswing",
    ],
  },
];

const SENSATION = [
  "buzzing",
  "burning",
  "electric",
  "crawling",
  "tingling",
  "pins-and-needles",
  "hot coal",
  "cement",
  "rusty gate",
  "ants",
  "vibrating",
  "fire",
  "swollen",
  "catch",
  "locked",
  "twitch",
];

const LIMITATION = [
  "couldn't get up",
  "could not get up",
  "can't kneel",
  "couldn't kneel",
  "limping",
  "socks",
  "stairs",
  "canceled",
  "moving the bedroom",
  "sit on the floor",
  "give up golf",
  "supply closet",
];

const EMOTION = [
  "panic",
  "humiliation",
  "dignity",
  "burden",
  "stupid",
  "grief",
  "cried",
  "pity",
  "afraid",
  "scared",
  "dramatic",
  "old",
];

const FAILED_FIXES: { name: string; patterns: RegExp }[] = [
  { name: "NSAIDs / Aleve", patterns: /\b(aleve|ibuprofen|nsaid|advil|motrin)\b/i },
  { name: "Cortisone / injections", patterns: /\b(cortisone|injection|shot)\b/i },
  { name: "Creams & wraps", patterns: /\b(cream|brace|wrap)\b/i },
  { name: "PT", patterns: /\b(pt|physical therapy)\b/i },
  { name: "Painkiller fog", patterns: /\b(fog|painkiller|painkillers)\b/i },
];

const PERSONAS: { label: string; pattern: RegExp }[] = [
  { label: "Grandparents", pattern: /\b(grand(?:daughter|son|kids?|ma|pa)|hiking grandma)\b/i },
  { label: "Women 55–75", pattern: /\b(i'?m a woman|sister|wife said|my daughter)\b/i },
  { label: "Shift workers on concrete", pattern: /\b(warehouse|concrete|shift|nurse|12-hour|10-hour)\b/i },
  { label: "Golf / pickleball / church socials", pattern: /\b(golf|pickleball|church|pew|hymn)\b/i },
  { label: "NSAID-intolerant", pattern: /\b(stomach|nsaid|aleve|pharmacist)\b/i },
  { label: "People dismissed as 'just old'", pattern: /\b(aging|getting old|patted|dramatic|crazy)\b/i },
];

const URGENCY: { label: string; pattern: RegExp }[] = [
  {
    label: "House is shrinking (stairs / move)",
    pattern: /\b(bedroom downstairs|movers|laundry stairs|house starts shrinking)\b/i,
  },
  {
    label: "Sleep is breaking",
    pattern: /\b(2am|3am|sleep|twitch|moan|insomnia|wrecked)\b/i,
  },
  {
    label: "Identity slipping this season",
    pattern: /\b(gave up|canceled|used to be|last thing|thanksgiving|tourist in my own)\b/i,
  },
  {
    label: "Dignity flashpoints",
    pattern: /\b(socks|burden|get up|living room|rest stop)\b/i,
  },
];

function normalize(text: string): string {
  return text.toLowerCase();
}

function countHits(text: string, keywords: string[]): { count: number; matched: string[] } {
  const n = normalize(text);
  const matched: string[] = [];
  let count = 0;
  for (const keyword of keywords) {
    const re = new RegExp(
      `\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "gi",
    );
    const hits = n.match(re);
    if (hits && hits.length) {
      count += hits.length;
      matched.push(keyword);
    }
  }
  return { count, matched };
}

function intensityFor(text: string): number {
  const n = normalize(text);
  let score = 0;
  const boosts = [
    "cried",
    "panic",
    "humiliation",
    "burden",
    "electric",
    "can't",
    "could not",
    "couldn't",
    "miracle",
    "wrecked",
    "tantrum",
    "dignity",
  ];
  for (const word of boosts) {
    if (n.includes(word)) score += 1.2;
  }
  if (n.includes("!")) score += 0.4;
  return score;
}

function bestQuotes(reviews: ReviewItem[], keywords: string[], limit = 3): string[] {
  const scored: { text: string; score: number }[] = [];
  for (const review of reviews) {
    for (const sentence of review.sentences) {
      const { count } = countHits(sentence, keywords);
      if (!count) continue;
      const score =
        count * 2 +
        intensityFor(sentence) +
        Math.min(sentence.length / 80, 2);
      scored.push({ text: trimQuote(sentence), score });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  const unique: string[] = [];
  for (const item of scored) {
    if (unique.some((q) => overlap(q, item.text))) continue;
    unique.push(item.text);
    if (unique.length >= limit) break;
  }
  return unique;
}

function trimQuote(text: string): string {
  const clipped = text.replace(/^["“']+|["”']+$/g, "").trim();
  return clipped.length > 180 ? `${clipped.slice(0, 177).trim()}…` : clipped;
}

function overlap(a: string, b: string): boolean {
  const left = a.toLowerCase().slice(0, 48);
  return b.toLowerCase().includes(left);
}

function phraseCounts(
  reviews: ReviewItem[],
  dictionary: string[],
  category: PainPhrase["category"],
): PainPhrase[] {
  const map = new Map<string, number>();
  const blob = reviews.map((r) => r.text).join("\n");
  for (const phrase of dictionary) {
    const re = new RegExp(
      phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "gi",
    );
    const hits = blob.match(re);
    if (hits?.length) map.set(phrase, hits.length);
  }
  return [...map.entries()]
    .map(([phrase, count]) => ({ phrase, count, category }))
    .sort((a, b) => b.count - a.count);
}

function collectPersonas(reviews: ReviewItem[]): PersonaSignal[] {
  return PERSONAS.map((persona) => {
    const examples: string[] = [];
    let count = 0;
    for (const review of reviews) {
      const hits = review.text.match(persona.pattern);
      if (hits) {
        count += hits.length;
        const sentence =
          review.sentences.find((s) => persona.pattern.test(s)) ??
          review.text.slice(0, 120);
        examples.push(trimQuote(sentence));
      }
    }
    return { label: persona.label, count, examples: examples.slice(0, 2) };
  })
    .filter((p) => p.count > 0)
    .sort((a, b) => b.count - a.count);
}

function collectUrgency(reviews: ReviewItem[]): UrgencySignal[] {
  return URGENCY.map((signal) => {
    const quotes: string[] = [];
    let count = 0;
    for (const review of reviews) {
      if (signal.pattern.test(review.text)) {
        count += 1;
        const sentence =
          review.sentences.find((s) => signal.pattern.test(s)) ??
          review.text.slice(0, 140);
        quotes.push(trimQuote(sentence));
      }
    }
    return { label: signal.label, count, quotes: quotes.slice(0, 2) };
  })
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);
}

export function analyzeReviews(
  productName: string,
  rawReviews: string,
): AnalysisResult {
  const reviews = parseReviews(rawReviews);
  const blob = reviews.map((r) => r.text).join("\n");

  const themes: ThemeHit[] = THEMES.map((theme) => {
    const { count, matched } = countHits(blob, theme.keywords);
    const reviewIds = reviews
      .filter((review) => countHits(review.text, theme.keywords).count > 0)
      .map((review) => review.id);
    const intensity =
      reviews.reduce((sum, review) => {
        const hits = countHits(review.text, theme.keywords).count;
        return hits ? sum + intensityFor(review.text) : sum;
      }, 0) / Math.max(reviewIds.length, 1);
    const score =
      (reviewIds.length * 2.4 + count * 0.8 + intensity * 1.1) *
      theme.uniqueness;
    return {
      id: theme.id,
      label: theme.label,
      mentions: count,
      intensity: Number(intensity.toFixed(2)),
      uniqueness: theme.uniqueness,
      score: Number(score.toFixed(2)),
      keywords: [...new Set(matched)].slice(0, 8),
      quotes: bestQuotes(reviews, theme.keywords),
      reviewIds,
    };
  })
    .filter((theme) => theme.reviewIds.length > 0)
    .sort((a, b) => b.score - a.score);

  const failedSolutions = FAILED_FIXES.map((fix) => ({
    name: fix.name,
    count: (blob.match(new RegExp(fix.patterns, "gi")) || []).length,
  }))
    .filter((fix) => fix.count > 0)
    .sort((a, b) => b.count - a.count);

  const painLanguage = [
    ...phraseCounts(reviews, SENSATION, "sensation"),
    ...phraseCounts(reviews, LIMITATION, "limitation"),
    ...phraseCounts(reviews, EMOTION, "emotion"),
  ]
    .sort((a, b) => b.count - a.count)
    .slice(0, 16);

  const result: AnalysisResult = {
    productName: productName.trim() || "Untitled product",
    reviewCount: reviews.length,
    wordCount: wordCount(rawReviews),
    themes,
    painLanguage,
    urgency: collectUrgency(reviews),
    whoItsFor: collectPersonas(reviews),
    failedSolutions,
    angles: [],
    source: "heuristic",
    generatedAt: new Date().toISOString(),
  };

  result.angles = buildAngles(result, reviews);
  return result;
}
