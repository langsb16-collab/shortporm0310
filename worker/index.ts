/**
 * Cloudflare Worker API for AI Shorts Factory
 */

export interface Env {
  BUCKET: R2Bucket;
  GEMINI_API_KEY: string;
  OPENAI_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. Handle CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // 2. Routing Logic
    try {
      if (path === "/api/generate") {
        return await handleGenerate(request, env);
      }

      if (path === "/api/upload" && request.method === "POST") {
        return await handleUpload(request, env);
      }

      if (path === "/api/health") {
        return new Response(JSON.stringify({ status: "ok", edge: true }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }

      return new Response("AI Shorts Factory API - Cloudflare Worker", { status: 200 });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
  },
};

async function handleGenerate(request: Request, env: Env) {
  // Logic to call AI (Gemini/OpenAI)
  // In a real worker, you'd call the AI SDK or fetch the AI endpoint
  return new Response(JSON.stringify({ status: "processing", message: "AI generation triggered" }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}

async function handleUpload(request: Request, env: Env) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const fileName = formData.get("name") as string || `video_${Date.now()}.mp4`;

  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

  // Upload to R2 Bucket
  await env.BUCKET.put(fileName, file);

  return new Response(JSON.stringify({ status: "success", url: `https://pub-r2.aishorts.factory/${fileName}` }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}
