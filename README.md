# mathprog-editor

**The CodeMirror 6 extension for MathProg/GMPL code editing** — syntax highlighting, live math rendering, rainbow brackets, linting, and autocomplete for mathematical programming models.

[![CI](https://github.com/jonra/MathProg/actions/workflows/ci.yml/badge.svg)](https://github.com/jonra/MathProg/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/mathprog-editor.svg)](https://www.npmjs.com/package/mathprog-editor)
[![npm downloads](https://img.shields.io/npm/dm/mathprog-editor.svg)](https://www.npmjs.com/package/mathprog-editor)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/mathprog-editor)](https://bundlephobia.com/package/mathprog-editor)

Build web-based editors for MathProg (GNU MathProg / GMPL) — the modeling language used with GLPK for linear programming, mixed-integer programming, and optimization problems. Perfect for educational tools, optimization platforms, and operations research applications.

## Features

- **Full syntax highlighting** — Keywords, declarations, operators, functions, comments, and strings with distinct colors
- **Live math rendering** — See your MathProg code rendered as typeset mathematics using KaTeX (`sum{t in T}` becomes `Σ_{t∈T}`)
- **Rainbow brackets** — 6 cycling colors by nesting depth for `{}`, `[]`, `()`
- **Scope highlighting** — Click a bracket to highlight the entire enclosed region
- **Bracket mismatch detection** — Red underline on unclosed or mismatched brackets
- **Linting** — Human-friendly error messages ("Expected `;` after declaration" not "Syntax error")
- **Autocomplete** — All MathProg keywords, aggregate operators, and built-in functions
- **Light and dark themes** — GitHub-inspired color schemes
- **Incremental parsing** — Lezer grammar for fast, error-tolerant parsing
- **Zero config** — One function call to get a fully-featured editor

## Quick Start

### npm

```bash
npm install mathprog-editor
```

```js
import { mathProgEditor } from "mathprog-editor";

const view = mathProgEditor({
  parent: document.getElementById("editor"),
  doc: "set T := 1..24;\nparam cost{t in T};\n",
});
```

### With Math Panel

```js
import { mathProgEditor } from "mathprog-editor";

const view = mathProgEditor({
  parent: document.getElementById("editor"),
  mathPanel: document.getElementById("math-output"),
  doc: "minimize cost: sum{t in T} price[t] * x[t];",
  theme: "dark",
});
```

### CDN (Script Tag)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/mathprog-editor/dist/index.umd.js"></script>
<script>
  const view = MathProgEditor.mathProgEditor({
    parent: document.getElementById("editor"),
    doc: "set T := 1..24;",
  });
</script>
```

## Configuration

The `mathProgEditor()` function accepts the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `parent` | `HTMLElement` | *required* | Container element for the editor |
| `doc` | `string` | `""` | Initial MathProg source code |
| `theme` | `"light" \| "dark"` | `"light"` | Color theme |
| `mathPanel` | `HTMLElement` | — | Target element for rendered math output |
| `mathPanelDebounce` | `number` | `300` | Re-render delay in ms |
| `rainbowBrackets` | `boolean` | `true` | Enable rainbow bracket coloring |
| `scopeHighlight` | `boolean` | `true` | Enable scope highlighting on bracket click |
| `bracketMismatch` | `boolean` | `true` | Enable mismatch detection |
| `linting` | `boolean` | `true` | Enable error diagnostics |
| `extensions` | `Extension[]` | `[]` | Additional CodeMirror 6 extensions |

## Individual Exports

Use the pieces you need:

```js
import { mathProg } from "mathprog-editor";             // Language support
import { rainbowBrackets } from "mathprog-editor";       // Rainbow brackets
import { scopeHighlight } from "mathprog-editor";        // Scope highlighting
import { bracketMismatch } from "mathprog-editor";       // Mismatch detection
import { mathPanel } from "mathprog-editor";             // Math rendering panel
import { mathProgLinter } from "mathprog-editor";        // Linting
import { lightTheme, darkTheme } from "mathprog-editor"; // Themes
import { sourceToLatex } from "mathprog-editor";         // AST → LaTeX converter
import { renderLatex } from "mathprog-editor";           // KaTeX wrapper
```

## Math Rendering

The math panel converts MathProg code into typeset mathematical notation:

| MathProg | Rendered |
|----------|----------|
| `sum{t in T} x[t]` | Σ_{t∈T} x_t |
| `x[i,j]` | x_{i,j} |
| `>=` / `<=` / `<>` | ≥ / ≤ / ≠ |
| `a / b` | a/b (fraction) |
| `a * b` | a · b |
| `sqrt(x)` | √x |
| `abs(x)` | \|x\| |
| `minimize cost:` | min_{cost} |

## MathProg Language Support

The Lezer grammar covers the full MathProg/GMPL specification:

- **Declarations**: `set`, `param`, `var` with indexing, bounds, defaults
- **Objectives**: `minimize`, `maximize`
- **Constraints**: `s.t.` / `subject to` with multi-line expressions
- **Expressions**: Arithmetic (`+`, `-`, `*`, `/`, `**`, `^`), comparison (`<=`, `>=`, `=`, `<>`, `<`, `>`), logical (`and`, `or`, `not`), set operations (`union`, `inter`, `diff`, `symdiff`, `cross`)
- **Aggregates**: `sum`, `prod`, `min`, `max`, `forall`, `exists`, `setof`, `count`
- **Indexing**: `{i in S : condition}` with arbitrary nesting
- **Functions**: `abs`, `ceil`, `floor`, `exp`, `log`, `sqrt`, `sin`, `cos`, `atan`, `round`, `trunc`, `card`, `length`, `substr`, and more
- **Control**: `if`/`then`/`else`, `for`, `display`, `printf`, `solve`, `check`
- **Comments**: Line (`#`) and block (`/* */`)

## Browser Support

Works in all modern browsers that support ES2020. Tested with Chrome, Firefox, Safari, and Edge.

## Use Cases

- **Educational platforms** — Teach linear programming and optimization with an interactive editor
- **Operations research tools** — Build web interfaces for GLPK/GMPL model editing
- **Optimization IDEs** — Create browser-based development environments for mathematical programming
- **Documentation tools** — Embed editable MathProg examples in technical documentation
- **Homework platforms** — Let students write and validate optimization models online

## Related Projects

- [GLPK](https://www.gnu.org/software/glpk/) — GNU Linear Programming Kit
- [GLPK.js](https://github.com/jvail/glpk.js) — GLPK compiled to JavaScript via Emscripten
- [CodeMirror 6](https://codemirror.net/) — The editor framework this library extends
- [KaTeX](https://katex.org/) — Fast math typesetting for the web

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

## License

[MIT](./LICENSE)
