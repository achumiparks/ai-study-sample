# DevShell 컴포넌트-카탈로그 아키텍처 — 다른 프로젝트 이식 프롬프트

> **용도**: 이 문서를 그대로 AI 에이전트(또는 개발자)에게 건네면, 현재 `kr-seatrust-nexus`
> 프론트엔드가 쓰는 **DevShell(컴포넌트 카탈로그) + 원자적 페이지 조립** 방식을
> 새 프로젝트에 **동일한 규칙으로 재현**할 수 있다.
> 도메인(AutoML·드라이브·검색 등) 특화 내용은 걷어내고 **메커니즘만** 남겼다.
> 실제 페이지 이름/컴포넌트는 대상 프로젝트에 맞게 치환한다.

---

## 0. 한 줄 모델 (반드시 이 문장부터 이해)

> **모든 페이지 = Header + Sidebar + View.** View 는 여러 **sub-view** 로 구성한다.
> **한 영역 = 단일 라우트 + 내부 `?section=` 뷰 전환.**
> 앱은 **두 모드**로 부팅한다 — `app`(실제 콘솔) / `dev`(DevShell 카탈로그).
> DevShell 은 각 페이지를 **1뎁스 구성요소(Header/Sidebar/View)** 로 분해해 트리로 보여주고,
> 클릭하면 `/dev/components/<name>` 에서 **그 컴포넌트만 격리 프리뷰**한다.

이 아키텍처의 핵심 가치:
- **모든 UI 조각이 레지스트리에 등록** → 카탈로그에서 격리 프리뷰·Props 조작 가능 (스토리북 대체, 의존성 0).
- **페이지 = 조립**. 페이지는 로직만, 화면은 등록된 컴포넌트로만 조립.
- **문서(이 규칙)와 코드가 항상 일치** — 규칙을 바꾸면 같은 PR 에서 규칙 문서를 갱신.

---

## 1. 기술 스택 (대상 프로젝트에 맞게 조정 가능하나, 아래 조합이 검증됨)

- **React 19 + TypeScript(strict) + Vite** (`@vitejs/plugin-react-swc`)
- **react-router-dom v7** (`createBrowserRouter`)
- **Tailwind CSS v4** (`@tailwindcss/vite`) + 디자인 토큰
- **react-i18next** (ko/en) — 사용자 표시 문자열 하드코딩 금지
- (선택) `@tanstack/react-query` 서버 상태, `clsx`/`tailwind-merge` 클래스 병합
- 경로 별칭 `@/` → `src/` (`vite.config.ts` + `tsconfig` `paths`)

---

## 2. 디렉터리 구조 (그대로 생성)

```
src/
  app/
    hooks/useAppMode.ts        # dev|app 모드 판별 (URL ?mode= / env / 기본 dev)
    router/index.tsx           # createAppRouter
    router/routes.tsx          # buildRoutes(mode): app 라우트 + (dev면) DevShell 래핑
  dev/                         # ── DevShell (카탈로그) — 프로덕션엔 안 실림 ──
    DevShell.tsx               # 좌: 트리 / 중: 뷰포트 프레임 / 우: Viewport·Variants·Props·PageInfo
    Sidebar.tsx                # Pages 트리(PAGE_ORGANISMS) + 컴포넌트 카테고리 트리
    SidebarTree.tsx            # 키보드 트리(↑↓ →← Enter)
    ComponentPreview.tsx       # /dev/components/:name — 컴포넌트 격리 렌더 + 샘플 props
    PropsPanel.tsx             # Props 컨트롤(에디터/읽기전용)
    DesktopFrame.tsx           # 뷰포트 폭(1280/1440/fluid) 프레임
  registry/                    # ── 단일 출처(SSOT) 레지스트리 ──
    types.ts                   # RouteEntry / ComponentEntry / LayoutType
    routes.registry.ts         # 페이지 라우트 목록(+hidden/variants/navPath)
    components.registry.ts     # 컴포넌트 카탈로그(카테고리 + uses)
  layouts/
    ConsoleLayout.tsx          # 실제 앱 셸: TopAppBar + Outlet + NavRail
  components/
    primitives/                # Box·Stack·Row·Grid·Container·Text (레이아웃 기본, 유일한 raw HTML 허용처)
    atoms/                     # Button·TextField·Select·Checkbox·IconButton·StatusChip …
    molecules/                 # DataTable·TabBar·Card·차트 등 조합 단위
    chrome/                    # TopAppBar(헤더)·NavRail(사이드바) = 전 페이지 공용
    feedback/                  # Dialog·Toast …
    panels/                    # View 의 sub-view(탭 본문/섹션 본문)
  pages/
    <area>/<Area>Page.tsx      # 영역 페이지(헤더+사이드바+View 조립)
    <area>/<Area>View.tsx      # ?section 으로 sub-view 렌더
    <area>/sections.ts         # 섹션 메타 단일 출처
  i18n/locales/<lng>/<ns>.json # 번역 (Vite glob 자동 병합)
  App.tsx  main.tsx  styles/
```

