/**
 * Worker API Client
 * 프론트엔드 → Worker → AI API 구조
 */

const WORKER_API_URL = import.meta.env.VITE_WORKER_API_URL || '/api';

export interface Script {
  title: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  subtitle: Array<{
    start: number;
    end: number;
    text: string;
  }>;
}

/**
 * 스크립트 생성 (Worker API 호출)
 */
export async function generateScriptsViaWorker(
  keyword: string,
  category: string = 'Tech',
  lang: string = 'ko'
): Promise<Script[]> {
  console.log(`🌐 Calling Worker API: ${WORKER_API_URL}/generate`);
  
  try {
    const response = await fetch(`${WORKER_API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyword,
        category,
        lang
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `Worker API failed: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`✅ Worker API response:`, data);
    
    if (data.status === 'success' && data.scripts) {
      return data.scripts;
    }
    
    throw new Error('Invalid response from Worker API');
    
  } catch (error: any) {
    console.error('❌ Worker API call failed:', error);
    throw error;
  }
}

/**
 * 100개 스크립트 생성 (Worker API 호출)
 */
export async function generate100ScriptsViaWorker(
  keyword: string,
  category: string = 'Tech',
  lang: string = 'ko'
): Promise<{ jobId: string; message: string }> {
  console.log(`🌐 Calling Worker API: ${WORKER_API_URL}/generate-100`);
  
  try {
    const response = await fetch(`${WORKER_API_URL}/generate-100`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyword,
        category,
        lang
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `Worker API failed: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`✅ Worker API response (batch):`, data);
    
    return {
      jobId: data.jobId,
      message: data.message
    };
    
  } catch (error: any) {
    console.error('❌ Worker API call failed:', error);
    throw error;
  }
}

/**
 * Job 상태 확인
 */
export async function checkJobStatus(jobId: string): Promise<any> {
  try {
    const response = await fetch(`${WORKER_API_URL}/job/${jobId}`);
    
    if (!response.ok) {
      throw new Error(`Job status check failed: ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error: any) {
    console.error('❌ Job status check failed:', error);
    throw error;
  }
}

/**
 * Health check
 */
export async function checkWorkerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${WORKER_API_URL}/health`);
    const data = await response.json();
    
    return data.status === 'ok';
    
  } catch (error) {
    console.error('❌ Worker health check failed:', error);
    return false;
  }
}
