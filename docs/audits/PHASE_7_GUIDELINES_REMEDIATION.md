# Phase 7R — Web Interface Guidelines 보정 실행계획

> 작성일: 2026-09-12  
> 기준: `docs/REBUILD_PLAN.md`, `web-design-guidelines` 전 라우트 감사 결과  
> 대상: `Kevin-innovation/GPH_private` / `main`

기존 Phase 0–6의 레이아웃·정보 구조와 Phase 7의 시각 모션 구현은 유지한다. 이번 보정은 새 디자인을 추가하는 작업이 아니라, 전 라우트에서 확인된 접근성·시맨틱·상태 복원·반응형·성능 리스크를 순서대로 제거하는 작업이다.

## 보정 원칙

- 한 페이즈가 끝날 때마다 구현 → 자동 테스트 → In-app 브라우저 검수 → 커밋 → `private/main` 푸시 → 배포 확인 순서로 종료한다.
- 10개 canonical route와 확정 메뉴/URL은 변경하지 않는다.
- 홈의 핵심형 구성, 세로형 상세 흐름, Footer 즉시 접합, 기존 애니메이션 방향은 회귀시키지 않는다.
- 모든 인터랙션은 키보드·터치·마우스·`prefers-reduced-motion`에서 같은 정보를 제공해야 한다.

## Phase 7R-1 — 접근성 셸과 제목 계층

### 작업

- 모든 독립 라우트에 의미 있는 단일 `h1`을 제공한다. 공통 `SectionHeading`은 기본 `h2`로 유지하고 페이지 제목만 `PageHero`/route title에서 `h1`로 승격한다.
- skip link가 이동하는 `<main id="main-content">`에 `tabIndex={-1}`을 추가해 실제 포커스를 이동시킨다.
- Breadcrumb를 `<nav aria-label="Breadcrumb">`, Footer Explore 링크 묶음을 `<nav aria-label="Explore">`로 변경한다.
- 데스크톱 드롭다운은 실제 menu semantics를 구현하거나 `aria-haspopup="menu"`를 제거한다. 링크/키보드/ESC 동작을 하나의 패턴으로 통일한다.
- 모바일 메뉴는 `role="dialog"`, `aria-modal="true"`, 닫기 버튼 이름, 배경 `inert`(또는 동등한 접근성 차단)을 명시한다.
- 전역 포커스 스타일을 `:focus-visible` 중심으로 정리하고 포커스 링 대비를 확인한다.

### 완료 기준

- 10개 라우트 접근성 트리에 `h1`이 정확히 1개 존재한다.
- Tab → skip link → Enter 후 main에 포커스가 도착한다.
- 데스크톱 드롭다운과 모바일 dialog를 키보드만으로 열고 이동하고 ESC로 닫을 수 있다.
- 포커스가 메뉴 뒤 콘텐츠로 새지 않으며, 닫힌 뒤 트리거로 돌아온다.

## Phase 7R-2 — 콘텐츠 시맨틱과 출처 데이터

### 작업

- Evidence Base 표에 `<caption>`, `<thead>`, 열 제목, `scope`를 추가해 기관·자료·검토일의 관계를 명확히 한다.
- 검토일은 ISO 문자열을 그대로 노출하지 않고 `<time dateTime>`과 사용자 친화적 영문 날짜 형식으로 렌더링한다.
- 외부 출처 링크의 새 탭 동작과 보안 속성, 링크 목적을 명시하고 모호한 `View`/`Click here`를 사용하지 않는다.
- 표·폼·목록의 heading/landmark 연결을 전 라우트에서 재확인한다.

### 완료 기준

- 표가 `caption → thead → tbody` 순서로 읽히고 열 헤더가 AX 트리에 노출된다.
- 모든 출처의 날짜가 로케일 형식으로 표시되며 `dateTime` 값은 유효한 ISO 날짜다.
- 출처·CTA 링크는 목적을 링크 텍스트만으로 이해할 수 있다.

## Phase 7R-3 — 상태 복원과 스크롤 인터랙션

### 작업