---

## 3. 두 모드 부팅 (dev vs app) — 이식 시 제일 먼저 세팅

### 3.1 `app/hooks/useAppMode.ts`
```ts
export type AppMode = 'dev' | 'app'
// 우선순위: (개발빌드 한정) URL ?mode= > 환경변수 VITE_APP_MODE > 기본 'dev'
// PROD 빌드에서는 URL 오버라이드 무시 → 배포 이미지는 VITE_APP_MODE=app 로 빌드해
// DevShell 이 외부로 노출되지 않게 한다.
export function useAppMode(): AppMode {
  return useMemo(() => {
    if (import.meta.env.DEV) {
      const m = new URLSearchParams(location.search).get('mode')
      if (m === 'dev' || m === 'app') return m
    }
    const env = import.meta.env.VITE_APP_MODE
    if (env === 'dev' || env === 'app') return env
    return 'dev'
  }, [])
}
```

### 3.2 `app/router/routes.tsx` — `buildRoutes(mode)`
- 실제 앱 라우트를 레이아웃별로 조립(`console`/`blank`/`admin`).
- `mode === 'dev'` 이면 그 전체를 **`<DevShell/>` 레이아웃 라우트로 감싸고** `/dev/components/:name` 를 추가.
- 배포(`app`)면 DevShell 코드가 **번들에 포함되지 않는다**(동적 import).

```tsx
export async function buildRoutes(mode: AppMode): Promise<RouteObject[]> {
  const layoutRoutes = buildLayoutRoutes()   // console/blank/admin 레이아웃 라우트
  if (mode === 'dev') {
    const { DevShell } = await import('@/dev/DevShell')  // dev에서만 로드
    return [{
      element: <DevShell />,
      children: [
        ...layoutRoutes,
        { path: '/dev/components/:name', element: <Suspense…><ComponentPreview/></Suspense> },
      ],
    }]
  }
  return layoutRoutes
}
```

`App.tsx` 는 `useAppMode()` → `buildRoutes(mode)` → `createBrowserRouter` → `RouterProvider`.
(Provider 순서 예: QueryClient → Auth → Project → Toast → NavRail → RouterProvider)

---

## 4. 레지스트리 = 단일 출처(SSOT) — 4곳을 항상 함께 갱신

새 페이지/영역/컴포넌트를 추가할 때 **아래 데이터 흐름의 네 지점을 모두** 손댄다.
하나라도 빠지면 트리에 **빈 페이지**가 생긴다.

```
routes.registry.ts        ─ 페이지 라우트(+hidden/variants/navPath)
      │
dev/Sidebar.tsx  PAGE_ORGANISMS  ─ 페이지경로 → [1뎁스 구성요소 이름]  (Pages 트리 리프)
      │
components.registry.ts    ─ organism(Header/Sidebar/View…) + 각 컴포넌트의 uses(sub-view)
      │
ComponentPreview 샘플 props ─ 구성요소 클릭 시 격리 프리뷰용 데이터
```

### 4.1 `registry/types.ts`
```ts
export type LayoutType = 'console' | 'blank' | 'admin'

export interface RouteEntry {
  path: string; title: string; category: string; layout: LayoutType
  component: LazyExoticComponent<ComponentType<any>>
  file?: string             // 사이드바 표시용 소스 파일명
  navPath?: string          // :id 라우트의 사이드바 대표 경로
  hidden?: boolean          // DevShell Pages 에서 숨김(상세/내부 라우트)
  variants?: Array<{ key: string; label: string }>  // 우측 패널 변형 선택 → ?variant=
  propControls?: PropControl[]                        // 페이지 Props 조작
}

export interface ComponentEntry {
  name: string; category: string   // primitives|atoms|molecules|organisms|panels
  component: LazyExoticComponent<ComponentType<any>>
  description?: string
  uses?: string[]          // ★ 이 컴포넌트를 구성하는 하위 컴포넌트(=sub-view) 이름들
  file?: string
}
```

