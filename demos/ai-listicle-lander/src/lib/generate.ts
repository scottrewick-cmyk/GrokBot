import type {
  BriefInput,
  Category,
  FaqItem,
  GeneratedLander,
  ListicleReason,
  Testimonial,
} from "../types";

const MONTH = "September 14, 2026";

function norm(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(seed: string, items: T[]): T {
  return items[hash(seed) % items.length];
}

export function detectCategory(form: BriefInput): Category {
  const blob = `${form.productName} ${form.primaryPain} ${form.points.join(" ")}`.toLowerCase();
  if (
    /shower|filter|chlorine|hard water|hair|scalp|tap water|fluoride|limescale/.test(blob)
  ) {
    return "water";
  }
  if (
    /knee|joint|grandma|stiff|arthritis|wrap|pain|stairs|inflammation|compress/.test(blob)
  ) {
    return "wellness";
  }
  return "generic";
}

function firstName(audience: string, category: Category) {
  if (category === "water") return pick(audience, ["Maya Chen", "Priya Shah", "Elena Brooks"]);
  if (category === "wellness") return pick(audience, ["Ruth Alvarez", "Diane Cole", "Helen Park"]);
  return pick(audience, ["Jordan Hale", "Sam Ortiz", "Casey Nguyen"]);
}

function role(category: Category) {
  if (category === "water") return "Home Lab Editor";
  if (category === "wellness") return "Family Care Desk";
  return "DTC Briefing Editor";
}

function buzzwords(form: BriefInput, category: Category): string[] {
  const pain = form.primaryPain;
  const extracted = pain
    .split(/[,/]| and | \+ /i)
    .map((part) =>
      part
        .replace(/['"']/g, "")
        .replace(/\b(the|a|an|to|of|for|with|your|you|that|this|are|is)\b/gi, "")
        .trim(),
    )
    .filter((part) => part.length > 2 && part.length < 28)
    .slice(0, 4)
    .map((part) => part.toUpperCase());

  const extras =
    category === "water"
      ? ["CHLORINE", "HARD WATER", "DULL HAIR", "ITCHY SCALP", '"I FILTER MY TAP"']
      : category === "wellness"
        ? ["STAIRS", "MORNING STIFFNESS", '"I\'M FINE"', "GRANDKIDS", "WEATHER DAYS"]
        : ["THE OLD WAY", "WORKAROUND", "QUIET QUIT", "SWITCHERS"];

  const merged = [...extracted, ...extras];
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const item of merged) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
    if (unique.length === 5) break;
  }
  return unique;
}

function formatReviews(seed: string) {
  const n = 8000 + (hash(seed) % 9000);
  return n.toLocaleString("en-US");
}

function buyersToday(seed: string) {
  return String(120 + (hash(`${seed}-buy`) % 480));
}

function rating(seed: string) {
  const tenths = 84 + (hash(`${seed}-rate`) % 12);
  return (tenths / 10).toFixed(1);
}

export function suggestPoints(form: BriefInput): string[] {
  const category = detectCategory(form);
  const product = norm(form.productName) || "this product";
  const pain = norm(form.primaryPain) || "the old workaround";
  const audience = norm(form.audience) || "people who care";

  if (category === "water") {
    return [
      `You already filter the glass — you forgot the 10-minute cloud`,
      `Chlorine is a disinfectant. Your hair is not a kitchen counter`,
      `Hard water is why the expensive shampoo "stopped working"`,
      `What ${product} actually catches that a pitcher never will`,
      `The 14-day hair test people screenshot in group chats`,
      `Install is embarrassingly easy. That's the point`,
      `Why ${audience.toLowerCase()} made this the first swap`,
    ];
  }

  if (category === "wellness") {
    return [
      `She's not dramatic. She's rationing the stairs`,
      `Weather days are a family calendar now`,
      `Why "just rest it" is how people disappear from the kitchen`,
      `Heat + compression without a specialist lecture`,
      `The Sunday-sauce test: can she stand through it?`,
      `Daughters buy it. Grandmas pretend they didn't need it`,
      `90 days to try ${product} before anyone has to be "right"`,
    ];
  }

  return [
    `The identity gap: ${audience.toLowerCase()} already optimized everything except this`,
    `What ${pain.toLowerCase()} is actually costing in the background`,
    `Why the cheap version of the old fix makes it worse`,
    `What ${product} does in the first 14 days (the screenshot-able part)`,
    `The boring reason it sticks: it doesn't ask for a new personality`,
    `What switchers tell the group chat after week two`,
    `The no-lecture, money-back way to try it`,
  ];
}

