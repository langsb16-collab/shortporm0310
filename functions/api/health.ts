/**
 * Cloudflare Pages Functions - /api/health endpoint
 */

export async function onRequestGet() {
  return new Response(JSON.stringify({
    status: "ok",
    edge: true,
    timestamp: new Date().toISOString(),
    message: "AI Shorts Factory API - Cloudflare Pages Functions"
  }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
