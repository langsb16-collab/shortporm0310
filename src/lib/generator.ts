/**
 * Deterministic AI Generation Pipeline
 * 프롬프트 정확도 100% 달성을 위한 출력 강제 시스템
 */

import Ajv from 'ajv';
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

// JSON Schema 정의 (출력 형식 강제)
const SCRIPT_SCHEMA = {
  type: "object",
  required: ["title", "hook", "body", "cta", "hashtags", "subtitle"],
  properties: {
    title: { type: "string", minLength: 10, maxLength: 100 },
    hook: { type: "string", minLength: 10, maxLength: 200 },
    body: { type: "string", minLength: 50, maxLength: 500 },
    cta: { type: "string", minLength: 5, maxLength: 100 },
    hashtags: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 10
    },
    subtitle: {
      type: "array",
      items: {
        type: "object",
        required: ["start", "end", "text"],
        properties: {
          start: { type: "number" },
          end: { type: "number" },
          text: { type: "string" }
        }
      }
    }
  }
};

// Ajv 검증기 초기화
const ajv = new Ajv();
const validate = ajv.compile(SCRIPT_SCHEMA);

// 시스템 프롬프트 (절대 고정)
const SYSTEM_PROMPT = `You are a professional short-form video script AI.

STRICT RULES:
1. Output ONLY valid JSON - NO explanations, NO markdown
2. NEVER change the format
3. 30-second script duration
4. Hook → Body → CTA structure
5. Include subtitle timecodes

OUTPUT FORMAT (MUST FOLLOW):
{
  "title": "Engaging title under 100 chars",
  "hook": "Attention-grabbing opening (10-200 chars)",
  "body": "Main content with key information (50-500 chars)",
  "cta": "Clear call-to-action (5-100 chars)",
  "hashtags": ["tag1", "tag2", "tag3"],
  "subtitle": [
    { "start": 0, "end": 3, "text": "Hook subtitle" },
    { "start": 3, "end": 7, "text": "Body subtitle" }
  ]
}

FORBIDDEN:
- Any text outside JSON
- Format modifications
- Missing required fields`;

// Few-shot 예시 (스타일 고정)
const EXAMPLE_OUTPUT = {
  title: "AI가 바꾸는 숏폼 시장의 미래",
  hook: "지금 숏폼 시장에 혁명이 일어나고 있습니다",
  body: "AI 기술로 누구나 바이럴 영상을 만들 수 있는 시대. 키워드 하나로 100개의 숏폼이 자동 생성됩니다.",
  cta: "지금 바로 무료로 시작해보세요!",
  hashtags: ["AI", "숏폼", "바이럴", "자동화"],
  subtitle: [
    { start: 0, end: 3, text: "지금 숏폼 시장에" },
    { start: 3, end: 6, text: "혁명이 일어나고 있습니다" },
    { start: 6, end: 10, text: "AI 기술로 누구나" },
    { start: 10, end: 14, text: "바이럴 영상을 만들 수 있는 시대" }
  ]
};

/**
 * 품질 점수 계산
 */
function qualityScore(script: any): number {
  let score = 0;
  
  if (script.title && script.title.length >= 10) score += 1;
  if (script.hook && script.hook.length >= 10) score += 1;
  if (script.body && script.body.length >= 50) score += 1;
  if (script.hashtags && script.hashtags.length >= 3) score += 1;
  if (script.subtitle && script.subtitle.length >= 2) score += 1;
  
  return score;
}

/**
 * 단일 스크립트 생성 (검증 + 재시도)
 */
export async function generateSingleScript(
  keyword: string, 
  category: string, 
  lang: string,
  index: number
): Promise<any> {
  let retries = 3;
  
  while (retries > 0) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
          { role: "user", parts: [{ text: `키워드: 강남 아파트` }] },
          { role: "assistant", parts: [{ text: JSON.stringify(EXAMPLE_OUTPUT) }] },
          { role: "user", parts: [{ text: `키워드: ${keyword}, 카테고리: ${category}, 언어: ${lang}, 번호: ${index + 1}` }] }
        ],
        config: {
          temperature: 0,
          topP: 0.1,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              hook: { type: Type.STRING },
              body: { type: Type.STRING },
              cta: { type: Type.STRING },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              subtitle: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    start: { type: Type.NUMBER },
                    end: { type: Type.NUMBER },
                    text: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["title", "hook", "body", "cta", "hashtags", "subtitle"]
          }
        }
      });
      
      const output = JSON.parse(response.text);
      
      // 스키마 검증
      if (!validate(output)) {
        console.error(`Validation failed for script ${index}:`, validate.errors);
        retries--;
        continue;
      }
      
      // 품질 점수 검증
      if (qualityScore(output) < 4) {
        console.error(`Quality score too low for script ${index}`);
        retries--;
        continue;
      }
      
      return output;
      
    } catch (error) {
      console.error(`Generation error for script ${index}:`, error);
      retries--;
    }
  }
  
  throw new Error(`Failed to generate script ${index} after 3 retries`);
}

/**
 * 중복 제거 (해시 기반)
 */
function hashContent(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

function deduplicate(scripts: any[]): any[] {
  const seen = new Set<string>();
  
  return scripts.filter(script => {
    const hash = hashContent(script.title + script.hook);
    
    if (seen.has(hash)) {
      return false;
    }
    
    seen.add(hash);
    return true;
  });
}

/**
 * 병렬 생성 제한 (동시 5개)
 */
async function limitedParallel<T>(
  tasks: (() => Promise<T>)[],
  limit: number = 5
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];
  
  for (const task of tasks) {
    const promise = task().then(result => {
      results.push(result);
      executing.splice(executing.indexOf(promise), 1);
    });
    
    executing.push(promise);
    
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  
  await Promise.all(executing);
  return results;
}

/**
 * 100개 스크립트 대량 생성 (안정화 엔진)
 */
export async function generate100Scripts(
  keyword: string,
  category: string,
  lang: string,
  onProgress?: (completed: number, total: number) => void
): Promise<any[]> {
  console.log(`Starting generation of 100 scripts for keyword: ${keyword}`);
  
  const tasks = Array.from({ length: 100 }, (_, i) => 
    () => generateSingleScript(keyword, category, lang, i)
      .then(script => {
        if (onProgress) onProgress(i + 1, 100);
        return script;
      })
  );
  
  // 병렬 처리 (동시 5개)
  const results = await limitedParallel(tasks, 5);
  
  // 중복 제거
  const uniqueScripts = deduplicate(results);
  
  console.log(`Generated ${uniqueScripts.length} unique scripts out of 100`);
  
  return uniqueScripts;
}

/**
 * 캐시 키 생성
 */
export function getCacheKey(keyword: string, category: string, lang: string): string {
  return `scripts:${hashContent(keyword + category + lang)}`;
}
