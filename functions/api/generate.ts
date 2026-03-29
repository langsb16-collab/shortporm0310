/**
 * Cloudflare Pages Functions - /api/generate endpoint
 * This file runs as a serverless function on Cloudflare Pages
 */

interface Env {
  GEMINI_API_KEY: string;
}

export async function onRequestPost(context: { request: Request; env: Env; params: any }) {
  const { request, env } = context;

  try {
    const body = await request.json() as any;
    const { keyword, category = "Tech", lang = "ko" } = body;

    if (!keyword) {
      return new Response(JSON.stringify({ error: "Keyword required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // API 키 확인
    const apiKey = env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("GEMINI_API_KEY not found in env");
      return new Response(JSON.stringify({ 
        error: "API key not configured",
        debug: {
          hasEnv: !!env,
          envKeys: Object.keys(env || {})
        }
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    console.log("Generating scripts with Gemini API...");

    // Generate scripts
    const scripts = await Promise.all([
      generateScript(keyword, category, lang, 0, apiKey),
      generateScript(keyword, category, lang, 1, apiKey),
      generateScript(keyword, category, lang, 2, apiKey)
    ]);

    return new Response(JSON.stringify({
      status: "success",
      keyword,
      category,
      lang,
      count: scripts.length,
      scripts,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error: any) {
    console.error("Generate error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}

async function generateScript(
  keyword: string,
  category: string,
  lang: string,
  index: number,
  apiKey: string
) {
  const prompt = `Generate a viral short video script for "${keyword}" (${category}) in ${lang}.

Return ONLY valid JSON:
{
  "title": "Engaging title",
  "hook": "Opening",
  "body": "Main content",
  "cta": "Call-to-action",
  "hashtags": ["tag1", "tag2", "tag3"],
  "subtitle": [
    { "start": 0, "end": 3, "text": "Text" }
  ]
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error (${response.status}):`, errorText);
      console.error(`API Key length: ${apiKey.length}`);
      console.error(`Request URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`);
      throw new Error(`Gemini API failed: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("Invalid Gemini response:", JSON.stringify(data));
      throw new Error("Invalid Gemini response structure");
    }

    const resultText = data.candidates[0].content.parts[0].text;
    const script = JSON.parse(resultText);

    return {
      title: script.title || `${keyword} - 스크립트 ${index + 1}`,
      hook: script.hook || "주목하세요",
      body: script.body || `${keyword}에 대한 정보`,
      cta: script.cta || "지금 확인하세요",
      hashtags: script.hashtags || [keyword, category],
      subtitle: script.subtitle || []
    };

  } catch (error: any) {
    console.error(`Script generation error (index ${index}):`, error);
    console.error(`Error message: ${error.message}`);
    console.error(`Error stack: ${error.stack}`);
    
    // Return error info instead of fallback for debugging
    return {
      title: `ERROR: ${error.message}`,
      hook: `Index: ${index}`,
      body: `API Key exists: ${!!apiKey}, Length: ${apiKey?.length}`,
      cta: error.stack?.split('\n')[0] || "Unknown error",
      hashtags: [keyword, category, "ERROR"],
      subtitle: [
        { start: 0, end: 3, text: error.message }
      ]
    };
  }
}
