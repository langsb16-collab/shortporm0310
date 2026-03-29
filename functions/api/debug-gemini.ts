/**
 * Debug endpoint to test Gemini API directly
 */

export async function onRequestGet(context: { request: Request; env: any }) {
  const { env } = context;
  
  const apiKey = env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "No API key" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Say hello in JSON format: {\"message\": \"...\"}"
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100,
            responseMimeType: "application/json"
          }
        })
      }
    );
    
    const responseText = await response.text();
    
    return new Response(JSON.stringify({
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText.substring(0, 1000),
      apiKeyLength: apiKey.length
    }, null, 2), {
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error: any) {
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack
    }, null, 2), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
