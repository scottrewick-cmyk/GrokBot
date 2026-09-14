import type { BriefInput, CannedExample } from "../types";

export const SHOWER_FORM: BriefInput = {
  productName: "AquaLume Filtered Shower Head",
  audience: "Smart, research-heavy people who already buy organic",
  primaryPain: "Chlorine and hard water wrecking hair, skin, and the 'I'm clean' feeling",
  points: [
    "You already filter the glass — you forgot the 10-minute cloud",
    "Chlorine is a disinfectant. Your hair is not a kitchen counter",
    "Hard water is why the expensive shampoo 'stopped working'",
    "What a real shower filter actually catches",
    "The 14-day hair test people screenshot in group chats",
    "Install is embarrassingly easy. That's the point",
    "Why this became the first swap in households that research everything",
  ],
  cta: "Switch my shower — 30-second install",
  price: "$47",
};

export const KNEE_FORM: BriefInput = {
  productName: "Kinora Warm-Compress Knee Wrap",
  audience: "Grandmas — and the daughters who buy for them",
  primaryPain: "Morning stiffness, stairs, and 'I'm fine' while rationing the day",
  points: [
    "She's not dramatic. She's rationing the stairs",
    "Weather days are a family calendar now",
    "Why 'just rest it' is how grandmas disappear from the kitchen",
    "Heat + compression without a lecture from a specialist",
    "The Sunday-sauce test: can she stand through it?",
    "Daughters buy it. Grandmas pretend they didn't need it",
    "90 days to try it before anyone has to be 'right'",
  ],
  cta: "Get Grandma moving — 90-day trial",
  price: "$39",
};

export const EXAMPLES: CannedExample[] = [
  {
    id: "shower",
    label: "Filtered shower",
    blurb: "Smart people switching — chlorine / hard water / identity-gap",
    form: SHOWER_FORM,
  },
  {
    id: "knee",
    label: "Knee relief",
    blurb: "Grandma angle — stairs, stiffness, Sunday sauce",
    form: KNEE_FORM,
  },
];
