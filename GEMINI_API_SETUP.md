# Gemini API 키 설정 가이드

## 문제 상황
"생성하기" 버튼을 클릭했을 때 아무 반응이 없거나 에러 메시지가 표시되는 경우, Gemini API 키가 설정되지 않았기 때문입니다.

## 해결 방법

### 1단계: Gemini API 키 발급받기

1. **Google AI Studio 접속**
   - 링크: https://aistudio.google.com/apikey
   - Google 계정으로 로그인

2. **API 키 생성**
   - "Create API Key" 버튼 클릭
   - 프로젝트 선택 또는 새 프로젝트 생성
   - 생성된 API 키 복사 (예: `AIzaSyA...`)

⚠️ **중요**: API 키는 한 번만 표시됩니다. 안전한 곳에 저장하세요!

### 2단계: Cloudflare Pages 환경 변수 설정

#### 방법 A: Cloudflare 대시보드 (권장)

1. **Cloudflare 대시보드 접속**
   - 링크: https://dash.cloudflare.com
   - 계정으로 로그인

2. **프로젝트 설정 이동**
   - Pages > `shortporm0310` 선택
   - Settings > Environment variables 클릭

3. **환경 변수 추가**
   - "Add variable" 버튼 클릭
   - **Variable name**: `VITE_GEMINI_API_KEY`
   - **Value**: 복사한 API 키 붙여넣기
   - **Environment**: Production 선택 (또는 Both)
   - "Save" 버튼 클릭

4. **프로젝트 재배포**
   - Deployments 탭으로 이동
   - 최신 배포의 "Retry deployment" 클릭
   - 또는 GitHub에 새로운 커밋 푸시

#### 방법 B: Wrangler CLI (고급)

```bash
# Cloudflare API 토큰 설정
export CLOUDFLARE_API_TOKEN="by3fVckluRl-M99qGj0TLH60sbSHSiBrqGqnzdTS"

# 환경 변수 설정
npx wrangler pages secret put VITE_GEMINI_API_KEY --project-name shortporm0310

# 프롬프트에서 API 키 입력
```

### 3단계: 배포 확인

1. **브라우저에서 프로덕션 사이트 접속**
   - https://puke365.biz

2. **"생성하기" 버튼 테스트**
   - 키워드 입력 (예: "AI Technology")
   - 카테고리 선택 (예: "Tech")
   - "생성하기" 버튼 클릭
   - 로딩 애니메이션 표시 → 3개의 스크립트 생성

## 로컬 개발 환경 설정

로컬에서 개발하는 경우:

### 1. .env.local 파일 생성

```bash
cd /home/user/webapp
cp .env.example .env.local
```

### 2. API 키 입력

`.env.local` 파일 편집:
```env
VITE_GEMINI_API_KEY=AIzaSyA...your_actual_api_key_here
```

### 3. 개발 서버 재시작

```bash
npm run dev
```

## 문제 해결

### Q1: "생성하기" 버튼을 눌러도 아무 반응이 없어요
**A**: 
1. 브라우저 콘솔(F12) 열기
2. Console 탭에서 에러 메시지 확인
3. "API key is not configured" 에러가 보이면 위의 단계를 따라 API 키 설정

### Q2: 에러 메시지: "GEMINI_API_KEY is not configured"
**A**: 
1. Cloudflare Pages 환경 변수에 `VITE_GEMINI_API_KEY` 추가
2. 프로젝트 재배포
3. 캐시 클리어 후 다시 시도 (Ctrl+Shift+R)

### Q3: API 키를 설정했는데도 작동하지 않아요
**A**: 
1. 환경 변수 이름이 정확한지 확인: `VITE_GEMINI_API_KEY` (대문자)
2. API 키에 공백이나 따옴표가 포함되지 않았는지 확인
3. Cloudflare Pages에서 재배포 후 5-10분 대기
4. 브라우저 캐시 완전 삭제 또는 시크릿 모드로 접속

### Q4: "API quota exceeded" 에러가 나와요
**A**: 
1. Google AI Studio에서 API 사용량 확인
2. 무료 플랜의 경우 일일 요청 제한 확인
3. 필요시 유료 플랜으로 업그레이드

### Q5: 로컬에서는 작동하는데 Cloudflare Pages에서는 안 돼요
**A**: 
1. 로컬 `.env.local`과 Cloudflare Pages 환경 변수가 다름
2. Cloudflare 대시보드에서 환경 변수 다시 확인
3. Production 환경에 설정되어 있는지 확인

## 보안 주의사항

⚠️ **절대 하지 말아야 할 것**:
- API 키를 코드에 직접 하드코딩
- API 키를 GitHub에 커밋
- API 키를 브라우저 콘솔에 출력
- API 키를 다른 사람과 공유

✅ **올바른 방법**:
- 항상 환경 변수 사용
- `.env.local` 파일은 `.gitignore`에 포함
- Cloudflare Pages의 환경 변수 기능 사용
- API 키가 노출되었다면 즉시 삭제하고 새로 발급

## 환경 변수 확인 명령어

### Cloudflare Pages (CLI)
```bash
export CLOUDFLARE_API_TOKEN="by3fVckluRl-M99qGj0TLH60sbSHSiBrqGqnzdTS"
npx wrangler pages secret list --project-name shortporm0310
```

## 추가 리소스

- **Gemini API 문서**: https://ai.google.dev/docs
- **Cloudflare Pages 문서**: https://developers.cloudflare.com/pages/
- **Vite 환경 변수 문서**: https://vitejs.dev/guide/env-and-mode.html

## 완료 체크리스트

배포 전 확인사항:
- [ ] Gemini API 키 발급 완료
- [ ] Cloudflare Pages 환경 변수에 `VITE_GEMINI_API_KEY` 추가
- [ ] Production 환경에 설정 완료
- [ ] 프로젝트 재배포 완료
- [ ] puke365.biz에서 "생성하기" 버튼 테스트 성공

---

**작성일**: 2026-03-10  
**버전**: 1.0  
**상태**: ✅ 배포 완료
