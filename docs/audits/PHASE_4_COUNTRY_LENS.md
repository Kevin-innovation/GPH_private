# Phase 4 — Country Spotlight와 How the Lens Works 완료 기록

작성일: 2026-09-11  
대상 저장소: `Kevin-innovation/GPH_private`  
대상 브랜치: `main`

## 구현 범위

- Country Spotlight를 지구본 Hero → 5개 국가 선택기 → 선택 국가 상세 → 출처 → Lens 연결 순서의 단일 세로 흐름으로 재구성했다.
- 국가 선택 시 선택기 상태, 국가 상세, 지구본 회전·줌, 수도 label이 함께 갱신된다.
- 수도 marker의 실제 구체 반지름을 `0.035`, pulse ring을 `0.052–0.064`로 줄이고 반투명 opacity 및 제한된 pulse를 적용했다. 클릭 hit 영역은 별도로 유지했다.
- How the Lens Works에 기존 HeroVisual을 인터랙티브 Lens Hero로 배치하고, Body·Environment·Systems 선택 시 각 시각 언어와 설명이 전환되도록 했다.
- Lens chain에 수직 단계 class와 connector를 추가해 세 단계가 한 열에서 이어지도록 했다. Systems 네트워크는 기존 직선 segment 구성을 유지한다.
- Mission의 데스크톱 sticky 좌우 분할을 해제하고 제목·본문·결정요인 rail을 세로로 쌓았다. 본문 챕터는 지원 브라우저에서 스크롤 진입 reveal을 사용하고 reduced-motion에서는 즉시 노출한다.
- Country Spotlight 끝에 `How the Lens Works` Related Page를 추가했다.

## 브라우저 검수

검수 방식: 사용자 Chrome을 열지 않고 Codex In-app Browser에서 로컬 `http://localhost:3000` 확인.

| 경로 | 확인 결과 |
|---|---|
| `/country-spotlight` | 지구본 Hero·5개 국가 selector·세로 상세·Related Page 노출 |
| Country selector | India 클릭 후 selector `aria-pressed`, 상세 제목, `New Delhi · India` label 동기화 |
| `/lens/how-it-works` | 인터랙티브 Hero와 3개 수직 Lens 단계·2개 connector 노출 |
| Lens selector | Systems 클릭 후 active label `Systems`, pressed 상태 `false/false/true` |
| Mission | 제목 아래 본문이 같은 읽기 열로 이어져 좌측 하단 공백 제거 |
| 공통 셸 | `main → footer` gap 0px, Country `section → Related` gap 0px, 가로 overflow 없음 |

## 자동 검증

- `npm run lint` 통과
- `npm test` 통과 (8 tests)
- `git diff --check` 통과

## 종료 기준

Phase 4 구현·테스트·In-app 브라우저 검수를 완료했다. 다음 작업은 Phase 5 `Micronutrients, Solutions, Nutrition App`이다.
