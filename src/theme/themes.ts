import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { Extension } from "@codemirror/state";

// --- Theme color definitions ---

export interface ThemeColors {
  // Editor chrome
  background: string;
  foreground: string;
  caret: string;
  selection: string;
  gutterBg: string;
  gutterFg: string;
  gutterBorder: string;
  activeLineBg: string;
  activeGutterBg: string;
  // Syntax
  keyword: string;
  controlKeyword: string;
  definition: string;
  variable: string;
  function: string;
  aggregate: string;
  number: string;
  string: string;
  operator: string;
  comment: string;
  bracket: string;
  separator: string;
  modifier: string;
  // Feature overrides
  scopeHighlightBg: string;
  bracketHighlightBg: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipFg: string;
  mathBlockHoverBg: string;
}

export interface ThemeDefinition {
  name: string;
  label: string;
  dark: boolean;
  colors: ThemeColors;
}

function buildTheme(def: ThemeDefinition): Extension {
  const c = def.colors;

  const highlightStyle = HighlightStyle.define([
    { tag: t.definitionKeyword, color: c.keyword, fontWeight: "bold" },
    { tag: t.keyword, color: c.keyword, fontWeight: "bold" },
    { tag: t.controlKeyword, color: c.controlKeyword, fontWeight: "bold" },
    { tag: t.logicOperator, color: c.keyword, fontWeight: "bold" },
    { tag: t.operatorKeyword, color: c.keyword },
    { tag: t.modifier, color: c.modifier, fontStyle: "italic" },
    { tag: t.function(t.keyword), color: c.aggregate, fontWeight: "bold" },
    { tag: t.function(t.name), color: c.function },
    { tag: t.definition(t.variableName), color: c.definition, fontWeight: "bold" },
    { tag: t.variableName, color: c.variable },
    { tag: t.number, color: c.number },
    { tag: t.string, color: c.string },
    { tag: t.operator, color: c.operator },
    { tag: t.definitionOperator, color: c.operator },
    { tag: t.paren, color: c.bracket },
    { tag: t.squareBracket, color: c.bracket },
    { tag: t.brace, color: c.bracket },
    { tag: t.separator, color: c.separator },
    { tag: t.lineComment, color: c.comment, fontStyle: "italic" },
    { tag: t.blockComment, color: c.comment, fontStyle: "italic" },
  ]);

  const editorTheme = EditorView.theme(
    {
      "&": {
        color: c.foreground,
        backgroundColor: c.background,
      },
      ".cm-content": {
        caretColor: c.caret,
      },
      ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: c.caret,
      },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
        backgroundColor: c.selection,
      },
      ".cm-gutters": {
        backgroundColor: c.gutterBg,
        color: c.gutterFg,
        borderRight: `1px solid ${c.gutterBorder}`,
      },
      ".cm-activeLineGutter": {
        backgroundColor: c.activeGutterBg,
      },
      ".cm-activeLine": {
        backgroundColor: c.activeLineBg,
      },
      ".cm-scope-highlight": {
        backgroundColor: c.scopeHighlightBg,
      },
      ".cm-bracket-highlight": {
        backgroundColor: c.bracketHighlightBg,
      },
      ".cm-math-bracket-tooltip": {
        backgroundColor: c.tooltipBg,
        border: `1px solid ${c.tooltipBorder}`,
        color: c.tooltipFg,
      },
      ".cm-math-block:hover": {
        backgroundColor: c.mathBlockHoverBg,
      },
    },
    { dark: def.dark }
  );

  return [editorTheme, syntaxHighlighting(highlightStyle)];
}

// =====================================================================
//  LIGHT THEMES
// =====================================================================

const githubLightColors: ThemeColors = {
  background: "#ffffff",
  foreground: "#24292f",
  caret: "#0550ae",
  selection: "#dbe4ff",
  gutterBg: "#f6f8fa",
  gutterFg: "#8c959f",
  gutterBorder: "#d0d7de",
  activeLineBg: "#f6f8fa",
  activeGutterBg: "#eaeef2",
  keyword: "#0550ae",
  controlKeyword: "#8250df",
  definition: "#6639ba",
  variable: "#24292f",
  function: "#d4760a",
  aggregate: "#953800",
  number: "#0550ae",
  string: "#0a3069",
  operator: "#cf222e",
  comment: "#6e7781",
  bracket: "#24292f",
  separator: "#57606a",
  modifier: "#0550ae",
  scopeHighlightBg: "rgba(100, 149, 237, 0.08)",
  bracketHighlightBg: "rgba(100, 149, 237, 0.3)",
  tooltipBg: "#f0f0f0",
  tooltipBorder: "#ccc",
  tooltipFg: "#333",
  mathBlockHoverBg: "rgba(0,0,0,0.04)",
};

