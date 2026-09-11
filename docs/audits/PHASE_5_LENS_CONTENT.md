# Phase 5 — Lens 콘텐츠와 Nutrition App 완료 기록

작성일: 2026-09-11  
대상 저장소: `Kevin-innovation/GPH_private`  
대상 브랜치: `main`

## 구현 범위

- Micronutrients를 소개 문장 → 범위 필터 → 세로형 8개 영양소 목록 → 선택 항목 상세 → Nutrition App 연결 순서로 재구성했다.
- 데스크톱에서도 선택 영양소 상세가 목록 항목 아래에 펼쳐지도록 만들어, 좌우 sticky 패널 때문에 생기던 빈 열을 제거했다. 기존 비타민·미네랄 필터와 NIH 출처 링크는 유지했다.
- Solutions & Action을 소개 문장 → Conditions for health 6개 → 사례 pathway → 3개 Case Study 순서의 세로형 흐름으로 바꿨다. 사례는 `<details>`를 유지해 필요한 항목만 펼쳐 읽을 수 있다.
- Nutrition App을 제품 설명 → 4단계 Workflow → 기능 요약·안전 문구 → 3개 제품 화면 순서로 배치했다. 데스크톱에서도 화면이 겹치지 않고 균등한 순서로 노출된다.
- 세 페이지에 의미 있는 view-timeline 진입 reveal을 추가하고 `prefers-reduced-motion`에서는 즉시 노출되도록 했다.
- Micronutrients → Nutrition App, Solutions → Evidence Base, Nutrition App → Micronutrients Related Page를 추가했다.
- Related Pages가 실제 항목 수에 맞춰 1·2·3열을 사용하도록 수정해, 화살표가 빈 세 번째 열에 떠 보이는 문제를 함께 제거했다.

## 브라우저 검수

검수 방식: 사용자 Chrome을 열지 않고 Codex In-app Browser의 로컬 `http://localhost:3000` 확인.

| 경로 | 확인 결과 |
|---|---|
| `/lens/micronutrients` | 데스크톱 `atlas-layout` 숨김, 세로 목록 8개 노출, Vitamin A·Iron 선택 시 해당 상세가 항목 아래에서 갱신 |
| `/lens/solutions` | Conditions 6개와 Case Study 3개가 단일 열로 이어짐, 사례 `<details>` 펼침 동작 확인 |
| `/nutrition-app` | 소개·Workflow 4단계·기능·안전 문구·제품 화면 3개가 순서대로 노출, 화면 transform 모두 `none` |
| 공통 셸 | 세 페이지 `main → footer` gap 0px, 가로 overflow 없음, Related Page가 Footer 직전 접합 |
| Related Pages | 1개 항목은 1열로, 2개 항목은 동일 폭 2열로 정렬되고 각 화살표가 해당 열 우측에 고정 |

## 자동 검증

- `npm run lint` 통과
- `npm test` 통과 (9 tests)
- `git diff --check` 통과

## 종료 기준

Phase 5 구현·테스트·In-app 브라우저 검수를 완료했다. 다음 작업은 Phase 6 `Evidence Base, Contact, 내부 연결, Footer`다.
