# Global Public Health Lens — Vertical Editorial Rebuild Plan

> 작성일: 2026-09-11  
> 상태: **Phase 7 진행 중 — 타이포그래피·인터랙션·코드 네이티브 비주얼·영양소 스크롤 모션 slice 완료**
> 적용 저장소: `Kevin-innovation/GPH_private`의 `main`  
> 배포 확인 URL: `https://gph-lens.vercel.app/`  
> 레이아웃 참고 자료: `/Users/mk/Downloads/pangeaseed` 로컬 미러  
> 우선순위: 이 문서는 기존 `docs/TASK.md`의 Phase 2~4와 단일 랜딩 페이지 설명보다 우선한다.

## 1. 재개편 목표

현재 독립 라우트와 확정된 메뉴 구조는 유지한다. 다만 각 상세 페이지의 과도한 가로 분할을 제거하고, 강한 첫 장면과 세로형 챕터가 이어지는 공중보건 에디토리얼 사이트로 다시 구성한다.

필수 결과는 다음과 같다.

- 홈은 전체 콘텐츠를 반복하지 않고 프로젝트의 핵심만 짧고 강하게 보여준다.
- 상세 페이지는 각각 독립 URL을 유지하며 세로형 스토리 구조와 주제별 인터랙션을 갖는다.
- 마지막 콘텐츠와 Footer 사이에 빈 배경 띠나 별도 spacer가 존재하지 않는다.
- 데스크톱에서도 본문을 억지로 좌우에 분산하지 않는다.
- 애니메이션은 의미 있는 상태 변화와 이야기의 진행을 설명해야 한다.
- 폰트 겹침, 쉐이킹, 가로 오버플로, 고아 줄바꿈을 허용하지 않는다.
- Green Salad 앱 작업은 이 웹사이트 재개편 범위에서 제외한다.

## 2. 확정 정보 구조

```text
Homepage (/)
├── About
│   ├── Our Mission (/about/mission)
│   └── Our Team (/about/team)
│       └── Founder 정보 포함 — 별도 메뉴 아님
├── Country Spotlight (/country-spotlight)
├── The Lens
│   ├── Micronutrients (/lens/micronutrients)
│   ├── How the Lens Works (/lens/how-it-works)
│   └── Solutions & Action (/lens/solutions)
├── Nutrition App (/nutrition-app)
└── Contact (/contact)

Footer utility
└── Evidence Base (/evidence-base)
```

### 2.1 상단 메뉴

```text
Brand / Home

About ▾
  Our Mission
  Our Team

Country Spotlight

The Lens ▾
  Micronutrients
  How the Lens Works
  Solutions & Action

Nutrition App

Contact
```

### 2.2 메뉴 불변 규칙

- 로고와 브랜드 락업은 항상 `/`로 이동한다.
- Founder는 `Our Team` 페이지 내부 콘텐츠다.
- `Country Spotlight`는 드롭다운 밖의 주요 메뉴다.
- `Explore the Map`은 `Country Spotlight`와 중복되므로 만들지 않는다.
- `Evidence Base`는 Footer 유틸리티 링크로만 유지한다.
- 데스크톱과 모바일의 메뉴 계층과 명칭은 동일하다.
- 현재 URL은 유지하며 임의 변경하거나 중복 라우트를 추가하지 않는다.

## 3. PangeaSeed 참고 분석과 GPH 적용 원칙

PangeaSeed의 색상, 로고, 이미지, 카피를 복사하지 않는다. 긍정적인 레이아웃과 상호작용 원리를 GPH의 Navy, Teal, Cloud, Gold 및 기존 공중보건 에셋으로 변환한다.

