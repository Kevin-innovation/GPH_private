# Phase 7R-4 완료 기록 — 반응형 타이포그래피와 조작 영역

> 완료일: 2026-09-12  
> 대상: `Kevin-innovation/GPH_private` / `main`

## 구현 내용

- 데스크톱·모바일 헤더, 드롭다운, 필터, 영양소 선택, 국가 선택, 지구본 복귀, 렌즈 전환, 상세 외부 링크에 최소 44px 조작 영역을 적용했다.
- 모바일 헤더 행과 햄버거 버튼은 48px 이상으로 확장했고, 드롭다운 링크도 한 줄씩 충분한 세로 여유를 갖도록 정렬했다.
- 모든 버튼·링크·summary에 `touch-action: manipulation`을 적용해 터치 지연을 줄이고, 기존 `:focus-visible` 링을 유지했다.
- 구조용 eyebrow·toolbar·카테고리·상태 라벨을 0.72rem(11.52px) 이상으로 통일해 작은 화면에서도 정보 계층을 읽을 수 있게 했다. 좁은 국가 레일은 기존 아이콘 전용 표현을 유지하되 `aria-pressed` 상태를 보존한다.
- 페이지 히어로·섹션·atlas·폼·국가 상세의 grid/flex 자식에 `min-width: 0`을 지정하고, 본문은 `--reading-width`(65ch) 안에서 줄바꿈하도록 정리했다.
- 320px 구간에서는 페이지 거터, 필터 줄바꿈, 제목 `text-wrap: balance`를 별도로 조정해 고아 줄과 가로 overflow를 줄였다.

## 검증

- 소스 회귀 테스트에 44px 상호작용 영역, 모바일 48px 네비게이션, 11.52px 라벨, reading measure, `min-width: 0`, `touch-action` 계약을 추가했다.
- canonical route DOM을 인앱 브라우저에서 확인했다: `/`, `/about/mission`, `/about/team`, `/country-spotlight`, `/lens/micronutrients`, `/lens/how-it-works`, `/lens/solutions`, `/nutrition-app`, `/evidence-base`, `/contact`.
- 기준 폭은 CSS 분기와 레이아웃 계약으로 320 / 375 / 768 / 1024 / 1440 / 1920px를 점검했다. 좁은 폭에서 제목·standfirst·Note·CTA는 컨테이너 안에서 줄바꿈하고, 넓은 폭에서는 본문만 읽기 폭으로 제한된다.
- `npm test` — 통과 (build 포함)
- `npm run lint` — 통과
- `git diff --check` — 통과

## 다음 단계

다음은 Phase 7R-5 — 미디어·폰트·런타임 성능 점검이다.
