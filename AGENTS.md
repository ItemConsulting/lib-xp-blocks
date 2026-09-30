# AGENTS.md

This file provides guidance to AI agents like Claude and Copilot when working with code in this repository.

## Description

**Item Blocks** (`no.item:lib-xp-blocks` / npm `@item-enonic-types/lib-blocks`) is an Enonic XP 8 **library**, not a
standalone app. It ships a set of reusable content "blocks" (XP form fragments) — accordion, card(s), highlighted text,
images, map, quote, text, etc. — that consuming XP apps include in their forms and render.

It is dual-published:
- **Maven JAR** (`repo.itemtest.no`) — the runtime artifact: compiled server JS, YAML descriptors, FreeMarker
  templates, CSS and client scripts. Consumers add it via `include "no.item:lib-xp-blocks:<version>"`.
- **npm package** (`@item-enonic-types/lib-blocks`) — **types only** (`.d.ts`, including the types generated from the
  descriptors) plus CSS, so consumers get type-safe imports of the block functions the JAR provides at runtime.

The XP 7 version was published as `no.item:lib-xp-item-blocks` 0.x from the `lib-xp-item-blocks` repository. See
`README.md` for the consumer-facing install and usage instructions.

## Build system

Gradle is the primary build tool (`com.enonic.xp.base`, `java-library` and `maven-publish` plugins), with the
`com.github.node-gradle.node` plugin driving npm and `no.item.xp.codegen` generating TypeScript types from the YAML
descriptors. The `com.enonic.xp.settings` plugin in `settings.gradle` supplies the XP plugin versions. This library
does **not** need a sandbox to build — the JAR is consumed by apps rather than deployed on its own. XP 8 needs a Gradle
JVM of 21+ and compiles against Java 25.

`no.item.xp.codegen` 3.0.0 is not on the Gradle Plugin Portal yet: `settings.gradle` resolves `3.0.0-SNAPSHOT` from
`~/.m2`, published there with `./gradlew publishToMavenLocal` in the `xp-codegen-plugin` repository. Switch to the
released version (and drop `mavenLocal()` from `pluginManagement`) once it is published — CI cannot build until then.

Key wiring in `build.gradle`:
- `npmBuild` (`npm run build`) compiles into `build/npm/`, which `processResources` copies into the jar's resources.
  `processResources` empties its output directory first, so files from deleted or renamed sources never linger in the
  jar.
- The runtime libraries (`implementation` in `build.gradle`) are published as runtime dependencies in the POM, and a
  consuming app's `include` is transitive, so consumers only declare `include "no.item:lib-xp-blocks:<version>"`.
- `check` depends on `npmCheck` (`npm run check`).
- `npmBuild` and `npmCheck` depend on `generateTypeScript`, since the TypeScript imports the generated types.
- `npmBuild` sets `NODE_ENV=development` for `-Penv=dev` (and the legacy `-Pdev`/`-Pdevelopment`), which skips minification.
- `processResources` leaves out the stylesheet sources; they ship bundled as `assets/styles/blocks-all.min.css`. The npm
  package gets each stylesheet (`prepublish:styles`), in the same tree as the type declarations.

Libraries are declared in the version catalog `gradle/libs.versions.toml` and referenced as `libs.<alias>`; never
hardcode coordinates in `build.gradle`. The `xpVersion` in `gradle.properties` is the target XP version; the
`@enonic-types/*` packages in `package.json` should be at least this version.

`.npmrc` disables npm's audit and fund requests: an unreachable audit endpoint stalls every `npm install` for npm's
five-minute timeout.

## Commands

### npm scripts (primary for TypeScript/CSS work)

```bash
npm run build                 # empties build/npm (prebuild), then tsdown and PostCSS concurrently
npm run build:scripts         # tsdown: server TS → build/npm, client TS → build/npm/assets
npm run build:styles          # PostCSS: blocks-all.css → build/npm/assets/styles/blocks-all.min.css

npm run check                 # check:types + lint (what CI and Gradle run)
npm run check:types           # Type-check server + assets concurrently

npm run lint                  # Biome: lint AND format-check of TS/JS/JSON/CSS (fails on unformatted code)
npm run lint:fix              # Biome: apply fixes + format in place
```

