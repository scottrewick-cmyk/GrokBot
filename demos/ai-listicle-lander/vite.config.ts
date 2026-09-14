import { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function json(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function openaiRewritePlugin(): Plugin {
  return {
    name: "openai-rewrite",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0];
        if (url === "/api/status" && req.method === "GET") {
          json(res, 200, {
            openai: Boolean(process.env.OPENAI_API_KEY),
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          });
          return;
        }

        if (url === "/api/rewrite" && req.method === "POST") {
          const apiKey = process.env.OPENAI_API_KEY;
          if (!apiKey) {
            json(res, 501, {
              error: "OPENAI_API_KEY is not set. Template copy was kept.",
            });
            return;
          }

          try {
            const body = JSON.parse(await readBody(req)) as {
              lander?: unknown;
              form?: unknown;
            };
            const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model,
                temperature: 0.7,
                response_format: { type: "json_object" },
                messages: [
                  {
                    role: "system",
                    content:
                      "You punch up DTC listicle landing-page copy. Return JSON with a single key `lander` that keeps the EXACT same object shape and keys as the input lander. Do not add or remove reasons. Keep imageLabel values. Do not invent medical claims. Keep the identity-gap tone. Fictional brands only.",
                  },
                  {
                    role: "user",
                    content: JSON.stringify({
                      form: body.form ?? {},
                      lander: body.lander ?? {},
                    }),
                  },
                ],
              }),
            });

            if (!response.ok) {
              const detail = await response.text();
              json(res, 502, {
                error: "OpenAI request failed. Template copy was kept.",
                detail: detail.slice(0, 400),
              });
              return;
            }

            const data = (await response.json()) as {
              choices?: { message?: { content?: string } }[];
            };
            const content = data.choices?.[0]?.message?.content;
            if (!content) {
              json(res, 502, { error: "Empty OpenAI response." });
              return;
            }
            const parsed = JSON.parse(content) as { lander?: unknown };
            json(res, 200, { lander: parsed.lander ?? parsed });
          } catch (error) {
            json(res, 500, {
              error: error instanceof Error ? error.message : "Rewrite failed",
            });
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (env.OPENAI_API_KEY) process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
  if (env.OPENAI_MODEL) process.env.OPENAI_MODEL = env.OPENAI_MODEL;

  return {
    plugins: [react(), openaiRewritePlugin()],
    server: {
      host: "0.0.0.0",
      port: 5173,
    },
  };
});