const CANNED_BODIES: Record<string, string> = {
  "You already filter the glass — you forgot the 10-minute cloud":
    "The pitcher lives on the counter like a trophy. The shower is ten minutes of the same municipal water, heated, aerosolized, and run through your hair. Smart-household energy with a blind spot the size of a stall.",
  "Chlorine is a disinfectant. Your hair is not a kitchen counter":
    "Chlorine is good at killing what you don't want in a pipe. It is not a conditioner. If your ends feel like straw by Wednesday, that is not 'your hair type suddenly changing.' That is a chemistry problem you can swap in 30 seconds.",
  "Hard water is why the expensive shampoo 'stopped working'":
    "Minerals don't care that the bottle cost $38. They bind to the strand, dull the color, and make every product feel like a scam. People switch shampoos. The households in this briefing switched the water.",
  "What a real shower filter actually catches":
    "This is the cutaway beat. Sediment, chlorine taste/odor chemistry, the scale that films the glass door. Don't hand-wave 'toxins.' Name the job. AquaLume is a shower-rated cartridge, not a kitchen leftover on a hose.",
  "The 14-day hair test people screenshot in group chats":
    "Not a celebrity before/after. A bathroom mirror on day 1 and day 14, same lighting, no ring light. The screenshot is the ad. If you only have budget for one UGC slot, this is it.",
  "Install is embarrassingly easy. That's the point":
    "If it needs a plumber, this lander dies. Wrist-twist onto the arm that's already there. The demo should show hands, not a lifestyle couple laughing in marble.",
  "Why this became the first swap in households that research everything":
    "They already did the mattress, the olive oil, the air purifier. The shower was the last un-optimized room. That's the identity gap: you are the kind of person who would have done this already — you just didn't look up.",
  "She's not dramatic. She's rationing the stairs":
    "Watch the third stair. The hand that finds the rail like it's always been there. Grandmas will not fill out a pain diary. They will quietly shrink the house until the kitchen is the whole map.",
  "Weather days are a family calendar now":
    "Rain is not the story. The barometer is. If the family already knows which mornings she 'takes it slow,' you are late to the product and early to the lander.",
  "Why 'just rest it' is how grandmas disappear from the kitchen":
    "Rest is how Sunday sauce becomes takeout. The goal is not a marathon. The goal is standing through a thing she still wants to be in charge of.",
  "Heat + compression without a lecture from a specialist":
    "She will not go to the appointment you booked. She will wear a wrap that looks like clothing. Kinora is a warm-compress layer, not a diagnosis, not a daring medical claim, not a Facebook-ban waiting to happen.",
  "The Sunday-sauce test: can she stand through it?":
    "Put the photo in steam, wooden spoon, cardigan over the wrap. If she lasts the pot, the lander has done its job. That is a better KPI than a pain scale.",
  "Daughters buy it. Grandmas pretend they didn't need it":
    "The buyer and the wearer are not the same person. Sell the daughter the dignity, not the decline. The review you want is: she said she didn't need it, and she had it on for Sunday sauce.",
  "90 days to try it before anyone has to be 'right'":
    "The trial is the sentence in the card. Nobody has to win the argument. If it lives in the drawer, it comes back. Put this next to the button, not in a policy link.",
};