### Gradle

```bash
./gradlew generateTypeScript  # Regenerate .xp-codegen/ from the YAML descriptors
./gradlew build               # generateTypeScript → npmInstall → npmCheck → npmBuild → jar
./gradlew build -Penv=dev     # Development build (NODE_ENV=development, no minification)
./gradlew publishToMavenLocal # Try the jar in a local app
```

### Versioning & publishing (changesets)

```bash
npx changeset                 # Record a change (author a changeset)
npm run versioning            # Apply changesets: bump package.json + gradle.properties version
npm run release               # changeset publish (npm), run by the Publish workflow
```

## CI/CD

GitHub Actions (`.github/workflows/`):
- **`main.yml` (CI)** — on `main` and pull requests: `npm ci`, then `./gradlew build` on Java 25.
- **`publish.yml` (Publish)** — after a successful CI run on `main`: uses `changesets/action` to either open a
  "Version Packages" PR or, once merged, publish the npm package and the jar and create a GitHub release. The
  `versioning` script keeps `package.json` and `gradle.properties` versions in sync through
  `.changeset/gradle-version.mjs`, which turns a prerelease (`1.0.0-beta.0`) into the jar snapshot `1.0.0-SNAPSHOT`,
  so `build.gradle` publishes it to the snapshots repository.

## Architecture

### Blocks are XP form fragments

Each block lives in `src/main/resources/cms/form-fragments/blocks-<name>/` and is a small bundle of co-located files:

| File | Purpose |
|------|---------|
| `blocks-<name>.yaml` | XP form fragment (`kind: "FormFragment"`), the fields the editor fills in |
| `blocks-<name>.ts` | Server render logic — the exported `process` function consumers call |
| `blocks-<name>.freemarker.ts` | Type of the FreeMarker template's model (types only, not built) |
| `blocks-<name>.ftlh` | The FreeMarker template, in the square bracket tag syntax (`[#if]`, `[#-- --]`) |
| `blocks-<name>.css` | The block's styles (optional). `assets/styles/blocks-all.css` imports every block's stylesheet |

Form fragments reference each other with `- include: "<name>"`. `blocks/blocks.ts` is the dispatcher that renders a
list of blocks (consumers can pass extra `processors`). Shared helpers live in `lib/item/blocks/` (`colors`,
`images`, `links`, `responses`, `utils`, `types`). The admin extension `admin/extensions/color-selector/`
backs the color picker (`CustomSelector`) in `_blocks-color`. It implements the `contentstudio.customselector`
interface, so XP only serves it (through the `admin:extension` universal API) to Content Studio. The i18n keys follow
`form-fragments.<fragment-name>.<field path>`, where each segment is the name of what it labels: the prefix is the
`cms/form-fragments/` directory, the fragment name stays kebab-case and field names stay camelCase. The fragment itself uses `.displayName` and `.description`, help text
appends `.helpText` to its field's key, and option-set options and selector options add their name as one more segment,
e.g. `form-fragments._blocks-card.link.internal.contentId` and `form-fragments.blocks-map.markers.helpText`. Texts
used only by a template have no field to follow (`blocks-images.close`).

Editor-facing texts — the inline `text:` values in the YAML descriptors and the English phrases in
`i18n/phrases.properties` — are written in British English (colour, centre, stylised), and the two must say the
same thing. Help texts (`.helpText` keys and `helpText:` in the descriptors) are sentences and end with a full stop, in
every language; labels, display names and descriptions do not. Identifiers keep their existing spelling (`color`,
`center`, `color-selector`): code, generated types and i18n keys depend on them. The bundles use the standard names,
`phrases.properties` (English, the default), `phrases_no.properties` (Bokmål) and `phrases_nn.properties` (Nynorsk);
do not rename them to sidestep collisions with a consuming app's or another library's bundles, since any name is just
as exposed.

