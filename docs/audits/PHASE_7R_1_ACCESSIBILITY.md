# Phase 7R-1 — 접근성 셸·제목 계층 완료 기록

> 완료일: 2026-09-12  
> 기준: [`PHASE_7_GUIDELINES_REMEDIATION.md`](PHASE_7_GUIDELINES_REMEDIATION.md)  
> 대상: `Kevin-innovation/GPH_private` / `main`

## 구현 내용

- 9개 상세 라우트의 첫 시각 제목을 route-level `h1`로 승격했다. 공통 `SectionHeading`에는 `level` prop을 추가하고 기존 h2 시각 스케일을 별도 alias로 보존했다.
- 홈과 상세 페이지의 `main#main-content`에 `tabIndex={-1}`을 추가해 skip link가 실제 콘텐츠 포커스를 이동하도록 했다.
- Breadcrumb와 Footer Explore 링크를 명시적 navigation landmark로 변경했다.
- 데스크톱 disclosure에서 실제 menu semantics를 선언하지 않으면서 남아 있던 `aria-haspopup="menu"`를 제거했다. `aria-expanded`/`aria-controls` disclosure 패턴은 유지했다.
- 모바일 navigation surface에 `role="dialog"`, `aria-modal`, `aria-labelledby`를 추가하고 메뉴가 열릴 때 main/footer를 `inert`·`aria-hidden` 처리했다.
- skip link와 contact form focus rule을 `:focus-visible` 기준으로 정리했다.

## 브라우저 검수

오른쪽 Codex In-app Browser의 로컬 탭에서 검수했다. 사용자 Chrome은 사용하지 않았다.

- 10개 canonical route의 DOM snapshot에서 route-level `h1`이 정확히 1개씩 확인됐다.
- 상세 라우트에서 `navigation "Breadcrumb"`, Footer의 `navigation "Explore"` landmark가 확인됐다.
- Skip link 클릭 후 URL이 `#main-content`로 이동하고 focused element가 `main-content`가 되는 것을 확인했다.
- 데스크톱 About disclosure를 Enter로 열었을 때 `aria-expanded`가 갱신되고 하위 링크가 노출됐다.
- 모바일 dialog/inert 계약은 Header 컴포넌트와 회귀 테스트에 고정했다. 기존 In-app 탭은 데스크톱 뷰포트이므로 모바일 레이아웃 자체는 Phase 8의 기준 폭 전수 검수에서 다시 확인한다.

## 자동 검증

- `npm test`: 12개 테스트 통과
- `npm run lint`: 통과
- `git diff --check`: 통과
- production build: 성공

기존 Three.js client chunk 500KB 초과 경고는 Phase 7R-5 성능 범위로 이월한다.

## 다음 단계

Phase 7R-2에서 Evidence Base 표 시맨틱, `<time>` 날짜 렌더링, 외부 출처 링크 목적을 보정한다.