const solarizedLightColors: ThemeColors = {
  background: "#fdf6e3",
  foreground: "#657b83",
  caret: "#268bd2",
  selection: "#eee8d5",
  gutterBg: "#fdf6e3",
  gutterFg: "#93a1a1",
  gutterBorder: "#eee8d5",
  activeLineBg: "#eee8d5",
  activeGutterBg: "#eee8d5",
  keyword: "#268bd2",
  controlKeyword: "#6c71c4",
  definition: "#d33682",
  variable: "#657b83",
  function: "#b58900",
  aggregate: "#cb4b16",
  number: "#2aa198",
  string: "#2aa198",
  operator: "#859900",
  comment: "#93a1a1",
  bracket: "#586e75",
  separator: "#93a1a1",
  modifier: "#268bd2",
  scopeHighlightBg: "rgba(38, 139, 210, 0.08)",
  bracketHighlightBg: "rgba(38, 139, 210, 0.2)",
  tooltipBg: "#eee8d5",
  tooltipBorder: "#d3cbb7",
  tooltipFg: "#657b83",
  mathBlockHoverBg: "rgba(0,0,0,0.03)",
};

const rosePineDawnColors: ThemeColors = {
  background: "#faf4ed",
  foreground: "#575279",
  caret: "#907aa9",
  selection: "#dfdad9",
  gutterBg: "#faf4ed",
  gutterFg: "#9893a5",
  gutterBorder: "#f2e9e1",
  activeLineBg: "#f2e9e1",
  activeGutterBg: "#f2e9e1",
  keyword: "#907aa9",
  controlKeyword: "#b4637a",
  definition: "#d7827e",
  variable: "#575279",
  function: "#ea9d34",
  aggregate: "#56949f",
  number: "#d7827e",
  string: "#ea9d34",
  operator: "#286983",
  comment: "#9893a5",
  bracket: "#575279",
  separator: "#9893a5",
  modifier: "#907aa9",
  scopeHighlightBg: "rgba(144, 122, 169, 0.08)",
  bracketHighlightBg: "rgba(144, 122, 169, 0.2)",
  tooltipBg: "#f2e9e1",
  tooltipBorder: "#dfdad9",
  tooltipFg: "#575279",
  mathBlockHoverBg: "rgba(0,0,0,0.03)",
};

const catppuccinLatteColors: ThemeColors = {
  background: "#eff1f5",
  foreground: "#4c4f69",
  caret: "#1e66f5",
  selection: "#ccd0da",
  gutterBg: "#e6e9ef",
  gutterFg: "#9ca0b0",
  gutterBorder: "#ccd0da",
  activeLineBg: "#e6e9ef",
  activeGutterBg: "#dce0e8",
  keyword: "#1e66f5",
  controlKeyword: "#8839ef",
  definition: "#d20f39",
  variable: "#4c4f69",
  function: "#fe640b",
  aggregate: "#df8e1d",
  number: "#40a02b",
  string: "#40a02b",
  operator: "#e64553",
  comment: "#9ca0b0",
  bracket: "#5c5f77",
  separator: "#9ca0b0",
  modifier: "#7287fd",
  scopeHighlightBg: "rgba(30, 102, 245, 0.07)",
  bracketHighlightBg: "rgba(30, 102, 245, 0.2)",
  tooltipBg: "#e6e9ef",
  tooltipBorder: "#ccd0da",
  tooltipFg: "#4c4f69",
  mathBlockHoverBg: "rgba(0,0,0,0.03)",
};