| 참고 사이트의 긍정 요소 | GPH 변환 방식 |
|---|---|
| 화면을 채우는 강한 첫 장면 | 각 페이지에 주제별 `PageHero` 또는 인터랙티브 스테이지 구성 |
| 이미지 위 제목과 짧은 설명 | 기존 GPH 이미지·3D 그래픽 위에 브랜드 대비를 준 제목 배치 |
| 투명 Header가 스크롤 후 흰색 Header로 전환 | 히어로에서는 오버레이, 스크롤 후 Cloud/White 고정 Header |
| 긴 페이지를 명확한 챕터로 구분 | 전폭 배경 밴드와 좁은 본문을 번갈아 배치 |
| 강한 Display와 읽기 쉬운 Body 대비 | Inter를 유지하고 크기·두께·공간으로 위계 강화 |
| 전폭 비주얼과 제한된 본문 폭 | 비주얼 1180~1280px, 읽기 본문 최대 65ch |
| Slider와 Tabs의 선택적 사용 | Country와 Micronutrients처럼 실제 선택이 필요한 곳에만 사용 |
| `clip-path` 기반 이미지 reveal | 이미지·지도·제품 화면의 진입 효과로 제한 적용 |
| 프로젝트 상세의 메타데이터 우선 노출 | Country에 국가·지역·보건 주제, 사례에 위치·개입·근거 표시 |
| 관련 콘텐츠가 Footer 전까지 이어짐 | 페이지별 `RelatedPages` → Evidence strip → Footer 순서 |
| Footer가 여러 기능 밴드로 자연스럽게 연결 | GPH에서는 Evidence·검토일·법적 고지를 역할별 밴드로 구성 |

### 3.1 직접 가져오지 않는 요소

- PangeaSeed 로고, 해양 사진, 영상, 카피
- Climate Crisis 서체와 동일한 타이포그래피
- 무지개 그라디언트
- Donate, Shop, 언론사 로고, Newsletter 등 GPH에 없는 기능
- 무분별한 슬라이더, 카드 그리드, 장식 애니메이션

## 4. 공통 시각·레이아웃 규칙

### 4.1 페이지 골격

```text
Overlay Header
↓
Page Hero
↓
Integrated Breadcrumb / Context
↓
Lead Statement
↓
Vertical Story Chapters
↓
Topic Interaction
↓
Related Page Navigation
↓
Evidence / Review Strip
↓
Footer
```

### 4.2 레이아웃

- 홈 히어로 높이: 약 `78–88vh`
- 상세 페이지 히어로 높이: 약 `52–64vh`
- 페이지 비주얼 폭: 최대 `1280px`
- 본문 폭: 최대 `65ch`
- 기본 페이지 gutter: 모바일 16px, 태블릿 24px, 데스크톱 32px 이상
- 핵심 본문 흐름은 데스크톱에서도 한 열을 우선한다.
- 두 열은 정보 비교가 실제로 필요한 짧은 블록에만 제한한다.
- Section 배경은 White / Cloud / Navy와 제한된 Teal tint로 구분한다.
- Section 사이에는 외부 margin을 두지 않고 내부 padding으로만 호흡을 만든다.
- 마지막 Section 다음에는 Footer가 즉시 이어진다.
- Breadcrumb를 별도 빈 띠로 만들지 않고 Hero 하단이나 첫 콘텐츠 안에 통합한다.

### 4.3 타이포그래피와 줄바꿈

- 브랜드 서체는 Inter를 유지한다.
- H1, H2, standfirst, body, label의 역할을 명확히 분리한다.
- 제목은 `clamp()`와 최대 글자 폭을 함께 사용한다.
- `text-wrap: balance`만 믿지 않고 중요한 문장의 마지막 2~4단어에 `no-orphan` 보호를 적용한다.
- CTA, 탭, 상태 라벨이 제목이나 설명과 겹치지 않도록 고정 폭과 절대 위치를 피한다.
- 320px부터 1920px까지 고아 줄바꿈과 폰트 겹침이 없어야 한다.

### 4.4 애니메이션

- Header: 오버레이 → 고정 배경 전환
- Hero: 주제별 depth motion 또는 상태 전환
- Media: `clip-path` reveal
- Chapter: opacity + 작은 translate 진입
- Selector: 설명·비주얼 동기화
- Hover: 1~3px 이동 또는 제한된 scale만 허용
- 쉐이킹을 유발하는 hover와 state 변경의 반복 호출을 금지한다.
- `prefers-reduced-motion`에서는 움직임을 제거하고 모든 정보를 즉시 노출한다.
- `animation-timeline` 미지원 브라우저에는 `IntersectionObserver` fallback을 제공한다.
- 애니메이션 실패나 WebGL 미지원 시에도 텍스트와 조작 기능은 유지한다.

## 5. 페이지별 구조

