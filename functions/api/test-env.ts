/**
 * Test endpoint to check environment variables
 */

export async function onRequestGet(context: { request: Request; env: any }) {
  const { env } = context;
  
  return new Response(JSON.stringify({
    hasEnv: !!env,
    hasGeminiKey: !!env?.GEMINI_API_KEY,
    envKeys: Object.keys(env || {}),
    geminiKeyLength: env?.GEMINI_API_KEY?.length || 0
  }, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
