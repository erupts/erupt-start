# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`start.erupt.xyz` — a project generator for the Erupt low-code framework (the Erupt equivalent of start.spring.io). Users pick build tool / Java / database / modules, preview the generated files, and download a ready-to-run Spring Boot ZIP. The ZIP is assembled **entirely in the browser**; there is no backend.

## Running

No build step, no package manager, no tests. Everything is static:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Serve over HTTP rather than opening `index.html` directly — `generate()` fetches wrapper scripts from `assets/` with `fetch()`, which fails on `file://`. All third-party libs (Vue 3, Element Plus, JSZip, FileSaver, highlight.js) are loaded from CDN via `<script>` tags; there is no bundler.

## Files

- `index.html` — the whole app: CSS (top `<style>`), Vue template (`#app`), and the app script (`createApp({setup(){...}})`). ~2500 lines, deliberately single-file.
- `viz.js` — hover illustrations for module cards. An IIFE that builds one inline SVG string per module id and exposes `window.VIZ`; the template renders it with `v-html="VIZ[m.id]"`.
- `assets/` — Maven and Gradle wrapper files copied verbatim into generated ZIPs (`mvnw`, `gradlew`, `gradle-wrapper.jar`, `*.properties`).
- `logo.svg` — favicon.

## Architecture of `index.html`

Data tables at the top of the script drive everything:

- `ERUPT_VER` / `BOOT_VER` — version constants. Bumping Erupt is a one-line change to `ERUPT_VER` (see commit "Bump ERUPT_VER to 2.1.1").
- `LANG` — en/zh UI strings. Every visible string goes through `t(key)`; module descriptions use `desc` / `descZh` on the module itself. Locale is auto-detected from `navigator.language` and toggled by the header button.
- `MODULES` — the module catalogue. Flags control grouping and behavior: `ai: true` (AI section), `data: true` (data-source section), `pro: true` + `proUrl` (commercial; emitted as a *commented* dependency and links to pricing), `requires: '<id>'` (dependency chain, resolved recursively in `toggleMod` — selecting `erupt-ai-staff` pulls in `erupt-ai-claw` then `erupt-ai`; deselecting cascades the other way), `tag` (NEW / PRO badge). Adding a module = adding one entry here plus a `VIZ['<id>']` sketch in `viz.js`.
- `DB` — per-database `mvn` / `gradle` dependency snippets and a `yml(artifact)` datasource template.
- `JAVA_VERSIONS`, `LOCALES` — dropdown options.

Generation pipeline inside `setup()`:

1. `form` (reactive) holds all user choices; `selectedMods` holds module ids.
2. `render*()` functions are template-string renderers, one per output file (`renderPom`, `renderGradle`, `renderYml`, `renderAppJs`, `renderApp`, `renderSample`, `renderDockerfile`, `renderGitignore`, `renderReadme`).
3. `previewFiles` (computed) maps output path → rendered content. This single map feeds **both** the preview dialog (tree + highlighted source) and the ZIP, so preview and download can never diverge.
4. `generate()` writes `previewFiles` into a JSZip folder, appends the wrapper from `assets/` (`addMavenWrapper` / `addGradleWrapper` set the unix executable bit), and calls `saveAs`.

A parallel set of `renderNode*()` functions plus `generateCloudNode()` produces a minimal **erupt-cloud-node** worker project (shown only when `erupt-cloud-server` is selected). It intentionally omits `erupt-spring-boot-starter` / `erupt-admin` / `erupt-security`.

When adding a new generated file: write a `renderX()` and register it in `previewFiles`. When adding a new form field: add to `form`, wire it in the template, and consume it in the relevant renderer.

## Visual style

The page uses the "Erupt Raft" neo-brutalist cream-paper style: 2px ink borders, hard offset shadows (`--shadow: 4px 4px 0 var(--ink)`), zero border-radius, candy accent palette (`--cyan`, `--pink`, `--yellow`, `--green`, `--purple`). CSS custom properties are declared at the top of the `<style>` block; Element Plus is re-themed through the `--el-color-primary*` overrides there. `viz.js` uses the same palette constants (`I`, `C`, `P`, `Y`, `G`, `V`) and animation classes (`ap` pop-in, `ad` draw, `ar` rise, `af` flow, etc.) whose keyframes live in `index.html`. The `erupt-raft` skill documents this design language; use it for any new UI.