### 5.1 Home

홈은 종합 랜딩 페이지가 아니다. 약 2.5~3개 화면 안에서 프로젝트의 핵심과 주요 진입점만 보여준다.

```text
Immersive Hero
↓
Body / Environment / Systems Interaction
↓
Short Project Definition
↓
Country Spotlight / Nutrition App Pathways
↓
Evidence Strip
↓
Footer
```

홈에서 반복하지 않는 내용:

- Mission 전체 본문
- Founder 및 Team 상세
- 국가별 상세
- 전체 Micronutrients 목록
- Solutions와 Case Studies 전체
- Contact Form
- Evidence 목록 전체

### 5.2 Our Mission

```text
Mission Hero
↓
Lead Statement
↓
Why This Project
↓
Six Determinants
↓
Selected Determinant Story
↓
Nutrition Is the First Lens
↓
Continue to Our Team
```

### 5.3 Our Team

```text
Team Hero
↓
Founder Introduction
↓
Founder Profile and Facts
↓
Research / Interviews / Project Story
↓
Continue to Contact
```

가짜 인물 사진을 만들지 않는다. 전달된 사진이 없다면 Founder 마크, 타이포그래피, 연구 주제와 스토리로 첫 장면을 구성한다.

### 5.4 Country Spotlight

```text
Interactive Globe Hero
↓
Five-country Selector
↓
Selected Country Introduction
↓
Health Issue
↓
Social / Environmental Drivers
↓
Public-health Response
↓
Country Sources
↓
Continue to How the Lens Works
```

- 지도와 상세 콘텐츠를 좌우 고정하지 않는다.
- 국가 선택 시 지구본 회전 → 줌 → 작은 수도 marker pulse 순서로 동작한다.
- 수도 marker는 지도를 가리지 않도록 작고 반투명하게 유지한다.
- 한국, 인도, 멕시코, 프랑스, 미국을 동일한 구조로 제공한다.

### 5.5 Micronutrients

```text
Nutrition Hero
↓
Selected Nutrient Feature
↓
Filter / Selector
↓
Editorial Nutrient List
↓
Expanded Nutrient Detail
↓
Continue to Nutrition App
```

### 5.6 How the Lens Works

```text
Interactive Lens Hero
↓
Body
↓
Environment / Community
↓
Systems
↓
Worked Example
↓
Continue to Solutions & Action
```

- Body는 입자가 한쪽에 몰리지 않도록 균형 있게 분산한다.
- Environment는 공간과 조건이 확장되는 움직임을 사용한다.
- Systems는 직선형 AI 네트워크와 거미줄 연결을 사용한다.
- 세 단계는 세로 진행선으로 명확히 연결한다.
- 카드 내부의 모호한 기하학 장식을 사용하지 않는다.

### 5.7 Solutions & Action

```text
Action Hero
↓
Six Solution Chapters
↓
Case Studies
↓
Location / Issue / Intervention / Lessons / Sources
↓
Continue to Evidence Base
```

### 5.8 Nutrition App

```text
Product Hero
↓
Workflow
↓
Features
↓
Sequential App Screens
↓
Disclaimer
↓
App Status / CTA
↓
Continue to Micronutrients
```

휴대폰 화면을 좁은 가로 3열로 고정하지 않는다. 화면과 설명이 세로 순서로 이어지도록 구성한다.

### 5.9 Evidence Base

```text
Evidence Hero
↓
Source Groups
↓
Source Titles and Links
↓
Reviewed Dates
↓
Continue to Country Spotlight
```

기관 로고가 아니라 텍스트 링크를 사용하며 모든 명칭은 `Evidence Base`로 통일한다.

### 5.10 Contact

```text
Contact Hero
↓
Contact Notice
↓
Single-column Form
↓
Submission States
↓
Footer
```

## 6. 내부 연결 규칙

```text
Our Mission → Our Team
Our Team → Contact
Country Spotlight → How the Lens Works
Micronutrients → Nutrition App
How the Lens Works → Solutions & Action
Solutions & Action → Evidence Base
Nutrition App → Micronutrients
Evidence Base → Country Spotlight
```

