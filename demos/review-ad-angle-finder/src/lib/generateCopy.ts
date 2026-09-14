import type { AdAngle, AnalysisResult, ReviewItem } from "../types";

function productToken(name: string): string {
  const trimmed = name.trim() || "this formula";
  return trimmed.length > 42 ? `${trimmed.slice(0, 40)}…` : trimmed;
}

function firstQuote(quotes: string[], fallback: string): string {
  return quotes[0] || fallback;
}

function personaLine(analysis: AnalysisResult): string {
  const top = analysis.whoItsFor.slice(0, 2).map((p) => p.label.toLowerCase());
  if (!top.length) return "people who've been managing pain quietly for years";
  if (top.length === 1) return top[0];
  return `${top[0]} and ${top[1]}`;
}

function failedLine(analysis: AnalysisResult): string {
  const names = analysis.failedSolutions.slice(0, 2).map((f) => f.name);
  if (!names.length) return "creams, braces, and the usual pills";
  return names.join(" and ");
}

const COPY: Record<
  string,
  (ctx: {
    product: string;
    quote: string;
    quote2: string;
    persona: string;
    failed: string;
    theme: AnalysisResult["themes"][number];
  }) => Pick<
    AdAngle,
    | "title"
    | "painInsight"
    | "whyItMightConvert"
    | "primaryTexts"
    | "headline"
    | "advertorialHook"
    | "tags"
  >
