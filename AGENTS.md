# AGENTS.md

This file provides guidance to coding agents (Claude Code, Codex, ...) when working with code in this repository.

## What this is

`start.erupt.xyz` — a project generator for the Erupt low-code framework (the Erupt equivalent of start.spring.io). Users pick build tool / Java / database / modules, preview the generated files, and download a ready-to-run Spring Boot ZIP. The ZIP is assembled **entirely in the browser**; there is no backend.

## Running

No build step, no package manager, no tests. Everything is static:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Serve over HTTP rather than opening `index.html` directly — `generate()` fetches wrapper scripts from `assets/` with `fetch()`, which fails on `file://`. All third-party libs (Vue 3, Element Plus, JSZip, FileSaver, highlight.js) are loaded from CDN via `<script>` tags; there is no bundler.

Deployment is static too: `wrangler.jsonc` serves the repository root as Cloudflare static assets, so every file in the repo is public.

## Files

- `index.html` — the whole app: CSS (top `<style>`), Vue template (`#app`), and the app script (`createApp({setup(){...}})`). ~2100 lines, deliberately single-file.
- `nodes.js` — Erupt Cloud node templates. Exposes `window.NODE_LANGS`; each entry's `files(ctx)` returns `{path: content}`. JVM entries carry `fw: true` and are shown as one Java / Kotlin tile with a framework row: Spring Boot (rendered by the `renderNode*()` functions in `index.html`, no `files`), no framework (`erupt-cloud-node-lite`), Solon, Quarkus, Micronaut, Vert.x, Ktor and Servlet — framework versions follow erupt-cloud's own build and are pinned in the `V` table in `nodes.js`. The other languages (Python, Go, TypeScript, PHP, .NET, Rust, Ruby, Swift) use the erupt-sdk packages.
- `viz.js` — hover illustrations for module cards; exposes `window.VIZ`, rendered with `v-html="VIZ[m.id]"`.
- `assets/` — Maven and Gradle wrapper files copied verbatim into generated ZIPs (`mvnw`, `mvnw.cmd`, `mvn-wrapper/maven-wrapper.properties`, `gradlew`, `gradlew.bat`, `gradle-wrapper/gradle-wrapper.{jar,properties}`).
- `logo.svg` — favicon.

## Architecture of `index.html`

Data tables at the top of the script drive everything:

- `ERUPT_VER` / `BOOT_VER` — version constants. Bumping Erupt is a one-line change to `ERUPT_VER`, which also reaches the node templates as `ctx.ver`.
- `LANG` — en/zh UI strings. Every visible string goes through `t(key)`; module descriptions use `desc` / `descZh` on the module itself. Locale is auto-detected from `navigator.language` and toggled by the header button.
- `MODULES` — the module catalogue. Flags control grouping and behavior: `ai: true` (AI section), `data: true` (data-source section), `pro: true` + `proUrl` (commercial; emitted as a *commented* dependency and links to pricing), `requires: '<id>'` (dependency chain, resolved recursively in `toggleMod` — selecting `erupt-ai-staff` pulls in `erupt-ai-claw` then `erupt-ai`; deselecting cascades the other way), `tag` (NEW / PRO badge). Adding a module = adding one entry here.
- `APPS` — the ready-made apps of the last step; each links to `https://github.com/erupt-io/<id>`.
- `DB` — per-database `mvn` / `gradle` dependency snippets and a `yml(artifact)` datasource template.
- `JAVA_VERSIONS`, `LOCALES` — dropdown options.

Generation pipeline inside `setup()`:

1. `form` (reactive) holds all user choices; `selectedMods` holds module ids.
2. `render*()` functions are template-string renderers, one per output file (`renderPom`, `renderGradle`, `renderYml`, `renderAppJs`, `renderApp`, `renderSample`, `renderDockerfile`, `renderGitignore`, `renderReadme`).
3. `previewFiles` (computed) maps output path → rendered content, from `appFiles()` for an app or `nodeFiles()` for a node. This single map feeds **both** the preview dialog (tree + highlighted source) and the ZIP, so preview and download can never diverge.
4. `generate()` writes `previewFiles` into a JSZip folder, appends the wrapper from `assets/` (`addMavenWrapper` / `addGradleWrapper` set the unix executable bit), and calls `saveAs`.

`form.kind` switches the whole page between an **Erupt app** and a **Cloud node** (step 00). For a node, `previewFiles` returns `nodeFiles()`: the Spring Boot node comes from the `renderNode*()` functions (no `erupt-spring-boot-starter` / `erupt-admin` / `erupt-security`), every other language from `NODE_LANGS`. User input is reduced to safe characters before it is interpolated into generated code. Configuration and modules are shown only for an app (configuration also for the Spring Boot node).

Modules are shown one category at a time (`MOD_CATS` tabs: all / AI / plugins / data / pro) with a search box, as compact tiles; the `VIZ` sketch still pops up on hover.

When adding a new generated file: write a `renderX()` and register it in `appFiles()` (or `nodeFiles()` / the language's `files(ctx)` for a node). When adding a new form field: add to `form`, wire it in the template, and consume it in the relevant renderer.

## Visual style

The page follows erupt.xyz's Playful-Brutalist language: white paper, a bounded 1200px frame with 2px ink side borders, a graph-paper intro, 2px ink lines between rows, hard offset shadows (`--shadow: 4px 4px 0 var(--ink)`), zero border-radius, cyan (`--cyan`) as the primary / selected colour with ink text. Tokens live at the top of the `<style>` block; Element Plus is re-themed through the `--el-color-primary*` overrides there.

Layout: a sticky header, an intro row, then a two-column workspace — the numbered steps (project type → configuration → metadata → modules → ready-made apps) on the left, and a sticky "Your project" panel on the right with the summary, selected modules, the live file tree from `previewFiles` (click a file to open it in the preview dialog) and the Generate / Explore buttons. Commercial modules are only marked in the module list; their purchase links go into the generated build file as comments.

`viz.js` provides the hover sketches on module cards (palette constants `I`, `C`, `P`, `Y`, `G`, `V`; animation classes `ap`, `ad`, `ar`, `af`… with keyframes in `index.html`).
