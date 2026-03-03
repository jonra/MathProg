import { Diagnostic, linter } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";

export const mathProgLinter = linter((view: EditorView): Diagnostic[] => {
  const diagnostics: Diagnostic[] = [];
  const doc = view.state.doc;
  const source = doc.toString();
  const tree = syntaxTree(view.state);

  // Check for parse errors in the syntax tree
  tree.iterate({
    enter(node) {
      if (node.type.isError) {
        const line = doc.lineAt(node.from);
        const context = source.slice(
          Math.max(0, node.from - 20),
          Math.min(source.length, node.from + 20)
        );

        let message = "Syntax error";

        // Try to give a more helpful message based on context
        const before = source.slice(Math.max(0, node.from - 50), node.from);
        const after = source.slice(node.from, Math.min(source.length, node.from + 10));

        if (/\b(set|param|var)\s+\w+[^;]*$/.test(before) && !/;/.test(after)) {
          message = 'Expected ";" after declaration';
        } else if (/\b(minimize|maximize)\s+\w+\s*:/.test(before) && !/;/.test(after)) {
          message = 'Expected ";" after objective declaration';
        } else if (/:\s*[^;]+$/.test(before) && !/;/.test(after)) {
          message = 'Expected ";" at end of statement';
        } else if (/\{[^}]*$/.test(before)) {
          message = 'Unclosed "{" — missing closing "}"';
        } else if (/\([^)]*$/.test(before)) {
          message = 'Unclosed "(" — missing closing ")"';
        } else if (/\[[^\]]*$/.test(before)) {
          message = 'Unclosed "[" — missing closing "]"';
        }

        diagnostics.push({
          from: node.from,
          to: Math.max(node.from + 1, node.to),
          severity: "error",
          message,
        });
      }
    },
  });

  // Check for missing "end;" at end of model
  const trimmed = source.trimEnd();
  if (trimmed.length > 0 && !trimmed.endsWith("end;") && !trimmed.match(/\bend\s*;\s*$/)) {
    // Only warn if there's substantial content
    const lineCount = doc.lines;
    if (lineCount > 3) {
      diagnostics.push({
        from: doc.line(lineCount).from,
        to: doc.line(lineCount).to,
        severity: "warning",
        message: 'Model should end with "end;" statement',
      });
    }
  }

  // Check for common mistakes
  const lines = source.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check for := vs = confusion in constraints
    if (/^(s\.t\.|subject\s+to)\s/.test(trimmedLine) && /:=/.test(trimmedLine)) {
      const lineObj = doc.line(i + 1);
      const pos = line.indexOf(":=");
      diagnostics.push({
        from: lineObj.from + pos,
        to: lineObj.from + pos + 2,
        severity: "warning",
        message:
          'Constraints use comparison operators (=, <=, >=), not assignment (:=)',
      });
    }
  }

  return diagnostics;
});
