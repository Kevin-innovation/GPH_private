# Phase 0 — 재개편 기준선 감사

> 감사일: 2026-09-11  
> 저장소: `Kevin-innovation/GPH_private` / `main`  
> 대상: `http://localhost:3000` 현재 구현  
> 기준 문서: [`docs/REBUILD_PLAN.md`](../REBUILD_PLAN.md)

## 1. 감사 범위와 방법

- 현재 독립 라우트 10개를 브라우저에서 순회하고 접근성 트리를 확인했다.
- 전 라우트에서 `main`, 콘텐츠 Section, Footer의 실제 위치와 높이를 측정했다.
- 현재 foreground 브라우저 뷰포트는 `1325 × 1824`였다. 320 / 375 / 768 / 1024 / 1440 / 1920px 폭은 전역 CSS의 `560px`, `900px`, `1200px` 분기와 각 컴포넌트의 반응형 규칙을 소스 기준으로 대조했다.
- `npm test`를 실행해 production build, 콘텐츠 소스, 국가 5개, Three.js lazy-load, canonical route 회귀를 확인했다.

## 2. 라우트 기준선

| 라우트 | 문서 제목 | 핵심 콘텐츠 | 현재 상태 |
|---|---|---|---|
| `/` | See Health in Context | Hero, Body/Environment/Systems lens, project directory | 렌더링 정상. 홈 디렉터리가 전체 상세 진입점을 반복함 |
| `/about/mission` | Our Mission | 6 determinants 인터랙션 | 렌더링 정상. 5:7 가로 분할과 별도 breadcrumb 사용 |
| `/about/team` | Our Team | Founder 프로필과 4개 챕터 | 렌더링 정상. Founder는 Team 내부에 포함됨 |
| `/country-spotlight` | Country Spotlight | Three.js globe, 5개 국가 선택, 출처 | 렌더링 정상. 지도와 설명이 넓은 2열 구조 |
| `/lens/micronutrients` | Micronutrients | nutrient atlas와 필터 | 렌더링 정상. atlas가 가로 2열로 확장됨 |
| `/lens/how-it-works` | How the Lens Works | body → community → systems 흐름 | 렌더링 정상. 여러 콘텐츠 블록이 가로 확장됨 |
| `/lens/solutions` | Solutions & Action | 6개 action, case studies | 렌더링 정상. solutions/case가 4:8 구조 |
| `/nutrition-app` | Nutrition App | workflow, 앱 화면, CTA | 렌더링 정상. 앱 설명과 이미지가 2열 |
| `/evidence-base` | Evidence Base | WHO/UNICEF/NIH/USDA source table | 렌더링 정상. 푸터 유틸리티 링크 유지 |
| `/contact` | Contact | 안내문과 contact form | 렌더링 정상. 2열 form 구조 |

## 3. 치수 및 레이아웃 증거

측정 기준은 `1325 × 1824` 뷰포트다. `sectionBottom → footerTop` 사이가 실제로 비어 있는 영역이며, 시각적으로는 `route-main`의 최소 높이가 만든 빈 띠다.

| 라우트 | 콘텐츠 Section bottom | Footer top | 빈 영역 |
|---|---:|---:|---:|
| `/about/mission` | 1,350.7px | 1,896.6px | **545.9px** |
| `/about/team` | 1,428.7px | 1,896.6px | **467.9px** |
| `/country-spotlight` | 1,334.5px | 1,896.6px | **562.2px** |
| `/lens/micronutrients` | 2,056.1px | 2,056.1px | 0px |
| `/lens/how-it-works` | 2,126.3px | 2,126.3px | 0px |
| `/lens/solutions` | 1,505.1px | 1,896.6px | **391.5px** |
| `/nutrition-app` | 1,050.7px | 1,896.6px | **845.9px** |
| `/evidence-base` | 733.1px | 1,896.6px | **1,163.5px** |
| `/contact` | 795.0px | 1,896.6px | **1,101.7px** |

확인된 원인은 다음과 같다.

1. `.route-main { min-height: 100vh; }`가 짧은 상세 페이지 아래에 빈 높이를 강제로 추가한다.
2. `Footer` 자체의 `margin-top`은 `0`이지만, 실제 빈 영역은 Footer 이전의 `route-main` 내부에 생긴다.
3. `.mission-grid`, `.split-grid`, `.app-grid`, `.sources-grid`, `.contact-grid`가 공통으로 `5fr 7fr`와 최대 `144px` gap을 사용한다.
4. `.solutions-wrap`, `.case-studies`가 `4fr 8fr`와 최대 `120px` gap을 사용한다.
5. 홈도 `.hero-grid`와 `.directory-intro`에서 넓은 좌우 분할을 사용한다. 홈은 짧은 핵심 소개만 남기고 디렉터리를 축소해야 한다.

