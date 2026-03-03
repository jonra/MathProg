import {
  ViewPlugin,
  ViewUpdate,
  Decoration,
  DecorationSet,
  EditorView,
} from "@codemirror/view";

const scopeMark = Decoration.mark({ class: "cm-scope-highlight" });
const bracketHighlight = Decoration.mark({ class: "cm-bracket-highlight" });

const openBrackets = new Set(["(", "[", "{"]);
const closeBrackets = new Set([")", "]", "}"]);
const matchingClose: Record<string, string> = { "(": ")", "[": "]", "{": "}" };
const matchingOpen: Record<string, string> = { ")": "(", "]": "[", "}": "{" };

function findMatchingBracket(
  doc: string,
  pos: number
): { from: number; to: number } | null {
  const ch = doc[pos];
  if (!ch) return null;

  if (openBrackets.has(ch)) {
    const target = matchingClose[ch];
    let depth = 1;
    for (let i = pos + 1; i < doc.length; i++) {
      if (doc[i] === ch) depth++;
      else if (doc[i] === target) {
        depth--;
        if (depth === 0) return { from: pos, to: i };
      }
    }
  } else if (closeBrackets.has(ch)) {
    const target = matchingOpen[ch];
    let depth = 1;
    for (let i = pos - 1; i >= 0; i--) {
      if (doc[i] === ch) depth++;
      else if (doc[i] === target) {
        depth--;
        if (depth === 0) return { from: i, to: pos };
      }
    }
  }
  return null;
}

function buildScopeDecorations(view: EditorView): DecorationSet {
  const pos = view.state.selection.main.head;
  const doc = view.state.doc.toString();
  const decorations: Array<{ from: number; to: number; value: Decoration }> = [];

  // Check character at cursor and just before cursor
  for (const offset of [0, -1]) {
    const checkPos = pos + offset;
    if (checkPos < 0 || checkPos >= doc.length) continue;
    const ch = doc[checkPos];
    if (!openBrackets.has(ch) && !closeBrackets.has(ch)) continue;

    const match = findMatchingBracket(doc, checkPos);
    if (match) {
      // Highlight the two brackets
      decorations.push(
        { from: match.from, to: match.from + 1, value: bracketHighlight },
        { from: match.to, to: match.to + 1, value: bracketHighlight }
      );
      // Highlight the scope between them (subtle background)
      if (match.to - match.from > 1) {
        decorations.push({
          from: match.from + 1,
          to: match.to,
          value: scopeMark,
        });
      }
      break;
    }
  }

  return Decoration.set(
    decorations
      .sort((a, b) => a.from - b.from || a.to - b.to)
      .map((d) => d.value.range(d.from, d.to)),
    true
  );
}

export const scopeHighlight = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = buildScopeDecorations(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.selectionSet) {
        this.decorations = buildScopeDecorations(update.view);
      }
    }
  },
  { decorations: (v) => v.decorations }
);

export const scopeHighlightTheme = EditorView.baseTheme({
  ".cm-scope-highlight": {
    backgroundColor: "rgba(100, 149, 237, 0.08)",
    borderRadius: "2px",
  },
  ".cm-bracket-highlight": {
    backgroundColor: "rgba(100, 149, 237, 0.3)",
    borderRadius: "2px",
    fontWeight: "bold",
  },
});
