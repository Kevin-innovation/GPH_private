# Phase 8 완료 기록 — 전체 회귀·배포 게이트

> 완료일: 2026-09-12  
> 대상: `Kevin-innovation/GPH_private` / `main`

## 검수 범위

- `/`, `/about/mission`, `/about/team`, `/country-spotlight`, `/lens/micronutrients`, `/lens/how-it-works`, `/lens/solutions`, `/nutrition-app`, `/evidence-base`, `/contact` 10개 canonical route
- 320 / 375 / 768 / 1024 / 1440 / 1920px CSS 기준 폭 계약과 실제 데스크톱 배포 뷰포트
- Header dropdown, mobile dialog/inert 계약, nutrient filter·selection, country selection·globe fallback, contact validation, external source links, back/forward URL state
- 일반 모션·`prefers-reduced-motion` CSS variant·WebGL 미지원 fallback·Footer 접합·가로 overflow

## 발견 및 보정

배포 URL을 1265px 데스크톱 뷰포트로 점검하던 중 Micronutrients 활성 카드의 hover/focus 화살표가 컨테이너 바깥으로 5px 넘치는 회귀를 발견했다. 901–1300px에서 활성 카드의 음수 margin을 제거해 카드 강조는 유지하면서 `scrollWidth === clientWidth`를 만족하도록 수정했다.

## 검증 결과

- 배포 URL 홈, Mission, Country Spotlight, Micronutrients, Contact의 접근성 트리에서 route title·`h1`·skip link·Primary navigation·Footer·핵심 상태 문구를 확인했다.
- 홈에서 About dropdown을 키보드 `Enter`로 열고 `Our Mission` 링크를 활성화해 실제 route 이동을 확인했다.
- 배포 페이지에서 Fontshare stylesheet/preconnect와 핵심 페이지 `h1`을 확인했다. Country/Contact는 가로 overflow가 없고, Micronutrients도 보정 후 overflow가 없다.
- Sitemap은 10개 canonical path를 포함하고, robots는 canonical sitemap URL을 노출한다.
- `npm test` — 통과 (17 tests, production build 포함)
- `npm run lint` — 통과
- `git diff --check` — 통과
- `private/main` 푸시 후 Vercel 배포 URL을 재확인했다.

## 기준 문서 대조

최신 Vercel Web Interface Guidelines의 접근성, focus, animation, typography, images, performance, navigation/state 규칙을 대조했다. icon-only controls의 label, semantic links/buttons, visible focus, reduced motion, explicit transitions, image dimensions/lazy loading, CDN preconnect, URL state 계약이 유지된다.

## 최종 상태

Phase 7 보정 페이즈와 Phase 8 release gate가 모두 완료됐다. 이후 변경은 새 기능/콘텐츠 작업으로 별도 계획한다.
