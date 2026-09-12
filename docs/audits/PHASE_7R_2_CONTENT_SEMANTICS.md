# Phase 7R-2 완료 기록 — 콘텐츠 시맨틱과 출처 데이터

> 완료일: 2026-09-12  
> 대상: `Kevin-innovation/GPH_private` / `main`

## 구현 내용

- Evidence Base의 출처 표에 `caption → thead → tbody` 구조를 적용했다.
- `No.`, `Organization`, `Source` 열 헤더에 `scope="col"`과 `columnheader` 역할을 지정해 기관·출처 관계를 명확히 했다.
- 표의 기존 기관 그룹 행 헤더는 `scope="rowgroup"`을 유지해 같은 기관의 여러 링크가 하나의 그룹으로 읽히도록 했다.
- 각 출처의 `reviewedAt`와 전체 콘텐츠 검토일(`siteConfig.lastReviewedAt`)은 ISO `dateTime` 속성을 유지하면서 `1 Sept 2026` 형식의 사용자 친화적 영문 날짜로 표시한다.
- 외부 출처 링크는 `target="_blank"`, `rel="noopener noreferrer"`와 `(opens in a new tab)` 보조 텍스트를 유지해 새 탭 동작과 보안 목적을 드러낸다.

## 검증

- 인앱 브라우저 `http://localhost:3000/evidence-base?phase=7r2-qa2`의 DOM 스냅샷에서 `caption`, `rowgroup`, 네 개의 `columnheader`, 출처별·전체 검토일 `time`을 확인했다.
- 외부 링크의 접근성 이름에 `(opens in a new tab)`이 포함되는 것을 확인했다.
- `npm test` — 13개 통과 (build 포함)
- `npm run lint` — 통과
- `git diff --check` — 통과

## 다음 단계

다음은 Phase 7R-3 — URL 상태 복원과 스크롤 인터랙션 검증이다.
