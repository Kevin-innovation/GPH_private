# Phase 7R-5 완료 기록 — 미디어·폰트·런타임 성능

> 완료일: 2026-09-12  
> 대상: `Kevin-innovation/GPH_private` / `main`

## 구현 내용

- Nutrient Atlas의 선택 상세 이미지·모바일 썸네일·모바일 상세 이미지·데스크톱 카드에 실제 표시 폭을 반영한 `sizes`를 지정했다. 앱 미리보기 화면도 모바일 32vw / 데스크톱 220px 예산으로 제한했다.
- Fontshare CSS `@import`를 제거하고 문서 `<head>`의 stylesheet 링크로 이동했다. API/CDN preconnect와 dns-prefetch를 함께 선언해 폰트 요청을 렌더링 경로 앞쪽에서 시작한다.
- Country Spotlight의 WebGL 수도 label 위치 계산은 `ResizeObserver`가 갱신하는 mount 폭·높이 캐시를 사용한다. 애니메이션 프레임마다 `getBoundingClientRect()`를 읽던 강제 layout read를 제거했다.
- `earth-atmos-8192.jpg`(약 5.7MB)와 `earth-clear-8192.webp`(약 2.0MB)는 소스에서 참조되지 않는 원본이라 제거했다. 실제 지구본은 `earth-atmos-2048.jpg`(512,606 bytes)를 사용한다.
- Three.js는 Country Spotlight route-level chunk로만 로드되며, production 산출물의 `three.module` 청크는 733,398 bytes다. 초기 페이지에 포함되지 않는 WebGL 전용 청크이므로 현재 500kB build warning은 허용 예산 예외로 기록한다.

## 검증

- 인앱 브라우저 `/lens/micronutrients?phase=7r5-qa`에서 Fontshare stylesheet/preconnect, nutrient `sizes`, `scrollWidth === innerWidth`를 확인했다.
- `dist/client`를 점검해 제거한 8192 텍스처가 복사되지 않고 2048 텍스처만 남는 것을 확인했다.
- `npm test` — 통과 (16 tests, build 포함)
- `npm run lint` — 통과
- `git diff --check` — 통과

## 예산 예외

`three.module` 청크의 크기 경고는 WebGL이 필요한 Country Spotlight에서만 route-level lazy chunk로 요청되는 특수 자산이다. Phase 8 전체 회귀·배포 게이트에서 초기 route payload와 실제 네트워크 waterfall을 재확인하고, 필요하면 더 작은 Three.js 서브모듈/에셋 분할을 후속 최적화한다.

## 다음 단계

다음은 Phase 8 — 전체 회귀·배포 게이트다.