## 4. CSS 및 컴포넌트 리스크 목록

### P0 — Phase 1에서 반드시 해결

- `app/globals.css`가 5,279줄이며 같은 컴포넌트 선택자가 여러 후속 override 블록에 반복된다. 토큰 / reset / shell / component / responsive 순서로 재정렬해야 한다.
- `route-main`의 `min-height`와 분리된 breadcrumb band를 제거하거나 콘텐츠 골격 안으로 통합해야 한다.
- 상세 페이지 핵심 흐름을 1열 우선으로 바꾸고, 2열은 비교가 필요한 짧은 블록에만 허용해야 한다.
- 마지막 콘텐츠 Section 바로 다음에 Footer가 붙도록 모든 페이지에서 확인해야 한다.

### P1 — 페이지 재구축 중 해결

- `HomeDirectory`가 상세 페이지 링크 대부분을 반복하므로 홈의 핵심 진입점 2~3개로 축소한다.
- 기존 `hero-lens-*` 계열 스타일이 여러 실험 버전으로 누적되어 있어 실제 사용 컴포넌트와 불필요한 장식 스타일을 분리한다.
- 모든 페이지의 첫 장면을 `PageHero` 또는 주제별 인터랙티브 스테이지로 통일하되, 페이지 목적에 맞는 에셋을 사용한다.
- Breadcrumb를 별도 빈 띠로 두지 않고 Hero 하단 또는 첫 콘텐츠 내부에 배치한다.
- 관련 페이지와 Evidence / review strip을 Footer 직전에 연결한다.

### P2 — Phase 7 최종 QA에서 검증

- 제목과 CTA의 겹침 및 고아 줄바꿈을 320px부터 1920px까지 재검증한다.
- hover / focus / click 상태에서 1~3px 이내의 제한된 이동만 허용하고, 반복 state update로 인한 쉐이킹을 재현 테스트한다.
- `prefers-reduced-motion`, WebGL 미지원, 키보드 탐색, touch 선택 상태를 확인한다.

## 5. 유지 / 리팩터링 / 폐기 기준

### 유지

- `Header`, `Footer`, skip link, mobile focus trap
- `content/navigation.ts`의 확정 정보 구조와 모든 canonical route
- `content/countries.ts`, `content/nutrients.ts`, `content/sources.ts`, `content/founder.ts`의 검토된 콘텐츠
- Three.js lazy-load와 compact Earth texture
- `SectionShell`, `SectionHeading`, `Eyebrow`, `ButtonLink`, `ExternalLink`, `orphanSafeText`

### 리팩터링

- `RoutePage`를 vertical page shell로 변경하고 breadcrumb를 통합한다.
- `Hero`, `HeroVisual`, `CountrySpotlight`, `NutrientAtlas`, `LensChain`을 공통 `PageHero` / `ContentBand` / `RelatedPages` 패턴에 맞춘다.
- `app/globals.css`의 중복 규칙과 오래된 실험용 override를 정리한다.
- 각 상세 페이지의 가로 grid를 세로 chapter 흐름으로 바꾼다.

### 폐기 후보

- `route-main`의 강제 `min-height: 100vh`
- 콘텐츠 높이를 늘리기 위한 빈 spacer 및 별도 breadcrumb 띠
- 의미 없이 반복되는 큰 2열 gap과 카드형 장식선
- 홈에서 전체 상세 내용을 재노출하는 directory row

## 6. 확정 페이지 골격

모든 상세 페이지는 다음 순서를 기본으로 삼는다.

```text
Overlay Header
→ Page Hero
→ Hero 내부 Breadcrumb / Context
→ Lead Statement
→ Vertical Story Chapters
→ Topic Interaction
→ Related Pages
→ Evidence / Review Strip
→ Footer
```

홈은 예외적으로 다음의 짧은 핵심 흐름만 유지한다.

```text
Immersive Hero
→ Body / Environment / Systems interaction
→ Short project definition
→ Country Spotlight / Nutrition App pathways
→ Evidence strip
→ Footer
```

## 7. 회귀 검증 결과

`npm test` 결과: **5개 테스트 모두 통과**

- production client/server entry 생성
- 모든 콘텐츠 source URL HTTPS 및 review date 유효성
- Country Spotlight 5개 국가 고정: South Korea, India, Mexico, France, United States
- Hero / Country Globe의 Three.js lazy-load 및 compact texture
- canonical route, native brand home link, directory href, 중복 `Explore the Map` 없음

## 8. Phase 0 종료 판단

기준선과 리스크가 고정되었고, 현재 코드가 유지해야 할 정보 구조와 재구축할 레이아웃이 분리되었다. 다음 단계는 **Phase 1 — 전역 디자인 시스템과 사이트 셸**이다.
