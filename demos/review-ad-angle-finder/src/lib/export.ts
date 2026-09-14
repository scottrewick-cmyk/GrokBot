import type { AnalysisResult } from "../types";

export function toMarkdown(analysis: AnalysisResult): string {
  const lines: string[] = [
    `# Ad angle brief — ${analysis.productName}`,
    ``,
    `_Generated ${new Date(analysis.generatedAt).toLocaleString()} · ${analysis.source} engine · ${analysis.reviewCount} reviews · ${analysis.wordCount} words_`,
    ``,
    `## Who it's for`,
    ...analysis.whoItsFor.map(
      (p) => `- **${p.label}** (${p.count}) — ${p.examples[0] ?? ""}`,
    ),
    ``,
    `## Pain language`,
    analysis.painLanguage
      .slice(0, 12)
      .map((p) => `\`${p.phrase}\` (${p.count})`)
      .join(" · "),
    ``,
    `## Urgency`,
    ...analysis.urgency.map((u) => `- ${u.label} (${u.count})`),
    ``,
    `## Ranked angles`,
    ``,
  ];

  for (const angle of analysis.angles) {
    lines.push(
      `### ${String(angle.rank).padStart(2, "0")}. ${angle.title}`,
      ``,
      `**Theme:** ${angle.themeLabel} · **Score:** ${angle.score} · **Support:** ${angle.evidence.mentionCount} reviews`,
      ``,
      `**Pain insight:** ${angle.painInsight}`,
      ``,
      `**Why it might convert:** ${angle.whyItMightConvert}`,
      ``,
      `**Headline:** ${angle.headline}`,
      ``,
      `**Advertorial hook:** ${angle.advertorialHook}`,
      ``,
      `**Meta primary text A**`,
      ``,
      angle.primaryTexts[0],
      ``,
      `**Meta primary text B**`,
      ``,
      angle.primaryTexts[1],
      ``,
      `**Meta primary text C**`,
      ``,
      angle.primaryTexts[2],
      ``,
      `**Evidence quotes**`,
      ...angle.evidence.sampleQuotes.map((q) => `- "${q}"`),
      ``,
    );
  }

  lines.push(
    `---`,
    `Demo creative only. Not medical advice. Sample reviews, when used, are fictional.`,
  );
  return lines.join("\n");
}

export function downloadFile(filename: string, contents: string, mime: string) {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "angles"
  );
}
