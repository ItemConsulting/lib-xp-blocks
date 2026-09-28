import { existsSync, globSync } from "node:fs";
import { sep } from "node:path";
import { transform } from "@swc/core";
import { defineConfig } from "tsdown";

const SRC = "src/main/resources";
const SRC_ASSETS = `${SRC}/assets`;
// Gradle's processResources copies this into the jar's resources; `npm run build` empties it first (prebuild)
const DST = "build/npm";
const DST_ASSETS = `${DST}/assets`;

const dev = process.env.NODE_ENV === "development";
const logLevel: "silent" | "info" = ["QUIET", "WARN"].includes(process.env.LOG_LEVEL_FROM_GRADLE || "")
  ? "silent"
  : "info";

// Enonic XP loads each controller/service/task by its resource path, so every
// source file must become its own output file with the directory tree intact.
// Turn a glob into a tsdown `entry` map ({ "relative/name": "src/path/file.ts" }).
function entries(dir: string, exts: string, exclude: string[] = []): Record<string, string> {
  return Object.fromEntries(
    globSync(`${dir}/**/*.${exts}`, { exclude }).map((match) => {
      // globSync returns platform separators; entry keys and paths must be posix.
      const file = match.replaceAll(sep, "/");
      return [file.slice(dir.length + 1).replace(/\.[^.]+$/, ""), file];
    }),
  );
}

// *.freemarker.ts only declare the types of a template's model, so they have
// no runtime output worth shipping.
const serverEntry = entries(SRC, "{ts,js}", ["**/*.d.ts", "**/*.freemarker.ts", `${SRC_ASSETS}/**`]);
const assetEntry = entries(SRC_ASSETS, "{tsx,ts,jsx,js}", ["**/*.d.ts"]);

// XP resolves an absolute import at runtime against the app's own resources
// first, then against the modules provided by the runtime: XP's own libraries
// (/lib/xp/*), libraries `include`d in build.gradle, modules from other apps.
// Mirror that rule at build time: bundle an absolute import only when it is a
// source file of this library, and leave every other one to the runtime — no
// list of runtime modules to maintain. A mistyped specifier is caught by
// `check:types` (TS2307), not by the bundler.
const SRC_EXTS = [".ts", ".js"];
const appSourceCache = new Map<string, boolean>();
function isAppSource(id: string): boolean {
  let hit = appSourceCache.get(id);
  if (hit === undefined) {
    hit = SRC_EXTS.some((ext) => existsSync(`${SRC}${id}${ext}`) || existsSync(`${SRC}${id}/index${ext}`));
    appSourceCache.set(id, hit);
  }
  return hit;
}
const isRuntimeModule = (id: string, _importer: string | undefined, isResolved: boolean): boolean =>
  !isResolved && id.startsWith("/") && !isAppSource(id);

// Nashorn (XP's server-side JS engine) lacks ES2015 destructuring, but Oxc —
// tsdown's transformer — can't target below es2015. Re-lower the bundled server
// output to es5 with SWC after bundling, so bundled deps are covered too.
const nashornEs5 = {
  name: "nashorn-es5",
  async renderChunk(code: string) {
    const out = await transform(code, {
      jsc: {
        parser: { syntax: "ecmascript" },
        target: "es5",
        loose: true,
        externalHelpers: false,
      },
      isModule: false,
      minify: false,
      sourceMaps: false,
    });
    return { code: out.code, map: null };
  },
};

// Skip a target that has no source files to bundle.
export default defineConfig([
  ...(Object.keys(serverEntry).length
    ? [
        {
          entry: serverEntry,
          outDir: DST,
          format: "cjs" as const,
          target: "esnext", // leave all lowering to nashornEs5: Oxc's es2015 helpers use ES2016+ APIs (e.g. Array#includes) Nashorn lacks
          platform: "neutral" as const,
          clean: false, // outDir also holds the assets/ subfolder and the styles; `prebuild` empties it instead
          dts: false, // d.ts files are useless at runtime
          minify: false, // minifying server files makes debugging harder
          sourcemap: false,
          logLevel,
          plugins: [nashornEs5],
          tsconfig: `${SRC}/tsconfig.json`,
          inputOptions: {
            external: isRuntimeModule,
            resolve: {
              mainFields: ["module", "main"],
            },
          },
          outputOptions: {
            chunkFileNames: "_chunks/[name]-[hash].js", // avoid chunk-name collisions
          },
        },
      ]
    : []),
  ...(Object.keys(assetEntry).length
    ? [
        {
          entry: assetEntry,
          outDir: DST_ASSETS,
          format: "esm" as const,
          target: "es2023",
          platform: "browser" as const,
          clean: false,
          dts: false,
          minify: !dev,
          sourcemap: dev,
          logLevel,
          tsconfig: `${SRC_ASSETS}/tsconfig.json`,
          // MapLibre GL is served as its own ES modules from assets/maplibre-gl/ instead of being bundled: its worker
          // (maplibre-gl-worker.mjs) is loaded next to maplibre-gl.mjs, and shares maplibre-gl-shared.mjs with it, so
          // bundling would ship the shared code twice. The import is rewritten to a URL relative to the only script that
          // imports it, scripts/blocks/maplibre-gl.mjs.
          inputOptions: {
            external: ["maplibre-gl"],
          },
          outputOptions: {
            paths: { "maplibre-gl": "../../maplibre-gl/maplibre-gl.mjs" },
          },
          copy: [
            {
              from: ["maplibre-gl.mjs", "maplibre-gl-shared.mjs", "maplibre-gl-worker.mjs", "maplibre-gl.css"].map(
                (file) => `node_modules/maplibre-gl/dist/${file}`,
              ),
              to: `${DST_ASSETS}/maplibre-gl`,
            },
          ],
        },
      ]
    : []),
]);
