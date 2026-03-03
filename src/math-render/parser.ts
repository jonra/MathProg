// Convert MathProg source to LaTeX using regex-based parsing.
// Strips comments, splits into statements, and converts each to LaTeX.

export interface LatexBlock {
  latex: string;
  fromLine: number;
  toLine: number;
  type: "objective" | "constraint" | "declaration" | "expression";
}

/** Strip line comments (#...) respecting string literals */
function stripComment(line: string): string {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === "#" && !inSingle && !inDouble) {
      return line.slice(0, i).trimEnd();
    }
  }
  return line.trimEnd();
}

/**
 * Render an identifier for LaTeX. Identifiers with underscores use
 * \mathit{\text{...}} so KaTeX doesn't interpret _ as subscript.
 * Simple single-letter or short identifiers stay as math italic.
 */
function texId(name: string): string {
  if (name.includes("_")) {
    // Use \textit so underscores render literally and it stays italic
    return `\\textit{${name.replace(/_/g, "\\_")}}`;
  }
  return name;
}

/**
 * Render a subscripted variable: name[i] -> name_{i}
 * name[i,j] -> name_{i,j}
 */
function texSubscript(name: string, subs: string): string {
  // Process the subscript contents — could have expressions like t-1
  const processed = subs
    .split(",")
    .map((s) => s.trim())
    .join(", ");
  return `${texId(name)}_{${processed}}`;
}

export function sourceToLatex(source: string): LatexBlock[] {
  const lines = source.split("\n");
  const blocks: LatexBlock[] = [];
  let i = 0;
  let inBlockComment = false;

  while (i < lines.length) {
    // Handle block comments spanning lines
    if (inBlockComment) {
      if (lines[i].includes("*/")) {
        inBlockComment = false;
      }
      i++;
      continue;
    }

    const stripped = stripComment(lines[i]).trim();

    if (!stripped) { i++; continue; }

    if (stripped.startsWith("/*")) {
      if (!stripped.includes("*/")) inBlockComment = true;
      i++;
      continue;
    }

    // Skip solve, display, printf, end, data statements entirely
    if (/^(solve|display|printf|end|data|check|for)\b/.test(stripped)) {
      // Still need to consume until ;
      while (i < lines.length) {
        const l = stripComment(lines[i]).trim();
        i++;
        if (l.endsWith(";")) break;
      }
      continue;
    }

    // Collect statement lines until ;
    let stmt = "";
    const startLine = i;
    while (i < lines.length) {
      const l = stripComment(lines[i]).trim();
      if (l) stmt += (stmt ? " " : "") + l;
      i++;
      if (l.endsWith(";")) break;
    }

    stmt = stmt.replace(/;\s*$/, "").trim();
    if (!stmt) continue;

    const block = convertStatement(stmt, startLine + 1, i);
    if (block) blocks.push(block);
  }

  return blocks;
}

function convertStatement(
  stmt: string,
  fromLine: number,
  toLine: number
): LatexBlock | null {
  let m: RegExpMatchArray | null;

  // --- Set declaration ---
  m = stmt.match(/^set\s+(\w+)\s*(.*)/);
  if (m) {
    const name = texId(m[1]);
    const rest = m[2].trim();
    let latex = `\\textbf{set} \\; ${name}`;
    if (rest) {
      latex += " \\; " + convertDeclAttrs(rest);
    }
    return { latex, fromLine, toLine, type: "declaration" };
  }

  // --- Param declaration ---
  m = stmt.match(/^param\s+(\w+)\s*(.*)/);
  if (m) {
    const name = texId(m[1]);
    const rest = m[2].trim();
    let latex = `\\textbf{param} \\; ${name}`;
    if (rest) {
      latex += " \\; " + convertDeclAttrs(rest);
    }
    return { latex, fromLine, toLine, type: "declaration" };
  }

  // --- Var declaration ---
  m = stmt.match(/^var\s+(\w+)\s*(.*)/);
  if (m) {
    const name = texId(m[1]);
    const rest = m[2].trim();
    let latex = `\\textbf{var} \\; ${name}`;
    if (rest) {
      latex += " \\; " + convertDeclAttrs(rest);
    }
    return { latex, fromLine, toLine, type: "declaration" };
  }

  // --- Objective ---
  m = stmt.match(/^(minimize|maximize)\s+(\w+)\s*:\s*(.*)/s);
  if (m) {
    const op = m[1] === "minimize" ? "\\min" : "\\max";
    const name = texId(m[2]);
    const expr = convertExpr(m[3]);
    return {
      latex: `\\underset{\\text{${m[2]}}}{${op}} \\quad ${expr}`,
      fromLine,
      toLine,
      type: "objective",
    };
  }

  // --- Constraint ---
  m = stmt.match(
    /^(?:s\.t\.\s+|subject\s+to\s+)?(\w+)(\s*\{[^}]*\})?\s*:\s*(.*)/s
  );
  if (m) {
    const name = m[1];
    if (
      [
        "set", "param", "var", "minimize", "maximize",
        "solve", "display", "printf", "check", "end", "data", "for",
      ].includes(name)
    ) {
      return null;
    }
    const indexing = m[2] ? convertIndexing(m[2].trim()) : "";
    const body = convertConstraintBody(m[3].trim());
    return {
      latex: `${texId(name)}${indexing} : \\qquad ${body}`,
      fromLine,
      toLine,
      type: "constraint",
    };
  }

  return null;
}

