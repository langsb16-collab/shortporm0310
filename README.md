<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI 숏폼 자동 제작 (AI Factory)

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
- **Cloudflare Pages**: https://shortporm0310.pages.dev
- **GitHub**: https://github.com/langsb16-collab/shortporm0310
- **AI Studio**: https://ai.studio/apps/0395f5ce-d8c6-410b-b6b9-7913471d8802

## 기술 스택
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS 4.1
- **Animation**: Motion (Framer Motion)
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: Google Gemini API
- **Deployment**: Cloudflare Pages

## 프로젝트 구조
```
webapp/
├── src/
│   ├── App.tsx                 # 메인 애플리케이션
│   ├── main.tsx               # 진입점
│   ├── components/
│   │   ├── Sidebar.tsx        # 사이드바 네비게이션
│   │   ├── TopBar.tsx         # 상단 바
│   │   ├── VideoGenerator.tsx # 비디오 생성기
│   │   ├── Dashboard.tsx      # 대시보드
│   │   ├── Analytics.tsx      # 분석
│   │   ├── History.tsx        # 히스토리
│   │   ├── Trends.tsx         # 트렌드
│   │   ├── Settings.tsx       # 설정
│   │   ├── Upload.tsx         # 업로드
│   │   ├── ChatWindow.tsx     # 채팅 창
│   │   └── FAQWindow.tsx      # FAQ 창
│   └── lib/
│       ├── gemini.ts          # Gemini API 연동
│       └── i18n.ts            # 다국어 지원
├── dist/                      # 빌드 출력
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 데이터 아키텍처
- **AI 모델**: Google Gemini API
- **데이터 흐름**: 
  1. 사용자 키워드 입력
  2. Gemini API로 콘텐츠 생성 요청
  3. AI가 숏폼 비디오 스크립트 생성
  4. 대시보드에서 결과 확인 및 관리

## 사용자 가이드

### 1. 비디오 생성
1. 왼쪽 사이드바에서 "영상 제작" 선택
2. 키워드 입력 (예: "Elon Musk, Real Estate, AI Trends")
3. 카테고리 선택 (Economy, Entertainment 등)
4. 타겟 플랫폼 선택 (Shorts, TikTok, Reels)
5. "생성하기" 버튼 클릭

### 2. 대시보드
- 생성된 비디오 통계 확인
- 조회수, 좋아요 등 성과 분석
- 최근 활동 내역 확인

### 3. 트렌드
- 인기 키워드 확인
- 트렌딩 카테고리 분석
- 추천 콘텐츠 아이디어

### 4. 히스토리
- 생성한 모든 비디오 목록
- 필터링 및 검색 기능
- 상세 정보 확인

## 로컬 개발

**필수 요구사항:** Node.js

1. 의존성 설치:
   ```bash
   npm install
   ```

2. 환경 변수 설정:
   `.env.local` 파일에 Gemini API 키 설정
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. 개발 서버 실행:
   ```bash
   npm run dev
   ```
   브라우저에서 http://localhost:3000 접속

4. 빌드:
   ```bash
   npm run build
   ```

## 배포
- **플랫폼**: Cloudflare Pages
- **상태**: ✅ 활성화
- **자동 배포**: GitHub 연동
- **마지막 업데이트**: 2026-03-10

### 배포 명령어
```bash
# 빌드 및 배포
npm run build
npx wrangler pages deploy dist --project-name shortporm0310
```

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

## 미구현 기능
- 실제 비디오 생성 및 렌더링 백엔드
- 사용자 인증 시스템
- 데이터베이스 연동
- 파일 업로드 스토리지
- 결제 시스템

## 권장 다음 단계
1. **백엔드 API 구축**: 실제 비디오 생성을 위한 서버 구현
2. **인증 시스템**: 사용자 로그인/회원가입 기능
3. **데이터베이스**: 사용자 데이터 및 비디오 정보 저장
4. **스토리지**: 생성된 비디오 파일 저장소 연동
5. **결제 연동**: 유료 플랜을 위한 결제 시스템

## 라이선스
MIT License
