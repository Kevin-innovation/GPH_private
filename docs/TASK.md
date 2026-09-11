# TASK.md — Global Public Health Lens 랜딩 웹사이트

> 작성일: 2026-08-20
> 상태: **Phase 1 진행 중.**
> 근거 문서: `Website Design and Development Brief.docx`, `Global_Public_Health_Lens_Website_Starter_Pack.docx` (둘 다 전문 분석 완료)

> **2026-09-11 IA addendum:** 클라이언트 피드백에 따라 기존 단일 랜딩·앵커 내비 가정을 폐기한다. 최신 네비게이션과 독립 페이지 매핑은 [`docs/IA.md`](./IA.md)를 기준으로 하며, 이 부록이 §3·§4의 기존 단일 페이지 설명보다 우선한다. `Explore the Map`은 `Country Spotlight`와 중복되어 제거하고, `Evidence Base`는 푸터 유틸리티로 유지한다.

---

## 0. 이 문서를 읽는 방법

이 문서는 **개발 착수 전 합의된 사양서**다. 구현자는 다음 순서로 읽으면 된다.

1. §1 프로젝트 목표 — 무엇을 왜 만드는가
2. §2 확정 결정사항 — 원본 문서와 프롬프트가 충돌하는 지점의 최종 판단
3. §3~§5 범위 / 페이지 구조 / 컴포넌트
4. §6 DESIGN.md 확보 및 병합 — **UI 코드 한 줄 쓰기 전에 반드시 선행**
5. §7~§9 기술 스택 / 콘텐츠 데이터 / 에셋
6. §10 개발 순서
7. §11~§13 완료 조건 / 제외 범위 / 미해결 항목

UI 텍스트·변수명·함수명·컴포넌트명·코드 주석은 **전부 영문**. 이 문서와 `docs/DEVELOPMENT_RESULT.md`만 한국어.

---

## 1. 프로젝트 목표

`Global Public Health Lens`(이하 GPHL)를 소개하고, 별도로 개발될 Nutrition App으로 사용자를 연결하는 **영문 랜딩 웹사이트**를 만든다.

### 1.1 전달해야 할 5가지

| # | 목표 | 담당 섹션 |
|---|------|-----------|
| 1 | GPHL 프로젝트/클럽의 목적 소개 | Hero, Mission |
| 2 | Global Nutrition & Micronutrient Health 주제 소개 | Micronutrients |
| 3 | **글로벌 공중보건 관점의 차별성 전달** | Global Lens |
| 4 | Nutrition App의 주요 기능 소개 | Nutrition App Preview |
| 5 | Nutrition Web App / App Store로 연결하는 CTA | Header CTA, App 섹션 |

### 1.2 포지셔닝 (원본 문서에서 확정된 사항)

- **조직 = Global Public Health Lens** (확장 가능한 상위 플랫폼)
- **첫 이니셔티브 = Global Nutrition and Micronutrient Health** (조직의 영구적 한계가 아님)
- 태그라인: `Understanding health through a global lens.`
- 앱 워킹네임: `GPH Lens: Nutrition`
- 브랜드 약속: *"Every topic will connect three levels: what happens in the body, what happens in communities, and what public-health systems can do."*
- **절대 금지되는 인상**: 영양제 판매 사이트, 상업적 웰니스 사이트, 응급 의료 서비스

### 1.3 성공 판정 기준 (스타터팩 §17 원문 기준)

- 첫 화면에서 global-health 목적이 명확할 것
- 진단/치료 없이 유용한 미량영양소 교육을 제공할 것
- 개인 영양 정보와 **나란히** 인구집단 수준의 원인·해법을 설명할 것
- 사이트 재구축 없이 영양소·사례연구·향후 프로젝트를 추가할 수 있을 것

---

## 2. 확정 결정사항 (충돌 해소)

프롬프트와 첨부 문서 2종은 여러 지점에서 범위가 다르다. 아래는 사용자 확인을 거쳐 **확정**된 판단이다.

| # | 충돌 지점 | 프롬프트 | 첨부 브리프 | **확정** |
|---|-----------|----------|-------------|----------|
| D1 | 사이트 규모 | Single Landing Page + 앵커 내비 (§6) | 5개 별도 페이지 + 영양소 상세페이지 + 검색/필터 + CMS | **랜딩 1페이지만 구현. 단, 콘텐츠를 `content/` 레이어로 완전 분리해 후속 라우트 추가 시 재작성 불필요** |
| D2 | 브랜드 에셋 | 언급 없음 | §14에 SVG 7종 목록 | **실제 전달된 건 .docx 2개뿐. docx 내부 PNG 4종을 추출해 사용하고, 로고/파비콘만 SVG로 재작성** |
| D3 | Contact 폼 | 백엔드 연결 MVP 필수 아님 (§15) | Gmail 전송 + 스팸 방지 + 성공 메시지 | **UI·검증·상태처리 전부 구현, 실제 전송만 비활성. `siteConfig.contact.endpoint` 한 줄로 Formspree 활성화** |
| D4 | 영양소 개수 | 랜딩에 4~6종 editorial list (§9) | 13종 + 개별 상세페이지 | **데이터는 스타터팩에 완성 카피가 있는 8종 전부 수록. 랜딩 노출은 editorial list + 인라인 확장** |
| D5 | 내비게이션 라벨 | About / Micronutrients / Global Lens / Nutrition App / Contact | Home / Micronutrient Guide / Nutrition App / Solutions & Action / About & Contact | **프롬프트 5종을 그대로 사용** (아래 D5-a 참조) |
| D6 | 앱 이름 | "Nutrition App" | "GPH Lens: Nutrition" | **제품명은 `GPH Lens: Nutrition`, 내비 라벨은 `Nutrition App`** |
| D7 | Hero 서포팅 카피 | geography, **policy**, inequality 포함 | policy 미포함 | **프롬프트 버전(policy 포함) 채택 — 상위집합이며 §10 차별성 서사와 일치** |

**D5-a — Solutions 섹션의 내비 처리:**
프롬프트의 내비 목록에 `Solutions`가 없지만 §12에 Public Health Solutions 섹션은 존재한다. Global Lens 섹션의 3단계 서사 마지막 항목("what public-health systems can do")이 곧 Solutions로 이어지므로, **Solutions는 Global Lens에 연속된 하위 섹션으로 배치하고 별도 내비 항목을 만들지 않는다.** 내비에 추가하려면 `content/navigation.ts` 배열에 한 줄만 넣으면 된다.

---

## 3. 구현 범위

### 3.1 포함