function expandReason(
  title: string,
  index: number,
  form: BriefInput,
  category: Category,
): ListicleReason {
  const product = form.productName;
  const pain = form.primaryPain;
  const audience = form.audience;
  const imageSets: Record<Category, { label: string; caption: string }[]> = {
    water: [
      { label: "HERO · unfiltered vs filtered stream", caption: "Side-by-side water stream. Leave room for before/after minerals." },
      { label: "MACRO · hair after city water", caption: "Close crop of dull ends. Not a glam shot — a 'receipt' shot." },
      { label: "PRODUCT · cartridge cutaway", caption: "Exploded filter layers. Label KDF / calcium sulfite / sediment." },
      { label: "UGC · 14-day hair selfie", caption: "Bathroom mirror, no ring light. Group-chat energy." },
      { label: "INSTALL · wrist-twist on existing arm", caption: "Hands only, 30-second swap. No plumber, no tools." },
      { label: "LIFESTYLE · 'already organic' kitchen", caption: "Filtered pitcher in frame. The identity-gap punchline." },
      { label: "PACK SHOT · box + shower chrome", caption: "Retail-ready. Keep negative space for price callout." },
    ],
    wellness: [
      { label: "HERO · stairs, one hand on the rail", caption: "Not a medical diagram. A real staircase, mid-morning light." },
      { label: "DETAIL · wrap on at the table", caption: "Coffee, crossword, wrap visible. Dignity, not disability." },
      { label: "PRODUCT · heat + compression layers", caption: "Call out the pocket, the strap, the washable cover." },
      { label: "FAMILY · daughter dropping it off", caption: "Doorway hug. Product in a paper bag — not a hospital vibe." },
      { label: "TEST · standing through Sunday sauce", caption: "Kitchen steam, wooden spoon, wrap under a cardigan." },
      { label: "UGC · 'I didn't think I needed this'", caption: "Grandma quote over a simple portrait. No stock smile." },
      { label: "PACK SHOT · gift-ready box", caption: "The daughter-purchase shot. Fits in a tote." },
    ],
    generic: [
      { label: "HERO · the old way, mid-workaround", caption: "Show the pain without the grimace. Specific > cinematic." },
      { label: "MACRO · the ugly detail", caption: "The residue / strap mark / leftover of the old fix." },
      { label: "CUTAWAY · why this one is different", caption: "One mechanism, labeled. No feature laundry list." },
      { label: "DAY 14 · the first noticeable change", caption: "UGC crop. Screenshot energy, not campaign energy." },
      { label: "RITUAL · how it fits a Tuesday", caption: "30 seconds, existing routine, no new personality." },
      { label: "SOCIAL · group chat quote", caption: "Text-style overlay. Keep it readable on mobile." },
      { label: "PACK SHOT · DTC hero", caption: "Box + product + negative space for the sticky CTA." },
    ],
  };

  const visual = imageSets[category][index] ?? imageSets.generic[index % 7];

  const bodies: string[] = [
    `${audience} will spend an afternoon researching olive oil, mattresses, air purifiers — then live with ${pain.toLowerCase()} like it's weather. ${product} is the unglamorous swap that closes that gap.`,
    `The old fix treats the symptom you can screenshot. ${pain} is the one you stop mentioning because everyone already offered advice. This section is the 'actually, here's the mechanism' beat — keep it concrete, not clinical.`,
    `Cheap alternatives usually copy the silhouette and skip the part that does the work. If ${product} has one sentence of proof, put it here: materials, time-to-relief, or the thing you can feel before you believe the reviews.`,
    `Day 14 is when ${audience.toLowerCase()} send the photo. Not because it's dramatic — because it's the first time the old complaint isn't the first thing they notice. Write to that quiet delta.`,
    `If it takes a lifestyle overhaul, it will die in the drawer. The winning listicle beat is: ${product} sits on top of a routine that already exists. No new identity required.`,
    `Switchers don't write essays. They write one line in the group chat. Harvest that tone: slightly smug, slightly relieved, never infomercial.`,
    `Risk reversal belongs near the end: a real window to try it, a human return, and a CTA that sounds like a decision — not a funnel. ${form.cta}`,
  ];

  return {
    number: index + 1,
    title,
    body: CANNED_BODIES[title] ?? bodies[index] ?? bodies[0],
    imageLabel: visual.label,
    imageCaption: visual.caption,
    callout:
      index === 2
        ? "Keep this section visual. Meta traffic bounces if reason 3 is a wall of text."
        : undefined,
  };
}