> = {
  "night-nerve": ({ product, quote, quote2, persona }) => ({
    title: "The 2am buzzing isn't 'arthritis'",
    painInsight: `Nighttime nerve language — buzzing, crawling, electric — shows up independently of daytime joint ache. Reviews describe sleep as the first thing that broke, not walking.`,
    whyItMightConvert: `Most knee ads sell stairs and hiking. This angle hijacks a more intimate failure: the bed. It's specific, screenshot-able, and lets ${persona} feel recognized at 2am when generic "joint support" feels like a lie.`,
    primaryTexts: [
      `I used to set an alarm early just so my legs could "catch up."\n\nNot to stretch. To wait until the buzzing quieted down enough to stand.\n\n"${quote}"\n\nIf your pain feels electric at night — not just stiff — ${product} is the angle the joint creams never spoke to.\n\nNot a miracle. Quieter nights. That's the whole pitch.`,
      `Quick question: does your pain get louder when the lights go out?\n\nJoints ache. Nerves buzz. Those are not the same commercial.\n\nPeople taking ${product} keep repeating the same weirdly specific win: the crawling at night got quieter first.\n\n"${quote2}"\n\nWorth a look if you've been told it's just aging.`,
      `Stop scrolling if this is you:\n• sheets feel like sandpaper on your calves\n• 2am buzzing you can't stretch away\n• doctors saying "arthritis" while your feet feel electric\n\n${product} is showing up in reviews for the NERVE part of knee-and-nerve — the part creams ignore.\n\nRead the stories. See if they sound like your 2am.`,
    ],
    headline: "It's not stiff. It's electric at 2am.",
    advertorialHook: `The alarm wasn't for work. It was so her calves could stop buzzing long enough to stand. That's when she realized every "joint cream" she'd bought was talking to the wrong pain.`,
    tags: ["night pain", "nerve", "sleep", "pattern interrupt"],
  }),
  dignity: ({ product, quote, persona, failed }) => ({
    title: "The sock-and-stairs dignity test",
    painInsight: `The highest-emotion moments aren't marathons. They're socks, floor-to-stand, laundry stairs, grocery bags — tiny tasks that announce "I am becoming a burden."`,
    whyItMightConvert: `Dignity is under-bought in this category. Competitors flex "get back to the gym." This angle is for ${persona} who will never click that, but will click a story about putting on their own socks after ${failed}.`,
    primaryTexts: [
      `The MRI didn't make him feel old.\n\nThe socks did.\n\n"${quote}"\n\nIf the smallest tasks are starting to require an audience, that's the review pattern behind ${product} — not "crush your next 5K."\n\nQuiet independence. That's the product.`,
    `Nobody runs an ad about laundry stairs.\n\nThey should. That's where households start talking about moving the bedroom downstairs.\n\n${product} reviews keep circling the same unglamorous wins: socks, stairs, getting up from the floor without calling for backup.`,
      `If you've ever smiled so a grandchild wouldn't see you panic on the floor — this is your ad.\n\n${product} isn't promising a new personality. It's promising fewer moments where someone has to hook their arms under yours in your own living room.`,
    ],
    headline: "The day the socks needed help.",
    advertorialHook: `It wasn't the scan. It was sitting on the bed, breathing like he'd run a mile, because his knees wouldn't bend far enough for socks. That's the moment most "joint" ads are too proud to sell.`,
    tags: ["dignity", "ADL", "emotional", "ugc-story"],
  }),
  identity: ({ product, quote, persona }) => ({
    title: "The identity they lost this year",
    painInsight: `Pain is the mechanism. The wound is social: hiking grandma, pickleball Tuesdays, the usual pew, tulips. Reviews mourn a role, not a WOMAC score.`,
    whyItMightConvert: `Identity ads outperform generic relief because the click is about becoming recognizable again — to a daughter, a spouse, a doubles partner. Strong for ${persona}.`,
    primaryTexts: [
      `She used to be the hiking grandma. That was her whole personality at Thanksgiving.\n\nThen she became the one on the bench making jokes so nobody would pity her.\n\n"${quote}"\n\n${product} reviews aren't about becoming 30. They're about not disappearing from the family photo.`,
      `When pickleball died, Tuesdays died with it.\n\nThat's not a hobby. That's a social life with a knee problem.\n\nIf you miss a version of yourself more than you miss a sport, read what people say after ${product} — "I was slower. I was there."`,
      `Pain made him boring. He was the guy who canceled.\n\nThat's the ad.\n\n${product} is for people who don't need a PR from a doctor. They need a reason to say yes to the invite again.`,
    ],
    headline: "Pain made me the one who cancels.",
    advertorialHook: `The tulips were still in the bag. She stood in her own garden like a tourist, holding a trowel, grieving flowers — which sounds silly until it's the last ritual that still felt like you.`,
    tags: ["identity", "social proof", "family", "loss-aversion"],
  }),
  dismissed: ({ product, quote }) => ({
    title: "Six minutes and 'that's aging'",
    painInsight: `A cluster of reviewers felt medically shrugged-off. The product becomes an ally against dismissal — "at least the label took the nerve part seriously."`,
    whyItMightConvert: `Rage-recognition is a converter. People who felt stupid in the exam room will stop for copy that repeats the insult and then sides with them. Handle ethically: validate, don't bash clinicians.`,
    primaryTexts: [
      `The appointment lasted 6 minutes.\n\n"That's aging."\n\n"${quote}"\n\nIf you've been patted on the head while your feet buzz at night, you're not dramatic. You're underserved.\n\n${product} keeps showing up for people who were told it was just old — and wanted someone to take the nerve part seriously.`,
      `You're not crazy for saying it feels electric.\n\nYou're not dramatic for mentioning the crawling at night.\n\nYou're not "just aging" on a convenient timeline.\n\nRead the ${product} reviews if the last professional you told made you feel small.`,
      `Unpopular opinion: "that's aging" is not a care plan.\n\nIt's a sentence that ends the visit.\n\n${product} isn't a doctor. It is, for a lot of people in these reviews, the first time the copy matched the buzzing they actually feel.`,
    ],
    headline: `"That's aging" is not a diagnosis.`,
    advertorialHook: `He wanted to ask whether aging also explained the buzzing in his feet at night, or just the part that was convenient to ignore. He didn't. He bought a bottle instead.`,
    tags: ["validation", "contrarian", "nerve", "trust"],
  }),
  "failed-meds": ({ product, quote, failed }) => ({
    title: "The stomach-or-walking bargain",
    painInsight: `Reviewers aren't supplement-naive. They're refugees from ${failed} — stomach wreckage, 11-day cortisone miracles, cream theater, painkiller fog that stole punchlines.`,
    whyItMightConvert: `This angle pre-empts skepticism ("I hate supplements") by agreeing with it, then positioning ${product} as a different category of attempt: not another NSAID, not a locker-room cream.`,
    primaryTexts: [
      `Aleve made it a choice: walking, or a stomach that felt like a battery.\n\nThat's a rotten choice.\n\n"${quote}"\n\n${product} is showing up for people who already tried the obvious and paid for it. Still talk to your pharmacist. Then read why the skeptics stayed.`,
      `I hate supplements. Most of them are dust in a capsule with a Facebook ad.\n\nI took ${product} anyway because the reviews were uncomfortably specific — socks, night buzzing, the floor — not "support your joints™."\n\nI'm still a skeptic. I'm also still taking it.`,
      `Cortisone was a miracle for 11 days.\n\nThen it wasn't.\n\nIf your history looks like: cream → brace → PT → shot → shrug, ${product} is the next chapter a lot of these reviewers wrote — especially the ones who wanted their afternoon clarity back.`,
    ],
    headline: "I was choosing between walking and my stomach.",
    advertorialHook: `The fog from the afternoon pill made her miss the punchline. She decided she'd rather hurt a little and be in the room. That's the sentence that sells more honestly than "clinically studied comfort."`,
    tags: ["skeptic", "failed alternatives", "clarity", "ugc"],
  }),
  occupational: ({ product, quote, persona }) => ({
    title: "Pain that clocks in with you",
    painInsight: `Occupational standing — concrete, 12-hour shifts, parking-garage stairs — is a distinct buyer. Their KPI isn't a 5K. It's Friday without limping to the time clock.`,
    whyItMightConvert: `Work-identity targeting is crisp for Meta: ${persona}. Creative that smells like a gym loses them. Creative that names the supply closet, the time clock, the garage stairs feels like it was written in their break room.`,
    primaryTexts: [
      `By Thursday the concrete has an opinion.\n\n"${quote}"\n\n${product} isn't a "weekend warrior" ad. It's for people whose job is already the workout — and who still have to get to the time clock on Friday.`,
      `If you've hidden in a supply closet just to get your weight off your knees, you don't need a lecture about form.\n\nYou need the electric part to quiet down before the last four hours of the shift.\n\nThat's the ${product} review pattern from nurses and warehouse floors.`,
      `Standing is the sport.\n\nCreams that smell like a locker room don't survive a 12-hour shift. ${product} keeps getting mentioned as the thing that didn't feel like theater — stairs still stairs, less bargaining with each step.`,
    ],
    headline: "Friday, without the limp to the clock.",
    advertorialHook: `She was good at the job. The humiliation was the closet — ducking out of a shift she could otherwise run, just to unload her knees. Nobody makes a TV spot about that. The reviews did.`,
    tags: ["occupation", "nurses", "warehouse", "practical win"],
  }),
  weather: ({ product, quote }) => ({
    title: "The human barometer",
    painInsight: `Weather-flare language is sticky and visual. Reviewers claim they can predict rain; nerve burning stacks on joint swelling when pressure drops.`,
    whyItMightConvert: `It's a pattern-interrupt you can film (sky, knee, dinner plans). It also sets honest expectations: not canceling storms — turning an 8 into a 4 so they can still show up.`,
    primaryTexts: [
      `She can predict rain better than the app.\n\n"${quote}"\n\n${product} didn't cancel weather. It made the flare a 4 instead of an 8 — which is the difference between canceling dinner and showing up.`,
      `Barometric pressure is not a personality. It's a schedule.\n\nIf your shins burn when the sky drops, you're not imagining it — and most joint ads will never say the word "barometer."\n\n${product} reviews do.`,
      `Honest ad: this will not make you immune to storms.\n\nIt might make the stack — swollen joint + burning nerve — short enough that you keep the reservation.\n\nThat's the ${product} weather-flare story.`,
    ],
    headline: "Your knees knew about the rain first.",
    advertorialHook: `The sky hadn't even changed color yet. Her knees had. She used to treat that as a superstition until enough strangers on the internet described the exact same forecast.`,
    tags: ["weather", "honest claim", "flare", "visual"],
  }),
  "nerve-vs-joint": ({ product, quote, quote2 }) => ({
    title: "Wrong aisle: this isn't a joint cream",
    painInsight: `The sharpest positioning in the corpus: reviewers insist the sensation is electric, not a dull arthritic argument. They tried joint SKUs and felt unseen.`,
    whyItMightConvert: `Category disruption. If competitors all say "joint," you can own "wires." It also explains why previous products failed without attacking the customer for "not trying hard enough."`,
    primaryTexts: [
      `Arthritis is a dull argument.\n\nThis is electric.\n\n"${quote}"\n\nEvery cream was for "joints." Nobody was talking to the wires.\n\n${product} is the first time a lot of these reviewers heard their actual vocabulary in an ad.`,
      `If your pain has a SOUND in your head — buzzing, crawling, ants in a line — you have been shopping the wrong aisle.\n\n"${quote2}"\n\n${product} reviews keep saying the night crawling quieted before the ache did. Sequence matters. It means they hit nerve first.`,
      `Joint support is a crowded party.\n\nNerve language is how you walk in and take a chair.\n\nRead ${product} reviews for the words electric, crawling, wires, buzzing. If those are your words, this is your test.`,
    ],
    headline: "Your creams were talking to the wrong pain.",
    advertorialHook: `She didn't need another brochure about cartilage. She needed someone to say the word electric. The first product whose reviews sounded like her body is the product she finally finished.`,
    tags: ["positioning", "nerve", "category of one", "vocabulary"],
  }),
  "mobility-trap": ({ product, quote }) => ({
    title: "The rest-stop freeze",
    painInsight: `Locking after sitting — cars, church stand-sit, the backswing catch — is a cinematic, highly targetable scene. It's pain plus public embarrassment.`,
    whyItMightConvert: `High mental-imagery creative. Easy UGC: "the door opened and my leg didn't." Converts people who still walk "fine" but fear the after-sitting trap.`,
    primaryTexts: [
      `Ohio rest stop. Door open. Leg wouldn't follow.\n\nHe pretended to check his phone so the family wouldn't see.\n\n"${quote}"\n\n${product} isn't a flex ad. It's for the freeze after sitting — church pews, long drives, the top of a golf swing.`,
      `Church is standing, sitting, standing until your knees start doing math on the second hymn.\n\nIf you've arrived late on purpose just to take the back row, ${product} reviews will feel uncomfortably accurate.`,
      `The rusty-gate catch at the top of the backswing ended the season.\n\nNot the walking. The catch.\n\nThat's a ${product} story: not touring. Nine holes without the sick little lock.`,
    ],
    headline: "Door open. Leg wouldn't follow.",
    advertorialHook: `He sat in the driver's seat gripping the frame, performing "just checking my phone," while his knee decided whether he would be a person in the parking lot. Nobody films that for a brand. They should.`,
    tags: ["embarrassment", "cars", "church", "visual hook"],
  }),
};

