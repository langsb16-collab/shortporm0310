/**
 * API 키 설정 안내
 */

export function showApiKeySetup() {
  const hasApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!hasApiKey) {
    console.error(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  GEMINI API KEY 설정 필요
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Google AI Studio에서 API 키 생성:
   https://aistudio.google.com/app/apikey

2. 프로젝트 루트에 .env 파일 생성:
   VITE_GEMINI_API_KEY=your_api_key_here

3. 개발 서버 재시작:
   npm run dev

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
    
    return false;
  }
  
  return true;
}

/**
 * API 키 검증
 */
export function validateApiKey(): boolean {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    alert("⚠️ API 키가 설정되지 않았습니다.\n\n1. .env 파일에 VITE_GEMINI_API_KEY를 추가하세요.\n2. 개발 서버를 재시작하세요.");
    return false;
  }
  
  if (apiKey === "your_gemini_api_key_here") {
    alert("⚠️ API 키를 실제 값으로 변경해주세요.\n\nGoogle AI Studio에서 API 키를 생성하세요:\nhttps://aistudio.google.com/app/apikey");
    return false;
  }
  
  return true;
}