### 4.2 `registry/components.registry.ts`
- 카테고리별 헬퍼(`primitive/atom/molecule/organism/panel`)로 등록. 각 항목은 **lazy import + description + uses**.
- **Header/Sidebar/View 는 organism** 으로 등록하고, **View 의 `uses` = 실제 sub-view 이름들**.
- 표시 순서: 큰 단위(Panels/Organisms) → 작은 단위(Atoms/Primitives).

```ts
const organism = entry('organisms')
export const componentRegistry: ComponentEntry[] = [
  organism('Header',  () => import('@/components/chrome/TopAppBar')…, '공용 상단 헤더', ['IconButton','Logo',…], 'TopAppBar.tsx'),
  organism('Sidebar', () => import('@/components/chrome/NavRail')…,  '공용 좌측 사이드바', ['NavItem','NavSectionTitle'], 'NavRail.tsx'),
  organism('View',    () => import('@/pages/<area>/<Area>Page')…,    '메인 뷰',
           ['<SubViewA>','<SubViewB>','<SubViewC>'], '<Area>Page.tsx'),  // ★ uses = sub-view 들
  // panels(sub-view), molecules, atoms, primitives …
]
```

### 4.3 `dev/Sidebar.tsx` — `PAGE_ORGANISMS`
```ts
// 페이지경로 → 1뎁스 구성요소(클릭 시 /dev/components/<name>)
const PAGE_ORGANISMS: Record<string, string[]> = {
  '/<area>': ['Header', 'Sidebar', 'View'],          // 일반(크롬 있는) 페이지
  '/login':  ['TextField', 'Button', 'Text', 'Box'], // 크롬 없는 단독 페이지 → 직접 쓰는 컴포넌트들
}
```
- Pages 트리는 `routeRegistry.filter(e => !e.hidden)` 를 순회, 각 페이지의 리프 = `PAGE_ORGANISMS[navPath ?? path]`.
- 컴포넌트 카테고리 트리는 각 항목 아래에 그 컴포넌트의 `uses` 를 **1뎁스 리프**로만 노출(더 안 펼침).

### 4.4 `dev/ComponentPreview.tsx` — 샘플 props
- `/dev/components/:name` 에서 레지스트리를 찾아 렌더.
- `propControls[name]`(에디터로 조작 가능) 또는 `sampleProps[name]`(읽기전용 고정 데이터) 제공.
- 하단에 `uses` 칩 → 클릭 시 하위 컴포넌트로 이동(그래프 탐색).

---

## 5. 원자적 디자인 계층 & "컴포넌트만 사용" 규칙 (MUST)

계층: **primitives → atoms → molecules → organisms → panels(sub-view)**.

- **상위 코드(페이지·molecule·organism)는 디자인시스템 컴포넌트/primitive 로만 조립.**
- **raw HTML 폼/표면 직접 사용 금지**:
  - 폼: `<input> <select> <textarea> <button> 체크박스` → **atom 컴포넌트**(`TextField`,`Select`,`Checkbox`,`Button`,`IconButton`…).
  - 레이아웃/표면: raw `<div className>` → **primitives**(`Box`,`Stack`,`Row`,`Grid`,`Container`,`Text`).
    배경/보더/패딩/라운드는 `Box` prop 으로: `<Box border bg="surface" rounded="md" p={5}>`.
- **raw HTML 은 atom/컨테이너 셸의 *내부 구현*에서만 허용** (예: `Select` 내부 `<select>`, `Dialog` 의 오버레이·포털 `<div>`). 이들을 *쓰는* 페이지는 다시 raw HTML 금지.
- 필요한 컨트롤이 없으면 → **먼저 atom 을 만들고(또는 확장)** 그걸 쓴다.
- 자가점검: 페이지/molecule 에서 `grep -nE "<(input|select|textarea|button)\b"` 매치가 있으면 위반.

---

## 6. 국제화(i18n) 규칙 (MUST)