function testimonials(form: BriefInput, category: Category): Testimonial[] {
  if (category === "water") {
    return [
      {
        name: "Alicia K.",
        tag: "Verified buyer · 3 weeks",
        quote:
          "I filter my drinking water like it's a personality. Never occurred to me I was steaming chlorine into my hair every morning. The group-chat photos after week two were rude.",
        stars: 5,
      },
      {
        name: "Dev P.",
        tag: "Verified buyer · 6 weeks",
        quote:
          "Install was actually 30 seconds. I hate when brands say that. Hair feels like the expensive salon water without the salon.",
        stars: 5,
      },
      {
        name: "Nora S.",
        tag: "Verified buyer · 2 months",
        quote:
          "Hard-water film on the glass door is gone. That was the accidental proof. Hair was the reason I bought it.",
        stars: 5,
      },
    ];
  }
  if (category === "wellness") {
    return [
      {
        name: "Marisol T.",
        tag: "Bought for Mom · 1 month",
        quote:
          "She said she didn't need it. She had it on for Sunday sauce. That's the whole review.",
        stars: 5,
      },
      {
        name: "Helen P.",
        tag: "Verified buyer · 5 weeks",
        quote:
          "Stairs are still stairs. I just don't budget them like a bank account anymore. The heat is the part I didn't know I'd care about.",
        stars: 5,
      },
      {
        name: "June R.",
        tag: "Bought for Grandma · 3 weeks",
        quote:
          "Looks like a normal wrap, not medical equipment. That mattered more than I expected. She'll wear it in the living room.",
        stars: 4,
      },
    ];
  }
  return [
    {
      name: "Chris M.",
      tag: "Verified buyer · 18 days",
      quote: `I delayed this because ${form.primaryPain.toLowerCase()} felt like 'just how it is.' It isn't. Wish the lander had been less polite about that.`,
      stars: 5,
    },
    {
      name: "Rae L.",
      tag: "Verified buyer · 1 month",
      quote: `${form.productName} didn't ask me to become a different person. That's why it's still on the counter.`,
      stars: 5,
    },
    {
      name: "Owen J.",
      tag: "Verified buyer · 2 months",
      quote: "Bought it after the numbered reasons, which I usually skip. Reason 4 was the screenshot.",
      stars: 4,
    },
  ];
}