const paperLightColors: ThemeColors = {
  background: "#f8f4e8",
  foreground: "#3e3c38",
  caret: "#5c6bc0",
  selection: "#e8e0cd",
  gutterBg: "#f2eedf",
  gutterFg: "#a09880",
  gutterBorder: "#e8e0cd",
  activeLineBg: "#f0ecdb",
  activeGutterBg: "#ece7d5",
  keyword: "#5c6bc0",
  controlKeyword: "#ab47bc",
  definition: "#c62828",
  variable: "#3e3c38",
  function: "#e65100",
  aggregate: "#00838f",
  number: "#2e7d32",
  string: "#558b2f",
  operator: "#ad1457",
  comment: "#a09880",
  bracket: "#5d5a52",
  separator: "#8c8775",
  modifier: "#5c6bc0",
  scopeHighlightBg: "rgba(92, 107, 192, 0.07)",
  bracketHighlightBg: "rgba(92, 107, 192, 0.2)",
  tooltipBg: "#f0ecdb",
  tooltipBorder: "#ddd6c1",
  tooltipFg: "#3e3c38",
  mathBlockHoverBg: "rgba(0,0,0,0.03)",
};

// =====================================================================
//  DARK THEMES
// =====================================================================

const githubDarkColors: ThemeColors = {
  background: "#0d1117",
  foreground: "#e6edf3",
  caret: "#79c0ff",
  selection: "#264f78",
  gutterBg: "#161b22",
  gutterFg: "#484f58",
  gutterBorder: "#30363d",
  activeLineBg: "#161b22",
  activeGutterBg: "#1c2128",
  keyword: "#79c0ff",
  controlKeyword: "#d2a8ff",
  definition: "#d2a8ff",
  variable: "#e6edf3",
  function: "#ffa657",
  aggregate: "#ffa657",
  number: "#79c0ff",
  string: "#a5d6ff",
  operator: "#ff7b72",
  comment: "#8b949e",
  bracket: "#e6edf3",
  separator: "#8b949e",
  modifier: "#79c0ff",
  scopeHighlightBg: "rgba(56, 139, 253, 0.1)",
  bracketHighlightBg: "rgba(56, 139, 253, 0.3)",
  tooltipBg: "#1c2128",
  tooltipBorder: "#30363d",
  tooltipFg: "#e6edf3",
  mathBlockHoverBg: "rgba(255,255,255,0.04)",
};

const draculaDarkColors: ThemeColors = {
  background: "#282a36",
  foreground: "#f8f8f2",
  caret: "#f8f8f2",
  selection: "#44475a",
  gutterBg: "#282a36",
  gutterFg: "#6272a4",
  gutterBorder: "#44475a",
  activeLineBg: "#44475a",
  activeGutterBg: "#3e4054",
  keyword: "#ff79c6",
  controlKeyword: "#ff79c6",
  definition: "#50fa7b",
  variable: "#f8f8f2",
  function: "#ffb86c",
  aggregate: "#8be9fd",
  number: "#bd93f9",
  string: "#f1fa8c",
  operator: "#ff79c6",
  comment: "#6272a4",
  bracket: "#f8f8f2",
  separator: "#6272a4",
  modifier: "#8be9fd",
  scopeHighlightBg: "rgba(189, 147, 249, 0.08)",
  bracketHighlightBg: "rgba(189, 147, 249, 0.25)",
  tooltipBg: "#44475a",
  tooltipBorder: "#6272a4",
  tooltipFg: "#f8f8f2",
  mathBlockHoverBg: "rgba(255,255,255,0.04)",
};

const tokyoNightDarkColors: ThemeColors = {
  background: "#1a1b26",
  foreground: "#a9b1d6",
  caret: "#c0caf5",
  selection: "#283457",
  gutterBg: "#1a1b26",
  gutterFg: "#3b4261",
  gutterBorder: "#292e42",
  activeLineBg: "#292e42",
  activeGutterBg: "#24283b",
  keyword: "#9d7cd8",
  controlKeyword: "#bb9af7",
  definition: "#7dcfff",
  variable: "#c0caf5",
  function: "#7aa2f7",
  aggregate: "#2ac3de",
  number: "#ff9e64",
  string: "#9ece6a",
  operator: "#89ddff",
  comment: "#565f89",
  bracket: "#a9b1d6",
  separator: "#565f89",
  modifier: "#bb9af7",
  scopeHighlightBg: "rgba(122, 162, 247, 0.08)",
  bracketHighlightBg: "rgba(122, 162, 247, 0.25)",
  tooltipBg: "#24283b",
  tooltipBorder: "#292e42",
  tooltipFg: "#c0caf5",
  mathBlockHoverBg: "rgba(255,255,255,0.04)",
};