- Micronutrients의 filter/active nutrient, Country Spotlight의 선택 국가·zoom 상태를 URL query/hash와 동기화한다. 새로고침·공유·뒤로/앞으로에서 동일 상태를 복원한다.
- Solutions의 펼침 상태는 필요 시 안정적인 식별자를 사용하되, URL을 오염시키지 않는 기본 동작을 유지한다.
- 전체 영양소 상세를 `aria-live`로 읽지 않도록 하고, 선택된 항목명·상태만 짧은 polite status로 알린다.
- 빠른 wheel/touch 스크롤에서 자동 선택이 한 번에 여러 항목을 건너뛰거나 위로 튀지 않도록 settle/hysteresis와 anchor 계산을 하나의 상태 머신으로 검증한다.
- 수동 +/- 버튼, 클릭 선택, 스크롤 자동 선택이 서로의 상태를 덮어쓰지 않도록 단일 source of truth를 사용한다.

### 완료 기준

- 각 선택 상태를 URL로 복사해 새 탭에서 동일하게 재현할 수 있다.
- 빠른 하향·상향 스크롤 모두 현재 카드가 잘리지 않고 한 단계씩 부드럽게 열린다.
- 자동 전환 중 레이아웃 점프, 이중 전환, `aria-live` 전체 본문 재낭독이 없다.

## Phase 7R-4 — 반응형 타이포그래피와 조작 영역

### 작업

- 헤더 disclosure, 필터, nutrient chapter control의 최소 조작 높이를 44px 이상으로 통일한다.
- 11.52px 전역 label과 9.6px Explore 상태 텍스트를 읽기 가능한 토큰으로 올리고, 색상만으로 상태를 구분하지 않는다.
- 320 / 375 / 768 / 1024 / 1440 / 1920px에서 H1·standfirst·Note·CTA의 고아 줄바꿈, 겹침, 가로 overflow를 재검수한다.
- 데스크톱은 넓은 콘텐츠 폭을 사용하되 문장 자체는 읽기 폭을 넘기지 않도록 `max-width`와 `text-wrap`을 조정한다.

### 완료 기준

- 모든 주요 버튼·탭·disclosure가 44px 이상이며 키보드 포커스 영역이 시각적으로 식별된다.
- 전 기준 폭에서 텍스트가 잘리거나 겹치지 않고 horizontal overflow가 0이다.
- 본문 대비·상태 대비를 AX/색상 대비 검사로 확인한다.

## Phase 7R-5 — 미디어·폰트·런타임 성능

### 작업

- nutrient 이미지에 실제 렌더 폭에 맞는 `sizes`를 지정해 100–220px 이미지가 1080px 리소스를 과다 요청하지 않도록 한다.
- Fontshare 연결을 문서 head의 preconnect/stylesheet 경로로 정리해 CSS `@import` 지연을 줄인다.
- Country Spotlight 수도 label 계산에서 매 프레임 `getBoundingClientRect()`를 호출하지 않도록 ResizeObserver 기반 캐시를 사용한다.
- Three.js 720KB 청크와 미사용 6MB 원본 텍스처를 프로파일링하고, route-level lazy load·더 작은 에셋·예산 예외 중 하나를 결정해 기록한다.

### 완료 기준

- 이미지 네트워크 요청 폭이 표시 폭과 합리적으로 일치한다.
- 애니메이션 프레임 안의 강제 layout read가 제거된다.
- production build 경고가 해소되거나 허용 예산과 사유가 문서화된다.

## Phase 8 — 전체 회귀·배포 게이트

### 검수 묶음

- 10개 canonical route: 접근성 트리, heading/landmark, 링크 href, 폼 오류, 외부 링크
- 6개 기준 폭: 레이아웃, 줄바꿈, overflow, 44px target, Footer 접합
- 인터랙션: 키보드, touch, 빠른 양방향 스크롤, 자동/수동 선택, 뒤로/앞으로, 새로고침
- 모션: 일반 환경, `prefers-reduced-motion`, WebGL 미지원 fallback
- 품질: `npm test`, `npm run lint`, `npm run build`, `git diff --check`

### 종료 조건

- 위 보정 페이즈의 체크리스트가 모두 충족되고, 실제 `https://gph-lens.vercel.app/`에서 전 라우트와 핵심 인터랙션을 확인한다.
- `docs/DEVELOPMENT_RESULT.md`와 `docs/REBUILD_PLAN.md`의 상태를 갱신한다.
- `private/main` 푸시와 Vercel 배포 성공을 확인한 뒤에만 전체 작업을 완료로 보고한다.

## 다음 실행

Phase 7R-1은 완료되었다. 다음 구현 페이즈는 **Phase 7R-2 — 콘텐츠 시맨틱과 출처 데이터**다.

완료 기록: [`docs/audits/PHASE_7R_1_ACCESSIBILITY.md`](PHASE_7R_1_ACCESSIBILITY.md)
