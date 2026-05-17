# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-05-17

### Added — 8 new tools
- **UUID generator** with v4, v7, ULID, and Nano ID, batch generation up to 1000
- **Hash calculator** — MD5 / SHA-1 / SHA-256 / SHA-512 from one input
- **Base64** encoder/decoder with URL-safe variant and file input
- **URL** encoder/decoder with auto query-string parser
- **JWT decoder** with header/payload pretty-print and expiry status
- **Regex tester** with live highlight, group capture, all flags
- **QR code generator** with PNG/SVG download, customizable colors and ECC
- **Color converter** — HEX ↔ RGB ↔ HSL with tints & shades palette

### Changed — Full rewrite
- Rebuilt from a single hand-written `index.html` to **Vite + Vue 3 + TypeScript**
- New **Vercel/Linear-inspired design system** with dark-first theme and indigo accent
- Replaced CDN-loaded Vue 2/3 with a proper bundle, lazy-loaded routes per tool
- All 14 legacy tools rewritten as Vue SFC components with consistent UX
- Merged `diff_check` and `diff_check2` into a single `table-diff` tool with both modes
- Brand-new **homepage** with hero, search, categorized tool grid, feature highlights
- New **404 / About** pages with internal navigation
- **Hash routing** for full GitHub Pages compatibility (no SPA-redirect tricks needed)
- **Bilingual UI** (中文/English) auto-detected from browser language

### Repository
- Added GitHub Actions workflows for CI (typecheck + lint + build) and Pages deploy
- Issue templates for bug reports and feature requests
- PR template with reviewer checklist
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`
- Dependabot config for weekly npm + actions updates
- ESLint flat config + Prettier + EditorConfig
- TypeScript strict mode across the codebase

### Removed
- All hard-coded CDN script tags (Vue, Tailwind, sql-formatter, etc.) — replaced with proper npm deps
- The legacy `tools/` directory is preserved at `legacy/tools/` for reference but is no longer deployed

## [1.x] - 2024

Original single-page HTML toolbox with 14 tools. Archived at `legacy/`.

[2.0.0]: https://github.com/hiszm/MyToolBox/releases/tag/v2.0.0
