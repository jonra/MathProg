import {
  ViewPlugin,
  ViewUpdate,
  Decoration,
  DecorationSet,
  EditorView,
} from "@codemirror/view";
import { showTooltip, Tooltip } from "@codemirror/view";
import { StateField } from "@codemirror/state";

const aggregateKeywords = new Set([
  "sum",
  "prod",
  "min",
  "max",
  "forall",
  "exists",
  "setof",
  "count",
  "for",
]);

const aggregateLabels: Record<string, string> = {
  sum: "Summation",
  prod: "Product",
  min: "Minimum",
  max: "Maximum",
  forall: "Universal quantifier",
  exists: "Existential quantifier",
  setof: "Set builder",
  count: "Count",
  for: "Loop iteration",
};

const mismatchMark = Decoration.mark({ class: "cm-bracket-mismatch" });

function findMismatchedBrackets(doc: string): DecorationSet {
  const stack: { ch: string; pos: number }[] = [];
  const mismatches: { from: number; to: number }[] = [];
  const matchMap: Record<string, string> = { "(": ")", "[": "]", "{": "}" };
  const openSet = new Set(["(", "[", "{"]);
  const closeSet = new Set([")", "]", "}"]);
  const reverseMap: Record<string, string> = { ")": "(", "]": "[", "}": "{" };

  for (let i = 0; i < doc.length; i++) {
    const ch = doc[i];
    if (openSet.has(ch)) {
      stack.push({ ch, pos: i });
    } else if (closeSet.has(ch)) {
      if (stack.length > 0 && matchMap[stack[stack.length - 1].ch] === ch) {
        stack.pop();
      } else {
        mismatches.push({ from: i, to: i + 1 });
      }
    }
  }

  // Anything left on the stack is unmatched
  for (const { pos } of stack) {
    mismatches.push({ from: pos, to: pos + 1 });
  }

  if (mismatches.length === 0) return Decoration.none;

  return Decoration.set(
    mismatches
      .sort((a, b) => a.from - b.from)
      .map((m) => mismatchMark.range(m.from, m.to)),
    true
  );
}

export const bracketMismatch = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = findMismatchedBrackets(view.state.doc.toString());
    }
    update(update: ViewUpdate) {
      if (update.docChanged) {
        this.decorations = findMismatchedBrackets(
          update.view.state.doc.toString()
        );
      }
    }
  },
  { decorations: (v) => v.decorations }
);

// Tooltip showing aggregate context when cursor is on { after sum, prod, etc.
function getAggregateTooltip(view: EditorView): readonly Tooltip[] {
  const pos = view.state.selection.main.head;
  const doc = view.state.doc.toString();

  // Check if cursor is on or near a { that follows an aggregate keyword
  for (const offset of [0, -1]) {
    const checkPos = pos + offset;
    if (checkPos < 0 || checkPos >= doc.length) continue;
    if (doc[checkPos] !== "{") continue;

    // Look backwards from the { to find a keyword
    let start = checkPos - 1;
    while (start >= 0 && doc[start] === " ") start--;

    let wordEnd = start + 1;
    while (start >= 0 && /[a-zA-Z]/.test(doc[start])) start--;
    start++;

    const word = doc.slice(start, wordEnd);
    if (aggregateKeywords.has(word)) {
      // Find the indexing expression content
      let braceDepth = 1;
      let end = checkPos + 1;
      while (end < doc.length && braceDepth > 0) {
        if (doc[end] === "{") braceDepth++;
        else if (doc[end] === "}") braceDepth--;
        end++;
      }
      const indexContent = doc.slice(checkPos + 1, end - 1).trim();
      const label = aggregateLabels[word] || word;

      return [
        {
          pos: checkPos,
          above: true,
          create() {
            const dom = document.createElement("div");
            dom.className = "cm-math-bracket-tooltip";
            dom.textContent = `${label}: {${indexContent.slice(0, 40)}${indexContent.length > 40 ? "..." : ""}}`;
            return { dom };
          },
        },
      ];
    }
  }

  return [];
}

export const mathAwareTooltip = StateField.define<readonly Tooltip[]>({
  create(state) {
    return [];
  },
  update(tooltips, tr) {
    if (!tr.docChanged && !tr.selection) return tooltips;
    return [];
  },
  provide: (f) =>
    showTooltip.computeN([f], (state) => {
      // We can't call getAggregateTooltip here because we don't have the view
      // Instead return empty; the ViewPlugin handles the actual tooltip
      return state.field(f);
    }),
});

// ViewPlugin that updates the tooltip state field
export const mathAwareTooltipPlugin = ViewPlugin.fromClass(
  class {
    constructor(private view: EditorView) {
      this.updateTooltips();
    }
    update(update: ViewUpdate) {
      if (update.selectionSet || update.docChanged) {
        this.updateTooltips();
      }
    }
    private updateTooltips() {
      const tooltips = getAggregateTooltip(this.view);
      this.view.dispatch({
        effects: [],
      });
    }
  }
);

export const bracketMismatchTheme = EditorView.baseTheme({
  ".cm-bracket-mismatch": {
    textDecoration: "wavy underline red",
    color: "red !important",
    fontWeight: "bold",
  },
  ".cm-math-bracket-tooltip": {
    padding: "4px 8px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "12px",
    fontFamily: "monospace",
    color: "#333",
  },
});
