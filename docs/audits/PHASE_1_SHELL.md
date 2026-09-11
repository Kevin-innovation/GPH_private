# Phase 1 — 전역 디자인 시스템과 사이트 셸 완료 기록

> 완료일: 2026-09-11  
> 기준 문서: [`docs/REBUILD_PLAN.md`](../REBUILD_PLAN.md)  
> 이전 감사: [`PHASE_0_BASELINE.md`](PHASE_0_BASELINE.md)

## 구현 내용

- `app/globals.css` 상단에 primitive → semantic → component 3계층 토큰을 추가했다.
- 페이지 gutter, content width, reading width, section rhythm, control radius, motion duration을 변수로 고정했다.
- `route-main`의 강제 `min-height: 100vh`를 제거했다.
- Breadcrumb를 route 흐름을 늘리는 일반 블록에서 route frame 상단에 통합되는 context layer로 변경했다.
- Header에 requestAnimationFrame 기반 scroll state를 추가했다. 초기 상태는 투명에 가까운 표면이고, 12px 이상 스크롤하면 `is-scrolled` 상태로 전환된다.
- `PageHero`, `ContentBand`, `PageIntro`, `RelatedPages` 공통 컴포넌트와 대응 스타일을 추가했다.
- Footer는 콘텐츠 Section의 실제 끝에 바로 접합되도록 shell 규칙을 고정했다.
- focus ring, reduced-motion 기존 규칙과 충돌하지 않도록 공통 focus contract를 정리했다.

## 브라우저 검증

오른쪽 인앱 브라우저의 로컬 탭에서 확인했다. 사용자 Chrome은 사용하지 않았다.

- `/about/mission`에서 `route-main` computed `min-height`가 `0px`로 확인됨.
- `/about/mission`, `/about/team`, `/country-spotlight`, `/lens/micronutrients`, `/lens/how-it-works`, `/lens/solutions`, `/nutrition-app`, `/evidence-base`, `/contact` 모두 콘텐츠 Section bottom과 Footer top의 gap이 `0px`.
- 홈에서 `scrollY`가 증가하면 Header class가 `site-header is-scrolled`, `data-scrolled="true"`로 전환됨.
- 홈과 Mission 상세 화면에서 새 토큰 기반 gutter·헤더·Breadcrumb 스타일이 적용됨.

## 자동 검증

- `npm test`: 5개 테스트 통과
- `npm run lint`: 오류 없이 통과
- production build에서 모든 canonical route가 생성됨

## 다음 단계

Phase 2는 **핵심형 Home 재구성**이다. 기존 `HomeDirectory`를 축소하고, 프로젝트 핵심만 남긴 Hero → Body / Environment / Systems interaction → 짧은 정의 → Country Spotlight / Nutrition App pathway → Evidence strip 흐름으로 전환한다.