- 모든 페이지는 Header, Breadcrumb, Related Pages, Footer 중 최소 두 곳에서 연결된다.
- `Click here`, `View` 같은 모호한 링크 텍스트를 사용하지 않는다.
- 현재 페이지를 제외한 Breadcrumb 단계는 링크로 제공한다.
- 페이지 끝의 Related Pages 영역은 Footer와 직접 맞닿는다.

## 7. 실행 페이즈

각 페이즈는 구현 → 테스트 → 브라우저 검수 → 커밋 → `private/main` 푸시 → Vercel 확인 후 종료한다. 한 페이즈가 완료되기 전에 다음 페이즈의 코드를 섞지 않는다.

### Phase 0 — 재개편 기준선 고정

- [x] 전체 라우트 반응형 기준선 및 320 / 375 / 768 / 1024 / 1440 / 1920 breakpoint 대조 기록
- [x] 불필요한 여백, 가로 배치, 겹침, 쉐이킹 리스크 목록화
- [x] 유지할 컴포넌트와 폐기할 스타일 구분
- [x] CSS 중복·우선순위 충돌 목록 작성
- [x] 페이지별 Hero, Chapter, Interaction, Related Page 구조 확정
- [x] 기존 메뉴와 URL 회귀 테스트 고정

기준선 감사 결과: [`docs/audits/PHASE_0_BASELINE.md`](audits/PHASE_0_BASELINE.md)

종료 커밋: `docs: define vertical editorial rebuild system`

### Phase 1 — 전역 디자인 시스템과 사이트 셸

- [x] 전역 CSS를 토큰·reset·공통 shell 중심으로 정리
- [x] 섹션 스타일을 충돌하지 않는 단위로 분리
- [x] Overlay / Scrolled Header 상태 구현
- [x] 모바일 메뉴와 focus trap 재검수
- [x] Breadcrumb를 콘텐츠에 통합
- [x] `route-main`의 불필요한 `min-height`와 spacer 제거
- [x] `PageHero`, `ContentBand`, `PageIntro`, `RelatedPages` 구현
- [x] Footer 즉시 접합 확인

셸 완료 기록: [`docs/audits/PHASE_1_SHELL.md`](audits/PHASE_1_SHELL.md)

종료 커밋: `refactor: rebuild global shell and vertical layout system`

### Phase 2 — 핵심형 Home

- [x] 큰 프로젝트 디렉터리 제거 또는 축소
- [x] Immersive Hero 재구성
- [x] Body / Environment / Systems 핵심 인터랙션 배치
- [x] 짧은 프로젝트 정의 배치
- [x] Country Spotlight / Nutrition App 경로 배치
- [x] Evidence strip과 Footer 즉시 연결

홈 및 중복 섹션 완료 기록: [`docs/audits/PHASE_2_HOME.md`](audits/PHASE_2_HOME.md)

종료 커밋: `feat: rebuild home as a concise public-health statement`

### Phase 3 — About

- [x] Our Mission 세로형 챕터 재구성
- [x] Six Determinants 인터랙션 재구성
- [x] Our Team에 Founder 정보 통합
- [x] About 페이지 간 Related Page 연결

About 완료 기록: [`docs/audits/PHASE_3_ABOUT.md`](audits/PHASE_3_ABOUT.md)

종료 커밋: `feat: rebuild about pages as visual editorial stories`

### Phase 4 — Country Spotlight와 How the Lens Works

- [x] 지구본 중심 Country Hero 구성
- [x] 국가 선택과 세로형 상세 콘텐츠 동기화
- [x] 수도 marker 크기·투명도·pulse 수정
- [x] Body / Environment / Systems 시각 언어 분리
- [x] Systems 직선 네트워크 구성
- [x] 키보드와 reduced-motion 대응
- [x] Mission 데스크톱 좌측 공백 제거 및 스크롤 챕터 reveal 보강

Country/Lens 및 Mission 공백 보정 완료 기록: [`docs/audits/PHASE_4_COUNTRY_LENS.md`](audits/PHASE_4_COUNTRY_LENS.md)

종료 커밋: `feat: rebuild country and lens experiences`

### Phase 5 — Micronutrients, Solutions, Nutrition App

- [x] Micronutrients 세로형 탐색 흐름
- [x] Solutions 6개와 Case Studies 세로형 구성
- [x] Nutrition App 화면과 Workflow 순차 구성
- [x] 안전 문구와 기존 콘텐츠 보존

