import type { ReviewItem } from "../types";

export function parseReviews(raw: string): ReviewItem[] {
  const cleaned = raw.replace(/\r\n/g, "\n").trim();
  if (!cleaned) return [];

  const chunks = cleaned
    .split(
      /\n\s*\n+|(?=^\s*(?:\d+[\.\)]\s+|★+\s*|⭐+\s*|Review\s*\d+\s*[:.\-–]|Verified\b))/gim,
    )
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 40);

  const source = chunks.length >= 2 ? chunks : fallbackSplit(cleaned);

  return source.map((text, index) => ({
    id: `r${index + 1}`,
    text,
    sentences: splitSentences(text),
  }));
}

function fallbackSplit(text: string): string[] {
  const byLines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 60);
  if (byLines.length >= 3) return byLines;
  return [text];
}

export function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z“"I])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12);
}

export function estimateReviewCount(raw: string): number {
  return parseReviews(raw).length;
}

export function wordCount(raw: string): number {
  return raw.trim() ? raw.trim().split(/\s+/).length : 0;
}