function genericCopy(ctx: {
  product: string;
  quote: string;
  quote2: string;
  persona: string;
  failed?: string;
  theme: AnalysisResult["themes"][number];
}) {
  return {
    title: ctx.theme.label,
    painInsight: `Reviewers keep returning to ${ctx.theme.label.toLowerCase()} in their own words — a cluster with ${ctx.theme.reviewIds.length} supporting stories.`,
    whyItMightConvert: `It's specific language from ${ctx.persona}, not a category cliché. Specificity is what stops the thumb.`,
    primaryTexts: [
      `${ctx.quote}\n\nThat's a real review pattern for ${ctx.product} — not a slogan. If it sounds like your body, the rest of the stories are worth a minute.`,
      `Most ads in this space say "joint support." These reviewers are describing ${ctx.theme.label.toLowerCase()} instead.\n\n${ctx.product} is where that language is concentrating.`,
      `If you've been shopping generic pain ads and bouncing, it may be because nobody named this: ${ctx.theme.label.toLowerCase()}.\n\n${ctx.product} reviews did.`,
    ] as [string, string, string],
    headline: ctx.theme.label,
    advertorialHook: ctx.quote,
    tags: ["emergent", "review-mined"],
  };
}

export function buildAngles(
  analysis: AnalysisResult,
  _reviews: ReviewItem[],
): AdAngle[] {
  const product = productToken(analysis.productName);
  const persona = personaLine(analysis);
  const failed = failedLine(analysis);

  return analysis.themes.slice(0, 6).map((theme, index) => {
    const quote = firstQuote(
      theme.quotes,
      "The pain was one thing. What it took from me was another.",
    );
    const quote2 =
      theme.quotes[1] ||
      theme.quotes[0] ||
      "It finally sounded like my body, not a brochure.";
    const factory = COPY[theme.id] ?? genericCopy;
    const copy = factory({
      product,
      quote,
      quote2,
      persona,
      failed,
      theme,
    });

    return {
      id: theme.id,
      rank: index + 1,
      score: theme.score,
      themeId: theme.id,
      themeLabel: theme.label,
      evidence: {
        mentionCount: theme.reviewIds.length,
        intensity: theme.intensity,
        sampleQuotes: theme.quotes,
        personas: analysis.whoItsFor.slice(0, 3).map((p) => p.label),
      },
      ...copy,
    };
  });
}