- **단일 랜딩 페이지** (`/`) — 앵커 스크롤 내비게이션
- 데스크톱 / 태블릿 / 모바일 반응형 (320 · 375 · 768 · 1024 · 1440 · 1920)
- 모바일 햄버거 내비게이션
- 영양소 8종 데이터 + editorial list UI + 인라인 확장 패널
- Iron을 사례로 한 3단계 Global Lens 서사
- Nutrition App 프리뷰 (실제 스크린샷 교체 가능한 별도 컴포넌트)
- Public Health Solutions 6종 + 사례연구 3종
- Sources 섹션 (WHO / UNICEF / NIH ODS / USDA FoodData Central 텍스트 링크)
- Health Disclaimer
- Contact 폼 (UI + 클라이언트 검증 + 상태처리, 전송 비활성)
- Footer
- SEO 메타데이터 · Open Graph · favicon · `sitemap.xml` · `robots.txt`
- 접근성: 키보드 내비게이션, 포커스 링, 의미있는 이미지 alt, 색 대비, `prefers-reduced-motion`

### 3.2 구조만 준비 (이번 구현 대상 아님)

후속 개발 시 **데이터 재작성 없이** 라우트만 추가하면 되도록 설계한다.

```
미구현 (폴더/타입만 존재):
  /guide            영양소 인덱스 + 검색/필터
  /guide/[slug]     영양소 상세페이지 8개
  /solutions        Solutions & Action 전용 페이지
  /about            About & Contact 전용 페이지
  /projects/[slug]  향후 공중보건 프로젝트
```

이를 위해 `content/` 타입에 브리프가 요구한 필드를 **미리 포함**한다: `source`, `sourceUrl`, `reviewedAt`, `slug`, `category`, `bodyFunctions`.

---

## 4. 페이지 구조

### 4.1 섹션 순서

```
┌─────────────────────────────────────────────────────────┐
│ Header (sticky)                                          │
│   좌: GPHL 로고 락업                                     │
│   우: About · Micronutrients · Global Lens ·            │
│       Nutrition App · Contact    [ Explore the App ]     │
│   모바일: 햄버거                                         │
├─────────────────────────────────────────────────────────┤
│ #hero          비대칭 2단 — 좌 텍스트 / 우 일러스트      │
│                H1 + 서포팅 + CTA 2개                     │
├─────────────────────────────────────────────────────────┤
│ #about         Mission — "Health is shaped by more      │
│                than individual choices."                 │
│                + 6개 결정요인 인라인 나열                │
├─────────────────────────────────────────────────────────┤
│ #micronutrients  비대칭 5:7 — 좌 설명 / 우 영양소        │
│                  editorial list 8종 + 인라인 확장        │
├─────────────────────────────────────────────────────────┤
│ #global-lens   ★ 핵심 차별성 섹션                        │
│                3단계 수직 서사 (Iron 사례)               │
│                body → communities → systems              │
│                └ 이어서 Solutions 6종 + 사례연구 3종     │
├─────────────────────────────────────────────────────────┤
│ #app           Nutrition App Preview                     │
│                4단계 워크플로 + 기능 5종 + 스크린샷      │
│                + 앱 disclaimer + CTA                     │
├─────────────────────────────────────────────────────────┤
│ #sources       기관 텍스트 링크 8종 + 최종 검토일        │
├─────────────────────────────────────────────────────────┤
│ #contact       폼 (Name / Email / Category /             │
│                Subject / Message / 동의) + 연락 고지     │
├─────────────────────────────────────────────────────────┤
│ Footer (다크 반전 — 페이지에서 유일한 다크 영역)         │
│   미션 · 링크 · 이메일 · 소셜 · Sources · Privacy ·      │
│   Health Disclaimer · Copyright                          │
└─────────────────────────────────────────────────────────┘
```

### 4.2 섹션별 확정 카피 (전부 스타터팩/프롬프트 원문)

<details>
<summary><b>Hero</b></summary>

- H1: `Understanding health through a global lens.`
- Supporting: `Explore how nutrition, food access, geography, policy, and inequality shape the health of communities around the world.`
- Primary CTA: `Explore Micronutrients` → `#micronutrients`
- Secondary CTA: `Discover the Nutrition App` → `#app`
</details>

