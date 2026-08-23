# 개발 결과 — Global Public Health Lens

작성일: 2026-08-20

## 구현 기능

- 단일 랜딩 페이지와 앵커 내비게이션
- 데스크톱·태블릿·모바일 반응형 레이아웃
- 모바일 햄버거 메뉴, Escape 닫기, 기본 포커스 반환
- 8개 미량영양소 editorial list와 인라인 상세 확장
- Iron을 사례로 한 body → communities → public-health systems 3단계 서사
- Public Health Solutions 6종과 사례연구 3종
- `GPH Lens: Nutrition` 앱 프리뷰와 Coming Soon 상태
- 기관 출처 8종, 건강 고지, 연락 폼, honeypot, 클라이언트 검증, 성공·오류 상태
- SEO 메타데이터, Open Graph 이미지, favicon, sitemap, robots

## 주요 파일 구조

- `app/page.tsx`: 랜딩 페이지 구조와 상호작용
- `app/globals.css`: 병합 디자인 토큰, 레이아웃, 반응형 규칙
- `content/`: 사이트 설정, 내비게이션, 영양소·해법·사례연구·출처 데이터
- `public/brand/`: 전달된 PNG 에셋과 재작성한 로고 SVG
- `DESIGN.md`: IBM·WIRED·Notion 규칙 병합본
- `docs/design/`: 원본 디자인 문서와 병합 기록

## 기술 및 디자인

- Vinext 기반 App Router, React, TypeScript, Tailwind CSS v4
- Cloud / White surface 교대, Deep Navy 중심 팔레트, Teal·Green·Gold 제한 사용
- 전역 radius 0, 그림자와 gradient 없음, hairline divider 기반 위계
- 본문 영문, UI 텍스트·변수·컴포넌트·주석 영문
- 키보드 포커스 링, skip link, 의미 있는 alt, `prefers-reduced-motion` 적용

## 미구현 및 확장 지점

- `/guide`, `/guide/[slug]`, `/solutions`, `/about`, `/projects/[slug]` 라우트는 구조 확장용 데이터만 준비
- 실제 연락 전송은 `content/site-config.ts`의 `contact.endpoint`에 Formspree URL을 넣으면 활성화
- 앱은 `nutritionApp.status`가 `live`일 때 링크 CTA로 전환
- 조직 이메일, 도메인, 소셜 링크, 앱 스토어 링크는 소유자 입력 대기 placeholder

## 검증 및 실행

- `npm run lint` 통과
- `npm run build` 통과
- 로컬 라우트 응답 확인
- 반응형 기준: 320 / 375 / 768 / 1024 / 1440 / 1920px

## 배포

Sites 비공개 배포 완료: https://gphl-lens.alsrbalsrjs.chatgpt.site
