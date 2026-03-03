import {
  ViewPlugin,
  ViewUpdate,
  Decoration,
  DecorationSet,
  EditorView,
} from "@codemirror/view";

const rainbowColors = [
  "#e6194b", // red
  "#3cb44b", // green
  "#4363d8", // blue
  "#f58231", // orange
  "#911eb4", // purple
  "#42d4f4", // cyan
];

function buildRainbowDecorations(view: EditorView): DecorationSet {
  const decorations: { from: number; to: number; depth: number }[] = [];
  let depth = 0;
  const doc = view.state.doc.toString();

  for (let i = 0; i < doc.length; i++) {
    const ch = doc[i];
    if (ch === "(" || ch === "[" || ch === "{") {
      decorations.push({ from: i, to: i + 1, depth });
      depth++;
    } else if (ch === ")" || ch === "]" || ch === "}") {
      depth = Math.max(0, depth - 1);
      decorations.push({ from: i, to: i + 1, depth });
    }
  }

  return Decoration.set(
    decorations.map(({ from, to, depth: d }) =>
      Decoration.mark({
        class: `cm-rainbow-bracket-${d % rainbowColors.length}`,
      }).range(from, to)
    ),
    true
  );
}

export const rainbowBrackets = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = buildRainbowDecorations(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = buildRainbowDecorations(update.view);
      }
    }
  },
  { decorations: (v) => v.decorations }
);

export const rainbowBracketTheme = EditorView.baseTheme(
  Object.fromEntries(
    rainbowColors.map((color, i) => [
      `.cm-rainbow-bracket-${i}`,
      { color, fontWeight: "bold" },
    ])
  )
);
