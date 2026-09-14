export type Category = "water" | "wellness" | "generic";

export interface BriefInput {
  productName: string;
  audience: string;
  primaryPain: string;
  points: string[];
  cta: string;
  price: string;
}

export interface SocialProof {
  rating: string;
  reviewCount: string;
  buyersToday: string;
  claim: string;
  outlets: string[];
}

export interface ListicleReason {
  number: number;
  title: string;
  body: string;
  imageLabel: string;
  imageCaption: string;
  callout?: string;
}

export interface Testimonial {
  name: string;
  tag: string;
  quote: string;
  stars: number;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface GeneratedLander {
  category: Category;
  kicker: string;
  headline: string;
  subhead: string;
  byline: string;
  date: string;
  readTime: string;
  intro: string[];
  painBuzzwords: string[];
  identityGap: string;
  socialProof: SocialProof;
  reasons: ListicleReason[];
  midCta: string;
  testimonials: Testimonial[];
  guarantee: string;
  faq: FaqItem[];
  cta: {
    primary: string;
    sub: string;
    urgency: string;
    price: string;
  };
  accent: string;
}

export interface CannedExample {
  id: string;
  label: string;
  blurb: string;
  form: BriefInput;
}
