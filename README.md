<div align="center">

<img src="./public/favicon.svg" width="80" height="80" alt="MyToolBox logo" />

# MyToolBox

**一站式开发者工具集 · 完全本地运行,不收集任何数据**

A modern, fast, privacy-first toolbox for developers — 21 tools, all in your browser.

[![CI](https://github.com/hiszm/MyToolBox/actions/workflows/ci.yml/badge.svg)](https://github.com/hiszm/MyToolBox/actions/workflows/ci.yml)
[![Deploy](https://github.com/hiszm/MyToolBox/actions/workflows/deploy.yml/badge.svg)](https://github.com/hiszm/MyToolBox/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Vue](https://img.shields.io/badge/Vue-3.5-42b883.svg?logo=vuedotjs)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#-contributing)

**[Live demo →](https://hiszm.github.io/MyToolBox/)** &nbsp;·&nbsp; [English](./README.en.md) &nbsp;·&nbsp; 中文

</div>

---

## ✨ 特性

- **21 个精心打磨的工具** — 涵盖编码转换、文本处理、数据工具、效率工具四大类
- **隐私优先** — 所有计算在浏览器本地完成,零网络请求,零追踪
- **现代技术栈** — Vue 3 + TypeScript + Vite + Tailwind CSS
- **中英双语** — 自动跟随浏览器语言,一键切换
- **暗色模式** — 默认暗色,可切亮色,跟随系统偏好
- **PWA 就绪** — 离线可用,可"安装到桌面"
- **可贡献** — 单仓库结构清晰,加一个工具只需新建一个 SFC 文件

## 📦 工具一览

### 🔄 编码与转换 (10)

| 工具 | 说明 |
|------|------|
| 字符转换 | 大小写、驼峰、下划线、短横线之间互转 |
| 数字转中文 | 阿拉伯数字 → 中文读法,支持万亿大数 |
| 时间戳格式化 | 毫秒/秒/微秒/纳秒互转,批量处理 |
| Base64 编解码 ✨ | 字符串/文件 Base64 编码解码,URL-safe 变体 |
| URL 编解码 ✨ | encodeURI/Component,自动解析 query |
| JWT 解码 ✨ | 解码 header & payload,显示过期状态 |
| UUID 生成器 ✨ | UUID v4 / v7 / ULID / Nano ID 批量生成 |
| 哈希计算 ✨ | MD5 / SHA-1 / SHA-256 / SHA-512 |
| 二维码生成 ✨ | 可下载 PNG / SVG,自定义颜色和容错 |
| 颜色转换 ✨ | HEX ↔ RGB ↔ HSL,自动生成调色板 |

### 📝 文本处理 (5)

| 工具 | 说明 |
|------|------|
| JSON 格式化 | 格式化、压缩、按 key 排序、按 key 提取 |
| 代码格式化 | SQL / JSON / XML / CSS / JavaScript |
| 正则测试 ✨ | 实时匹配高亮、分组捕获、所有标志 |
| 文档对比 | 逐字符高亮差异,统计新增删除 |
| 词云生成 | 中英文混合分词,可调阈值 |

### 📊 数据工具 (3)

| 工具 | 说明 |
|------|------|
| 集合计算器 | 交集、并集、差集、对称差集 |
| Hive 增量合并 | 生成 ODS → DW 增量合并 SQL |
| 表数据比对 | 主键模式 + MD5 全字段模式,Hive/Spark/Trino |

### ⚡ 效率工具 (3)

| 工具 | 说明 |
|------|------|
| 通讯录生成器 | 姓名+电话 → .vcf,导入手机通讯录 |
| 值班排班表 | 多月日历视图,自动轮换,导出 CSV |
| 人生进度条 | 日/周/月/年/人生剩余的可视化进度 |

> ✨ = v2.0 新增

## 🚀 快速开始

需要 Node.js ≥ 18 和 npm 或 pnpm。

```bash
# 1. clone
git clone https://github.com/hiszm/MyToolBox.git
cd MyToolBox

# 2. install
npm install
# 或者 pnpm install

# 3. dev (http://localhost:5173)
npm run dev

# 4. build
npm run build

# 5. preview production build
npm run preview
```

## 🏗️ 架构

```
src/
├── components/
│   ├── layout/      # AppHeader, AppFooter, ToolLayout
│   └── ui/          # 设计系统原子组件 (Button, Card, Input, ...)
├── composables/     # useTheme, useI18n, useClipboard, useSEO
├── data/tools.ts    # 工具元数据注册表
├── pages/
│   ├── Home.vue     # 主页
│   ├── About.vue
│   └── tools/       # 每个工具一个 SFC
├── router/          # Vue Router 配置 (hash mode 兼容 GitHub Pages)
├── i18n/            # 中英文翻译
├── styles/          # 设计 token + 全局样式
└── types/           # 共享类型定义
```

工具页通过 `import.meta.glob` 自动注册路由,加新工具只需:

1. 在 `src/data/tools.ts` 注册元数据
2. 新建 `src/pages/tools/<slug>.vue`

不需要改动路由配置。

## 🧪 测试

```bash
npm run typecheck   # vue-tsc
npm run lint        # eslint
npm run test        # vitest
```

## 🤝 贡献 {#-contributing}

非常欢迎贡献新工具或改进现有工具。请先阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)。

新工具需要遵循三原则:

1. **本地运行** — 不调用任何后端 / 第三方 API
2. **单一职责** — 一个工具只解决一类问题
3. **中英双语** — 元数据和界面都提供两种语言

## 🔐 安全

如果你发现安全问题,请按 [SECURITY.md](./SECURITY.md) 中的流程上报,不要在公开 issue 里讨论。

## 📜 许可证

[MIT](./LICENSE) © 2024-2026 hiszm

---

<sub>如果觉得有用,欢迎给个 ⭐ 支持一下 · Built with care, free forever.</sub>