<details>
<summary><b>Mission (#about)</b></summary>

> Health is shaped by more than individual choices. Where people live, which foods are available and affordable, the services they can access, and the policies surrounding them all influence health. Global Public Health Lens turns these connections into clear, reliable learning experiences.

인라인 노출 개념 6종: `nutrition` · `access` · `environment` · `geography` · `policy` · `inequality`
(카드 6개가 아니라 hairline으로 구분된 인라인 나열로 처리)

Featured initiative 문단:
> Our first initiative explores global nutrition and micronutrient health. Learn why vitamins and minerals matter, how deficiencies affect different populations, and how public-health strategies—from dietary diversity to food fortification—can improve health at scale.

Future projects 문단:
> Nutrition is our first lens—not our last. Future projects may examine clean water and sanitation, infectious-disease prevention, maternal and child health, mental-health access, environmental health, and other issues that cross borders.
</details>

<details>
<summary><b>Micronutrients (#micronutrients)</b></summary>

좌측 설명:
> Micronutrients are vitamins and minerals that the body needs in small amounts, but their effects are essential. This guide connects the biology of each nutrient with food sources, population risk, and public-health action.
>
> Nutrient needs differ by age, sex, pregnancy status, health conditions, medications, and other factors. The guide is educational and should not be used to diagnose deficiency or choose a supplement dose.

우측 editorial list 8종 (각 항목: 이름 + 한 줄 요약 + hairline divider, 클릭 시 4필드 확장):
`Vitamin A` · `Vitamin D` · `Vitamin B12` · `Folate` · `Iron` · `Iodine` · `Zinc` · `Magnesium`

확장 필드 4종: `What it does in the body` / `Food sources` / `Global public-health lens` / `Safety`
</details>

<details>
<summary><b>Global Lens (#global-lens) — 핵심 섹션</b></summary>

3단계 수직 서사를 **시각적으로** 표현한다. 카드 3개가 아니라, 단계가 이어진다는 것이 보이는 형태.

```
What happens in the body
        │
        ▼
What happens in communities
        │
        ▼
What public-health systems can do
```

Iron 사례 (프롬프트 §10 지정):
1. `supports hemoglobin and oxygen transport`
2. `deficiency affects some populations more strongly`
3. `food access, infections, socioeconomic conditions and healthcare access influence outcomes`
4. `interventions may include dietary diversity, food fortification and targeted public-health programs`

이어지는 Solutions 6종 (스타터팩 §8 원문):
`Dietary diversity` · `Food fortification` · `Targeted supplementation` · `Maternal and child nutrition` · `Healthier food environments` · `Measurement and accountability`

사례연구 3종: `Universal salt iodization` · `Fortifying staple flours and grains` · `Vitamin A programs for young children`
(각 사례연구 타입에 브리프가 요구한 필드 포함: location / issue / population / intervention / lessons / sources)

Solutions 도입 문단:
> Micronutrient problems cannot be solved by telling individuals to make better choices when nutritious foods are unaffordable, unavailable, unsafe, or culturally inappropriate. Effective public health combines individual knowledge with stronger food systems, health services, and policy.
</details>

<details>
<summary><b>Nutrition App (#app)</b></summary>

- Eyebrow: `GPH LENS: NUTRITION`
- H2: `Turn everyday food choices into a learning experience.`
- 설명: `GPH Lens: Nutrition is a planned educational app that will help users record foods, explore nutrient balance, and understand how daily intake connects with the larger story of global nutrition.`
- 워크플로 4단계: `Add Food` → `Enter Amount` → `Track Micronutrients` → `Review Daily Balance`
- 기능 5종: `Record foods` / `Enter grams or servings` / `Track vitamins and minerals` / `Review daily nutrient balance` / `View a nutrition score`
- 스크린샷 영역: **별도 컴포넌트** `<AppScreenshots />` — 현재는 추출한 PNG, 실제 프로토타입 나오면 파일만 교체
- App disclaimer: `App results will be educational estimates based on user-entered information and available food data. They will not diagnose deficiency, confirm nutritional status, or replace individualized advice from a qualified professional.`
- CTA: `siteConfig.nutritionApp.status` 에 따라 `App Coming Soon`(비활성) ↔ `Open Nutrition App`(활성) 자동 전환
</details>

<details>
<summary><b>Sources (#sources)</b></summary>

로고 무단 사용 금지 → **텍스트 링크만**. 실제 URL은 스타터팩 §16에서 추출 완료:

| 기관 | URL |
|------|-----|
| WHO — Micronutrients | `https://www.who.int/health-topics/micronutrients` |
| WHO — Food fortification | `https://www.who.int/health-topics/food-fortification` |
| WHO — Healthy diet | `https://www.who.int/health-topics/healthy-diet` |
| WHO — Social determinants of health equity | `https://www.who.int/publications/i/item/9789240107588` |
| UNICEF — Undernourished and Overlooked | `https://www.unicef.org/reports/undernourished-overlooked-nutrition-crisis` |
| UNICEF Data — Child Nutrition | `https://data.unicef.org/topic/nutrition/child-nutrition/` |
| NIH Office of Dietary Supplements | `https://ods.od.nih.gov/factsheets/list-all/` |
| USDA FoodData Central | `https://fdc.nal.usda.gov/` |

영양소별 NIH ODS 링크 8종도 데이터에 포함 (`.../factsheets/{VitaminA,VitaminD,VitaminB12,Folate,Iron,Iodine,Zinc,Magnesium}-Consumer/`).

모든 외부 링크: `target="_blank" rel="noopener noreferrer"` + 스크린리더용 "(opens in a new tab)".
</details>

<details>
<summary><b>Contact (#contact)</b></summary>

필드: `Name` · `Email address` · `Question category` · `Subject` · `Message` · 개인정보 동의 체크박스(필수)

카테고리 8종: `General question` · `Nutrition information` · `Nutrition app` · `Website feedback` · `Club participation` · `Collaboration` · `Technical issue` · `Other`

성공 메시지:
> Thank you for contacting Global Public Health Lens. Your message has been received. Please remember that we cannot provide emergency assistance, diagnosis, or personalized medical treatment through this form.

연락 고지: 진단 불가 / 응급용 아님 / 개인 의료조언 불가 / 긴급 시 지역 의료서비스 이용

스팸 방지: 숨김 honeypot 필드 + 제출 최소 경과시간 체크 (CAPTCHA 미사용)
</details>

<details>
<summary><b>Footer + Disclaimer</b></summary>

Footer 미션:
> Global Public Health Lens makes health easier to understand by connecting individual experiences with the global systems that shape them.

Health Disclaimer (짧은 버전, 프롬프트 §14):
> Global Public Health Lens provides educational information and does not provide medical diagnosis, treatment, or individualized medical advice.

긴 버전(스타터팩 §11)은 `content/legal.ts`에 보관 — 향후 `/health-disclaimer` 페이지용.

Footer 링크: Micronutrient Guide · Nutrition App · Solutions & Action · About · Contact · Sources · Privacy · Health Disclaimer
(현재 미구현 라우트는 앵커 또는 `#` placeholder)
</details>

### 4.3 SEO

- `<title>`: `Global Public Health Lens | Understanding Health Globally`
- `<meta name="description">`: `Explore how nutrition, food access, policy, geography, and inequality shape health across communities worldwide.`
- OG 이미지: 히어로 일러스트 + 로고를 **HTML/이미지 파일에서 합성**. 일러스트 안에 텍스트를 넣지 말 것 (스타터팩 §12 지시)
- `lang="en"`

---

## 5. 주요 컴포넌트

```
components/
├── layout/
│   ├── Header.tsx              sticky, 스크롤 시 hairline 노출
│   ├── MobileNav.tsx           햄버거 오버레이, 포커스 트랩, ESC 닫기
│   ├── Footer.tsx
│   └── SectionShell.tsx        섹션 공통 래퍼 (canvas↔surface 교대, 상하 여백, id 앵커)
├── hero/
│   ├── Hero.tsx
│   └── HeroVisual.tsx          일러스트 + 반응형 아트디렉션
├── mission/
│   └── MissionSection.tsx
├── micronutrients/
│   ├── MicronutrientSection.tsx
│   ├── NutrientList.tsx        editorial list (WIRED story-row 패턴)
│   └── NutrientRow.tsx         hairline divider + 인라인 확장 (details/summary 기반)
├── global-lens/
│   ├── GlobalLensSection.tsx
│   ├── LensChain.tsx           3단계 수직 서사 (Iron 사례)
│   ├── SolutionsList.tsx       6종
│   └── CaseStudyList.tsx       3종
├── app-preview/
│   ├── NutritionAppPreview.tsx
│   ├── AppWorkflow.tsx         4단계 흐름
│   └── AppScreenshots.tsx      ★ 교체 전용 컴포넌트
├── sources/
│   └── SourcesSection.tsx
├── contact/
│   ├── ContactSection.tsx
│   └── ContactForm.tsx         검증 + idle/submitting/success/error 상태
└── ui/
    ├── Eyebrow.tsx             sentence case 라벨 (대문자 자간 금지)
    ├── ButtonLink.tsx          primary / secondary, radius 0
    ├── Rule.tsx                hairline divider
    ├── ExternalLink.tsx        새 탭 + a11y 라벨
    └── DisclaimerNote.tsx
```

**컴포넌트 원칙**

- `ui/` 컴포넌트 5개 외에 범용 `Card` 컴포넌트를 **만들지 않는다.** (§6.4 참조)
- 모든 섹션은 `SectionShell`로 감싸 배경 교대·앵커·여백을 일원화
- 콘텐츠는 컴포넌트에 하드코딩하지 않고 전부 `content/`에서 주입

---

## 6. DESIGN.md 확보 및 병합 ★ 최우선

> **UI 코드를 한 줄이라도 쓰기 전에 이 단계를 끝낸다.**

### 6.1 선정 근거

getdesign.md 카탈로그 **328개 전수 스윕 → 64개 후보 → 상위 10개 실제 다운로드 후 전문 비교**를 거쳤다. 웹 미리보기 페이지에는 마케팅 요약만 노출되므로, `npx`로 실제 파일을 받아 규칙을 직접 읽고 판단했다.

| 후보 | 판정 | 사유 |
|------|------|------|
| **IBM (Carbon)** | ✅ 채택 — 구조 레이어 | 화이트 서피스, 단일 액센트, radius 0, drop-shadow 전면 금지, 16컬럼 그리드 |
| **WIRED** | ✅ 채택 — 편집 레이어 | story-row + hairline divider, 비대칭 매거진 그리드, flat only |
| **Notion** | ✅ 채택 — 독해 레이어 | Inter, 따뜻한 off-white canvas, 본문 weight 400 고정 |
| Claude | ❌ | cream+coral+슬랩세리프 — 팔레트 충돌 |
| Apple | ❌ | light/dark 교대 캔버스, 제품 마케팅 지향 |
| Mintlify | ❌ | 히어로 sky-gradient = 금지 항목 |
| Sanity / HashiCorp / Linear / Vercel | ❌ | dark-first 또는 mesh gradient = 금지 항목 |

### 6.2 다운로드

`npx getdesign add`는 **실행 위치에 `DESIGN.md`를 덮어쓴다.** 따라서 반드시 개별 폴더로 받는다.

```bash
# 주의: 셸 훅이 npx를 npm으로 재작성할 수 있음 → 전체 경로 사용
NPX=$(which npx)
mkdir -p /tmp/gphl-design && cd /tmp/gphl-design
for s in ibm wired notion; do
  mkdir -p "$s" && (cd "$s" && "$NPX" --yes getdesign@latest add "$s")
done
```

원본 3종은 이미 다운로드해 두었다 (세션 스크래치패드, 정리될 수 있으므로 위 명령으로 재취득 가능):
`/private/tmp/claude-501/-Users-mk-Dev-Cade/62c3e2ac-8fce-4430-862c-4ea89087c591/scratchpad/dmd/`

### 6.3 배치

```
Cade/
├── DESIGN.md                    ← 병합본. 코딩 에이전트가 UI 작성 전 읽는 단일 진실
└── docs/
    ├── TASK.md                  ← 이 문서
    ├── DEVELOPMENT_RESULT.md    ← 개발 완료 후 작성
    └── design/
        ├── MERGE_NOTES.md       ← 어떤 규칙을 채택/기각했는지 기록
        └── vendor/
            ├── ibm.DESIGN.md    ← 원본 26KB
            ├── wired.DESIGN.md  ← 원본 24KB
            └── notion.DESIGN.md ← 원본 27KB
```

### 6.4 병합 규칙 — 채택/치환/기각

**IBM Carbon에서 채택 (구조·절제)**

| 원본 규칙 | 우리 적용 |
|-----------|-----------|
| 모든 버튼/입력/컨테이너 `border-radius: 0` | **부분 채택 (수정 2026-08-21).** 구조 표면(섹션·룰·리스트 행·입력)은 radius 0 유지 → 금지항목 "둥근 카드 10개 반복" 차단. **인터랙티브 컨트롤(버튼·CTA)만 radius 8px** + press 상태. 사유: radius 0 컨트롤이 클릭 가능 여부를 전달하지 못하고 구형 폼 컨트롤처럼 읽힘. 상태 표시는 pill(999px)로 버튼과 구분 |
| drop-shadow 전면 금지, surface 전환 + 1px hairline으로 위계 | 그대로 채택 |
| display는 weight 300, "헤드라인 bold 금지" | 그대로 채택 → calm·academic 톤 확보 |
| 액센트 **1개만**, 희소하게 (링크·주 CTA·포커스만) | **치환**: IBM Blue → Deep Navy `#12314B` + Public Health Teal `#159A91` |
| canvas ↔ surface-1 2면 리듬으로 섹션 구분 | **치환**: `#FFFFFF` ↔ Cloud `#F5F8F7` |
| eyebrow는 sentence case, 대문자 자간 금지 | 그대로 채택 (앱 섹션 eyebrow만 예외) |
| 푸터만 다크 반전, 나머지 전부 light | **치환**: 반전색 → Ink `#17252E` 또는 Deep Navy |
| 4px 베이스 스페이싱 | 그대로 채택 (Tailwind 기본과 일치) |
| 48px 최소 터치 타겟 | 그대로 채택 |

**IBM에서 기각**
- 4-up 카드 그리드 → **기각.** 금지항목 "동일한 3-column cards 반복"과 직결. WIRED story-row로 대체
- 히어로 soft-blue gradient → **기각.** 금지항목 "과도한 gradient"
- 콘텐츠 밀도 극대화 ("customers expect to see a lot") → **완화.** 학생·일반인 대상이므로 여백 확보
- 1584px 최대 폭 → **축소.** 1280px (본문 가독성)

**WIRED에서 채택 (편집)**

| 원본 규칙 | 우리 적용 |
|-----------|-----------|
| story-row: 전폭 1칼럼 + hairline divider 스택 | **영양소 8종 editorial list의 기본 패턴** |
| 히어로 1개 + 2-up 보조 + 수직 스택 = 비대칭 그리드 | Hero, Micronutrients 5:7 분할에 적용 |
| Level 0 flat / Level 1 hairline **둘뿐**, 그림자 없음 | 그대로 채택 (IBM과 동일 방향, 상호 보강) |
| 섹션 상하 48px 기준 | 데스크톱 96px / 모바일 56px로 스케일 |
| 세 서체 세 역할 (display / body / label) | **치환**: Inter 단일 패밀리 + weight·size·tracking으로 3역할 분리 |

**WIRED에서 기각**
- 순수 흑백 + 크로마틱 액센트 전면 금지 → **기각.** 브랜드북이 Navy/Teal을 지정
- 독자 세리프 display (WiredDisplay) → **기각.** 브랜드 타이포는 Inter 지정
- 컨테이너 1400px → **축소.** 1280px

**Notion에서 채택 (독해)**

| 원본 규칙 | 우리 적용 |
|-----------|-----------|
| **"순백 위에 전면 본문 금지 — 따뜻한 canvas가 brand calm의 핵심"** | 그대로 채택. 이것이 요구사항 *"scientific but not clinical"* 의 구체적 실행 근거이자 Cloud `#F5F8F7`를 기본 canvas로 쓰는 이유 |
| 본문은 무조건 weight 400, "본문에 굵은 weight 금지" | 그대로 채택 |
| 액센트는 주 액션·인라인 링크·포커스 신호에만, 장식 금지 | 그대로 채택 (IBM 규칙과 동일 — 상호 보강) |
| hairline + 거의 안 보이는 Level-1로 서피스 정의, 강한 그림자 금지 | 그대로 채택 |

**Notion에서 기각**
- 스티커 팔레트(핑크/오렌지 등 다색 장식) → **기각.** 팔레트는 브랜드북 6색으로 고정
- pill `rounded-full` CTA → **기각.** IBM radius 0 규칙이 우선
- 딥 인디고 "night" 히어로 → **기각.** 라이트 우선

### 6.5 병합본 필수 포함 토큰

#### 색 대비 실측 결과 ★ 중요

브랜드북 6색의 WCAG 대비를 **전부 실측했다. 3건이 AA에 미달한다.** 브랜드색을 그대로 쓰면 접근성 완료 조건을 통과할 수 없으므로, 아래 파생 토큰을 반드시 함께 정의한다.

| 조합 | 대비 | AA 본문(4.5) | 판정 |
|------|------|:---:|------|
| Navy `#12314B` on White | 13.40:1 | ✅ | 헤딩·본문 모두 안전 |
| Navy on Cloud `#F5F8F7` | 12.54:1 | ✅ | |
| Ink `#17252E` on Cloud | 14.66:1 | ✅ | 본문 기본 |
| White on Navy | 13.40:1 | ✅ | 주 버튼·푸터 |
| Navy on Gold `#F2B84B` | 7.49:1 | ✅ | 스타터팩 지침대로 골드엔 네이비 텍스트 |
| **Teal `#159A91` on White** | **3.46:1** | ❌ | **본문/링크 텍스트 사용 금지** |
| **White on Teal `#159A91`** | **3.46:1** | ❌ | **버튼 배경 사용 금지** |
| **Green `#75B85A` on White** | **2.40:1** | ❌ | **텍스트 절대 금지** |
| **White on Gold `#F2B84B`** | **1.79:1** | ❌ | **골드 위 흰 텍스트 금지** |

스타터팩 §3의 경고("Teal — 작은 텍스트에 주의, 필요시 어둡게", "골드는 흰색이 아니라 네이비와 페어")가 수치로 확인된 셈이다.

**해결: 색조(H 175.9°)·채도(S 0.76)를 유지한 채 명도만 낮춘 텍스트 전용 파생 토큰을 추가한다.**

| 파생 토큰 | 값 | on White | on Cloud | White on it |
|-----------|-----|:---:|:---:|:---:|
| `--color-teal-text` | `#117E76` | 4.92:1 ✅ | 4.60:1 ✅ | 4.92:1 ✅ |
| `--color-green-text` | `#4B7E36` | 4.87:1 ✅ | 4.56:1 ✅ | — |
| `--color-gold-text` | `#99670B` | 4.87:1 ✅ | 4.56:1 ✅ | — |

주의: `--color-teal-text`를 Navy 배경 위에 올리면 2.73:1로 미달한다. **네이비 배경(푸터·주 버튼) 위에는 흰색만 사용.**

#### 토큰 정의

```
Colors — 구조
  --color-white        #FFFFFF   교대 서피스
  --color-cloud        #F5F8F7   기본 canvas  ("순백 전면 본문 금지" — Notion 규칙)
  --color-ink          #17252E   본문
  --color-navy         #12314B   헤딩 · 주 버튼 배경 · 내비 · 푸터 반전
  --color-hairline     navy @ 12%   divider · border  ← 유일한 위계 표현 수단

Colors — 액센트 (희소하게)
  --color-teal         #159A91   비텍스트 전용: rule · 아이콘 fill · 그래픽 · 대형 텍스트(24px+)
  --color-teal-text    #117E76   인라인 링크 · 포커스 링 · 세컨더리 버튼 배경
  --color-green        #75B85A   비텍스트 전용: 영양/식품 맥락의 rule·dot·fill. 텍스트 금지
  --color-gold         #F2B84B   배경 전용. 반드시 navy 텍스트와 페어 (Safety 노트 등)
  --color-green-text   #4B7E36   필요 시에만
  --color-gold-text    #99670B   필요 시에만

Radius   0 (전역).  예외: 원형 아이콘 컨테이너만 full
Shadow   없음 (전역)
Font     Inter (next/font), 폴백 Arial → system sans
Body     16px 이상 / weight 400 / line-height 1.6+
Display  weight 300, 음수 tracking, clamp() 유동 스케일
Motion   150–300ms, transform/opacity만, prefers-reduced-motion 존중
```

**색 단독 의존 금지** (스타터팩 §3: *"Do not rely on color alone to communicate status"*): Safety 노트 등 상태 표현은 반드시 **색 + 라벨 텍스트**를 함께 쓴다. 골드 배경만으로 "주의"를 전달하지 않는다.

**한 화면 색 사용 규칙**: Navy + Teal 계열을 중심으로 하고, Green·Gold는 각각 화면당 1~2회 이내로 제한한다.

### 6.6 "AI가 만든 것 같은" 회피 — 금지항목 → 실행 규칙 매핑

| 금지 항목 | 이를 막는 구체 규칙 | 출처 |
|-----------|---------------------|------|
| 과도한 gradient / glowing / neon | 배경 gradient 전면 금지. 단색 서피스 2종 교대만 | IBM |
| glassmorphism | backdrop-filter 사용 금지 | IBM/Notion |
| 모든 내용을 Card에 | 범용 `Card` 컴포넌트를 **만들지 않음**. hairline divider + surface 전환으로 대체 | WIRED/IBM |
| Bento Grid 남발 | 그리드는 5:7 비대칭 1종 + 1칼럼 스택 1종만 사용 | WIRED |
| 둥근 카드 10개+ 반복 | `border-radius: 0` 전역 | IBM |
| 의미 없는 통계 숫자 | 숫자는 **출처 있는 값**만. 무출처 카운터 금지 | 브리프 §9 |
| 과도한 icon decoration | Lucide 아이콘 총 사용량 상한 **8개**, 장식 목적 사용 금지 | 프롬프트 §2 |
| 모든 section 중앙 정렬 | 기본은 좌측 정렬. 중앙 정렬은 Hero CTA 행 등 최대 1곳 | WIRED |
| 지나치게 큰 SaaS Hero | Hero는 뷰포트 100vh를 채우지 않음. 헤드라인 weight 300 | IBM |
| AI 일러스트 배경 남발 | 일러스트는 Hero 우측 1회만. 배경으로 깔지 않음 | 프롬프트 §7 |
| 무의미한 floating shapes | 장식 도형 0개 | IBM |
| 동일한 3-column cards 반복 | 3칼럼 반복 레이아웃 0회 | WIRED |
| SaaS Dashboard UI | 앱 프리뷰는 실제 스크린샷 이미지만. UI 목업 재현 금지 | 프롬프트 §3 |

---

## 7. 사용할 기술

### 7.1 스택 (2026-08-20 기준 최신 확인 완료)

| 항목 | 버전 | 비고 |
|------|------|------|
| Next.js | `16.3.1` | App Router |
| React | `19.2.8` | |
| TypeScript | create-next-app 스캐폴드 기본값 | 최신은 `7.0.2`, 필요 시 업그레이드 |
| Tailwind CSS | `4.3.3` | **v4 = CSS-first.** `tailwind.config.js` 없음, `globals.css`의 `@theme`에 토큰 정의 |
| lucide-react | `1.33.0` | 아이콘 총 8개 상한 |
| 패키지 매니저 | `pnpm 10.33.0` (로컬 확인) | npm/bun도 가능 |
| Node | `v25.8.2` (로컬 확인) | |

### 7.2 사용하지 않는 것

- ❌ shadcn/ui, Radix, MUI, Chakra 등 UI 컴포넌트 라이브러리
- ❌ Framer Motion / GSAP — CSS transition + IntersectionObserver로 충분
- ❌ 상태관리 라이브러리 — 서버 상태가 없음
- ❌ CMS / 데이터베이스 / 인증 / 애널리틱스 SDK
- ❌ 폼 라이브러리 — 필드 6개는 네이티브 + `useState`로 충분

### 7.3 스캐폴딩

```bash
pnpm create next-app@latest gphl-website \
  --typescript --tailwind --eslint --app \
  --src-dir --import-alias "@/*" --no-turbopack
```
(`--turbopack` 여부는 빌드 안정성 확인 후 결정)

### 7.4 성능 목표

전역 룰 `rules/web/performance.md` 랜딩 페이지 기준 준수.

| 지표 | 목표 |
|------|------|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| JS (gzip) | < 150kb |
| CSS | < 30kb |

- 히어로 이미지: `priority` + `fetchpriority="high"`, 명시적 width/height
- 그 외 이미지: `loading="lazy"`
- 이미지 포맷: AVIF 우선, WebP 폴백
- 폰트: Inter 1패밀리, `font-display: swap`, 사용 weight만 서브셋

---

## 8. 콘텐츠 데이터 구조

화면 구조와 콘텐츠를 완전히 분리한다. **후속 개발 시 데이터 재작성이 없어야 한다** (브리프 핵심 요구).

```
content/
├── site-config.ts     ★ 소유자가 바꿀 값 전부를 여기 한 곳에
├── navigation.ts      내비 항목 + 앵커
├── nutrients.ts       영양소 8종
├── solutions.ts       해법 6종
├── case-studies.ts    사례연구 3종
├── sources.ts         기관 출처 8종 + 영양소별 링크
├── app-preview.ts     워크플로 4단계 + 기능 5종
└── legal.ts           disclaimer(단·장문) / privacy / affiliate / 연락 고지
```

### 8.1 `site-config.ts` — 소유자 변경 지점 단일화

```ts
export const siteConfig = {
  organization: 'Global Public Health Lens',
  tagline: 'Understanding health through a global lens.',
  email: '[INSERT ORGANIZATION EMAIL]',        // 미정
  socialLinks: [],                              // 미정
  domain: '[INSERT DOMAIN]',                    // 미정
  nutritionApp: {
    name: 'GPH Lens: Nutrition',
    status: 'coming-soon',                      // 'coming-soon' | 'live'
    webUrl: '',                                 // 미정
    appStoreUrl: '',                            // 미정
    googlePlayUrl: '',                          // 미정
  },
  contact: {
    endpoint: '',                               // '' → 전송 비활성. Formspree URL 넣으면 활성
    responseTime: '[INSERT, E.G. 3-5 WORKING DAYS]',
  },
  lastReviewedAt: '2026-08-20',
} as const
```

### 8.2 타입 — 향후 확장 필드 선반영

```ts
// 브리프가 요구한 재사용 콘텐츠 타입. 지금은 랜딩에서 일부만 쓰지만
// 필드는 미리 채워둬 후속 상세페이지 추가 시 데이터 재작성이 없게 한다.
export type Nutrient = {
  slug: string                    // 향후 /guide/[slug]
  name: string
  category: 'vitamin' | 'mineral'
  bodyFunctions: string[]         // 향후 필터용
  summary: string                 // editorial list 한 줄 요약
  whatItDoes: string
  foodSources: string
  globalLens: string
  safetyNote: string
  source: string
  sourceUrl: string
  reviewedAt: string
}

export type CaseStudy = {
  slug: string
  title: string
  location: string
  issue: string
  population: string
  intervention: string
  lessons: string
  sources: Source[]
  reviewedAt: string
}

export type Source = {
  organization: string
  title: string
  url: string
  reviewedAt: string
}
```

### 8.3 콘텐츠 출처

영양소 8종·해법 6종·사례연구 3종의 **본문은 스타터팩에 완성 카피가 이미 존재**한다. 새로 작성하지 말고 원문을 그대로 옮긴다. 특히 안전(Safety) 문장은 스타터팩 §15가 "게시 전 자격 있는 보건/영양 전문가 검토 필요"로 명시했으므로 **임의 수정 금지**.

---

## 9. 브랜드 에셋

### 9.1 현재 상황

스타터팩 §14는 SVG 7종을 나열하지만 실제 전달된 것은 `.docx` 2개뿐이다. docx 내부에서 PNG 4종을 확인했다.

| docx 내부 | 크기 | 내용 | 용도 |
|-----------|------|------|------|
| `word/media/image1.png` | 1024×1024 | 로고 마크 (티일 링 + 네이비 지구본 + 그린 위도선 + 골드 점 + 렌즈 손잡이) | 파비콘 · 앱 아이콘 · 소셜 |
| `word/media/image2.png` | 2800×720 | 가로형 락업 (마크 + "Global Public Health / Lens" + 태그라인) | 헤더 · 푸터 |
| `word/media/image3.png` | 1672×941 | 히어로 일러스트 (지구본 + 다양한 세대·지역 인물 + 식품) | Hero |
| `word/media/image4.png` | 1800×1000 | 앱 콘셉트 3화면 (Today 82점 / Add a meal / Global Lens: Iron) | App 프리뷰 |

### 9.2 추출

```bash
mkdir -p /tmp/gphl-assets
unzip -o "Global_Public_Health_Lens_Website_Starter_Pack.docx" -d /tmp/gphl-assets
cp /tmp/gphl-assets/word/media/image1.png public/brand/logo-mark.png
cp /tmp/gphl-assets/word/media/image2.png public/brand/logo-horizontal.png
cp /tmp/gphl-assets/word/media/image3.png public/brand/hero-illustration.png
cp /tmp/gphl-assets/word/media/image4.png public/brand/app-preview.png
```

### 9.3 처리 방침

- **로고 마크 → SVG 재작성.** 도형이 단순(원·링·타원 위경도선·둥근 사각 손잡이·원형 골드 점)하고 색이 브랜드 6색과 정확히 일치하므로 재현 가능. 헤더/파비콘 선명도 확보 목적
- **가로형 락업 → SVG 재작성** (마크 SVG + Inter 텍스트 조합)
- **파비콘** → 마크 SVG에서 파생, `.ico` + `.svg` + apple-touch-icon
- **히어로 일러스트 → PNG 유지 + AVIF/WebP 변환.**
  구도상 **좌측 약 40%가 빈 크림색 영역**이다. 따라서 Hero는 *좌측 텍스트 / 우측 일러스트* 비대칭 배치가 원본 아트워크와 자연스럽게 맞물린다. 이는 프롬프트 §7의 "큰 editorial typography + 작은 supporting visual" 지시와도 일치.
  alt (스타터팩 지정): `Illustration of people from different generations gathered around a globe with vegetables, grains, legumes, citrus, eggs and fish.`
- **앱 프리뷰 → PNG 유지 + 변환.** 3화면이 한 이미지에 합쳐져 있으므로, 모바일에서는 개별 화면으로 크롭한 파생본을 쓰거나 가로 스크롤 처리
- 모든 이미지에 명시적 `width`/`height` (CLS 방지)

---

## 10. 개발 순서

### Phase 0 — 준비 (코드 없음)

1. `npx getdesign add`로 ibm / wired / notion DESIGN.md 3종 개별 다운로드
2. `docs/design/vendor/`에 원본 배치
3. §6.4 기준으로 **루트 `DESIGN.md` 병합본 작성** — 팔레트를 브랜드 6색으로 치환
4. `docs/design/MERGE_NOTES.md`에 채택/기각 기록
5. docx에서 PNG 4종 추출 → `public/brand/`

### Phase 1 — 기반

6. `create-next-app` 스캐폴딩
7. `globals.css`의 `@theme`에 §6.5 토큰 정의 (Tailwind v4 CSS-first)
8. Inter 폰트 설정 (`next/font`)
9. `content/` 8개 파일에 스타터팩 원문 카피 전량 입력 + 타입 정의
10. `SectionShell` · `Rule` · `Eyebrow` · `ButtonLink` · `ExternalLink` 작성
11. §6.5 파생 토큰(`--color-teal-text` 등 3종) 정의 — 실측 완료, 재조사 불필요

### Phase 1 IA addendum — 2026-09-11

- [x] Primary navigation grouped into `About` and `The Lens` disclosures
- [x] Canonical route map implemented for each primary destination
- [x] Homepage reduced to Hero + editorial project directory
- [x] `Explore the Map` duplicate removed; `Country Spotlight` is the sole map destination
- [x] `Evidence Base` terminology and footer utility route aligned
- [x] Shared route wrapper with breadcrumb and independent page sections added

### Phase 2 — 뼈대

12. `layout.tsx` — 메타데이터, 폰트, `lang="en"`
13. `Header` + `MobileNav` (포커스 트랩, ESC, 스크롤 시 hairline)
14. `Footer`
15. 앵커 스크롤 + `scroll-margin-top`(sticky 헤더 보정) + 활성 섹션 하이라이트

### Phase 3 — 콘텐츠 섹션

16. `Hero` + `HeroVisual` — 비대칭 배치
17. `MissionSection`
18. `MicronutrientSection` + `NutrientList` + `NutrientRow` (인라인 확장)
19. **`GlobalLensSection` + `LensChain`** — 가장 공들일 섹션. 3단계가 *이어진다*는 것이 시각적으로 읽혀야 함
20. `SolutionsList` + `CaseStudyList`
21. `NutritionAppPreview` + `AppWorkflow` + `AppScreenshots`
22. `SourcesSection`
23. `ContactSection` + `ContactForm` (검증·상태·honeypot)

### Phase 4 — 마감

24. 반응형 점검: 320 / 375 / 768 / 1024 / 1440 / 1920 — 가로 오버플로 0
25. 접근성: 키보드 전체 순회, 포커스 링 가시성, 대비 실측, alt 텍스트, `prefers-reduced-motion`
26. 성능: Lighthouse, 번들 크기, 이미지 포맷/치수
27. SEO: 메타데이터, OG 이미지, `sitemap.xml`, `robots.txt`
28. **§6.6 금지항목 13개 전수 자체검수**
29. `pnpm build` 무오류 확인
30. `docs/DEVELOPMENT_RESULT.md` 작성 (한국어)

---

## 11. 완료 조건

### 기능

- [ ] `pnpm install` 후 `pnpm dev` 즉시 실행
- [ ] `pnpm build` 오류·경고 없이 통과
- [ ] 랜딩 페이지 전 섹션 렌더링
- [ ] 앵커 내비게이션 정상 동작 (sticky 헤더 높이 보정 포함)
- [ ] 모바일 햄버거 내비 열림/닫힘/포커스 트랩/ESC
- [ ] 영양소 8종 인라인 확장 동작
- [ ] Contact 폼 검증 + idle/submitting/success/error 상태 전부 확인 가능
- [ ] 앱 CTA가 `siteConfig.nutritionApp.status`로 전환됨
- [ ] 외부 링크 8종 전부 정상 (새 탭 + rel)

### 콘텐츠

- [ ] UI 텍스트 100% 영어 — 한국어 문자열 0개
- [ ] 변수/함수/컴포넌트명 + 코드 주석 100% 영어
- [ ] 스타터팩 원문 카피 사용, 안전 문장 임의 수정 없음
- [ ] Health Disclaimer 노출
- [ ] Sources 8종 + 최종 검토일 노출
- [ ] 무출처 통계 숫자 0개

### 디자인

- [ ] 루트 `DESIGN.md` 병합본 존재, 코드가 그 규칙을 따름
- [ ] §6.6 금지항목 13개 전부 위반 없음
- [ ] 팔레트: 한 화면에서 Navy + Teal 중심, Green/Gold는 제한적
- [ ] `border-radius: 0` — 구조 표면 전역. 예외는 인터랙티브 컨트롤(버튼 8px)과 상태 pill(999px)뿐 (§6.4 수정사항)
- [ ] `box-shadow` 0개
- [ ] 배경 gradient 0개
- [ ] 범용 `Card` 컴포넌트 미존재
- [ ] Lucide 아이콘 8개 이하
- [ ] 3칼럼 반복 레이아웃 0회
- [ ] 첫 화면에서 global-health 목적이 명확

### 품질

- [ ] 320 / 375 / 768 / 1024 / 1440 / 1920 가로 오버플로 없음
- [ ] 키보드만으로 전체 순회 가능, 포커스 링 가시
- [ ] 본문·링크 대비 WCAG AA — §6.5 실측표 준수. 특히 원색 Teal/Green을 텍스트에, 흰색을 Gold 위에 쓰지 않았는지 확인
- [ ] 상태 표현이 색 단독에 의존하지 않음 (색 + 라벨 텍스트 병행)
- [ ] 의미있는 이미지 alt, 장식 이미지 `alt=""`
- [ ] `prefers-reduced-motion` 존중
- [ ] Lighthouse: Performance / Accessibility / Best Practices / SEO 90+
- [ ] LCP < 2.5s, CLS < 0.1
- [ ] 이미지 전부 명시적 width/height

### 확장성

- [ ] 화면 구조와 콘텐츠 데이터 분리
- [ ] `Nutrient` / `CaseStudy` / `Source` 타입에 `slug` · `source` · `sourceUrl` · `reviewedAt` 포함
- [ ] 소유자 변경 지점이 `site-config.ts` 한 곳
- [ ] `/guide/[slug]` 등 후속 라우트 추가 시 데이터 재작성 불필요

### 문서

- [ ] `docs/TASK.md` (이 문서)
- [ ] `docs/DEVELOPMENT_RESULT.md` — 한국어, 구현 기능 / 파일 구조 / 기술 / 디자인 / 반응형 / 미구현·확장 / 실행 방법 / 배포 방법

---

## 12. 제외 범위

### 이번 랜딩 사이트에서 구현하지 않음 (프롬프트 §19)

회원가입 · 로그인 · 개인 건강 프로필 · 음식 기록 · Nutrition Score 계산 · AI 분석 · 사용자 영양 데이터 저장 · 복잡한 backend · e-commerce · supplement recommendation · medical recommendation

### 브리프가 초기 범위에서 제외한 항목 (브리프 §8)

네이티브 모바일 앱 · 영양점수 알고리즘 · 개인화 의료 권고 · 완전한 식품성분 DB · 사용자 건강 프로필 · 의무기록 저장 · 결제 처리 · 자동 보충제 처방 · 실시간 국가 보건데이터 연동

### 별도 견적 대상 (브리프 §7, 이번 미포함)

인터랙티브 세계지도 · 국가별 영양 데이터 · 고급 검색/필터 · 뉴스레터/대기명단 · 한국어 다국어 · 멤버 프로필 · 이벤트 캘린더 · 블로그 · 사용자 계정 · 개인화 추천 · 퀴즈 · 배지/게이미피케이션 · 애널리틱스 대시보드 · 커스텀 일러스트/애니메이션

### 이번엔 구조만, 구현 안 함

`/guide` · `/guide/[slug]` · `/solutions` · `/about` · `/projects/[slug]` · 영양소 검색/필터 · CMS

---

## 13. 미해결 항목 (소유자 입력 대기)

스타터팩 §15가 명시한 미정 항목. 전부 `site-config.ts` placeholder로 처리하고 **개발을 막지 않는다.**

| 항목 | 현재 처리 |
|------|-----------|
| 조직 이메일 | `[INSERT ORGANIZATION EMAIL]` |
| 창립자/팀 이름·약력·사진 | About 섹션에서 **생략** (랜딩 범위 밖). 후속 `/about`에서 처리 |
| 소셜/프로필 링크 | 빈 배열 → 푸터에서 조건부 미렌더 |
| 최종 도메인 | `[INSERT DOMAIN]` — 메타데이터 `metadataBase`에 영향 |
| 개인정보 관할 국가 | Privacy는 placeholder 링크만 |
| 앱 스토어 링크 | 빈 문자열 → `status: 'coming-soon'` 유지 |
| 응답 기대 시간 | `[INSERT, E.G. 3-5 WORKING DAYS]` |
| 보건 콘텐츠 검토자 | 스타터팩 §15가 "용량/안전 정보 게시 전 식별" 요구. 현재 카피는 원문 그대로 사용하되, **수치 용량 정보는 랜딩에 넣지 않음** |
| Formspree 폼 ID | `contact.endpoint: ''` → 전송 비활성 |

### 배포 (기본 방침)

Vercel + GitHub 연동. `docs/DEVELOPMENT_RESULT.md`에 상세 절차 기록. 도메인 확정 전까지는 Vercel 기본 도메인 사용.

---

## 부록 A. 원본 문서 분석 요약

### `Website Design and Development Brief.docx` (14장, 519단락)

발주자 관점의 **요구사항 정의서 겸 견적 요청서**. 5개 페이지 구조, 영양소 페이지 표준 템플릿(A~E), 앱 페이지 범위 경계, Solutions 페이지 주제, Contact 폼 요구사항, 시각 방향, 필수/선택 기능, 제외 범위, 건강·개인정보·신뢰성 요구, 소유자 제공 자료, 개발자 산출물, 소유권·유지보수, 견적 구분, 최종 방향을 담고 있다.

핵심: *"결과물은 상업적 비타민 판매 사이트가 아니라, 신뢰할 수 있고 확장 가능한 글로벌 공중보건 교육 플랫폼처럼 느껴져야 한다."*

### `Global_Public_Health_Lens_Website_Starter_Pack.docx` (17장, 466단락, 이미지 4종)

**콘텐츠·브랜드 핸드오프 문서.** 브리프보다 실행 단계가 앞서 있으며, 이미 확정된 사항과 완성된 영문 카피를 담고 있다.

이 프로젝트에서 특히 중요한 부분:
- §2 브랜드 파운데이션 — 포지셔닝, 미션, 비전, 브랜드 약속(3단계 연결), 핵심가치 6종, Voice/Tone 대조표
- §3 비주얼 아이덴티티 — 로고 콘셉트, 컬러 6종 hex + 접근성 지침, 타이포그래피, 이미지 방향
- §5~§10 **완성된 영문 카피 전량** (홈 / 미량영양소 8종 / 앱 / 해법 / About·Contact / 푸터·인터페이스)
- §11 안전·개인정보·고지 초안
- §12 SEO 카피
- §13 개발 요구사항 + **재사용 콘텐츠 타입 정의**
- §16 출처 라이브러리 (실제 URL 확보 완료)

> 이 문서가 있으므로 **콘텐츠를 새로 작성할 필요가 없다.** 개발 작업은 사실상 "확정된 카피와 브랜드를 어떻게 배치할 것인가"의 문제다.

## 부록 B. getdesign.md 조사 기록

- 카탈로그 전체: 328개 / 21페이지 / 8개 카테고리 (Productivity & SaaS, Developer Tools, AI & ML, Backend & DevOps, Fintech, Design & Creative, E-commerce, Media & Consumer)
- 전수 스윕 → 64개 후보 → 상위 24개 평가 → 상위 10개 실제 다운로드 후 전문 비교
- **웹 미리보기 페이지에는 마케팅 요약만 있고 실제 규칙이 없다.** 반드시 `npx getdesign@latest add <slug>`로 받아 읽어야 판단 가능
- 최종 채택: `ibm` (구조) + `wired` (편집) + `notion` (독해)
- 참고: 다운로드된 문서 내부에 `npx @google/design.md lint DESIGN.md` 린트 명령이 언급되어 있으나 **미검증**. 병합 후 시도해 보고 동작하면 Phase 0에 추가
