# Project Conventions

## Directory Structure
- Frontend projects must be created inside the `frontend/` directory, not the repo root.
- Architecture rules: see `_frontend_rules.md`

## Frontend Architecture (DevShell + Component Catalog)
- Tech stack: React 19 + TypeScript strict + Vite 5 (`@vitejs/plugin-react-swc`) + Tailwind CSS v4 + react-router-dom v7 + react-i18next
- Path alias: `@/` → `src/`
- All pages = `TopAppBar` + `NavRail` (props-injected) + View. Never create page-specific header/sidebar.
- Section switching via `?section=` (or `?filter=` for filter-type nav), URL-synced.
- All UI assembled from atoms/primitives only — no raw `<input>/<div>` in pages/molecules.
- All user-visible strings via `t('<ns>.<key>')` — no hardcoded Korean/English.
- DevShell (`?mode=dev`): component catalog, activated by default in dev mode.
- SSOT: routes.registry.ts + components.registry.ts + PAGE_ORGANISMS in dev/Sidebar.tsx — all 4 updated together when adding pages.
- Tailwind v4: `@import "tailwindcss"` in CSS, no tailwind.config.js, custom tokens in `@theme {}`.
