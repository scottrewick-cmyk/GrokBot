function firstNameOf(expertName) {
  const withoutCreds = expertName.split(",")[0].trim();
  return withoutCreds.split(/\s+/)[0] || "Margaret";
}

export function createBrief({
  productName = "Old World Relief",
  category = "knee comfort cream",
  expertName = "Margaret Hale, DPT",
} = {}) {
  const product = productName.trim() || "Old World Relief";
  const cat = category.trim() || "knee comfort cream";
  const expert = expertName.trim() || "Margaret Hale, DPT";
  const firstName = firstNameOf(expert);
  const catPlain = cat.replace(/\s+/g, " ");

  return {
    product,
    cat: catPlain,
    expert,
    firstName,
    year: 2026,
    expertTitle: "Physical therapist · former collegiate trainer",
    location: "Hudson Valley, NY",

    authorityEyebrow: "Field notes · a personal letter",
    authorityHeadline: `I tested every ${catPlain} I could get my hands on. I kept one tin.`,
    authorityDek: `An unglamorous aisle audit from a practitioner who does not fall for jars — and the quiet formula that survived it.`,
    authorityOpen: `I am not a person who falls for a cream. I am a person who falls for a protocol. Ice. Load management. Strength. Sleep. The unromantic work.\n\nAnd still: after a wet Saturday of assessments, my own right knee would announce itself on the stairs like a petty colleague.\n\nSo I did what I tell patients not to do. I went shopping.`,
    authorityTried: [
      {
        title: "The locker-room gel",
        body: "Cold, loud, gone in twenty minutes. Smells like a high school athletic train. Fine in a pinch. Not a companion.",
      },
      {
        title: "The $64 French name",
        body: "Heavy glass, a ribbon, a claim I will not repeat. My skin felt expensive. My stairs did not notice.",
      },
      {
        title: "The viral stick",
        body: "I bought it because a stranger on my phone had good lighting. I used it twice. It lives in a drawer now, with the other lighting.",
      },
    ],
    authorityTurn: `${product} showed up in a training room in a dented tin. No campaign. A strip of tape with a date. I rolled my eyes and used it anyway — because the trainer I trust does not collect mascots.`,
    authorityWhy: `What I kept coming back to was not a miracle. It was a ritual I would actually repeat: a small amount, warm hands, two quiet minutes before I loaded the joint. The tin did not try to replace strength work. It sat beside it.`,
    authorityProof: [
      { k: "14", v: "months of unscientific, very personal testing" },
      { k: "41", v: `formulas, gels, sticks, and “luxury” ${catPlain}s` },
      { k: "1", v: "tin that earned a permanent pocket in my bag" },
    ],
    authorityQuotes: [
      {
        quote: "She handed me the tin like it was tape. Not a speech. That’s how I knew it was real.",
        name: "Lena R.",
        role: "masters rower · fictional composite",
      },
      {
        quote: "I wanted a protocol, not a personality. This is the boring one I still use.",
        name: "James K.",
        role: "weekend trail cook · fictional composite",
      },
    ],
    authorityCta: `If you want the same tin I keep in the side pocket of my bag, it’s here. Use it as a ritual. Keep doing the real work. Talk to someone who knows your joints if the story is bigger than a cream.`,
    authorityPs: `P.S. I do not own ${product}. I am not paid to prefer it. This page is a marketing-format demonstration for a fictional offer.`,

    listHeadline: `Seven things I wish the ${catPlain} aisle had printed on the shelf talker`,
    listDek: `A field guide from ${expert} — numbered so you can skim, written so you don’t have to.`,
    listItems: [
      {
        n: "01",
        title: "Cold is not a personality.",
        body: `A menthol blast can be a useful interruption. It is not a relationship. If your ${catPlain} only “works” while it is shouting, it is a distraction, not a ritual.`,
      },
      {
        n: "02",
        title: "Packaging is not a protocol.",
        body: "Ribbon, glass, and a French definite article are design. Design is allowed. It is not evidence that the stairs will be kinder on Sunday.",
      },
      {
        n: "03",
        title: "If you will not repeat it, it does not exist.",
        body: "The best tin is the one that survives a Tuesday. Two minutes, warm hands, then load the joint. Anything more baroque will lose to your actual life.",
      },
      {
        n: "04",
        title: "Scent is a vote you cast every morning.",
        body: "Locker-room sharp, candle-shop sweet, or almost nothing. I vote for almost nothing. Your household should not have to participate in your knees.",
      },
      {
        n: "05",
        title: "The waiting room is not a strategy.",
        body: "Appointments matter. They are also slow. A cream is not a substitute for care — and care is not a substitute for the Tuesday you are living through.",
      },
      {
        n: "06",
        title: "Strangers with ring lights are not colleagues.",
        body: "I have bought the stick. I have owned the lighting. I still work in a clinic. Those are different jobs.",
      },
      {
        n: "07",
        title: `The one I kept is called ${product}.`,
        body: `Not because it won a laboratory. Because it was the ${catPlain} I reached for after I had already done the work. Dented tin. Quiet. Repeatable. That is the whole review.`,
      },
    ],

    storyKicker: "A Tuesday in March",
    storyHeadline: "The morning the downstairs landing won",
    storyDek: `${firstName} kept a notebook for patients and a second, smaller one for the stairs at home. This is the second notebook.`,
    storyGrafs: [
      `The rain had the particular Hudson Valley talent of making every wooden step feel like a negotiation. I had already packed the clinic bag. Coffee. The good socks. I put my right foot on the landing and the landing, politely, declined.`,
      `I sat down on the step like a person who had meant to sit down. This is a lie I am good at. In the clinic I would have called it a flare and asked about last week’s load. At home I called it “the weather” and waited for my pride to catch up.`,
      `I am a physical therapist. I know the sermon: strength, sleep, don’t bargain with inflammation as if it were a landlord. I also have a right knee that has been in the room for every assessment I have ever given. Hypocrisy is a kind of fieldwork.`,
      `At noon a trainer I trust — the sort who still writes dates on athletic tape — slid a dented tin across the bench. ${product}. No pitch. “It’s a ${catPlain}. Don’t make it a religion.” I did not make it a religion. I put it in the side pocket, next to the tape.`,
      `What changed was not cinematic. Tuesday stopped being a vote. I warmed a small amount between my hands, two minutes, then I loaded the joint the way I tell other people to. The stairs remained stairs. I remained a person who uses them.`,
      `I am not going to tell you this tin is the work. The work is still the work. But if you want the same quiet ${catPlain} I keep in that pocket, it is here, without a ring light.`,
    ],
    storyPull: "Don’t make it a religion.",

    newsDesk: "The Morning Wellness Desk",
    newsKicker: "Training rooms · a brief",
    newsHeadline: `Why a dented tin of ${catPlain} keeps showing up in serious gyms`,
    newsByline: `By the Desk · ${expert} (contributing note) · March 2026`,
    newsLead: `It does not look like a campaign. That, according to the trainers who pass it around, is the point. ${product} is a ${catPlain} in a tin that appears to have already lived a life.`,
    newsBody: `We asked a practitioner who does not endorse jars for a living to describe the fuss. ${firstName} declined to fuss. “I tested a small, embarrassing number of formulas. I kept one because I would actually use it on a Tuesday.” The Desk is not a clinic, and this is not advice. It is a format: reported tone, one product in a box, no countdown clock.`,
    newsBox: `${product} — a fictional ${catPlain} used in this kit to demonstrate a news-mimic lander. Quiet ritual. No miracle language.`,

    quizHeadline: `Find a ${catPlain} you might actually repeat`,
    quizDek: "Three questions. One recommendation. Not a diagnosis — a format.",
    quizQuestions: [
      {
        id: "where",
        prompt: "Where does the day argue with you?",
        options: [
          { id: "knees", label: "The stairs. Always the stairs." },
          { id: "else", label: "Somewhere else I am tired of naming." },
          { id: "general", label: "A general, unhelpful stiffness." },
        ],
      },
      {
        id: "tried",
        prompt: "What have you already given a fair chance?",
        options: [
          { id: "gel", label: "The cold gel from the pharmacy aisle." },
          { id: "wait", label: "Waiting — for weather, for an appointment." },
          { id: "ad", label: "Something a stranger on my phone suggested." },
        ],
      },
      {
        id: "want",
        prompt: "What do you want from a tin, honestly?",
        options: [
          { id: "quiet", label: "Quiet. Repeatable. No locker-room scent." },
          { id: "simple", label: "Something I will not forget how to use." },
          { id: "honest", label: "Not a personality. Just a companion to the work." },
        ],
      },
    ],
    quizResultTitle: `A hallway consult would have ended here: ${product}.`,
    quizResultBody: `Not because a quiz can know your joints. Because this kit is demonstrating an interactive lander — and the honest shape of that family is a few questions that resolve to one ${catPlain}, plus a reminder to keep the real work and real care in the room.`,

    compareHeadline: `Four ways people try to get through a stubborn ${catPlain} season`,
    compareDek: "A side-by-side for clients who think in tables. The house pick wins on ritual, not volume.",
    compareRows: [
      { label: "What it is", cells: ["Pharmacy cold gel", "Ice, wait, hope", "Mystery ad cream", product] },
      { label: "The ritual", cells: ["Twenty loud minutes", "A towel and a calendar", "A ring light and a code", "Two quiet minutes, then load"] },
      { label: "The scent", cells: ["Locker room", "Freezer", "Candle shop, usually", "Almost nothing"] },
      { label: "The honest catch", cells: ["Gone when the cold is gone", "Slow, and not a Tuesday plan", "You bought the lighting", "It is still just a cream"] },
      { label: "House note", cells: ["Fine in a pinch", "Care still matters", "Drawer, eventually", "The one that stayed in the bag"] },
    ],
    compareWinner: 3,

    ctaLabel: `See the ${product} tin`,
    ctaSub: "Fictional offer · demo checkout is not connected",
    disclaimer:
      "Marketing-format demonstration. Fictional product and composite quotes. Not medical advice, not a diagnosis, and not an offer for sale. If you have pain, speak with a licensed clinician.",
  };
}

