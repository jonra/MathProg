import katex from "katex";

export interface RenderOptions {
  displayMode?: boolean;
  throwOnError?: boolean;
}

export function renderLatex(
  latex: string,
  container: HTMLElement,
  options: RenderOptions = {}
): void {
  try {
    katex.render(latex, container, {
      displayMode: options.displayMode ?? true,
      throwOnError: false,
      errorColor: "#cc0000",
      trust: false,
      strict: false,
    });
  } catch {
    container.textContent = latex;
    container.classList.add("cm-math-render-error");
  }
}

export function renderLatexToString(
  latex: string,
  options: RenderOptions = {}
): string {
  try {
    return katex.renderToString(latex, {
      displayMode: options.displayMode ?? true,
      throwOnError: false,
      errorColor: "#cc0000",
      trust: false,
      strict: false,
    });
  } catch {
    return `<span class="cm-math-render-error">${escapeHtml(latex)}</span>`;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
