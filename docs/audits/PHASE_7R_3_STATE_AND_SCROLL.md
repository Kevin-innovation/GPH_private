# Phase 7R-3 완료 기록 — 상태 복원과 스크롤 인터랙션

> 완료일: 2026-09-12  
> 대상: `Kevin-innovation/GPH_private` / `main`

## 구현 내용

- Micronutrients의 `filter`와 `nutrient` 선택을 URL query와 동기화했다.
- 사용자가 직접 선택한 필터·영양소는 `pushState`로 기록하고, 데스크톱 스크롤 자동 선택은 `replaceState`로 반영해 뒤로가기 기록이 자동 전환으로 오염되지 않도록 했다.
- `popstate` 이벤트를 구독해 뒤로가기·앞으로가기에서 필터와 활성 영양소를 다시 적용한다.
- Country Spotlight의 `country`·`zoom=1` 상태를 URL query와 동기화했다. 개별 국가 선택과 전체 지구본 복귀도 공유 가능한 URL로 남는다.
- 지구본이 아직 초기화되지 않은 상태에서 URL 복원이 먼저 일어나도 focus/overview 요청을 pending action으로 보관해 WebGL 초기화 후 실행한다.
- 영양소 상세 본문 전체의 `aria-live`를 제거하고, 선택된 영양소·국가명과 현재 상태만 짧은 `status` 라이브 영역으로 알린다.

## 검증

- 인앱 브라우저 Micronutrients URL `?filter=mineral&nutrient=iron`에서 Iron 카드·Minerals 필터가 복원되는 것을 확인했다.
- Micronutrients에서 Iodine을 선택하면 URL이 `nutrient=iodine`으로 갱신되고 status가 `Selected nutrient: Iodine`으로 바뀌는 것을 확인했다.
- 인앱 브라우저 Country Spotlight URL `?country=india&zoom=1`에서 India 선택·지구본 포커스·복귀 버튼이 복원되는 것을 확인했다.
- Mexico 선택 후 URL `country=mexico&zoom=1`, 전체 지구본 복귀 후 `zoom` 제거 상태를 확인했다.
- DOM 스냅샷에서 전체 영양소 본문이 아닌 짧은 선택 상태만 `status`로 노출되는 것을 확인했다.
- `npm test` — 14개 통과 (build 포함)
- `npm run lint` — 통과
- `git diff --check` — 통과

## 다음 단계

다음은 Phase 7R-4 — 반응형 타이포그래피와 조작 영역 점검이다.