export function getCopySections(familyId, brief) {
  const shared = [
    { id: "cta", label: "Primary CTA", text: brief.ctaLabel },
    { id: "disclaimer", label: "Disclaimer", text: brief.disclaimer },
  ];

  if (familyId === "authority") {
    return [
      { id: "h", label: "Headline", text: brief.authorityHeadline },
      { id: "dek", label: "Dek", text: brief.authorityDek },
      { id: "open", label: "Opening letter", text: brief.authorityOpen },
      { id: "turn", label: "The turn", text: brief.authorityTurn },
      { id: "why", label: "Why it stayed", text: brief.authorityWhy },
      { id: "cta-body", label: "Soft close", text: brief.authorityCta },
      ...shared,
    ];
  }
  if (familyId === "listicle") {
    return [
      { id: "h", label: "Headline", text: brief.listHeadline },
      { id: "dek", label: "Dek", text: brief.listDek },
      ...brief.listItems.map((item) => ({
        id: `item-${item.n}`,
        label: `${item.n} · ${item.title}`,
        text: `${item.title}\n\n${item.body}`,
      })),
      ...shared,
    ];
  }
  if (familyId === "story") {
    return [
      { id: "h", label: "Headline", text: brief.storyHeadline },
      { id: "dek", label: "Dek", text: brief.storyDek },
      ...brief.storyGrafs.map((g, i) => ({
        id: `g-${i}`,
        label: `Movement ${i + 1}`,
        text: g,
      })),
      ...shared,
    ];
  }
  if (familyId === "news") {
    return [
      { id: "h", label: "Headline", text: brief.newsHeadline },
      { id: "lead", label: "Lead", text: brief.newsLead },
      { id: "body", label: "Body", text: brief.newsBody },
      { id: "box", label: "Product box", text: brief.newsBox },
      ...shared,
    ];
  }
  if (familyId === "quiz") {
    return [
      { id: "h", label: "Headline", text: brief.quizHeadline },
      { id: "result", label: "Result", text: `${brief.quizResultTitle}\n\n${brief.quizResultBody}` },
      ...shared,
    ];
  }
  if (familyId === "comparison") {
    return [
      { id: "h", label: "Headline", text: brief.compareHeadline },
      { id: "dek", label: "Dek", text: brief.compareDek },
      ...shared,
    ];
  }
  return shared;
}
