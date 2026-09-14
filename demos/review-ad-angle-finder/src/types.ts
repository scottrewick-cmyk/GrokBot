export type EngineSource = "heuristic" | "openai" | "openai-client";

export interface ReviewItem {
  id: string;
  text: string;
  sentences: string[];
}

export interface ThemeHit {
  id: string;
  label: string;
  mentions: number;
  intensity: number;
  uniqueness: number;
  score: number;
  keywords: string[];
  quotes: string[];
  reviewIds: string[];
}

export interface PainPhrase {
  phrase: string;
  count: number;
  category: "sensation" | "limitation" | "emotion" | "failed-fix";
}

export interface PersonaSignal {
  label: string;
  count: number;
  examples: string[];
}

export interface UrgencySignal {
  label: string;
  count: number;
  quotes: string[];
}

export interface AdAngle {
  id: string;
  rank: number;
  title: string;
  score: number;
  themeId: string;
  themeLabel: string;
  painInsight: string;
  whyItMightConvert: string;
  primaryTexts: [string, string, string];
  headline: string;
  advertorialHook: string;
  evidence: {
    mentionCount: number;
    intensity: number;
    sampleQuotes: string[];
    personas: string[];
  };
  tags: string[];
}

export interface AnalysisResult {
  productName: string;
  reviewCount: number;
  wordCount: number;
  themes: ThemeHit[];
  painLanguage: PainPhrase[];
  urgency: UrgencySignal[];
  whoItsFor: PersonaSignal[];
  failedSolutions: { name: string; count: number }[];
  angles: AdAngle[];
  source: EngineSource;
  generatedAt: string;
}

export type ScanStage =
  | "idle"
  | "parsing"
  | "clustering"
  | "scoring"
  | "writing"
  | "done";