/** Convert declaration attributes like {t in T} >= 0, <= cap, := expr */
function convertDeclAttrs(attrs: string): string {
  let result = attrs;

  // Indexing: {t in T} or {t in T : cond}
  result = result.replace(/\{([^}]+)\}/g, (_, inner) => {
    return convertIndexing("{" + inner + "}");
  });

  // Assignment :=
  result = result.replace(/:=/g, ":=");

  // Comparison operators
  result = result.replace(/>=/g, "\\geq");
  result = result.replace(/<=/g, "\\leq");

  // Subscripts
  result = result.replace(/(\w+)\[([^\]]+)\]/g, (_, n, s) => texSubscript(n, s));

  // Identifiers with underscores (but not already processed)
  result = result.replace(/\b(\w+_\w+)\b/g, (m) => {
    // Don't double-process things already in \textit
    if (result.indexOf("\\textit") >= 0) return m;
    return texId(m);
  });

  return result;
}

/** Convert constraint body — the expression(s) with comparison operators */
function convertConstraintBody(body: string): string {
  return convertExpr(body);
}

function convertExpr(expr: string): string {
  if (!expr) return "";
  let result = expr;

  // Aggregates: sum{i in S} expr -> \sum_{i \in S} expr
  result = result.replace(
    /\b(sum|prod)\s*\{([^}]+)\}/g,
    (_, op, idx) => {
      const latexOp = op === "sum" ? "\\sum" : "\\prod";
      const indexLatex = convertIndexing("{" + idx + "}");
      return `${latexOp}_{${indexLatex}} `;
    }
  );

  // Subscripts: x[i] -> x_{i}, x[i,j] -> x_{i,j}
  // Do this early, before other transforms
  result = result.replace(
    /(\w+)\[([^\]]+)\]/g,
    (_, name, subs) => texSubscript(name, subs)
  );

  // Comparison operators (multi-char first)
  result = result.replace(/>=/g, " \\geq ");
  result = result.replace(/<=/g, " \\leq ");
  result = result.replace(/<>/g, " \\neq ");

  // Division: a / b -> \frac{a}{b} (only simple single-token terms)
  result = result.replace(
    /(\b\w+(?:_{[^}]+})?\b)\s*\/\s*(\b\w+(?:_{[^}]+})?\b)/g,
    (_, a, b) => `\\frac{${a}}{${b}}`
  );

  // Multiplication: * -> \cdot
  result = result.replace(/\s*\*\s*/g, " \\cdot ");

  // Power: ** or ^
  result = result.replace(/\*\*\s*(\w+)/g, "^{$1}");
  result = result.replace(/\^\s*(\w+)/g, "^{$1}");

  // Built-in functions
  result = result.replace(/\bsqrt\(([^)]+)\)/g, "\\sqrt{$1}");
  result = result.replace(/\babs\(([^)]+)\)/g, "\\left|$1\\right|");
  result = result.replace(
    /\b(log|exp|sin|cos|atan|ceil|floor|round|trunc)\b/g,
    "\\operatorname{$1}"
  );

  // "in" keyword -> \in (but not "min", "bin", etc.)
  result = result.replace(/\bin\b/g, "\\in");

  // Now handle remaining identifiers with underscores that weren't
  // already converted (not inside _{} or \textit{})
  result = result.replace(/\b([a-zA-Z]\w*_\w+)\b/g, (match, name) => {
    // Skip if already LaTeX-escaped
    if (match.includes("\\")) return match;
    return texId(name);
  });

  // Clean up multiple spaces
  result = result.replace(/\s+/g, " ").trim();

  return result;
}

function convertIndexing(idx: string): string {
  let inner = idx.replace(/^\{/, "").replace(/\}$/, "").trim();

  // "in" -> \in
  inner = inner.replace(/\bin\b/g, "\\in");

  // Colon condition separator -> \mid
  inner = inner.replace(/\s*:\s*/g, " \\mid ");

  // Handle identifiers with underscores
  inner = inner.replace(/\b([a-zA-Z]\w*_\w+)\b/g, (m) => texId(m));

  return inner;
}
