import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function openaiRefinePlugin(apiKey: string | undefined): Plugin {
  return {
    name: "openai-refine",
    configureServer(server) {
      server.middlewares.use(
        "/api/refine",
        async (req: IncomingMessage, res: ServerResponse, next) => {
          if (req.method !== "POST") {
            next();
            return;
          }

          res.setHeader("Content-Type", "application/json");

          if (!apiKey) {
            res.statusCode = 200;
            res.end(JSON.stringify({ refined: false, source: "heuristic" }));
            return;
          }

          try {
            const raw = await readBody(req);
            const payload = JSON.parse(raw) as {
              productName?: string;
              reviews?: string;
              analysis?: unknown;
            };

            const openaiRes = await fetch(
              "https://api.openai.com/v1/chat/completions",
              {
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
                        "You polish DTC supplement ad angles for Meta. Return JSON { angles: AdAngle[] } using the same shape as the heuristic analysis. Keep claims review-grounded. Do not invent clinical proof. Each angle needs title, painInsight, whyItMightConvert, primaryTexts (3), headline, advertorialHook. Preserve evidence quotes when possible.",
                    },
                    {
                      role: "user",
                      content: JSON.stringify({
                        productName: payload.productName,
                        reviews: String(payload.reviews ?? "").slice(0, 12000),
                        heuristic: payload.analysis,
                      }),
                    },
                  ],
                }),
              },
            );

            if (!openaiRes.ok) {
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  refined: false,
                  source: "heuristic",
                  error: "upgrade_failed",
                }),
              );
              return;
            }

            const data = (await openaiRes.json()) as {
              choices?: Array<{ message?: { content?: string } }>;
            };
            const content = JSON.parse(
              data.choices?.[0]?.message?.content || "{}",
            ) as { angles?: unknown };

            res.statusCode = 200;
            res.end(
              JSON.stringify({
                refined: true,
                source: "openai",
                angles: content.angles ?? [],
              }),
            );
          } catch {
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                refined: false,
                source: "heuristic",
                error: "upgrade_failed",
              }),
            );
          }
        },
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), openaiRefinePlugin(env.OPENAI_API_KEY)],
    server: {
      host: true,
      port: 5173,
    },
  };
});
