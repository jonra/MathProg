import { EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { sourceToLatex, LatexBlock } from "./parser";
import { renderLatex } from "./renderer";

export interface MathPanelConfig {
  /** The DOM element to render math into (should be a sibling of the editor) */
  target: HTMLElement;
  /** Debounce delay in ms (default: 300) */
  debounce?: number;
}

export function mathPanel(config: MathPanelConfig) {
  const debounceMs = config.debounce ?? 300;

  return ViewPlugin.fromClass(
    class {
      private timeout: ReturnType<typeof setTimeout> | null = null;
      private blocks: LatexBlock[] = [];
      private blockElements: Map<number, HTMLElement> = new Map();

      constructor(private view: EditorView) {
        config.target.classList.add("cm-math-panel");
        this.render();
        this.setupScrollSync();
      }

      update(update: ViewUpdate) {
        if (update.docChanged) {
          if (this.timeout) clearTimeout(this.timeout);
          this.timeout = setTimeout(() => this.render(), debounceMs);
        }
      }

      destroy() {
        if (this.timeout) clearTimeout(this.timeout);
        this.clearPanel();
      }

      private clearPanel() {
        while (config.target.firstChild) {
          config.target.removeChild(config.target.firstChild);
        }
      }

      private render() {
        const source = this.view.state.doc.toString();
        this.blocks = sourceToLatex(source);
        this.blockElements.clear();
        this.clearPanel();

        if (this.blocks.length === 0) {
          const empty = document.createElement("div");
          empty.className = "cm-math-panel-empty";
          empty.textContent = "Write MathProg code to see rendered math";
          config.target.appendChild(empty);
          return;
        }

        for (const block of this.blocks) {
          const wrapper = document.createElement("div");
          wrapper.className = `cm-math-block cm-math-block-${block.type}`;
          wrapper.dataset.fromLine = String(block.fromLine);
          wrapper.dataset.toLine = String(block.toLine);

          // Click to jump to source
          wrapper.addEventListener("click", () => {
            const line = this.view.state.doc.line(block.fromLine);
            this.view.dispatch({
              selection: { anchor: line.from },
              scrollIntoView: true,
            });
            this.view.focus();
          });

          const mathEl = document.createElement("div");
          mathEl.className = "cm-math-content";
          // renderLatex uses KaTeX's render() which safely builds DOM
          renderLatex(block.latex, mathEl);
          wrapper.appendChild(mathEl);

          // Line label
          const label = document.createElement("span");
          label.className = "cm-math-line-label";
          label.textContent = `L${block.fromLine}`;
          wrapper.appendChild(label);

          this.blockElements.set(block.fromLine, wrapper);
          config.target.appendChild(wrapper);
        }
      }

      private setupScrollSync() {
        const editorScroller = this.view.scrollDOM;

        editorScroller.addEventListener("scroll", () => {
          // Find which line is at the top of the visible editor
          const topPos = this.view.lineBlockAtHeight(
            editorScroller.scrollTop
          );
          const topLine = this.view.state.doc.lineAt(topPos.from).number;

          // Find the closest math block
          let closestEl: HTMLElement | null = null;
          let closestDist = Infinity;
          for (const [line, el] of this.blockElements) {
            const dist = Math.abs(line - topLine);
            if (dist < closestDist) {
              closestDist = dist;
              closestEl = el;
            }
          }

          if (closestEl) {
            closestEl.scrollIntoView({ block: "start", behavior: "auto" });
          }
        });
      }
    }
  );
}

export const mathPanelTheme = EditorView.baseTheme({
  ".cm-math-panel": {
    overflow: "auto",
    padding: "20px 16px",
    fontFamily: "'KaTeX_Main', 'Times New Roman', serif",
  },
  ".cm-math-panel-empty": {
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    padding: "3em 1em",
    fontSize: "14px",
  },
  ".cm-math-block": {
    padding: "10px 14px 10px 16px",
    margin: "2px 0",
    borderRadius: "6px",
    cursor: "pointer",
    position: "relative",
    transition: "background-color 0.15s ease, box-shadow 0.15s ease",
    borderLeft: "3px solid transparent",
  },
  ".cm-math-block:hover": {
    backgroundColor: "rgba(0,0,0,0.035)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  ".cm-math-block-objective": {
    borderLeftColor: "#4363d8",
    padding: "14px 14px 14px 16px",
    margin: "8px 0",
  },
  ".cm-math-block-constraint": {
    borderLeftColor: "#2ea043",
  },
  ".cm-math-block-declaration": {
    borderLeftColor: "#bbb",
    fontSize: "0.9em",
  },
  ".cm-math-line-label": {
    position: "absolute",
    top: "6px",
    right: "8px",
    fontSize: "9px",
    color: "#bbb",
    fontFamily: "monospace",
    letterSpacing: "0.5px",
    opacity: "0.7",
  },
  ".cm-math-block:hover .cm-math-line-label": {
    opacity: "1",
  },
  ".cm-math-content": {
    overflowX: "auto",
    lineHeight: "1.6",
  },
  ".cm-math-render-error": {
    color: "#cc0000",
    fontFamily: "monospace",
    fontSize: "11px",
    padding: "4px 8px",
    backgroundColor: "rgba(204,0,0,0.05)",
    borderRadius: "4px",
  },
});