function faq(form: BriefInput, category: Category): FaqItem[] {
  if (category === "water") {
    return [
      {
        q: "Is this just a pitcher filter on a hose?",
        a: "No. Pitchers are built for a glass. A shower filter has to handle heat, flow, and a 10-minute exposure. AquaLume is a shower-rated cartridge — not a kitchen leftover.",
      },
      {
        q: "Will it kill my water pressure?",
        a: "The lander should show a pressure GIF here. Copy: designed to keep a real shower, not a mist. If pressure is a regional issue, say so in the caption — don't hide it.",
      },
      {
        q: "How often do I replace the cartridge?",
        a: "Call out a simple interval (e.g. ~3 months / household average) and make the refill a one-click Shopify subscription in the real store — not in this demo.",
      },
    ];
  }
  if (category === "wellness") {
    return [
      {
        q: "Is this a medical device?",
        a: "No — and the lander should never imply it is. Kinora is a warm-compress wrap for everyday stiffness. If she has a diagnosis, that's a conversation with her clinician, not a Facebook ad.",
      },
      {
        q: "Will Grandma actually wear it?",
        a: "That's why the photos matter: it has to look like clothing, not equipment. If the strap is fussy, she will 'forget' it in the drawer. Demo this in reason 6.",
      },
      {
        q: "Can I gift it without making it a whole thing?",
        a: "Yes. The pack shot is the gift shot. The 90-day trial is the sentence you put in the card so nobody has to be right.",
      },
    ];
  }
  return [
    {
      q: `Does ${form.productName} replace everything else I've tried?`,
      a: "Position it as the missing piece, not a personality transplant. Listicles convert when they respect the old workaround.",
    },
    {
      q: "How fast will I notice anything?",
      a: "Pick one observable (day 1 feel vs day 14 look). Don't promise both in the same sentence.",
    },
    {
      q: "What if it isn't for me?",
      a: form.cta.includes("trial")
        ? "Lean on the trial window in the sticky bar. Don't bury returns in a footer link."
        : "State the return window next to the button. Meta traffic will not hunt for a policy page.",
    },
  ];
}

function headlineFor(form: BriefInput, category: Category) {
  const product = form.productName;
  if (category === "water") {
    return "Why smart people are quietly switching their shower heads";
  }
  if (category === "wellness") {
    return `Grandmas who still “just push through” knee pain are missing this ${form.price} wrap`;
  }
  return `Why ${form.audience.toLowerCase()} are quietly switching to ${product}`;
}

function subheadFor(form: BriefInput, category: Category) {
  if (category === "water") {
    return "They'll debate olive oil for 40 minutes. Then stand in unfiltered city water for 10. The identity gap is the shower.";
  }
  if (category === "wellness") {
    return "She's not dramatic. She's rationing the stairs so she can still make the Sunday sauce. Heat + compression, without a prescription lecture.";
  }
  return `${form.audience} already optimized the obvious stuff. ${form.primaryPain} is the thing they stopped mentioning. ${form.productName} is the unglamorous close.`;
}

function identityGap(form: BriefInput, category: Category) {
  if (category === "water") {
    return "You buy the organic produce. You own the pitcher. You still take a chlorine shower. That's the gap the ad should make feel slightly embarrassing — then solvable in 30 seconds.";
  }
  if (category === "wellness") {
    return "She will not fill out a pain diary. She will not 'advocate for herself' on hold. She will stand through the sauce if the wrap is already in the house. Sell the daughter. Respect the grandma.";
  }
  return `The buyer already believes they're the kind of person who would have fixed ${form.primaryPain.toLowerCase()} by now. Your headline should name that identity — then show the one place they skipped.`;
}

function introFor(form: BriefInput, category: Category): string[] {
  if (category === "water") {
    return [
      "There's a particular kind of person who can tell you the PPM of their tap water, the origin of their olive oil, and why they switched mattresses twice. Then they get in the shower like the municipal plant is a spa.",
      "This is not a lecture about 'toxins.' It's a 7-point briefing on why chlorine and hard-water minerals are the most expensive hair products you didn't mean to buy — and why a filtered shower head is the unglamorous swap happening in kitchens that already had the pitcher.",
    ];
  }
  if (category === "wellness") {
    return [
      "If you ask her about the knee, she will change the subject to the grandchildren. If you watch the morning, you will see the pause at the third stair, the hand that finds the rail like it's always been there, the weather report that is actually a pain report.",
      "This page is for the daughter who is done having the argument, and for the grandma who will only accept help if it doesn't look like help. Seven reasons the Kinora wrap is showing up in tote bags this month — none of them are 'you're getting old.'",
    ];
  }
  return [
    `${form.audience} are not unaware of ${form.primaryPain.toLowerCase()}. They're fluent in it. They've tried the cheap version, the internet trick, the thing a friend swore by. What they haven't done is treat this like the other upgrades they already made.`,
    `${form.productName} is written here as a listicle because Meta traffic does not want a brand story. They want numbered reasons, a photo they can believe, and a button that doesn't feel like a trap.`,
  ];
}

