# AI Factory - AI 숏폼 자동 제작

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## 프로젝트 개요
- **이름**: AI Factory - AI 숏폼 자동 제작
- **목표**: 키워드 하나로 100개의 숏폼 콘텐츠를 자동 생성하는 AI 서비스
- **주요 기능**:
  - 🎬 AI 기반 숏폼 비디오 자동 생성
  - 📊 대시보드 및 분석 기능
  - 📈 트렌드 분석 및 추천
  - 📁 업로드 및 히스토리 관리
  - 🌐 다국어 지원 (한국어/영어)
  - 💬 채팅 및 FAQ 지원

## URLs
- **프로덕션**: https://puke365.biz
- **최신 배포**: https://80f01995.shortporm0310.pages.dev
- **Cloudflare Pages**: https://shortporm0310.pages.dev
- **GitHub**: https://github.com/langsb16-collab/shortporm0310

## 기술 스택
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS 4.1
- **Animation**: Motion (Framer Motion)
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: Google Gemini API (@google/genai)
- **Deployment**: Cloudflare Pages

## 로컬 개발

**필수 요구사항:** Node.js 18+

### 1. 저장소 클론
```bash
git clone https://github.com/langsb16-collab/shortporm0310.git
cd shortporm0310
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
Gemini API 키가 필요합니다. [Google AI Studio](https://aistudio.google.com/apikey)에서 API 키를 발급받으세요.

`.env.local` 파일 생성:
```bash
cp .env.example .env.local
```

`.env.local` 파일에 API 키 입력:
```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**⚠️ 중요**: `.env.local` 파일은 절대 Git에 커밋하지 마세요!

### 4. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 http://localhost:3000 접속

### 5. 빌드
```bash
npm run build
```

## Cloudflare Pages 배포

### 환경 변수 설정 (필수)
Cloudflare Pages에서 Gemini API가 작동하려면 환경 변수를 설정해야 합니다:

1. [Cloudflare 대시보드](https://dash.cloudflare.com) 접속
2. Pages > shortporm0310 > Settings > Environment variables
3. 환경 변수 추가:
   - **Variable name**: `VITE_GEMINI_API_KEY`
   - **Value**: 발급받은 Gemini API 키
   - **Environment**: Production (및 Preview 환경도 필요시 설정)
4. 저장 후 프로젝트 재배포

### 수동 배포
```bash
# 빌드
npm run build

# 배포 (Cloudflare API 토큰 필요)
export CLOUDFLARE_API_TOKEN="your_token"
npx wrangler pages deploy dist --project-name shortporm0310
```

### GitHub를 통한 자동 배포
```bash
git add .
git commit -m "Update features"
git push origin main
```
Cloudflare Pages가 자동으로 빌드 및 배포를 진행합니다.

## 프로젝트 구조
```
shortporm0310/
├── src/
│   ├── App.tsx                 # 메인 애플리케이션
│   ├── main.tsx               # 진입점
│   ├── vite-env.d.ts          # TypeScript 환경 변수 타입
│   ├── components/
│   │   ├── Sidebar.tsx        # 사이드바 네비게이션
│   │   ├── TopBar.tsx         # 상단 바
│   │   ├── VideoGenerator.tsx # 비디오 생성기 (메인)
│   │   ├── Dashboard.tsx      # 대시보드
│   │   ├── Analytics.tsx      # 분석
│   │   ├── History.tsx        # 히스토리
│   │   ├── Trends.tsx         # 트렌드
│   │   ├── Settings.tsx       # 설정
│   │   ├── Upload.tsx         # 업로드
│   │   ├── ChatWindow.tsx     # 채팅 창
│   │   └── FAQWindow.tsx      # FAQ 창
│   └── lib/
│       ├── gemini.ts          # Gemini API 연동 (수정됨)
│       └── i18n.ts            # 다국어 지원
├── dist/                      # 빌드 출력
├── .env.example               # 환경 변수 예제
├── .env.local                 # 로컬 환경 변수 (Git 제외)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 데이터 아키텍처
- **AI 모델**: Google Gemini 3 Flash Preview
- **이미지 생성**: Gemini 2.5 Flash Image
- **데이터 흐름**: 
  1. 사용자 키워드 입력
  2. Gemini API로 콘텐츠 생성 요청
  3. AI가 3개의 숏폼 비디오 스크립트 생성
  4. 선택된 스크립트의 썸네일 이미지 생성 (9:16 비율)
  5. 대시보드에서 결과 확인 및 관리

## 사용자 가이드

### 1. 비디오 생성 (생성하기 버튼)
1. 왼쪽 사이드바에서 "영상 제작" 선택
2. 키워드 입력 (예: "Elon Musk, Real Estate, AI Trends")
3. 카테고리 선택 (Economy, Entertainment 등)
4. 타겟 플랫폼 선택 (Shorts, TikTok, Reels)
5. **"생성하기" 버튼 클릭**
   - API 키가 설정되지 않은 경우: 에러 메시지 표시
   - API 키가 설정된 경우: 3개의 스크립트 생성

### 2. 스크립트 선택
- 생성된 3개의 스크립트 카드 중 선택
- 각 스크립트는 제목, 훅, 본문, 해시태그 포함
- "선택 및 렌더링" 버튼 클릭

### 3. 미리보기 및 편집
- 9:16 비율의 모바일 프리뷰 확인
- AI 생성 썸네일 확인
- BGM, 자막, B-Roll 옵션 편집
- 예상 조회수, CTR, 바이럴 점수 확인

### 4. 다운로드 및 발행
- 다운로드 버튼으로 비디오 저장
- YouTube 발행 버튼으로 바로 업로드

## 최근 업데이트 (2026-03-10)

### ✅ 수정된 내용
1. **환경 변수 수정**: `process.env` → `import.meta.env` (Vite 호환)
2. **API 키 변수명 변경**: `GEMINI_API_KEY` → `VITE_GEMINI_API_KEY`
3. **에러 처리 개선**: API 키 누락 시 명확한 에러 메시지
4. **UI 에러 표시**: 생성하기 버튼 클릭 시 에러 발생 시 빨간색 알림 표시
5. **TypeScript 타입 정의**: `vite-env.d.ts` 파일 추가
6. **.env.local 파일**: 로컬 개발용 환경 변수 파일 생성

### 🐛 해결된 문제
- **"생성하기" 버튼 먹통 문제**: Gemini API 키 환경 변수 오류로 인한 문제 해결
- API 키가 없거나 잘못된 경우 명확한 에러 메시지 표시
- Vite 환경에서 환경 변수가 제대로 로드되지 않던 문제 해결

## 트러블슈팅

### "생성하기" 버튼이 작동하지 않아요
1. `.env.local` 파일이 존재하는지 확인
2. `VITE_GEMINI_API_KEY` 값이 올바르게 설정되어 있는지 확인
3. 개발 서버를 재시작: `npm run dev`
4. 브라우저 콘솔(F12)에서 에러 메시지 확인

### Cloudflare Pages에서 작동하지 않아요
1. Cloudflare 대시보드에서 환경 변수 설정 확인
2. `VITE_GEMINI_API_KEY`가 Production 환경에 설정되어 있는지 확인
3. 프로젝트 재배포: Settings > Deployments > Retry deployment

### API 키 오류
- Gemini API 키가 유효한지 확인: https://aistudio.google.com/apikey
- API 키 권한 확인: Gemini API 사용 권한 필요
- 요금제 확인: API 사용량 제한 확인

## 완료된 기능
✅ AI 기반 비디오 생성 인터페이스
✅ 대시보드 및 통계
✅ 분석 기능
✅ 히스토리 관리
✅ 트렌드 분석
✅ 설정 페이지
✅ 업로드 기능
✅ 다국어 지원 (한국어/영어)
✅ 반응형 디자인
✅ 채팅 및 FAQ 지원
✅ Cloudflare Pages 배포
✅ Gemini API 연동
✅ 에러 처리 및 사용자 피드백
✅ 환경 변수 관리

## 미구현 기능
- 실제 비디오 렌더링 엔진
- 사용자 인증 시스템
- 데이터베이스 연동
- 파일 업로드 스토리지
- 결제 시스템
- YouTube API 직접 업로드
- BGM 라이브러리 연동
- 자막 커스터마이징

## 권장 다음 단계
1. **비디오 렌더링 엔진**: FFmpeg 또는 Video API 연동
2. **인증 시스템**: Clerk 또는 Auth0 연동
3. **데이터베이스**: Cloudflare D1 또는 Supabase 연동
4. **스토리지**: Cloudflare R2 또는 AWS S3 연동
5. **YouTube API**: 자동 업로드 기능 구현

## 배포 상태
- **플랫폼**: Cloudflare Pages ✅
- **자동 배포**: GitHub 연동 ✅
- **커스텀 도메인**: puke365.biz ✅
- **SSL/TLS**: 활성화 ✅
- **최종 배포**: 2026-03-10

## 라이선스
MIT License

## 연락처
- **GitHub**: langsb16-collab
- **Email**: langsb16@gmail.com

---

**마지막 업데이트**: 2026-03-10 - "생성하기" 버튼 문제 해결
