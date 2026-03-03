import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

const isDev = process.env.DEV === "true";

const libraryBuild = {
  input: "src/index.ts",
  output: [
    { file: "dist/index.esm.js", format: "esm", sourcemap: true },
    { file: "dist/index.cjs.js", format: "cjs", sourcemap: true },
    {
      file: "dist/index.umd.js",
      format: "umd",
      name: "MathProgEditor",
      sourcemap: true,
      globals: {
        "@codemirror/state": "CM.state",
        "@codemirror/view": "CM.view",
        "@codemirror/language": "CM.language",
        "@codemirror/autocomplete": "CM.autocomplete",
        "@codemirror/lint": "CM.lint",
        "@codemirror/commands": "CM.commands",
        "@codemirror/search": "CM.search",
        "@lezer/common": "Lezer.common",
        "@lezer/highlight": "Lezer.highlight",
        "@lezer/lr": "Lezer.lr",
        katex: "katex",
      },
    },
  ],
  external: isDev
    ? []
    : [
        /^@codemirror\//,
        /^@lezer\//,
        "katex",
      ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: !isDev,
      declarationDir: isDev ? undefined : "dist",
    }),
  ],
};

const demoBuild = {
  input: "demo/demo.js",
  output: {
    file: "demo/demo.bundle.js",
    format: "iife",
    sourcemap: true,
  },
  plugins: [
    resolve({ browser: true, extensions: [".ts", ".js"] }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      compilerOptions: {
        declaration: false,
        declarationDir: null,
        outDir: "./demo",
        allowJs: true,
      },
    }),
  ],
};

export default isDev ? [demoBuild] : [libraryBuild, demoBuild];
