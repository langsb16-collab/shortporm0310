/**
 * Batch Generation Service
 * 100개 스크립트 대량 생성 서비스
 */

import { generate100Scripts, getCacheKey } from './generator';

export interface BatchGenerationOptions {
  keyword: string;
  category: string;
  lang: string;
  onProgress?: (completed: number, total: number) => void;
  useCache?: boolean;
}

export interface BatchResult {
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  completed: number;
  total: number;
  scripts?: any[];
  error?: string;
  timestamp: string;
}

/**
 * 로컬 캐시 (브라우저 IndexedDB 또는 메모리)
 */
const cache = new Map<string, any>();

/**
 * 100개 스크립트 생성 시작
 */
export async function startBatchGeneration(
  options: BatchGenerationOptions
): Promise<{ jobId: string }> {
  const { keyword, category, lang, onProgress, useCache = true } = options;
  
  // 캐시 확인
  if (useCache) {
    const cacheKey = getCacheKey(keyword, category, lang);
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log('✅ Batch generation from cache');
      if (onProgress) onProgress(100, 100);
      return { jobId: cached.jobId };
    }
  }
  
  // Job ID 생성
  const jobId = `batch-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  console.log(`🚀 Starting batch generation: ${jobId}`);
  
  // 백그라운드에서 생성 시작
  generateInBackground(jobId, options).catch(console.error);
  
  return { jobId };
}

/**
 * Job 상태 확인
 */
export async function checkJobStatus(jobId: string): Promise<BatchResult> {
  // API 호출 또는 로컬 상태 확인
  const statusKey = `job-status:${jobId}`;
  const status = cache.get(statusKey);
  
  if (!status) {
    return {
      jobId,
      status: 'failed',
      progress: 0,
      completed: 0,
      total: 100,
      error: 'Job not found',
      timestamp: new Date().toISOString()
    };
  }
  
  return status;
}

/**
 * 백그라운드 생성
 */
async function generateInBackground(
  jobId: string,
  options: BatchGenerationOptions
) {
  const { keyword, category, lang, onProgress } = options;
  const statusKey = `job-status:${jobId}`;
  
  try {
    // 초기 상태 저장
    cache.set(statusKey, {
      jobId,
      status: 'processing',
      progress: 0,
      completed: 0,
      total: 100,
      timestamp: new Date().toISOString()
    });
    
    // 100개 생성
    const scripts = await generate100Scripts(
      keyword,
      category,
      lang,
      (completed, total) => {
        const progress = (completed / total) * 100;
        
        cache.set(statusKey, {
          jobId,
          status: 'processing',
          progress,
          completed,
          total,
          timestamp: new Date().toISOString()
        });
        
        if (onProgress) onProgress(completed, total);
      }
    );
    
    // 완료 상태 저장
    const result = {
      jobId,
      status: 'completed' as const,
      progress: 100,
      completed: scripts.length,
      total: 100,
      scripts,
      timestamp: new Date().toISOString()
    };
    
    cache.set(statusKey, result);
    cache.set(getCacheKey(keyword, category, lang), result);
    
    console.log(`✅ Batch generation completed: ${scripts.length} scripts`);
    
  } catch (error: any) {
    console.error(`❌ Batch generation failed:`, error);
    
    cache.set(statusKey, {
      jobId,
      status: 'failed' as const,
      progress: 0,
      completed: 0,
      total: 100,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * 캐시 클리어
 */
export function clearCache() {
  cache.clear();
  console.log('🗑️ Cache cleared');
}
