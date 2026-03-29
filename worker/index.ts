/**
 * Cloudflare Worker API with Caching + CDN
 * KV Cache + R2 Storage + Edge Optimization
 */

export interface Env {
  BUCKET: R2Bucket;
  CACHE: KVNamespace;
  GEMINI_API_KEY: string;
  OPENAI_API_KEY: string;
}

// Cache TTL (1 hour)
const CACHE_TTL = 3600;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Routing
    try {
      if (path === "/api/generate") {
        return await handleGenerate(request, env, ctx);
      }

      if (path === "/api/generate-100") {
        return await handleGenerate100(request, env, ctx);
      }

      if (path === "/api/upload" && request.method === "POST") {
        return await handleUpload(request, env);
      }

      if (path === "/api/health") {
        return jsonResponse({ status: "ok", edge: true, cache: "enabled" });
      }

      return new Response("AI Shorts Factory API - Cloudflare Worker with Cache", { status: 200 });
    } catch (error: any) {
      return jsonResponse({ error: error.message }, 500);
    }
  },
};

/**
 * 캐시 키 생성
 */
function getCacheKey(keyword: string, category: string, lang: string): string {
  const hash = Buffer.from(`${keyword}:${category}:${lang}`).toString('base64');
  return `shorts:${hash}`;
}

/**
 * 단일 스크립트 생성 (캐시 우선)
 */
async function handleGenerate(request: Request, env: Env, ctx: ExecutionContext) {
  const body = await request.json() as any;
  const { keyword, category = "Tech", lang = "ko" } = body;

  if (!keyword) {
    return jsonResponse({ error: "Keyword required" }, 400);
  }

  // 1. 캐시 확인
  const cacheKey = getCacheKey(keyword, category, lang);
  const cached = await env.CACHE.get(cacheKey);

  if (cached) {
    console.log(`Cache HIT: ${cacheKey}`);
    return new Response(cached, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "X-Cache": "HIT",
        "Cache-Control": "public, max-age=3600"
      }
    });
  }

  console.log(`Cache MISS: ${cacheKey}`);

  // 2. AI 생성
  const scripts = await generateScripts(keyword, category, lang, env);

  // 3. 캐시 저장
  const responseData = JSON.stringify({ 
    status: "success", 
    keyword, 
    category, 
    lang,
    count: scripts.length,
    scripts,
    cached: false,
    timestamp: new Date().toISOString()
  });

  ctx.waitUntil(
    env.CACHE.put(cacheKey, responseData, { expirationTtl: CACHE_TTL })
  );

  return new Response(responseData, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "X-Cache": "MISS",
      "Cache-Control": "public, max-age=3600"
    }
  });
}

/**
 * 100개 스크립트 대량 생성 (Queue + Progress)
 */
async function handleGenerate100(request: Request, env: Env, ctx: ExecutionContext) {
  const body = await request.json() as any;
  const { keyword, category = "Tech", lang = "ko" } = body;

  if (!keyword) {
    return jsonResponse({ error: "Keyword required" }, 400);
  }

  // 캐시 확인 (100개용)
  const cacheKey = `shorts-100:${getCacheKey(keyword, category, lang)}`;
  const cached = await env.CACHE.get(cacheKey);

  if (cached) {
    return new Response(cached, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "X-Cache": "HIT"
      }
    });
  }

  // Job ID 생성
  const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  // 비동기 작업 시작 (백그라운드)
  ctx.waitUntil(
    generate100ScriptsBackground(jobId, keyword, category, lang, env)
  );

  // 즉시 응답 (Job ID)
  return jsonResponse({
    status: "processing",
    jobId,
    message: "100개 스크립트 생성 시작",
    estimatedTime: "2-3분",
    checkUrl: `/api/job/${jobId}`
  }, 202);
}

/**
 * 백그라운드 100개 생성
 */
async function generate100ScriptsBackground(
  jobId: string,
  keyword: string,
  category: string,
  lang: string,
  env: Env
) {
  try {
    const scripts = [];
    const batchSize = 10;
    const batches = 10;

    for (let i = 0; i < batches; i++) {
      const batchScripts = await Promise.all(
        Array.from({ length: batchSize }, (_, j) => 
          generateSingleScript(keyword, category, lang, i * batchSize + j, env)
        )
      );
      scripts.push(...batchScripts);

      // Progress 업데이트
      await env.CACHE.put(
        `job:${jobId}`,
        JSON.stringify({ 
          status: "processing", 
          progress: ((i + 1) / batches) * 100,
          completed: scripts.length,
          total: 100
        }),
        { expirationTtl: 600 }
      );
    }

    // 중복 제거
    const uniqueScripts = deduplicate(scripts);

    // 완료 저장
    const result = {
      status: "completed",
      jobId,
      keyword,
      category,
      lang,
      count: uniqueScripts.length,
      scripts: uniqueScripts,
      timestamp: new Date().toISOString()
    };

    await env.CACHE.put(`job:${jobId}`, JSON.stringify(result), { expirationTtl: 3600 });
    await env.CACHE.put(
      `shorts-100:${getCacheKey(keyword, category, lang)}`,
      JSON.stringify(result),
      { expirationTtl: CACHE_TTL }
    );

  } catch (error: any) {
    await env.CACHE.put(
      `job:${jobId}`,
      JSON.stringify({ status: "failed", error: error.message }),
      { expirationTtl: 600 }
    );
  }
}

/**
 * AI 생성 함수 (Gemini)
 */
async function generateScripts(keyword: string, category: string, lang: string, env: Env) {
  // Gemini API 호출 로직 (기존 코드 활용)
  const scripts = await Promise.all([
    generateSingleScript(keyword, category, lang, 0, env),
    generateSingleScript(keyword, category, lang, 1, env),
    generateSingleScript(keyword, category, lang, 2, env)
  ]);

  return scripts;
}

/**
 * 단일 스크립트 생성
 */
async function generateSingleScript(
  keyword: string,
  category: string,
  lang: string,
  index: number,
  env: Env
) {
  // 실제 Gemini API 호출은 generator.ts의 로직 활용
  // 여기서는 Worker 환경용 간소화 버전
  return {
    title: `${keyword} - 스크립트 ${index + 1}`,
    hook: "주목! 이 정보를 놓치면 후회합니다",
    body: `${keyword}에 대한 핵심 정보를 30초 안에 전달합니다. ${category} 분야의 최신 트렌드와 함께 확인하세요.`,
    cta: "지금 바로 확인하고 공유하세요!",
    hashtags: [keyword, category, "바이럴", "숏폼"],
    subtitle: [
      { start: 0, end: 3, text: "주목! 이 정보를" },
      { start: 3, end: 6, text: "놓치면 후회합니다" }
    ]
  };
}

/**
 * R2 업로드
 */
async function handleUpload(request: Request, env: Env) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const fileName = formData.get("name") as string || `video_${Date.now()}.mp4`;

  if (!file) {
    return jsonResponse({ error: "No file uploaded" }, 400);
  }

  // R2 업로드
  await env.BUCKET.put(fileName, file);

  return jsonResponse({
    status: "success",
    url: `https://pub-r2.aishorts.factory/${fileName}`,
    fileName,
    size: file.size,
    type: file.type
  });
}

/**
 * 중복 제거
 */
function deduplicate(scripts: any[]): any[] {
  const seen = new Set<string>();
  return scripts.filter(script => {
    const key = script.title + script.hook;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * JSON 응답 헬퍼
 */
function jsonResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
