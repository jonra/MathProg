# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-03-03

### Added

- Full Lezer grammar for MathProg/GMPL syntax
  - Set, param, var declarations
  - Objectives (minimize/maximize)
  - Constraints with `s.t.` / `subject to`
  - Indexing expressions, aggregates (sum, prod, min, max)
  - Arithmetic, comparison, logical, set operations
  - Built-in functions (abs, sqrt, log, etc.)
  - Comments (line `#` and block `/* */`)
  - Data section, solve, display, printf, for
- Syntax highlighting with CodeMirror 6
  - Light theme (GitHub-inspired)
  - Dark theme (GitHub Dark-inspired)
- Rainbow bracket coloring (6 cycling colors by depth)
- Scope highlighting (background highlight between matching brackets)
- Bracket mismatch detection (red underline on unmatched brackets)
- Live math rendering panel
  - MathProg to LaTeX conversion
  - KaTeX rendering with error fallback
  - Synchronized scrolling
  - Click-to-jump from math to source
- Linting with human-friendly error messages
- Autocomplete for keywords and built-in functions
- Convenience `mathProgEditor()` setup function
- Interactive demo page with battery optimization sample model
- ESM, CJS, and UMD distribution bundles
