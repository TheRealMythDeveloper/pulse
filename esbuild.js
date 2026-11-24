
const esbuild = require("esbuild");

esbuild.build({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    format: "cjs",
    platform: "browser",
    target: "es2022",
    outfile: "dist/extension.js",
    external: ["vscode"],
    sourcemap: true
}).catch(() => process.exit(1));