완료 기록: [`docs/audits/PHASE_5_LENS_CONTENT.md`](audits/PHASE_5_LENS_CONTENT.md)

종료 커밋: `feat: rebuild lens content and nutrition app pages`

### Phase 6 — Evidence Base, Contact, 내부 연결, Footer

- [x] Evidence Base 명칭과 출처 그룹 통일
- [x] Contact Form 세로형 구성
- [x] Related Page 경로 전수 구현
- [x] Footer 정보 밴드 정리
- [x] 고아 페이지와 중복 CTA 제거

완료 기록: [`docs/audits/PHASE_6_EVIDENCE_CONTACT.md`](audits/PHASE_6_EVIDENCE_CONTACT.md)

종료 커밋: `feat: connect evidence contact and related-page pathways`

### Phase 7 — 애니메이션·반응형·접근성 QA

- [x] Header scroll transition
- [x] 이미지 `clip-path` reveal — Nutrition App 미디어 스테이지가 뷰포트 진입 시 한 번만 리빌되며, 미지원·모션 감소 환경에서는 즉시 노출
- [x] Section chapter reveal — 공통 SectionShell이 뷰포트 진입 시 한 번만 챕터를 열고 정적 fallback 유지
- [x] About·Solutions 섹션별 SVG 글래스모피즘 시각화 — 사진·생성 이미지 없이 콘텐츠 배경에 페이드 처리
- [x] selector 상태 전환 안정화 — 영양소 자동 선택에 140ms settle과 32px hysteresis를 적용하고, 상세 패널은 grid-row로 열고 닫아 스크롤 점프를 완화
- [x] 양방향 hand-off 안정화 — 빠른 스크롤에서도 인접 영양소를 한 단계씩 전환하고, 전환 직후 레이아웃 이벤트가 다음 항목을 연달아 열지 않도록 실제 스크롤 진행을 확인
- [ ] `prefers-reduced-motion`
- [ ] WebGL fallback
- [ ] 6개 기준 폭 전수 검수
- [ ] 폰트 겹침·고아 줄바꿈·가로 오버플로 0
- [ ] Footer 전 빈 공간 0
- [ ] hover shaking 0
- [ ] 키보드·focus·명도 대비 확인
- [ ] 성능과 이미지 크기 확인

종료 커밋: `fix: complete responsive motion and accessibility audit`

### Phase 8 — 최종 배포 검수

- [ ] `npm test`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] 실제 배포 URL 전 라우트 클릭 검수
- [ ] 메타데이터, sitemap, robots 확인
- [ ] `docs/DEVELOPMENT_RESULT.md` 갱신
- [ ] `private/main` 푸시 및 Vercel 성공 확인

종료 커밋: `docs: finalize vertical editorial rebuild`

## 8. 페이즈 완료 보고 형식

각 페이즈 종료 시 다음 항목을 사용자에게 보고한다.

```text
Phase N 완료
- 변경된 페이지 및 컴포넌트
- 시각적으로 달라진 점
- 검수한 화면 폭
- 테스트 결과
- 커밋 해시
- 배포 확인 결과
- 다음 Phase 범위
```

## 9. 전체 완료 조건

- [ ] 홈은 프로젝트의 핵심만 보여주고 상세 콘텐츠를 반복하지 않는다.
- [ ] 확정 메뉴와 URL이 그대로 유지된다.
- [ ] 모든 상세 페이지가 세로형 챕터 구조다.
- [ ] 페이지별로 서로 다른 의미 있는 첫 장면이 있다.
- [ ] 애니메이션이 내용 이해를 돕고 조작을 방해하지 않는다.
- [ ] Footer와 메인 사이에 빈 배경 영역이 없다.
- [ ] `Explore the Map` 중복이 없다.
- [ ] `Evidence Base` 명칭이 일관된다.
- [ ] Our Team에 Founder 정보가 포함된다.
- [ ] 320px부터 1920px까지 폰트 겹침과 고아 줄바꿈이 없다.
- [ ] 모든 버튼·링크·탭이 클릭 가능한 요소처럼 보이고 실제로 동작한다.
- [ ] 주요 테스트와 실제 배포 검수가 통과한다.
