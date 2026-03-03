import { styleTags, tags as t } from "@lezer/highlight";

export const mathProgHighlighting = styleTags({
  // Keywords - declarations
  "set param var": t.definitionKeyword,
  "minimize maximize": t.definitionKeyword,
  "solve check display printf end": t.keyword,
  subjectTo: t.keyword,

  // Control flow
  "if then else for": t.controlKeyword,

  // Logic and set operators
  "or and not": t.logicOperator,
  "union inter diff symdiff cross": t.operatorKeyword,
  "In notIn": t.operatorKeyword,

  // Type modifiers
  "integer binary symbolic": t.modifier,
  "dimen within Default": t.modifier,

  // Aggregate operators
  "sum prod Min Max forall exists setof count": t.function(t.keyword),

  // Function calls
  "FunctionCall/Identifier": t.function(t.name),

  // Identifiers in declarations
  "SetDecl/Identifier ParamDecl/Identifier VarDecl/Identifier": t.definition(t.variableName),
  "ObjectiveDecl/Identifier": t.definition(t.variableName),
  "ConstraintDecl/Identifier": t.definition(t.variableName),

  // General identifiers
  Identifier: t.variableName,

  // Literals
  Number: t.number,
  String: t.string,

  // Operators
  'CompareOp "+" "-" "*" "/" "**" "^"': t.operator,
  "div mod": t.operator,
  '":="': t.definitionOperator,

  // Punctuation
  '"(" ")"': t.paren,
  '"[" "]"': t.squareBracket,
  '"{" "}"': t.brace,
  '";" ","': t.separator,
  '":"': t.punctuation,
  '"."': t.punctuation,

  // Comments
  LineComment: t.lineComment,
  BlockComment: t.blockComment,
});