const catppuccinMochaDarkColors: ThemeColors = {
  background: "#1e1e2e",
  foreground: "#cdd6f4",
  caret: "#f5e0dc",
  selection: "#45475a",
  gutterBg: "#181825",
  gutterFg: "#585b70",
  gutterBorder: "#313244",
  activeLineBg: "#313244",
  activeGutterBg: "#262637",
  keyword: "#89b4fa",
  controlKeyword: "#cba6f7",
  definition: "#f38ba8",
  variable: "#cdd6f4",
  function: "#fab387",
  aggregate: "#94e2d5",
  number: "#a6e3a1",
  string: "#a6e3a1",
  operator: "#f38ba8",
  comment: "#585b70",
  bracket: "#bac2de",
  separator: "#6c7086",
  modifier: "#b4befe",
  scopeHighlightBg: "rgba(137, 180, 250, 0.08)",
  bracketHighlightBg: "rgba(137, 180, 250, 0.25)",
  tooltipBg: "#313244",
  tooltipBorder: "#45475a",
  tooltipFg: "#cdd6f4",
  mathBlockHoverBg: "rgba(255,255,255,0.04)",
};

const rosePineMoonDarkColors: ThemeColors = {
  background: "#232136",
  foreground: "#e0def4",
  caret: "#c4a7e7",
  selection: "#393552",
  gutterBg: "#2a273f",
  gutterFg: "#6e6a86",
  gutterBorder: "#393552",
  activeLineBg: "#2a273f",
  activeGutterBg: "#2a273f",
  keyword: "#c4a7e7",
  controlKeyword: "#eb6f92",
  definition: "#ea9a97",
  variable: "#e0def4",
  function: "#f6c177",
  aggregate: "#9ccfd8",
  number: "#ea9a97",
  string: "#f6c177",
  operator: "#3e8fb0",
  comment: "#6e6a86",
  bracket: "#e0def4",
  separator: "#6e6a86",
  modifier: "#c4a7e7",
  scopeHighlightBg: "rgba(196, 167, 231, 0.08)",
  bracketHighlightBg: "rgba(196, 167, 231, 0.25)",
  tooltipBg: "#393552",
  tooltipBorder: "#44415a",
  tooltipFg: "#e0def4",
  mathBlockHoverBg: "rgba(255,255,255,0.04)",
};

// =====================================================================
//  Theme registry
// =====================================================================

export const themeDefinitions: ThemeDefinition[] = [
  { name: "github-light", label: "GitHub Light", dark: false, colors: githubLightColors },
  { name: "solarized-light", label: "Solarized Light", dark: false, colors: solarizedLightColors },
  { name: "rose-pine-dawn", label: "Ros\u00e9 Pine Dawn", dark: false, colors: rosePineDawnColors },
  { name: "catppuccin-latte", label: "Catppuccin Latte", dark: false, colors: catppuccinLatteColors },
  { name: "paper", label: "Paper", dark: false, colors: paperLightColors },
  { name: "github-dark", label: "GitHub Dark", dark: true, colors: githubDarkColors },
  { name: "dracula", label: "Dracula", dark: true, colors: draculaDarkColors },
  { name: "tokyo-night", label: "Tokyo Night", dark: true, colors: tokyoNightDarkColors },
  { name: "catppuccin-mocha", label: "Catppuccin Mocha", dark: true, colors: catppuccinMochaDarkColors },
  { name: "rose-pine-moon", label: "Ros\u00e9 Pine Moon", dark: true, colors: rosePineMoonDarkColors },
];

// Build all themes eagerly
const builtThemes: Record<string, Extension> = {};
for (const def of themeDefinitions) {
  builtThemes[def.name] = buildTheme(def);
}

/**
 * Get a theme extension by name.
 *
 * Light themes: "github-light", "solarized-light", "rose-pine-dawn", "catppuccin-latte", "paper"
 * Dark themes: "github-dark", "dracula", "tokyo-night", "catppuccin-mocha", "rose-pine-moon"
 */
export function getTheme(name: string): Extension {
  return builtThemes[name] || builtThemes["github-light"];
}

/**
 * Get the ThemeDefinition metadata (name, label, dark flag, colors) for a theme.
 */
export function getThemeDefinition(name: string): ThemeDefinition | undefined {
  return themeDefinitions.find((d) => d.name === name);
}

// Convenience exports matching old API
export const lightThemes = themeDefinitions.filter((d) => !d.dark);
export const darkThemes = themeDefinitions.filter((d) => d.dark);
