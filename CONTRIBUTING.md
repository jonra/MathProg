# Contributing to mathprog-editor

Thank you for your interest in contributing to mathprog-editor! This guide will help you get started.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jonra/MathProg.git
   cd mathprog-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Generate the parser**
   ```bash
   npm run grammar
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Run tests**
   ```bash
   npm test
   ```

6. **Start the dev server**
   ```bash
   npm run dev
   ```
   Then open `demo/index.html` in your browser.

## Project Structure

- `src/language/` — Lezer grammar, tokenizer, syntax highlighting, autocomplete
- `src/brackets/` — Rainbow brackets, scope highlighting, mismatch detection
- `src/math-render/` — MathProg-to-LaTeX converter, KaTeX renderer, side panel
- `src/lint/` — Error detection with human-friendly messages
- `src/theme/` — Light and dark editor themes
- `src/index.ts` — Main exports and convenience `mathProgEditor()` function
- `demo/` — Interactive demo page
- `test/` — Test suite

## How to Contribute

### Reporting Bugs

- Use the [GitHub issue tracker](../../issues)
- Include the MathProg code that triggers the bug
- Describe expected vs. actual behavior
- Include browser/OS info if relevant

### Suggesting Features

- Open a discussion or issue describing the use case
- Explain why existing features don't cover your need

### Submitting Pull Requests

1. Fork the repo and create a feature branch from `main`
2. Write tests for new functionality
3. Ensure all tests pass: `npm test`
4. Ensure the build succeeds: `npm run build`
5. Write clear commit messages
6. Open a PR with a description of the changes

### Grammar Changes

The Lezer grammar (`src/language/mathprog.grammar`) is the foundation of the editor. Changes here affect everything downstream. When modifying the grammar:

1. Run `npm run grammar` to regenerate the parser
2. Verify the grammar test suite passes
3. Test with real MathProg/GMPL models in the demo page
4. Check that highlighting, autocomplete, and linting still work

## Code Style

- TypeScript with strict mode
- No unnecessary abstractions — keep it simple
- Follow existing patterns in the codebase

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