- 사용자에게 보이는 **모든 텍스트**(라벨·버튼·placeholder·aria-label·title·confirm·에러) → `t('<ns>.<key>')`. 리터럴 금지.
- 컴포넌트에서 `const { t } = useTranslation()`. 새 텍스트는 **ko/en 둘 다** 추가.
  번역 파일 `src/i18n/locales/<lng>/<ns>.json` (Vite glob 자동 병합), 네임스페이스 예: `common`·`chrome`·`components`·<도메인별>.
- 공용 단어(취소/저장/삭제/이름/유형/상태…)는 `common.*` 재사용(중복 키 금지).
- **모듈 최상위 한글 상수/배열**(예: 테이블 `columns` 헤더)은 `t` 불가 → 컴포넌트 내부로 옮기거나 `(t) => [...]` 함수로.
- 숫자/날짜는 `@/i18n/format` 의 `formatNumber`/`formatDate`(현재 로케일).
- 동적 사용자 데이터·브랜드명은 번역하지 않는다. 언어 전환은 공용 토글(헤더).

---

## 7. 페이지 구성 규칙 (MUST)

1. **Header + Sidebar + View 3요소**. 헤더·사이드바는 **전 페이지 공용 컴포넌트(`TopAppBar`,`NavRail`)를 재사용**.
   → **페이지 전용 헤더/사이드바를 새로 만들지 않는다**(`AdminHeader`/`AdminSidebar` 신설 = 과거 실수).
   `NavRail` 은 `title`·`sections` **props 로 내용 주입**(콘솔 기본 / 영역별 섹션).
2. **예외 — 크롬 없는 단독 페이지(로그인 등)**: 헤더/사이드바 없이 View 단독(3요소 면제).
3. **사이드바 = 뷰 전환의 단일 진입점**: 항목 클릭 → 뷰 전환 + active 이동 + **URL 동기화**.
   URL 동기화는 **기존 파라미터 보존**: `const n=new URLSearchParams(params); n.set('section',k); setParams(n)` (DevShell `?mode=` 등 유지). 새로고침·딥링크로 복원돼야 한다.
4. **한 영역 = 단일 라우트 + 내부 `?section=` 뷰 전환**.
   ❌ 영역마다 별도 라우트(`/admin/users`,`/admin/jobs`) 난립 → ✅ `/admin?section=users`.
5. **DevShell Pages 트리 = 1뎁스 구성요소**:
   - 일반 페이지 리프 `[Header, Sidebar, View]`, 크롬 없는 페이지는 **직접 쓰는 컴포넌트들**.
   - **보이는(=`hidden` 아닌) 모든 페이지는 `PAGE_ORGANISMS` 매핑이 있어야 한다**(빈 페이지 금지).
   - 영역을 별도 카테고리로 분리하지 말고 `Pages` 아래 **단일 항목**으로.
6. **View 는 sub-view 로 구성** — organism 의 `uses` = 그 뷰의 sub-view 들(`Components` 섹션에서 하위로 펼쳐짐).
   ❌ View 의 `uses` 를 atom 몇 개로 끝내지 말 것 → ✅ **실제 sub-view 들**. 각 sub-view 도 레지스트리에 등록해야 클릭 프리뷰가 된다.

---

## 8. 새 페이지/영역 추가 절차 (기계적 — 그대로 따른다)

1. **라우트**: `routes.registry.ts` 에 추가(`path`,`title`,`file`,`component(lazy)`,`category`,`layout`, 필요시 `hidden`/`variants`/`navPath`).
2. **영역이면 단일 페이지 구성**: `pages/<area>/<Area>Page.tsx` = `TopAppBar` + `NavRail(title, sections 주입)` + `<AreaView/>`. 섹션 전환은 `?section=`.
3. **View 컨테이너**: `<AreaView/>` 가 `?section` 으로 sub-view 렌더. 섹션 메타는 단일 출처 `pages/<area>/sections.ts` 에서 공유.
4. **components.registry.ts**:
   - Header/Sidebar 는 공용 `Header`/`Sidebar` 재사용(새로 등록 X).
   - `AreaView` organism 등록 + **`uses` = sub-view 이름들**.
   - sub-view 들을 `panel(...)` 로 등록.
