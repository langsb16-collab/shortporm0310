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
      throw new Error(`Gemini API failed: ${response.statusText}`);
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
    
    // Fallback
    return {
      title: `${keyword} - 스크립트 ${index + 1}`,
      hook: "주목! 이 정보를 놓치면 후회합니다",
      body: `${keyword}에 대한 핵심 정보를 30초 안에 전달합니다.`,
      cta: "지금 바로 확인하세요!",
      hashtags: [keyword, category, "바이럴"],
      subtitle: [
        { start: 0, end: 3, text: "주목하세요" }
      ]
    };
  }
}
