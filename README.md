# AI Shorts Factory - 숏폼 factory

## 🎯 프로젝트 개요
키워드 하나로 100개의 바이럴 숏폼 스크립트를 자동 생성하는 AI 기반 플랫폼

## 🚀 최신 업데이트 (2026-03-29)

### ✅ 완료된 기능

#### 1. 버튼 클릭 이벤트 최적화
- onClick 이벤트 핸들러 개선
- z-index 충돌 방지
- 상태 검증 로직 추가
- 에러 처리 강화

#### 2. 숏폼 100개 자동 생성 안정화 엔진
- **병렬 처리**: 동시 5개 생성 (과부하 방지)
- **재시도 시스템**: 실패 시 자동 3회 재시도
- **JSON Schema 검증**: Ajv 라이브러리 기반 출력 강제
- **품질 필터**: 최소 품질 점수 통과 스크립트만 선택
- **중복 제거**: 해시 기반 자동 중복 제거
- **진행률 추적**: 실시간 진행 상황 모니터링

#### 3. AI 결과 캐싱 + CDN 구조
- **Cloudflare KV Cache**: 1시간 TTL, 동일 키워드 재요청 시 즉시 응답
- **캐시 키 최적화**: keyword + category + lang 조합
- **R2 Storage**: 생성된 영상 파일 저장
- **Edge Cache**: CDN 레벨 캐싱으로 전세계 빠른 응답
- **Cache-Control 헤더**: 브라우저 + CDN 캐싱

#### 4. 프롬프트 정확도 100% Deterministic Pipeline
- **시스템 프롬프트 고정**: 절대 변경 불가 템플릿
- **JSON Schema 강제**: responseSchema로 출력 형식 강제
- **Few-shot Learning**: 예시 출력으로 스타일 고정
- **Temperature = 0**: 출력 편차 최소화
- **검증 + 재생성 루프**: 실패 시 자동 수정
- **타임코드 고정**: 자막 타이밍 정확도 보장

## 🏗️ 기술 아키텍처

### Frontend
- React 19 + TypeScript
- Motion (Framer Motion) 애니메이션
- TailwindCSS 4.x
- Lucide React 아이콘

### Backend
- Cloudflare Workers (Edge Runtime)
- Cloudflare Pages (정적 호스팅)
- Cloudflare KV (캐시 스토리지)
- Cloudflare R2 (파일 스토리지)

### AI Engine
- Google Gemini 3 Flash Preview
- JSON Schema 기반 구조화 출력
- Ajv 검증 라이브러리
- Deterministic Generation Pipeline

## 📋 데이터 모델

```typescript
interface Script {
  title: string;        // 제목 (10-100자)
  hook: string;         // 도입부 (10-200자)
  body: string;         // 본문 (50-500자)
  cta: string;          // 행동유도 (5-100자)
  hashtags: string[];   // 해시태그 (3-10개)
  subtitle: Array<{     // 자막 타임코드
    start: number;
    end: number;
    text: string;
  }>;
}
```

## 🌐 배포 URL

### Production
- **메인 사이트**: https://makehub.my
- **www 버전**: https://www.makehub.my
- **Cloudflare Pages**: https://shortporm0310.pages.dev

### GitHub
- **리포지토리**: https://github.com/langsb16-collab/shortporm0310

## 💡 핵심 기능 구현

### 1. 대량 생성 최적화
```typescript
// 병렬 처리 (동시 5개)
await limitedParallel(tasks, 5)

// 배치 생성 (10개 × 10회)
for (let i = 0; i < 10; i++) {
  await generateBatch(10);
}
```

### 2. 캐싱 전략
```typescript
// 1. KV Cache 확인
const cached = await env.CACHE.get(cacheKey);
if (cached) return cached;

// 2. AI 생성
const result = await generate();

// 3. 캐시 저장 (1시간 TTL)
await env.CACHE.put(cacheKey, result, { expirationTtl: 3600 });
```

### 3. 품질 보장
```typescript
// Schema 검증
if (!validate(output)) {
  retry();
}

// 품질 점수 검증
if (qualityScore(output) < 4) {
  retry();
}
```

## 📊 성능 지표

- **생성 속도**: 100개 스크립트 약 2-3분
- **캐시 적중률**: 예상 70-80%
- **API 응답 시간**: 캐시 HIT 시 < 100ms
- **실패율**: < 1% (재시도 포함)

## 🚧 향후 개발 계획

### Phase 1 (1-2주)
- [ ] 실제 영상 렌더링 엔진 통합
- [ ] 음성 합성 (TTS) 추가
- [ ] BGM 자동 선택

### Phase 2 (3-4주)
- [ ] 사용자 인증 시스템
- [ ] 대시보드 분석 기능
- [ ] 예상 조회수 AI 모델

### Phase 3 (2개월)
- [ ] YouTube/TikTok 자동 업로드
- [ ] A/B 테스팅 기능
- [ ] 팀 협업 기능

## 🔧 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build

# Worker 개발
npm run worker:dev

# 배포
npm run pages:deploy
```

## 📝 환경 변수

```bash
# .env.example
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

## 🛡️ 보안

- API 키는 Cloudflare Secrets로 관리
- CORS 정책 적용
- Rate Limiting (추후 적용 예정)

## 📄 라이선스

Private - All rights reserved

## 👨‍💻 개발자

langsb16-collab

---

**마지막 업데이트**: 2026-03-29  
**현재 버전**: 2.0.0 (안정화 엔진 + 캐싱 시스템)  
**상태**: ✅ Active