function kicker(category: Category) {
  if (category === "water") return "HOME LAB · READER BRIEFING";
  if (category === "wellness") return "FAMILY CARE · READER BRIEFING";
  return "DTC BRIEFING · READER FAVORITE";
}

function guarantee(form: BriefInput, category: Category) {
  if (category === "water") {
    return "60-day look-in-the-mirror guarantee. If your hair doesn't feel like the expensive salon water, send it back. We don't need a TED Talk about it.";
  }
  if (category === "wellness") {
    return "90-day walk-without-budgeting-the-stairs trial. If it lives in the drawer, it comes back. No family meeting required.";
  }
  return `Try ${form.productName} in the real routine for 60 days. If it isn't the missing piece, return it. Keep the lander honest — this line sits next to the button, not in a footer.`;
}

function outlets(category: Category) {
  if (category === "water") return ["Wellness Edit", "Home Lab Daily", "Skin Forum"];
  if (category === "wellness") return ["Sunday Kitchen", "Family Desk", "Porch Light"];
  return ["Checkout Notes", "The Cart Brief", "Direct Line"];
}

function accent(category: Category) {
  if (category === "water") return "#0f6e73";
  if (category === "wellness") return "#9a3b2f";
  return "#8a6a1f";
}

export function generateLander(input: BriefInput): GeneratedLander {
  const form: BriefInput = {
    productName: norm(input.productName) || "Untitled Product",
    audience: norm(input.audience) || "people who already optimize everything else",
    primaryPain: norm(input.primaryPain) || "the workaround they stopped mentioning",
    points: input.points.map(norm).filter(Boolean),
    cta: norm(input.cta) || "Get it while the lander is honest",
    price: norm(input.price) || "$49",
  };

  const category = detectCategory(form);
  const titles = (form.points.length >= 5 ? form.points : suggestPoints(form)).slice(0, 7);
  while (titles.length < 5) {
    titles.push(...suggestPoints(form).slice(titles.length));
  }
  const reasons = titles.slice(0, 7).map((title, index) => expandReason(title, index, form, category));
  const seed = `${form.productName}|${form.audience}`;

  return {
    category,
    kicker: kicker(category),
    headline: headlineFor(form, category),
    subhead: subheadFor(form, category),
    byline: `By ${firstName(form.audience, category)}, ${role(category)}`,
    date: MONTH,
    readTime: `${4 + (reasons.length % 3)} min read`,
    intro: introFor(form, category),
    painBuzzwords: buzzwords(form, category),
    identityGap: identityGap(form, category),
    socialProof: {
      rating: rating(seed),
      reviewCount: formatReviews(seed),
      buyersToday: buyersToday(seed),
      claim:
        category === "water"
          ? "Households that already own a pitcher"
          : category === "wellness"
            ? "Bought by daughters, worn by grandmas"
            : `Switchers from the old ${form.primaryPain.split(" ")[0].toLowerCase()} fix`,
      outlets: outlets(category),
    },
    reasons,
    midCta: form.cta,
    testimonials: testimonials(form, category),
    guarantee: guarantee(form, category),
    faq: faq(form, category),
    cta: {
      primary: form.cta,
      sub:
        category === "water"
          ? "Fits the arm you already have. No plumber."
          : category === "wellness"
            ? "Gift-ready. Looks like clothing, not equipment."
            : "Ships from the demo warehouse of your imagination.",
      urgency: `${buyersToday(seed)} claimed this offer in the last 24 hours`,
      price: form.price,
    },
    accent: accent(category),
  };
}