A template is resolved relative to the file that calls `resolve()`, which is why tsdown must emit every source file as
its own output file.

### Generated types (`xp-codegen`)

The `no.item.xp.codegen` Gradle plugin validates the YAML descriptors against XP's JSON schemas and generates `.d.ts`
types under `.xp-codegen/`, mirroring the `cms/**` tree. The server tsconfig merges `.xp-codegen` into the source tree
via `rootDirs`, so a block imports its own generated type with `import type { BlocksMap } from "."`. Do not hand-edit
`.xp-codegen/` — regenerate it with `./gradlew generateTypeScript`. The npm package ships these files next to the
compiled declarations.

### Dual build: server vs. client (tsdown)

`tsdown.config.mts` defines both targets:

**Server** (`src/main/resources/**/*.ts`, excluding `assets/` and `*.freemarker.ts`):
- CommonJS, `platform: "neutral"`, re-lowered to ES5 by an SWC plugin (`nashornEs5`), since XP's **Nashorn** engine
  lacks some ES2015 syntax. tsdown's target is `esnext` so SWC does all the lowering: Oxc's down-level helpers call
  ES2016+ APIs (e.g. `Array#includes` for object rest) that Nashorn lacks.
- Import the library's own files (and the generated types in `.xp-codegen/`) with **relative** paths, e.g.
  `../../../lib/item/blocks/utils`. The npm package's declarations keep the specifiers, and only relative ones resolve
  inside `dist/`. Absolute imports are for modules the XP runtime provides (`/lib/xp/*`, `/lib/freemarker`,
  `/lib/enonic/asset`); tsdown leaves those unbundled (`isRuntimeModule`). A mistyped specifier is caught by
  `check:types` (TS2307), not by the bundler.

**Client** (`src/main/resources/assets/**/*.ts`):
- ESM (`.mjs`), `platform: "browser"`, minified unless `NODE_ENV=development`. Bundles `@itemconsulting/popover-gallery`,
  Designsystemet's `clickdelegatefor`. MapLibre GL is not bundled: its ES modules (`maplibre-gl.mjs`, the shared chunk
  and the worker) and CSS are copied from the npm package into `assets/maplibre-gl/`, and the `maplibre-gl` import in
  `scripts/blocks/maplibre-gl.mjs` is rewritten to point there, so maplibre finds its worker next to itself.

CSS is built separately with **PostCSS** (`postcss.config.js`: `postcss-import`, and `cssnano` in production only).
The `browserslist` in `package.json` (`"baseline widely available"`) is what cssnano targets. The CSS is shipped
as written — native nesting included — so it may only use features within that baseline; nothing lowers or prefixes it.

### TypeScript toolchain

The project uses TypeScript 7 — the native compiler, which no longer exports the classic compiler API. `tsc` is used
only for type checking and for emitting the npm package's declarations; tsdown (Oxc) and SWC do all transpilation. Do
not add ts-node, ts-jest or typescript-eslint (or other packages with a `typescript <7` peer dependency).

There are two source tsconfigs — `src/main/resources/tsconfig.json` (XP server, no DOM) and
`src/main/resources/assets/tsconfig.json` (browser, DOM) — plus the root `tsconfig.json` for the build tooling. Keep
the split: server code must not gain DOM/browser types. Server-side code has access to the Enonic runtime globals
(`app`, `log`, `require`, `resolve`, `__`) via `@enonic-types/global`.

### Tooling

- **Biome** handles linting **and** formatting for TS/JS/JSON and CSS. `npm run lint` = `biome ci` fails on lint
  issues, unformatted code *and* unsorted CSS properties (the `useSortedProperties` assist action, Biome's own order);
  `npm run lint:fix` fixes all three.
- **changesets** drives versioning and npm publishing.
- There is currently **no test suite** in this repo.
