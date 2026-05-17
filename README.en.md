<div align="center">

<img src="./public/favicon.svg" width="80" height="80" alt="MyToolBox logo" />

# MyToolBox

**All-in-one developer toolbox — runs entirely in your browser, no tracking.**

[![CI](https://github.com/hiszm/MyToolBox/actions/workflows/ci.yml/badge.svg)](https://github.com/hiszm/MyToolBox/actions/workflows/ci.yml)
[![Deploy](https://github.com/hiszm/MyToolBox/actions/workflows/deploy.yml/badge.svg)](https://github.com/hiszm/MyToolBox/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Vue](https://img.shields.io/badge/Vue-3.5-42b883.svg?logo=vuedotjs)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff.svg?logo=vite)](https://vitejs.dev/)

**[Live demo →](https://hiszm.github.io/MyToolBox/)** &nbsp;·&nbsp; English &nbsp;·&nbsp; [中文](./README.md)

</div>

---

## ✨ Features

- **21 carefully crafted tools** across encoding, text, data and productivity
- **Privacy-first** — everything runs in your browser. Zero network calls, zero tracking
- **Modern stack** — Vue 3 + TypeScript + Vite + Tailwind CSS
- **Bilingual** — auto-detects your browser language, one-click toggle
- **Dark mode by default** — with light theme and system preference detection
- **PWA-ready** — installable, works offline
- **Contributor-friendly** — adding a tool is one SFC file away

## 📦 Tools

### 🔄 Encoding & Conversion (10)

| Tool | What it does |
|------|--------------|
| Text Convert | Switch between case, camelCase, snake_case, kebab-case |
| Number to Chinese | Convert Arabic numerals to Chinese readings |
| Timestamp Formatter | Convert ms/s/µs/ns timestamps, batch processing |
| Base64 ✨ | Encode/decode strings or files, URL-safe variant |
| URL Encode ✨ | encodeURI/Component, auto-parse query strings |
| JWT Decoder ✨ | Decode header & payload, show expiry status |
| UUID Generator ✨ | UUID v4 / v7 / ULID / Nano ID in batch |
| Hash Calculator ✨ | MD5 / SHA-1 / SHA-256 / SHA-512 |
| QR Code Generator ✨ | Download PNG/SVG, custom colors and ECC |
| Color Converter ✨ | HEX ↔ RGB ↔ HSL with palette generation |

### 📝 Text Processing (5)

| Tool | What it does |
|------|--------------|
| JSON Formatter | Format, minify, sort keys, extract by key |
| Code Formatter | SQL / JSON / XML / CSS / JavaScript |
| Regex Tester ✨ | Live matching with highlights, groups, flags |
| Document Diff | Char-level diff with stats |
| Word Cloud | Bilingual tokenizer with frequency tuning |

### 📊 Data Tools (3)

| Tool | What it does |
|------|--------------|
| Set Calculator | Union, intersection, difference, symmetric diff |
| Hive Incremental Merge | Generate ODS → DW merge SQL |
| Table Data Diff | Primary-key + MD5 modes; Hive/Spark/Trino |

### ⚡ Productivity (3)

| Tool | What it does |
|------|--------------|
| Contact (vCard) Builder | Names + phones → .vcf for phone import |
| Duty Schedule | Multi-month calendar with auto-rotation, CSV export |
| Life Progress | Day/week/month/year/life progress visualization |

> ✨ = new in v2.0

## 🚀 Quick start

Requires Node.js ≥ 18 and npm/pnpm.

```bash
git clone https://github.com/hiszm/MyToolBox.git
cd MyToolBox
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
```

## 🏗️ Architecture

```
src/
├── components/
│   ├── layout/      # AppHeader, AppFooter, ToolLayout
│   └── ui/          # Design system primitives
├── composables/     # useTheme, useI18n, useClipboard, useSEO
├── data/tools.ts    # Tool metadata registry
├── pages/
│   ├── Home.vue
│   ├── About.vue
│   └── tools/       # One SFC per tool
├── router/          # Vue Router (hash mode, GitHub Pages friendly)
├── i18n/            # Bilingual strings
└── styles/          # Design tokens + global CSS
```

Tool pages auto-register via `import.meta.glob`. Adding a tool:

1. Add metadata to `src/data/tools.ts`
2. Create `src/pages/tools/<slug>.vue`

No router config changes required.

## 🤝 Contributing

PRs welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md). New tools must be:

1. **Local-only** — no backend or third-party API calls
2. **Single-purpose** — one tool, one problem
3. **Bilingual** — UI strings and metadata in both languages

## 📜 License

[MIT](./LICENSE) © 2024-2026 hiszm