export function mergeLlmAngles(
  base: AnalysisResult,
  incoming: unknown,
): AnalysisResult {
  if (!Array.isArray(incoming) || incoming.length === 0) return base;

  const polished: AdAngle[] = [];
  for (const [index, raw] of incoming.entries()) {
    if (!raw || typeof raw !== "object") continue;
    const row = raw as Partial<AdAngle>;
    const fallback = base.angles[index] ?? base.angles[0];
    if (!fallback) continue;
    const texts = Array.isArray(row.primaryTexts)
      ? row.primaryTexts.filter((t): t is string => typeof t === "string")
      : [];
    const primaryTexts: [string, string, string] = [
      texts[0] || fallback.primaryTexts[0],
      texts[1] || fallback.primaryTexts[1],
      texts[2] || fallback.primaryTexts[2],
    ];
    polished.push({
      ...fallback,
      rank: index + 1,
      title: String(row.title || fallback.title),
      painInsight: String(row.painInsight || fallback.painInsight),
      whyItMightConvert: String(
        row.whyItMightConvert || fallback.whyItMightConvert,
      ),
      primaryTexts,
      headline: String(row.headline || fallback.headline),
      advertorialHook: String(
        row.advertorialHook || fallback.advertorialHook,
      ),
      tags: Array.isArray(row.tags)
        ? row.tags.map(String)
        : fallback.tags,
    });
  }

  if (!polished.length) return base;
  return {
    ...base,
    angles: polished,
    source: "openai",
  };
}
