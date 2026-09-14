import type { AdAngle, AnalysisResult } from "../types";
import { mergeLlmAngles } from "./generateCopy";

interface RefineResponse {
  refined?: boolean;
  source?: string;
  error?: string;
  angles?: unknown;
}

export async function maybeRefineWithOpenAI(
  analysis: AnalysisResult,
  rawReviews: string,
  clientKey: string,
): Promise<{ analysis: AnalysisResult; notice: string | null }> {
  const key = clientKey.trim();

  if (key) {
    try {
      const polished = await refineViaOpenAI(key, analysis, rawReviews);
      if (polished) {
        return {
          analysis: {
            ...mergeLlmAngles(analysis, polished),
            source: "openai-client",
          },
          notice: "Angles polished with your OpenAI key.",
        };
      }
    } catch {
      return {
        analysis,
        notice: "OpenAI upgrade failed — showing offline intelligence.",
      };
    }
  }

  try {
    const res = await fetch("/api/refine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName: analysis.productName,
        reviews: rawReviews,
        analysis,
      }),
    });
    if (!res.ok) return { analysis, notice: null };
    const data = (await res.json()) as RefineResponse;
    if (data.refined && Array.isArray(data.angles) && data.angles.length) {
      return {
        analysis: mergeLlmAngles(analysis, data.angles),
        notice: "Angles polished with OPENAI_API_KEY.",
      };
    }
    if (data.error === "upgrade_failed") {
      return {
        analysis,
        notice: "OpenAI upgrade failed — showing offline intelligence.",
      };
    }
  } catch {
    // Dev server without the middleware, or preview/prod: stay heuristic.
  }

  return { analysis, notice: null };
}

async function refineViaOpenAI(
  apiKey: string,
  analysis: AnalysisResult,
  rawReviews: string,
): Promise<AdAngle[] | null> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You polish DTC supplement ad angles for Meta. Return JSON { angles: AdAngle[] }. Each angle: title, painInsight, whyItMightConvert, primaryTexts (3 strings), headline, advertorialHook, tags. Keep claims review-grounded. No invented clinical proof.",
        },
        {
          role: "user",
          content: JSON.stringify({
            productName: analysis.productName,
            reviews: rawReviews.slice(0, 12000),
            heuristicAngles: analysis.angles,
          }),
        },
      ],
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}") as {
    angles?: AdAngle[];
  };
  return Array.isArray(parsed.angles) ? parsed.angles : null;
}
