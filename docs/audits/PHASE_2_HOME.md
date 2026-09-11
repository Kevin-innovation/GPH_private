# Phase 2 — 핵심형 Home 완료 기록

> 완료일: 2026-09-11  
> 기준 문서: [`docs/REBUILD_PLAN.md`](../REBUILD_PLAN.md)  
> 이전 감사: [`PHASE_1_SHELL.md`](PHASE_1_SHELL.md)

## 구현 내용

- 기존 `HomeDirectory`의 About / The Lens / Continue 3열 전체 디렉터리를 제거했다.
- 홈에 프로젝트 정의를 한 블록으로 압축하고, `Country Spotlight`와 `Nutrition App` 두 핵심 경로만 남겼다.
- Evidence Base는 홈 하단의 단일 Evidence strip에서만 연결하고 Footer와 바로 이어지도록 구성했다.
- Hero에 홈 전용 immersive 높이 계약을 추가했다. 기존 Body / Environment / Systems WebGL 인터랙션과 reduced-motion·WebGL fallback은 그대로 재사용한다.
- `How the Lens Works`에서 `SolutionsList`와 `CaseStudyList`를 제거했다. `Conditions for health`와 사례 콘텐츠의 소유권은 `Solutions & Action` 페이지로 일원화하고, Lens Works에는 Solutions로 이어지는 단일 hand-off만 남겼다.
- 홈과 Lens hand-off 링크를 모두 native anchor로 유지해 클릭 시 독립 라우트로 이동한다.

## 브라우저 검증

오른쪽 인앱 브라우저의 로컬 탭만 사용했다. 사용자 Chrome은 사용하지 않았다.

- 홈 로컬 탭: `1325 × 1824`, `devicePixelRatio 1.34`
- 홈의 Body / Environment / Systems 컨트롤을 순서대로 클릭해 active copy와 `aria-pressed` 상태가 `true` 대상 하나로 전환되는지 확인했다.
- 홈에는 `Country Spotlight`, `Nutrition App`, `Evidence Base` 세 링크만 존재하고 `.directory-groups`는 0개였다.
- 홈의 main→Footer gap은 `0px`, `#home-directory`→Footer gap은 `0px`, horizontal overflow는 `0px`였다.
- `How the Lens Works`에는 `Conditions for health`, `.solutions-wrap`, `.case-row`가 없고, Solutions hand-off가 존재했다.
- `Solutions & Action`에는 `Conditions for health` eyebrow가 화면에 1개, solution row 6개, case row 3개 존재했다.
- `How the Lens Works`와 `Solutions & Action` 모두 마지막 콘텐츠와 Footer 사이 gap은 `0px`였다.

## 자동 검증

- `npm test`: 6개 테스트 통과
- `npm run lint`: 오류 없이 통과
- production build에서 10개 canonical route 생성

## 다음 단계

Phase 3은 About 재구성이다. Our Mission의 세로형 챕터와 Six Determinants 인터랙션을 정리하고, Our Team 안에 Founder 정보를 통합한 뒤 About 페이지 간 Related Page 연결을 추가한다.