5. **dev/Sidebar.tsx `PAGE_ORGANISMS`**: `'/<path>': ['Header','Sidebar','AreaView']`(또는 크롬 없으면 직접 컴포넌트들).
6. (선택) **ComponentPreview 샘플 props**: 새 sub-view/molecule 에 `propControls` 또는 `sampleProps` 추가.
7. **검증**: `npx tsc -b && npm run build` 통과 + DevShell(`?mode=dev`) `Pages` 에서 페이지 하위 구성요소·View 하위 sub-view 가 보이는지 확인.
8. **규칙 문서 갱신**(구조가 바뀌었으면 같은 PR 에서).

---

## 9. 하지 말 것 (과거 실수 목록 — 이식 시 그대로 방지)

- ❌ 영역 sub-route 난립(`/admin/users`) → ✅ `/admin?section=users`
- ❌ 페이지 전용 헤더/사이드바 신설(`AdminHeader`/`AdminSidebar`) → ✅ `TopAppBar`/`NavRail` 공용(props 주입)
- ❌ View organism `uses` 를 atom 몇 개로 → ✅ 실제 sub-view 들
- ❌ `PAGE_ORGANISMS` 매핑 누락(빈 페이지, 예: 로그인) → ✅ 보이는 모든 페이지 매핑
- ❌ 별도 "Admin" 카테고리 분리 → ✅ `Pages` 아래 단일 항목
- ❌ 페이지/molecule 에서 raw HTML 폼/`<div>` 직접 사용 → ✅ atom/primitive 로만 조립
- ❌ 사용자 문자열 하드코딩 → ✅ `t('<ns>.<key>')`, ko/en 동시 추가
- ❌ 배포 빌드에 DevShell 노출 → ✅ `VITE_APP_MODE=app` 로 빌드(DevShell 동적 import)
- ❌ 규칙 문서를 안 고쳐 구버전·모순 방치 → ✅ 규칙 변경 시 같은 PR 에서 갱신

---

## 10. 이식 완료 체크리스트

- [ ] `useAppMode` — `?mode=dev|app`(개발), `VITE_APP_MODE`(배포), 기본 `dev` 동작
- [ ] `buildRoutes(mode)` — dev 에서만 `<DevShell/>` + `/dev/components/:name`, 배포 번들엔 DevShell 미포함
- [ ] `registry/types.ts` · `routes.registry.ts` · `components.registry.ts` 생성
- [ ] `dev/` 6파일(DevShell·Sidebar·SidebarTree·ComponentPreview·PropsPanel·DesktopFrame)
- [ ] `chrome/TopAppBar`·`NavRail`(props 주입형) 공용 헤더/사이드바
- [ ] primitives(Box·Stack·Row·Grid·Container·Text) + 기본 atoms
- [ ] `ConsoleLayout`(TopAppBar+Outlet+NavRail)
- [ ] 최소 1개 영역: `<Area>Page` + `<Area>View`(?section) + `sections.ts` + panels 등록
- [ ] i18n ko/en 스캐폴딩 + `LanguageToggle`
- [ ] `npx tsc -b && npm run build` 통과, `?mode=dev` 로 카탈로그 트리·프리뷰 확인
- [ ] 이 규칙을 대상 레포에 `frontend-rules.md` 로 복사(항상 코드와 일치 유지)

---

## 11. 참고 구현 (원본 kr-seatrust-nexus-dev/frontend — 이식 시 원본 코드 대조)

- `src/app/hooks/useAppMode.ts`, `src/app/router/routes.tsx` — 모드/라우트 빌드
- `src/dev/DevShell.tsx` — 좌 트리 / 중 뷰포트 프레임 / 우 Viewport·Variants·Props·PageInfo
- `src/dev/Sidebar.tsx` — `PAGE_ORGANISMS`, Pages+컴포넌트 통합 키보드 트리
- `src/dev/ComponentPreview.tsx` — `/dev/components/:name` 격리 프리뷰 + propControls/sampleProps
- `src/registry/{types,routes.registry,components.registry}.ts` — SSOT 레지스트리
- `src/layouts/ConsoleLayout.tsx`, `src/components/chrome/{TopAppBar,NavRail}.tsx` — 공용 셸
- `src/components/{primitives,atoms,molecules,panels}/` — 원자적 계층
- `pages/admin/{AdminPage,AdminView,sections}.ts` — "단일 라우트 + ?section" 영역 표준 예시
- `frontend-rules.md` — 이 규칙의 원본(대상 프로젝트로 복사)
