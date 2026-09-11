# Phase 6 — Evidence Base·Contact·내부 연결·Footer 완료 기록

작성일: 2026-09-11  
대상 저장소: `Kevin-innovation/GPH_private`  
대상 브랜치: `main`

## 구현 범위

- Evidence Base 라우트와 섹션 eyebrow를 `Evidence Base`로 통일하고, 출처 목록은 기관별 수직 그룹으로 읽히도록 유지했다. Solutions & Action·Contact Related Page를 추가했다.
- Contact Form을 단일 세로 흐름으로 정리해 제목·안내문·입력 필드·동의·상태 메시지가 겹치지 않도록 했다. Contact 하단에는 Our Mission·Country Spotlight 연결을 배치했다.
- How the Lens Works 하단에 Micronutrients·Solutions & Action 연결을 추가했다. 각 Related Page는 실제 라우트로 이동하며 항목 수에 맞는 2열/1열 레이아웃을 사용한다.
- 짧은 라우트에서 Footer 아래에 남던 빈 화면을 body flex shell로 제거했다. `main.route-main`이 남은 뷰포트 높이를 흡수하고 Footer가 마지막 밴드에 바로 접합된다.
- 기존 Google Fonts Inter 대신 Fontshare의 Satoshi를 전역 폰트로 적용했다. `400, 500, 700, 900` 웨이트를 로드하고, 큰 제목은 700, 소제목은 600으로 지정해 기존 hairline 인상을 없앴다. 고아 줄바꿈을 만들기 위한 강제 `<br>`는 추가하지 않았다.

## 브라우저 검수

검수 방식: 사용자 Chrome을 열지 않고 Codex In-app Browser의 로컬 `http://localhost:3000`만 사용.

| 경로 | 확인 결과 |
|---|---|
| `/contact` | 세로형 폼·Related Page 2개·Satoshi heading 700·가로 overflow 없음 |
| `/evidence-base` | eyebrow `Evidence Base`, 기관별 출처 8개 링크, 단일 열 목록, Related Page 2개 |
| `/lens/how-it-works` | 인터랙티브 Hero·수직 3단계·Related Page 2개, 제목 Satoshi 700 |
| 공통 셸 | `body` flex, Footer가 문서 하단에 접합, Footer 뒤 흰색 잔여 영역 없음 |

## 자동 검증

- `npm run lint` 통과
- `npm test` 통과 (10 tests)
- `git diff --check` 통과

## 종료 기준

Phase 6 구현·Fontshare 타이포그래피 적용·In-app 브라우저 검수를 완료했다. 다음 작업은 Phase 7 `애니메이션·반응형·접근성 QA`다.
