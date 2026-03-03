import { LRLanguage, LanguageSupport, foldNodeProp, foldInside, indentNodeProp } from "@codemirror/language";
import { parser } from "./mathprog.grammar.js";
import { mathProgCompletion } from "./complete";

export const mathProgLanguage = LRLanguage.define({
  name: "mathprog",
  parser: parser.configure({
    props: [
      foldNodeProp.add({
        "indexing SetLiteral": foldInside,
        "ForStatement": (node) => {
          const brace = node.getChild("{");
          if (brace) {
            const close = node.getChild("}");
            if (close) return { from: brace.to, to: close.from };
          }
          return null;
        },
        BlockComment(node) {
          return { from: node.from + 2, to: node.to - 2 };
        },
      }),
      indentNodeProp.add({
        "ForStatement indexing SetLiteral": (context) =>
          context.baseIndent + context.unit,
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: "#", block: { open: "/*", close: "*/" } },
    closeBrackets: { brackets: ["(", "[", "{", "'", '"'] },
    autocomplete: mathProgCompletion,
  },
});

export function mathProg(): LanguageSupport {
  return new LanguageSupport(mathProgLanguage);
}
