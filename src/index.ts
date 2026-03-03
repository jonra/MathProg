import { Extension } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection, highlightSpecialChars } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { closeBrackets, closeBracketsKeymap, autocompletion } from "@codemirror/autocomplete";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { bracketMatching, foldGutter, foldKeymap } from "@codemirror/language";

// Language
export { mathProgLanguage, mathProg } from "./language/mathprog";
export { mathProgCompletion } from "./language/complete";

// Brackets
export { rainbowBrackets, rainbowBracketTheme } from "./brackets/rainbow";
export { scopeHighlight, scopeHighlightTheme } from "./brackets/scope-highlight";
export { bracketMismatch, bracketMismatchTheme } from "./brackets/math-aware-match";

// Math rendering
export { sourceToLatex } from "./math-render/parser";
export type { LatexBlock } from "./math-render/parser";
export { renderLatex, renderLatexToString } from "./math-render/renderer";
export { mathPanel, mathPanelTheme } from "./math-render/panel";
export type { MathPanelConfig } from "./math-render/panel";

// Linting
export { mathProgLinter } from "./lint/linter";

// Themes — old API
export { lightTheme } from "./theme/light";
export { darkTheme } from "./theme/dark";

// Themes — new multi-theme API
export { getTheme, getThemeDefinition, themeDefinitions, lightThemes, darkThemes } from "./theme/themes";
export type { ThemeColors, ThemeDefinition } from "./theme/themes";

// Re-export key CM6 types for convenience
export { EditorView } from "@codemirror/view";
export { EditorState } from "@codemirror/state";

// --- Convenience setup ---

import { mathProg } from "./language/mathprog";
import { rainbowBrackets, rainbowBracketTheme } from "./brackets/rainbow";
import { scopeHighlight, scopeHighlightTheme } from "./brackets/scope-highlight";
import { bracketMismatch, bracketMismatchTheme } from "./brackets/math-aware-match";
import { mathPanel, mathPanelTheme, MathPanelConfig } from "./math-render/panel";
import { mathProgLinter } from "./lint/linter";
import { getTheme } from "./theme/themes";

export interface MathProgEditorConfig {
  /** Parent element for the editor */
  parent: HTMLElement;
  /** Initial document content */
  doc?: string;
  /**
   * Theme name. Available themes:
   * - Light: "github-light", "solarized-light", "rose-pine-dawn", "catppuccin-latte", "paper"
   * - Dark: "github-dark", "dracula", "tokyo-night", "catppuccin-mocha", "rose-pine-moon"
   * - Legacy: "light" (alias for github-light), "dark" (alias for github-dark)
   */
  theme?: string;
  /** Enable rainbow brackets (default: true) */
  rainbowBrackets?: boolean;
  /** Enable scope highlighting (default: true) */
  scopeHighlight?: boolean;
  /** Enable bracket mismatch detection (default: true) */
  bracketMismatch?: boolean;
  /** Enable linting (default: true) */
  linting?: boolean;
  /** Math panel target element (renders math if provided) */
  mathPanel?: HTMLElement;
  /** Math panel debounce ms (default: 300) */
  mathPanelDebounce?: number;
  /** Additional extensions */
  extensions?: Extension[];
}

function resolveThemeName(name?: string): string {
  if (!name || name === "light") return "github-light";
  if (name === "dark") return "github-dark";
  return name;
}

/**
 * Create a fully-configured MathProg editor with all features enabled.
 *
 * @example
 * ```ts
 * const view = mathProgEditor({
 *   parent: document.getElementById("editor")!,
 *   mathPanel: document.getElementById("math")!,
 *   doc: "set T := 1..24;\nparam demand{t in T};\n",
 *   theme: "dracula",
 * });
 * ```
 */
export function mathProgEditor(config: MathProgEditorConfig): EditorView {
  const themeName = resolveThemeName(config.theme);

  const extensions: Extension[] = [
    lineNumbers(),
    highlightActiveLine(),
    highlightSpecialChars(),
    drawSelection(),
    history(),
    foldGutter(),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    highlightSelectionMatches(),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
    ]),
    // MathProg language
    mathProg(),
    // Theme
    getTheme(themeName),
  ];

  // Optional features (all default to true)
  if (config.rainbowBrackets !== false) {
    extensions.push(rainbowBrackets, rainbowBracketTheme);
  }
  if (config.scopeHighlight !== false) {
    extensions.push(scopeHighlight, scopeHighlightTheme);
  }
  if (config.bracketMismatch !== false) {
    extensions.push(bracketMismatch, bracketMismatchTheme);
  }
  if (config.linting !== false) {
    extensions.push(mathProgLinter);
  }

  // Math panel
  if (config.mathPanel) {
    extensions.push(
      mathPanel({
        target: config.mathPanel,
        debounce: config.mathPanelDebounce,
      }),
      mathPanelTheme
    );
  }

  // User extensions
  if (config.extensions) {
    extensions.push(...config.extensions);
  }

  return new EditorView({
    doc: config.doc ?? "",
    extensions,
    parent: config.parent,
  });
}
